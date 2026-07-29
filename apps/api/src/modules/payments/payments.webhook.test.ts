import express from 'express';
import request from 'supertest';
import crypto from 'node:crypto';
import { prisma } from '../../lib/prisma';
import { razorpayWebhookHandler } from './payments.webhook';
import { WalletService } from '../wallet/wallet.service';
import { Prisma } from '@prisma/client';
import { createUser, createShopProfile, createCategory, createProduct } from '../../test/helpers';

// Razorpay webhook — idempotency + HMAC boundary + amount sanity. Builds a
// minimal app that mounts the handler with express.raw() (mirroring app.ts
// ordering) so the HMAC is computed over the exact bytes sent.

function buildApp() {
  const app = express();
  app.post('/webhook', express.raw({ type: '*/*' }), razorpayWebhookHandler);
  return app;
}

async function seedPendingOrder(opts: { amountPaise: number; razorpayOrderId: string }) {
  const buyer = await createUser({ role: 'BUYER' });
  await createShopProfile(buyer.id);
  const category = await createCategory();
  const product = await createProduct(category.id);
  const order = await prisma.order.create({
    data: {
      buyerId: buyer.id,
      status: 'PENDING_PAYMENT',
      paymentMethod: 'UPI',
      paymentStatus: 'PENDING',
      subtotalAmount: new Prisma.Decimal(opts.amountPaise / 100),
      totalAmount: new Prisma.Decimal(opts.amountPaise / 100),
      deliveryAddress: { city: 'Delhi' },
      items: {
        create: [
          {
            productId: product.id,
            productNameSnap: product.name,
            unitPriceSnap: new Prisma.Decimal(opts.amountPaise / 100),
            quantity: 1,
            lineTotal: new Prisma.Decimal(opts.amountPaise / 100),
          },
        ],
      },
    },
  });
  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      razorpayOrderId: opts.razorpayOrderId,
      amount: new Prisma.Decimal(opts.amountPaise / 100),
      status: 'PENDING',
    },
  });
  return { buyer, order, payment };
}

function payload(
  over: Partial<{
    paymentId: string;
    orderId: string;
    amountPaise: number;
    status: string;
  }> = {},
) {
  return JSON.stringify({
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: over.paymentId ?? `pay_${crypto.randomBytes(8).toString('hex')}`,
          order_id: over.orderId ?? 'order_abc',
          amount: over.amountPaise ?? 20000,
          status: over.status ?? 'captured',
        },
      },
    },
  });
}

describe('razorpay webhook (stub mode — no HMAC secret set)', () => {
  it('marks a PENDING payment CAPTURED and confirms the order', async () => {
    const { order, payment } = await seedPendingOrder({
      amountPaise: 20000,
      razorpayOrderId: 'order_abc',
    });
    const app = buildApp();

    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .send(payload({ orderId: 'order_abc', amountPaise: 20000 }));

    expect(res.status).toBe(200);
    const updatedPayment = await prisma.payment.findUnique({ where: { id: payment.id } });
    expect(updatedPayment?.status).toBe('CAPTURED');
    expect(updatedPayment?.razorpayPaymentId).toBeTruthy();
    expect(updatedPayment?.capturedAt).not.toBeNull();

    const updatedOrder = await prisma.order.findUnique({ where: { id: order.id } });
    expect(updatedOrder?.status).toBe('CONFIRMED');
    expect(updatedOrder?.confirmedAt).not.toBeNull();
  });

  it('is IDEMPOTENT: a duplicate delivery of the same payment returns 200 without double-processing', async () => {
    const { payment } = await seedPendingOrder({
      amountPaise: 20000,
      razorpayOrderId: 'order_dup',
    });
    const app = buildApp();
    const paymentId = 'pay_duplicate_1';

    const body = payload({ orderId: 'order_dup', amountPaise: 20000, paymentId });
    const first = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .send(body);
    expect(first.status).toBe(200);

    // same payment id delivered again → P2002 path → still 200, still one payment
    const second = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .send(body);
    expect(second.status).toBe(200);

    const p = await prisma.payment.findUnique({ where: { id: payment.id } });
    expect(p?.razorpayPaymentId).toBe(paymentId);
    expect(await prisma.payment.count()).toBe(1);
  });

  it('acknowledges (200) but ignores non-captured statuses', async () => {
    await seedPendingOrder({ amountPaise: 20000, razorpayOrderId: 'order_fail' });
    const app = buildApp();
    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .send(payload({ orderId: 'order_fail', status: 'failed' }));
    expect(res.status).toBe(200);
    expect(await prisma.payment.count({ where: { status: 'CAPTURED' } })).toBe(0);
  });

  it('404s when no Payment row exists for the razorpay order id', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .send(payload({ orderId: 'order_nonexistent' }));
    expect(res.status).toBe(404);
  });

  it('400s when the payload entity is missing', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ event: 'payment.captured', payload: {} }));
    expect(res.status).toBe(400);
  });
});

