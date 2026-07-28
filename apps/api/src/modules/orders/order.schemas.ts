import { z } from 'zod';
import { PaymentMethodSchema, OrderStatusSchema } from '@storefiller/types';

// B3-06/07 — Order schemas (arch §3).

// POST /orders body: only paymentMethod — server builds the order from the
// live cart + catalog, never from client-supplied line items or prices.
export const createOrderSchema = z.object({
  paymentMethod: PaymentMethodSchema,
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// GET /orders query: optional status filter + pagination.
export const listOrdersSchema = z.object({
  status: OrderStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type ListOrdersQuery = z.infer<typeof listOrdersSchema>;

// :id param for order-scoped routes.
export const orderIdParamsSchema = z.object({
  id: z.string().uuid(),
});
export type OrderIdParams = z.infer<typeof orderIdParamsSchema>;

// PATCH /orders/:id/cancel body.
export const cancelOrderSchema = z.object({
  reason: z.string().min(1).max(500),
});
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
