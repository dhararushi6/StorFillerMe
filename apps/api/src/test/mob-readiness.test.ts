import request from 'supertest';
import { prisma } from '../lib/prisma';
import { createApp } from '../app';
import { OrderService } from '../modules/orders/order.service';
import { AccountService } from '../modules/users/account.service';
import { logout } from '../modules/auth/auth.service';
import { compareVersions } from '../modules/app-config/app-config.routes';
import { seedBuyerWithCart, createUser, bearerFor } from './helpers';

// Mobile-readiness pack. Each block guards one thing a mobile client breaks that
// a web client does not: retried writes over a dropped connection, push that
// outlives the session, an account the store requires be deletable in-app, and a
// version gate that can stop a bad build without a store submission.

const app = createApp();

describe('POST /orders idempotency (retry over a flaky connection)', () => {
  it('replays the same order for a repeated Idempotency-Key instead of charging twice', async () => {
    const { buyer, product } = await seedBuyerWithCart({
      productPrice: 100,
      quantityAvailable: 10,
      cartQty: 2,
      walletBalance: 500,
    });
    const key = 'checkout-abc-123';

    const first = await OrderService.createOrder(buyer.id, { paymentMethod: 'WALLET' }, key);
    // The client never saw the response and retries with the same key. Note the
    // cart is empty by now, so without the key this would 400 "Cart is empty" —
    // and on a COD/second-item cart it would place a real duplicate order.
    const second = await OrderService.createOrder(buyer.id, { paymentMethod: 'WALLET' }, key);

    expect(second.id).toBe(first.id);
    expect(await prisma.order.count({ where: { buyerId: buyer.id } })).toBe(1);

    // Charged and reserved exactly once.
    const wallet = await prisma.buyerWallet.findUnique({ where: { buyerId: buyer.id } });
    expect(Number(wallet?.balance)).toBe(300);
    const inv = await prisma.productInventory.findUnique({ where: { productId: product.id } });
    expect(inv?.quantityReserved).toBe(2);
    expect(await prisma.walletTransaction.count({ where: { buyerId: buyer.id } })).toBe(1);
  });

  it('scopes keys per buyer — one buyer cannot replay another buyer’s key', async () => {
    const a = await seedBuyerWithCart({ cartQty: 1 });
    const b = await seedBuyerWithCart({ cartQty: 1 });
    const key = 'same-key-different-buyer';

    const orderA = await OrderService.createOrder(a.buyer.id, { paymentMethod: 'COD' }, key);
    // Same key, different buyer: must NOT return A's order. The unique index is
    // global, so this collides and is rethrown rather than silently mismatched.
    await expect(
      OrderService.createOrder(b.buyer.id, { paymentMethod: 'COD' }, key),
    ).rejects.toBeDefined();

    const stored = await prisma.order.findUnique({ where: { id: orderA.id } });
    expect(stored?.buyerId).toBe(a.buyer.id);
  });

  it('still creates a second order when no key is sent (no accidental dedupe)', async () => {
    const { buyer, product } = await seedBuyerWithCart({ cartQty: 1, quantityAvailable: 10 });
    await OrderService.createOrder(buyer.id, { paymentMethod: 'COD' });
    await prisma.cartItem.create({
      data: { buyerId: buyer.id, productId: product.id, quantity: 1 },
    });
    await OrderService.createOrder(buyer.id, { paymentMethod: 'COD' });
    expect(await prisma.order.count({ where: { buyerId: buyer.id } })).toBe(2);
  });
});

describe('logout', () => {
  it('deactivates device tokens so push does not follow a signed-out user', async () => {
    const user = await createUser({ role: 'BUYER' });
    await prisma.deviceToken.create({
      data: { userId: user.id, token: `tok-${user.id}`, platform: 'android' },
    });

    await logout(user.id);

    const tokens = await prisma.deviceToken.findMany({ where: { userId: user.id } });
    expect(tokens.every((t) => !t.isActive)).toBe(true);
    const refresh = await prisma.refreshToken.findMany({
      where: { userId: user.id, revokedAt: null },
    });
    expect(refresh).toHaveLength(0);
  });
});

