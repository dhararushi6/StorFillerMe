import { z } from 'zod';

// B3-04 — arch §3 Wallet:
//   GET  /wallet                       Buyer — → { balance }
//   GET  /wallet/transactions          Buyer — → { data[] }
//   POST /wallet/topup/razorpay-order  Buyer { amount } → { razorpayOrderId, amount, currency, keyId }
// Top-up amount is whole-rupee (INR has no subunit in this app); floor at 1.
export const topupSchema = z.object({
  amount: z.number().int().min(1).max(1_000_000),
});
export type TopupInput = z.infer<typeof topupSchema>;
