import { z } from 'zod';
import { OrderStatusSchema } from '@storefiller/types';

// B1-11 — Admin order schemas (arch §3).

export const adminOrdersQuerySchema = z.object({
  status: OrderStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type AdminOrdersQuery = z.infer<typeof adminOrdersQuerySchema>;

export const orderIdParamsSchema = z.object({
  id: z.string().uuid(),
});
export type OrderIdParams = z.infer<typeof orderIdParamsSchema>;

export const assignAgentSchema = z.object({
  agentId: z.string().uuid(),
});
export type AssignAgentInput = z.infer<typeof assignAgentSchema>;
