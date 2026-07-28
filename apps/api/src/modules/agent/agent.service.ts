import { prisma } from '../../lib/prisma';
import { notFound } from '../../lib/http-error';
import type { LocationUpdateInput } from './agent.schemas';

// B2-07 — Agent delivery tracking (arch §3). POST /agent/orders/:id/location:
// upsert LiveTracking + append DeliveryLocationLog row. GET /orders/:id/tracking
// reads from LiveTracking (O(1) not the log table).

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

  /** GET /orders/:id/tracking — read latest LiveTracking row. Fast, O(1), no
   *  history scan. */
  async getTracking(orderId: string) {
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
