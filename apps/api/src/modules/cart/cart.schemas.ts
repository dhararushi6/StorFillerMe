import { z } from 'zod';

// B2-06 — arch §3 Cart. Server-side cart keyed by buyerId; the CartItem
// @@unique([buyerId, productId]) makes add-item an upsert (re-add increments
// quantity, no duplicate row). quantity is per-line item count (wholesale, so
// the cap is generous).
export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(9999),
});

export const updateCartSchema = z.object({
  quantity: z.number().int().min(1).max(9999),
});

// productId in the path for PATCH/DELETE /cart/items/:productId.
export const cartItemParamsSchema = z.object({
  productId: z.string().uuid(),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartInput = z.infer<typeof updateCartSchema>;
export type CartItemParams = z.infer<typeof cartItemParamsSchema>;
