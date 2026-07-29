import type { RequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { verifyWebhookSignature, razorpayStubbed } from '../../lib/razorpay';

// B3-07 — Razorpay payment webhook (arch §4.3). Registered with express.raw()
// BEFORE the global express.json() so HMAC verification works against the raw
// body (a reserialized body would compute a different HMAC — silent failure).

type RpPayload = {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string; // razorpay_payment_id
        order_id: string; // razorpay_order_id
        amount: number; // paise
        status: string; // "captured" | "failed" | ...
      };
    };
  };
};

/**
 * POST /payments/razorpay/webhook (no auth — verified by HMAC).
 *
 * Stub mode writes a captured payment row against any PENDING Payment for the
 * razorpay order id (match by razorpayOrderId). In live mode the full HMAC
 * verification guards every call.
 */
export const razorpayWebhookHandler: RequestHandler = async (req, res) => {
  // In stub mode accept any payload as "captured" by convention. In live mode
  // the HMAC must match; if the secret is missing or the signature is absent
  // we reject (402 — Payment Required is Razorpay's convention too, but 400
  // for a bad request body is clearer to Razorpay's retry logic).
  if (!razorpayStubbed) {
    if (
      !verifyWebhookSignature(req.body, req.headers['x-razorpay-signature'] as string | undefined)
    ) {
      logger.warn('razorpay webhook HMAC mismatch');
      res.status(400).end();
      return;
    }
  }

  // Both modes registered with express.raw() → req.body is always a Buffer.
  // (The earlier stub branch read req.body as already-parsed JSON, which 400'd
  // every stub call — Buffer has no .payload.)
  const body: RpPayload = JSON.parse(req.body.toString('utf-8'));

  const payload = body.payload?.payment?.entity;
  if (!payload) {
    logger.warn({ body }, 'razorpay webhook payload missing entity');
    res.status(400).end();
    return;
  }

  const { id: razorpayPaymentId, order_id: razorpayOrderId, amount: amountPaise, status } = payload;

  if (status !== 'captured') {
    // Razorpay sends events for other states (failed, refunded). Those are
    // handled by reconciliation (B3-08); for now acknowledge and move on.
    res.status(200).end();
    return;
  }

  const paidAmount = new Prisma.Decimal(amountPaise).div(100);

  try {
    // razorpayOrderId is unique — exactly one Payment can claim a capture.
    const existing = await prisma.payment.findUnique({
      where: { razorpayOrderId },
      select: { id: true, kind: true, orderId: true, buyerId: true, amount: true },
    });
    if (!existing) {
      logger.error(
        { razorpayOrderId, razorpayPaymentId },
        'razorpay webhook: no Payment row for order_id',
      );
      res.status(404).end();
      return;
    }

    if (!existing.amount.equals(paidAmount)) {
      // Credit/confirm against what Razorpay actually captured, not what we asked
      // for — but say so loudly, because the two disagreeing is a real incident.
      logger.warn(
        { paymentId: existing.id, dbAmount: existing.amount, rpAmount: paidAmount },
        'razorpay webhook amount mismatch',
      );
    }

    const settled = await prisma.$transaction(async (tx) => {
      // Claim the row. Guarding on status PENDING is what makes a duplicate or
      // concurrent delivery a no-op instead of a second wallet credit — the
      // razorpayPaymentId unique index only catches a replay of the same payment.
      const { count } = await tx.payment.updateMany({
        where: { id: existing.id, status: 'PENDING' },
        data: { razorpayPaymentId, status: 'CAPTURED', capturedAt: new Date() },
      });
      if (count === 0) return false;

      if (existing.kind === 'WALLET_TOPUP') {
        if (!existing.buyerId) throw new Error(`top-up payment ${existing.id} has no buyerId`);
        // upsert returns the post-increment row, so balanceAfter on the ledger
        // entry is the real balance and the two can never disagree.
        const wallet = await tx.buyerWallet.upsert({
          where: { buyerId: existing.buyerId },
          update: { balance: { increment: paidAmount } },
          create: { buyerId: existing.buyerId, balance: paidAmount },
        });
        await tx.walletTransaction.create({
          data: {
            buyerId: existing.buyerId,
            type: 'CREDIT',
            amount: paidAmount,
            balanceAfter: wallet.balance,
          },
        });
        logger.info(
          { buyerId: existing.buyerId, razorpayPaymentId },
          'wallet credited via razorpay webhook',
        );
      } else {
        if (!existing.orderId) throw new Error(`order payment ${existing.id} has no orderId`);
        await tx.order.update({
          where: { id: existing.orderId },
          data: { status: 'CONFIRMED', paymentStatus: 'CAPTURED', confirmedAt: new Date() },
        });
        logger.info(
          { orderId: existing.orderId, razorpayPaymentId },
          'order confirmed via razorpay webhook',
        );
      }
      return true;
    });

    if (!settled) {
      logger.info({ razorpayOrderId, razorpayPaymentId }, 'razorpay webhook: already settled');
    }
    res.status(200).end();
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002') {
      // Duplicate webhook — payment already processed. Idempotent 200.
      res.status(200).end();
      return;
    }
    logger.error({ err }, 'razorpay webhook processing failed');
    res.status(500).end();
  }
};
