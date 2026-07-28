import { prisma } from '../../lib/prisma';
import { AgentService } from './agent.service';
import { createUser, createShopProfile } from '../../test/helpers';

// audit-2 #1 — GET /orders/:id/tracking must be ownership-scoped. A buyer may
// read tracking only for their own order; a foreign order id 404s (same
// semantics as getOrder), so no live agent GPS leaks across buyers.

async function seedOrderWithTracking() {
  const buyer = await createUser({ role: 'BUYER' });
  await createShopProfile(buyer.id);
  const order = await prisma.order.create({
    data: {
      buyerId: buyer.id,
      status: 'OUT_FOR_DELIVERY',
      paymentMethod: 'COD',
      paymentStatus: 'NOT_APPLICABLE',
      subtotalAmount: 100,
      totalAmount: 100,
      deliveryAddress: { city: 'Delhi' },
    },
  });
  const agent = await createUser({ role: 'AGENT' });
  await prisma.liveTracking.create({
    data: { orderId: order.id, agentId: agent.id, latitude: 28.6, longitude: 77.2 },
  });
  return { buyer, order, agent };
}

describe('AgentService.getTracking — ownership (audit-2 #1)', () => {
  it('returns tracking for the owning buyer', async () => {
    const { buyer, order } = await seedOrderWithTracking();
    const t = await AgentService.getTracking(buyer.id, order.id);
    expect(Number(t.latitude)).toBeCloseTo(28.6);
    expect(Number(t.longitude)).toBeCloseTo(77.2);
  });

  it('404s when another buyer requests the same order', async () => {
    const { order } = await seedOrderWithTracking();
    const other = await createUser({ role: 'BUYER' });
    await expect(AgentService.getTracking(other.id, order.id)).rejects.toMatchObject({
      status: 404,
    });
  });

  it('404s for a non-existent order id', async () => {
    const buyer = await createUser({ role: 'BUYER' });
    await expect(
      AgentService.getTracking(buyer.id, '00000000-0000-0000-0000-000000000000'),
    ).rejects.toMatchObject({ status: 404 });
  });
});
