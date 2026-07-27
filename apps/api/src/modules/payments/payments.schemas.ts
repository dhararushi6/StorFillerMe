import { z } from 'zod';

// B3-05/BE-3 — arch §3:
//   POST /payments/razorpay/order  Buyer { orderId } → { razorpayOrderId, amount, currency, keyId }
// Order must already exist (created by POST /orders, status PENDING_PAYMENT).
export const createRazorpayOrderSchema = z.object({
  orderId: z.string().uuid(),
});
export type CreateRazorpayOrderInput = z.infer<typeof createRazorpayOrderSchema>;
