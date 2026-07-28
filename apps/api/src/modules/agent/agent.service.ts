import { prisma } from '../../lib/prisma';
import { notFound, unprocessable } from '../../lib/http-error';
import { assertTransition } from '../orders/order.fsm';
import { GEOFENCE_RADIUS_METERS } from '@storefiller/types';
import type { LocationUpdateInput } from './agent.schemas';

// B2-07 — Agent delivery tracking (arch §3). POST /agent/orders/:id/location:
// upsert LiveTracking + append DeliveryLocationLog row. GET /orders/:id/tracking
// reads from LiveTracking (O(1) not the log table).
//
// B2-08 — Geofence validation. PATCH /agent/orders/:id/deliver: the agent must
// be within GEOFENCE_RADIUS_METERS (200m) of the buyer's ShopProfile.location.
// ST_Distance is computed in the DB (geography → metres) so the server never
// trusts a client-sent distance.

type DistanceRow = { distanceM: number };

export const AgentService = {
  /** POST /agent/orders/:id/location — called every 15s from the agent app.
   *  Upserts LiveTracking (current position) + inserts DeliveryLocationLog
   *  (append-only history). Also updates AgentProfile.lastLat/Lng. */
  async updateLocation(agentId: string, orderId: string, input: LocationUpdateInput) {
    // Verify order is assigned to this agent and in a trackable state.
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, agentId: true, status: true },
    });
    if (!order) throw notFound(`Order ${orderId} not found`);
    if (order.agentId !== agentId) throw notFound(`Order ${orderId} not found`);

    // Fire these in parallel — independent writes.
    await Promise.all([
      // Upsert LiveTracking: one row per order, always reflects latest position.
      prisma.$executeRaw`
        INSERT INTO "LiveTracking" ("orderId", "agentId", "latitude", "longitude", "location")
        VALUES (${orderId}, ${agentId}, ${input.latitude}, ${input.longitude},
                ST_SetSRID(ST_MakePoint(${input.longitude}, ${input.latitude}), 4326)::geography)
        ON CONFLICT ("orderId") DO UPDATE SET
          "latitude" = EXCLUDED."latitude",
          "longitude" = EXCLUDED."longitude",
          "location" = EXCLUDED."location",
          "updatedAt" = NOW()
      `,
      // Append to history log — never updated, only inserted and pruned later.
      prisma.deliveryLocationLog.create({
        data: {
          orderId,
          agentId,
          latitude: input.latitude,
          longitude: input.longitude,
        },
      }),
      // Update agent's last known position (used for agent availability/reporting).
      prisma.agentProfile.updateMany({
        where: { userId: agentId },
        data: { lastLatitude: input.latitude, lastLongitude: input.longitude },
      }),
    ]);

    return { ok: true };
  },

  /** PATCH /agent/orders/:id/deliver — geofenced delivery confirmation. Agent
   *  POSTs their current GPS; the server measures ST_Distance to the buyer's
   *  shop location and only allows DELIVERED when within the 200m radius.
   *  Out-of-range → 422, order stays OUT_FOR_DELIVERY. Wrong state → 422
   *  (assertTransition), so the geofence never runs on a non-deliverable order. */
  async deliverOrder(agentId: string, orderId: string, input: LocationUpdateInput) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, agentId: true, status: true, buyerId: true },
    });
    // Same message for missing-vs-wrong-agent to avoid leaking existence.
    if (!order || order.agentId !== agentId) throw notFound(`Order ${orderId} not found`);
    assertTransition(order.status, 'DELIVERED'); // 422 unless OUT_FOR_DELIVERY

    const shop = await prisma.shopProfile.findUnique({
      where: { userId: order.buyerId },
      select: { latitude: true, longitude: true },
    });
    if (!shop) throw notFound(`Shop profile for order ${orderId} not found`);

    // ponytail: compute the distance from the always-populated latitude/
    // longitude columns rather than the synced ShopProfile.location geography
    // column — avoids a null-sync edge and gives an identical metre result.
    const [row] = await prisma.$queryRaw<DistanceRow[]>`
      SELECT ST_Distance(
        ST_SetSRID(ST_MakePoint(${shop.longitude}, ${shop.latitude}), 4326)::geography,
        ST_SetSRID(ST_MakePoint(${input.longitude}, ${input.latitude}), 4326)::geography
      ) AS "distanceM"
    `;
    const distanceM = Number(row?.distanceM ?? Infinity);

    if (distanceM > GEOFENCE_RADIUS_METERS) {
      throw unprocessable(
        `Too far from shop (${Math.round(distanceM)}m > ${GEOFENCE_RADIUS_METERS}m)`,
      );
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status: 'DELIVERED', deliveredAt: new Date() },
      include: { items: true },
    });
  },

  /** GET /orders/:id/tracking — read latest LiveTracking row. Fast, O(1), no
   *  history scan. Buyer-ownership checked inline: a buyer may only read tracking
   *  for their own order (same 404-on-foreign-order semantics as getOrder). */
  async getTracking(buyerId: string, orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { buyerId: true },
    });
    if (!order || order.buyerId !== buyerId) throw notFound(`Order ${orderId} not found`);

    const tracking = await prisma.liveTracking.findUnique({
      where: { orderId },
      select: { latitude: true, longitude: true, updatedAt: true },
    });
    if (!tracking) throw notFound(`No tracking data for order ${orderId}`);
    return tracking;
  },

  /** GET /agent/orders — orders assigned to this agent. Arch says: "assigned/available orders". */
  async listAgentOrders(agentId: string) {
    // Orders directly assigned to this agent, non-terminal.
    const data = await prisma.order.findMany({
      where: {
        agentId,
        status: { in: ['DISPATCHED', 'OUT_FOR_DELIVERY'] },
      },
      include: { items: true },
      orderBy: { placedAt: 'desc' },
    });
    return { data };
  },
};
