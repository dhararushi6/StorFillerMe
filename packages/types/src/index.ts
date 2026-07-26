import { z } from 'zod';

/**
 * Shared domain enums + zod schemas — single source of truth for api <-> mobile.
 * Enum string values MUST match the Prisma enums in apps/api/prisma/schema.prisma.
 */

export const RoleSchema = z.enum(['BUYER', 'AGENT', 'ADMIN']);
export type Role = z.infer<typeof RoleSchema>;

export const ProductUnitSchema = z.enum(['KG', 'GRAM', 'LITRE', 'ML', 'PACK', 'PIECE', 'BOX']);
export type ProductUnit = z.infer<typeof ProductUnitSchema>;

export const PaymentMethodSchema = z.enum(['WALLET', 'UPI', 'CARD', 'COD']);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const PaymentStatusSchema = z.enum([
  'NOT_APPLICABLE',
  'PENDING',
  'CAPTURED',
  'FAILED',
  'REFUNDED',
]);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export const OrderStatusSchema = z.enum([
  'PENDING_PAYMENT',
  'CONFIRMED',
  'DISPATCHED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const WalletTxnTypeSchema = z.enum(['CREDIT', 'DEBIT']);
export type WalletTxnType = z.infer<typeof WalletTxnTypeSchema>;

export const TicketStatusSchema = z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']);
export type TicketStatus = z.infer<typeof TicketStatusSchema>;

export const JobStatusSchema = z.enum(['PENDING', 'PROCESSED', 'FAILED']);
export type JobStatus = z.infer<typeof JobStatusSchema>;

/** Order FSM allowed transitions — mirrored server-side in modules/orders. */
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export const GEOFENCE_RADIUS_METERS = 200;
