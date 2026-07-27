import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { razorpay, razorpayStubbed, razorpayKeyId } from '../../lib/razorpay';
import { badRequest, notFound } from '../../lib/http-error';
import type { CreateRazorpayOrderInput } from './payments.schemas';

// B3-05/BE-3 — Razorpay order creation. POST /payments/razorpay/order { orderId }
// loads the buyer's PENDING_PAYMENT order, creates a Razorpay order for its
// totalAmount, and inserts a PENDING Payment row keyed by orderId (@@unique so a
// repeat call for the same order is rejected — exactly one Payment per order).
// The Razorpay webhook (B3-07) flips it to CAPTURED. Stub mode returns a fake
// razorpayOrderId but still writes the PENDING Payment row so the webhook path
// can replay against a real-looking row.

export const PaymentsService = {
  async createRazorpayOrder(buyerId: string, input: CreateRazorpayOrderInput) {
    const order = await prisma.order.findUnique({
      where: { id: input.orderId },
      select: { id: true, buyerId: true, status: true, totalAmount: true, payment: true },
    });
    if (!order) throw notFound(`Order ${input.orderId} not found`);
    if (order.buyerId !== buyerId) throw notFound(`Order ${input.orderId} not found`);
    if (order.payment) {
      // Order already has a Payment row — return the existing Razorpay order id
      // rather than creating a duplicate (idempotent re-entry from a retry).
      if (order.payment.razorpayOrderId) {
        return {
          razorpayOrderId: order.payment.razorpayOrderId,
          amount: order.payment.amount,
          currency: 'INR',
          keyId: razorpayKeyId,
        };
      }
      throw badRequest('Order already has an in-flight payment');
    }

    const amount = order.totalAmount; // Decimal(10,2), INR
    const currency = 'INR';
    const amountPaise = Number(amount.mul(100).toFixed(0));

    let razorpayOrderId: string;
    if (razorpayStubbed || !razorpay) {
      razorpayOrderId = `order_stub_${order.id}_${amountPaise}`;
      logger.warn({ razorpayOrderId, orderId: order.id }, 'razorpay order in STUB mode');
    } else {
      const rpOrder = await razorpay.orders.create({
        amount: amountPaise,
        currency,
        notes: { orderId: order.id, buyerId },
      });
      razorpayOrderId = rpOrder.id;
    }

    // Exactly one Payment per order (orderId @unique). PENDING until the webhook.
    await prisma.payment.create({
      data: {
        orderId: order.id,
        razorpayOrderId,
        amount,
        status: 'PENDING',
      },
    });

    return { razorpayOrderId, amount, currency, keyId: razorpayKeyId };
  },
};
