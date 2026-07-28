import { prisma } from '../../lib/prisma';
import { badRequest, notFound } from '../../lib/http-error';
import { assertTransition } from '../orders/order.fsm';
import type { AdminOrdersQuery, AssignAgentInput } from './admin.schemas';
import type { AuditLogQuery } from './audit-log.schemas';

// B1-11 — Admin order operations (arch §3: GET /admin/orders, PATCH confirm,
// PATCH assign-agent, GET /admin/dashboard).

export const AdminService = {
  /** GET /admin/orders — list orders, optional status filter + pagination. */
  async listOrders(query: AdminOrdersQuery) {
    const where = query.status ? { status: query.status } : {};
    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          buyer: { select: { id: true, phone: true } },
        },
        orderBy: { placedAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.order.count({ where }),
    ]);
    return { data, total };
  },

  /** PATCH /admin/orders/:id/confirm — manual COD confirmation. No-op if
   *  already CONFIRMED (idempotent). */
  async confirmOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true, paymentMethod: true },
    });
    if (!order) throw notFound(`Order ${orderId} not found`);
    if (order.status === 'CONFIRMED') return order;

    assertTransition(order.status, 'CONFIRMED');
    return prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED', confirmedAt: new Date() },
    });
  },

  /** PATCH /admin/orders/:id/assign-agent — assign agent to order.
   *  Guard: agent must have an AgentProfile row whose isAvailable = true. */
  async assignAgent(orderId: string, input: AssignAgentInput) {
    const [order, agent] = await Promise.all([
      prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true, status: true },
      }),
      prisma.agentProfile.findUnique({
        where: { userId: input.agentId },
        select: { isAvailable: true },
      }),
    ]);
    if (!order) throw notFound(`Order ${orderId} not found`);
    if (!agent) throw notFound(`Agent ${input.agentId} not found`);
    if (!agent.isAvailable) {
      throw badRequest('Agent is not available — set isAvailable first');
    }

    assertTransition(order.status, 'DISPATCHED');
    return prisma.order.update({
      where: { id: orderId },
      data: {
        agentId: input.agentId,
        status: 'DISPATCHED',
        dispatchedAt: new Date(),
      },
    });
  },

  /** GET /admin/audit-logs — recent audit log entries, optional filters. */
  async listAuditLogs(query: AuditLogQuery) {
    const where: Record<string, unknown> = {};
    if (query.action) where.action = query.action;
    if (query.from || query.to) {
      const createdAt: Record<string, Date> = {};
      if (query.from) createdAt.gte = query.from;
      if (query.to) createdAt.lte = query.to;
      where.createdAt = createdAt;
    }
    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { admin: { select: { id: true, phone: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.auditLog.count({ where }),
    ]);
    return { data, total };
  },

  /** GET /admin/dashboard — summary counts. */
  async getDashboard() {
    const [pendingOrders, lowStock] = await Promise.all([
      prisma.order.count({
        where: { status: { in: ['PENDING_PAYMENT', 'CONFIRMED'] } },
      }),
      // ponytail: dashboard uses the same threshold as ProductInventory
      // (lowStockThreshold = 10). If the threshold becomes tunable per product
      // this query should join the threshold column instead of hardcoding 10.
      prisma.productInventory.count({
        where: {
          AND: [{ quantityAvailable: { lte: 10 } }, { quantityAvailable: { gt: 0 } }],
        },
      }),
    ]);

    return { pendingOrders, lowStock };
  },
};
