import type { RequestHandler } from 'express';
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

  const body: RpPayload = razorpayStubbed
    ? (req.body as RpPayload) // stub: raw body IS the JSON payload
    : JSON.parse(req.body.toString('utf-8'));

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

  try {
    // Find Payment by razorpayOrderId (not unique, but one-to-one in practice
    // — one Razorpay order maps to one Payment row). Use findFirst then update
    // by Payment.id so the unique constraint on razorpayPaymentId catches dupes.
    const existing = await prisma.payment.findFirst({
      where: { razorpayOrderId },
      select: { id: true, orderId: true, amount: true },
    });
    if (!existing) {
      logger.error(
        { razorpayOrderId, razorpayPaymentId },
        'razorpay webhook: no Payment row for order_id',
      );
      res.status(404).end();
      return;
    }

    // Update Payment with the Razorpay payment details.
    // razorpayPaymentId @unique → P2002 on duplicate webhook → idempotent 200.
    const payment = await prisma.payment.update({
      where: { id: existing.id },
      data: {
        razorpayPaymentId,
        razorpaySignature: payload.status ?? undefined,
        status: 'CAPTURED',
        capturedAt: new Date(),
      },
    });

    const paidAmount = amountPaise / 100;
    // Sanity check: amount matched (DB stores Decimal(10,2), paise/100 is safe).
    if (Number(payment.amount) !== paidAmount) {
      logger.warn(
        { orderId: existing.orderId, dbAmount: payment.amount, rpAmount: paidAmount },
        'razorpay webhook amount mismatch',
      );
    }

    // Transition order PENDING_PAYMENT → CONFIRMED.
    const order = await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'CONFIRMED', confirmedAt: new Date() },
    });
    logger.info({ orderId: order.id, razorpayPaymentId }, 'order confirmed via razorpay webhook');

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