describe('DELETE /users/me (store requirement)', () => {
  it('anonymises PII, kills sessions and device tokens, keeps the order record', async () => {
    const { buyer, product } = await seedBuyerWithCart({ cartQty: 1, quantityAvailable: 5 });
    const order = await OrderService.createOrder(buyer.id, { paymentMethod: 'COD' });
    // Terminal state so deletion is allowed.
    await prisma.order.update({ where: { id: order.id }, data: { status: 'DELIVERED' } });
    await prisma.deviceToken.create({
      data: { userId: buyer.id, token: `tok-del-${buyer.id}`, platform: 'ios' },
    });
    await prisma.cartItem.create({
      data: { buyerId: buyer.id, productId: product.id, quantity: 1 },
    });

    const res = await request(app)
      .delete('/api/v1/users/me')
      .set('Authorization', bearerFor(buyer.id, 'BUYER'))
      .send({ confirm: 'DELETE' });
    expect(res.status).toBe(200);

    const after = await prisma.user.findUnique({ where: { id: buyer.id } });
    expect(after?.deletedAt).not.toBeNull();
    expect(after?.isActive).toBe(false);
    expect(after?.email).toBeNull();
    expect(after?.firebaseUid).toBeNull();
    expect(after?.phone).toBe(`deleted:${buyer.id}`);
    expect(after?.pushEnabled).toBe(false);

    expect(await prisma.deviceToken.count({ where: { userId: buyer.id } })).toBe(0);
    expect(await prisma.cartItem.count({ where: { buyerId: buyer.id } })).toBe(0);
    // Financial record survives — the books must still balance.
    expect(await prisma.order.count({ where: { id: order.id } })).toBe(1);
    const shop = await prisma.shopProfile.findUnique({ where: { userId: buyer.id } });
    expect(shop?.ownerName).toBe('Deleted user');
  });

  it('rejects deletion while an order is still in flight', async () => {
    const { buyer } = await seedBuyerWithCart({ cartQty: 1, quantityAvailable: 5 });
    await OrderService.createOrder(buyer.id, { paymentMethod: 'COD' }); // → CONFIRMED

    await expect(AccountService.deleteAccount(buyer.id)).rejects.toMatchObject({ status: 409 });
  });

  it('is idempotent — a retried delete succeeds', async () => {
    const user = await createUser({ role: 'BUYER' });
    await AccountService.deleteAccount(user.id);
    await expect(AccountService.deleteAccount(user.id)).resolves.toMatchObject({
      alreadyDeleted: true,
    });
  });

  it('requires the typed confirmation and rejects ADMIN self-delete', async () => {
    const buyer = await createUser({ role: 'BUYER' });
    const noConfirm = await request(app)
      .delete('/api/v1/users/me')
      .set('Authorization', bearerFor(buyer.id, 'BUYER'))
      .send({});
    expect(noConfirm.status).toBe(400);

    const admin = await createUser({ role: 'ADMIN' });
    const asAdmin = await request(app)
      .delete('/api/v1/users/me')
      .set('Authorization', bearerFor(admin.id, 'ADMIN'))
      .send({ confirm: 'DELETE' });
    expect(asAdmin.status).toBe(403);
  });
});

describe('GET /app-config (version gate + kill switch)', () => {
  it('compares versions numerically, not lexically', () => {
    expect(compareVersions('1.10.0', '1.9.0')).toBe(1);
    expect(compareVersions('1.2', '1.2.0')).toBe(0);
    expect(compareVersions('0.9.9', '1.0.0')).toBe(-1);
  });

  it('flags updateRequired for a build below the floor, without auth', async () => {
    const stale = await request(app).get('/api/v1/app-config?platform=android&version=0.0.1');
    expect(stale.status).toBe(200);
    expect(stale.body.updateRequired).toBe(true);
    expect(stale.body.storeUrl).toContain('play.google.com');

    const current = await request(app).get('/api/v1/app-config?platform=ios&version=99.0.0');
    expect(current.body.updateRequired).toBe(false);
    expect(current.body.maintenanceMode).toBe(false);
    expect(Array.isArray(current.body.disabledFeatures)).toBe(true);
  });

  it('rejects an unknown platform', async () => {
    const res = await request(app).get('/api/v1/app-config?platform=windows');
    expect(res.status).toBe(400);
  });
});