describe('razorpay webhook — wallet top-up', () => {
  // The bug this guards: createTopupOrder used to create a Razorpay order and no
  // Payment row, so the capture matched nothing, 404'd, and the buyer was charged
  // for a balance that never moved.
  async function seedTopup(amount: number) {
    const buyer = await createUser({ role: 'BUYER' });
    const topup = await WalletService.createTopupOrder(buyer.id, { amount });
    return { buyer, razorpayOrderId: topup.razorpayOrderId };
  }

  it('credits the wallet and writes one CREDIT ledger row', async () => {
    const { buyer, razorpayOrderId } = await seedTopup(500);
    const app = buildApp();

    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .send(payload({ orderId: razorpayOrderId, amountPaise: 50000 }));
    expect(res.status).toBe(200);

    const wallet = await prisma.buyerWallet.findUnique({ where: { buyerId: buyer.id } });
    expect(Number(wallet?.balance)).toBe(500);

    const txns = await prisma.walletTransaction.findMany({ where: { buyerId: buyer.id } });
    expect(txns).toHaveLength(1);
    expect(txns[0].type).toBe('CREDIT');
    expect(Number(txns[0].amount)).toBe(500);
    expect(Number(txns[0].balanceAfter)).toBe(500);

    const p = await prisma.payment.findUnique({ where: { razorpayOrderId } });
    expect(p?.status).toBe('CAPTURED');
    expect(p?.kind).toBe('WALLET_TOPUP');
    expect(p?.orderId).toBeNull();
  });

  it('does not double-credit on a duplicate delivery', async () => {
    const { buyer, razorpayOrderId } = await seedTopup(200);
    const app = buildApp();
    const body = payload({
      orderId: razorpayOrderId,
      amountPaise: 20000,
      paymentId: 'pay_topup_dup',
    });

    await request(app).post('/webhook').set('Content-Type', 'application/json').send(body);
    // Same capture again — and a different payment id for the same order, which the
    // razorpayPaymentId unique index would NOT catch. The status guard does.
    await request(app).post('/webhook').set('Content-Type', 'application/json').send(body);
    const third = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .send(payload({ orderId: razorpayOrderId, amountPaise: 20000, paymentId: 'pay_other' }));
    expect(third.status).toBe(200);

    const wallet = await prisma.buyerWallet.findUnique({ where: { buyerId: buyer.id } });
    expect(Number(wallet?.balance)).toBe(200);
    expect(await prisma.walletTransaction.count({ where: { buyerId: buyer.id } })).toBe(1);
  });

  it('credits an existing balance on top rather than replacing it', async () => {
    const { buyer, razorpayOrderId } = await seedTopup(300);
    await prisma.buyerWallet.create({
      data: { buyerId: buyer.id, balance: new Prisma.Decimal(150) },
    });
    const app = buildApp();

    await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .send(payload({ orderId: razorpayOrderId, amountPaise: 30000 }));

    const wallet = await prisma.buyerWallet.findUnique({ where: { buyerId: buyer.id } });
    expect(Number(wallet?.balance)).toBe(450);
    const txn = await prisma.walletTransaction.findFirst({ where: { buyerId: buyer.id } });
    expect(Number(txn?.balanceAfter)).toBe(450);
  });
});
