import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { razorpay, razorpayStubbed, razorpayKeyId } from '../../lib/razorpay';
import type { TopupInput } from './wallet.schemas';

// B3-04 — arch §3 Wallet. Auto-creates BuyerWallet at balance 0 on first GET
// (handbook Expected Output: "New buyer's wallet auto-initializes at balance 0").
// Every mutation that moves money writes a WalletTransaction row with the
// resulting balanceAfter inside the same tx as the balance write, so the ledger
// and the wallet balance can never disagree (the row IS the audit trail).

const ZERO = new Prisma.Decimal(0);

export const WalletService = {
  /** GET /wallet → { balance }. upsert auto-creates at 0 on first access. */
  async getWallet(buyerId: string) {
    const wallet = await prisma.buyerWallet.upsert({
      where: { buyerId },
      update: {},
      create: { buyerId, balance: ZERO },
    });
    return { balance: wallet.balance };
  },

  /** GET /wallet/transactions → { data }. Newest first; balanceAfter gives the
   *  running balance at each entry (handbook Expected Output). */
  async listTransactions(buyerId: string) {
    // Ensure the wallet exists so a fresh buyer returns [] rather than later
    // auto-creating on first transaction read; cheap no-op upsert.
    await prisma.buyerWallet.upsert({
      where: { buyerId },
      update: {},
      create: { buyerId, balance: ZERO },
    });
    const data = await prisma.walletTransaction.findMany({
      where: { buyerId },
      orderBy: { createdAt: 'desc' },
    });
    return { data };
  },

  /**
   * POST /wallet/topup/razorpay-order { amount } → { razorpayOrderId, amount,
   * currency, keyId }. Creates a Razorpay order for the top-up amount. The
   * actual balance credit happens in the Razorpay webhook (B3-07) when the
   * payment is captured — top-up here only reserves the order. Stub mode
   * (no Razorpay keys) returns a deterministic fake order id so the flow is
   * testable end-to-end without a live Razorpay account.
   */
  async createTopupOrder(buyerId: string, input: TopupInput) {
    const amount = new Prisma.Decimal(input.amount);
    const currency = 'INR';

    if (razorpayStubbed || !razorpay) {
      // ponytail: deterministic stub id; the webhook (B3-07) will also run in
      // stub mode and credit the wallet off a simulated capture. Replace with
      // razorpay.orders.create() output when keys are present.
      const razorpayOrderId = `order_stub_${buyerId}_${input.amount}_${Date.now()}`;
      logger.warn(
        { razorpayOrderId },
        'wallet topup in STUB mode — no real Razorpay order created',
      );
      return { razorpayOrderId, amount, currency, keyId: razorpayKeyId };
    }

    const order = await razorpay.orders.create({
      amount: input.amount * 100, // Razorpay expects paise
      currency,
      notes: { buyerId, purpose: 'wallet_topup' },
    });
    return { razorpayOrderId: order.id, amount, currency, keyId: razorpayKeyId };
  },
};
