import { prisma } from '../../lib/prisma';
import { OrderService } from './order.service';
import { seedBuyerWithCart, createUser, createShopProfile } from '../../test/helpers';

// Integration tests for POST /orders (createOrder) — the highest-risk money path.
// Runs against the real test DB so FOR UPDATE locking, Decimal math, and the
// wallet-ledger invariant are exercised for real.

describe('OrderService.createOrder', () => {
  it('COD: creates a CONFIRMED order, reserves inventory, clears cart, writes one Payment row', async () => {
    const { buyer, product } = await seedBuyerWithCart({
      productPrice: 100,
      quantityAvailable: 10,
      cartQty: 2,
    });

    const order = await OrderService.createOrder(buyer.id, { paymentMethod: 'COD' });

    expect(order.status).toBe('CONFIRMED');
    expect(order.paymentMethod).toBe('COD');
    expect(order.paymentStatus).toBe('NOT_APPLICABLE');
    expect(Number(order.totalAmount)).toBe(200);
    expect(order.items).toHaveLength(1);
    expect(order.items[0].productNameSnap).toBe(product.name);
    expect(Number(order.items[0].unitPriceSnap)).toBe(100);
    expect(order.items[0].quantity).toBe(2);
    expect(Number(order.items[0].lineTotal)).toBe(200);

    // inventory reserved
    const inv = await prisma.productInventory.findUnique({ where: { productId: product.id } });
    expect(inv?.quantityReserved).toBe(2);
    expect(inv?.quantityAvailable).toBe(10);

    // cart cleared
    const cart = await prisma.cartItem.findMany({ where: { buyerId: buyer.id } });
    expect(cart).toHaveLength(0);

    // exactly one CAPTURED Payment row for COD reconciliation
    const payment = await prisma.payment.findUnique({ where: { orderId: order.id } });
    expect(payment?.status).toBe('CAPTURED');
    expect(Number(payment?.amount)).toBe(200);
    expect(payment?.capturedAt).not.toBeNull();
  });

  it('WALLET: debits balance atomically and writes a ledger row whose balanceAfter matches', async () => {
    const { buyer, product } = await seedBuyerWithCart({
      productPrice: 100,
      quantityAvailable: 10,
      cartQty: 2,
      walletBalance: 500,
    });

    const order = await OrderService.createOrder(buyer.id, { paymentMethod: 'WALLET' });

    expect(order.status).toBe('CONFIRMED');
    expect(order.paymentStatus).toBe('CAPTURED');

    // wallet debited 500 - 200 = 300
    const wallet = await prisma.buyerWallet.findUnique({ where: { buyerId: buyer.id } });
    expect(Number(wallet?.balance)).toBe(300);

    // ledger row balanceAfter matches wallet balance (the core invariant)
    const txns = await prisma.walletTransaction.findMany({ where: { buyerId: buyer.id } });
    expect(txns).toHaveLength(1);
    expect(txns[0].type).toBe('DEBIT');
    expect(Number(txns[0].amount)).toBe(200);
    expect(Number(txns[0].balanceAfter)).toBe(300);
    expect(txns[0].balanceAfter.toString()).toBe(wallet?.balance.toString());
    // back-patched referenceOrderId
    expect(txns[0].referenceOrderId).toBe(order.id);

    const payment = await prisma.payment.findUnique({ where: { orderId: order.id } });
    expect(payment?.status).toBe('CAPTURED');
    expect(product.id).toBeTruthy();
  });

  it('WALLET: rejects with 402 when balance is insufficient and debits nothing', async () => {
    const { buyer } = await seedBuyerWithCart({
      productPrice: 100,
      quantityAvailable: 10,
      cartQty: 2, // total 200, balance only 150
      walletBalance: 150,
    });

    await expect(
      OrderService.createOrder(buyer.id, { paymentMethod: 'WALLET' }),
    ).rejects.toMatchObject({
      status: 402,
    });

    // nothing changed: balance intact, no order, no ledger row, cart intact
    const wallet = await prisma.buyerWallet.findUnique({ where: { buyerId: buyer.id } });
    expect(Number(wallet?.balance)).toBe(150);
    expect(await prisma.order.count({ where: { buyerId: buyer.id } })).toBe(0);
    expect(await prisma.walletTransaction.count({ where: { buyerId: buyer.id } })).toBe(0);
    expect(await prisma.cartItem.count({ where: { buyerId: buyer.id } })).toBe(1);
  });

  it('rejects with 409 when stock is insufficient and reserves nothing', async () => {
    const { buyer, product } = await seedBuyerWithCart({
      productPrice: 100,
      quantityAvailable: 1, // cart wants 2, only 1 available
      cartQty: 2,
    });

    await expect(
      OrderService.createOrder(buyer.id, { paymentMethod: 'COD' }),
    ).rejects.toMatchObject({
      status: 409,
    });

    const inv = await prisma.productInventory.findUnique({ where: { productId: product.id } });
    expect(inv?.quantityReserved).toBe(0); // no partial reservation leaked
    expect(await prisma.order.count({ where: { buyerId: buyer.id } })).toBe(0);
    expect(await prisma.cartItem.count({ where: { buyerId: buyer.id } })).toBe(1); // cart kept
  });

  it('UPI/CARD: creates a PENDING_PAYMENT order with no Payment row yet', async () => {
    const { buyer } = await seedBuyerWithCart({ productPrice: 100, cartQty: 1 });

    const order = await OrderService.createOrder(buyer.id, { paymentMethod: 'UPI' });

    expect(order.status).toBe('PENDING_PAYMENT');
    expect(order.paymentStatus).toBe('PENDING');
    expect(order.confirmedAt).toBeNull();
    const payment = await prisma.payment.findUnique({ where: { orderId: order.id } });
    expect(payment).toBeNull(); // created later by PaymentsService.createRazorpayOrder
  });

  it('rejects with 400 when the buyer has no shop profile (delivery address)', async () => {
    const buyer = await createUser({ role: 'BUYER' }); // no shop profile
    const { createCategory, createProduct } = await import('../../test/helpers');
    const category = await createCategory();
    const product = await createProduct(category.id);
    await prisma.cartItem.create({
      data: { buyerId: buyer.id, productId: product.id, quantity: 1 },
    });

    await expect(
      OrderService.createOrder(buyer.id, { paymentMethod: 'COD' }),
    ).rejects.toMatchObject({
      status: 400,
    });
  });

  it('snapshots the delivery address from ShopProfile at order time', async () => {
    const { buyer } = await seedBuyerWithCart({ productPrice: 100, cartQty: 1 });

    const order = await OrderService.createOrder(buyer.id, { paymentMethod: 'COD' });
    const addr = order.deliveryAddress as Record<string, unknown>;
    expect(addr.city).toBe('Delhi');
    expect(addr.pincode).toBe('110001');
    expect(addr.addressLine).toBe('12 Market Road');
  });
});

describe('OrderService.listOrders / getOrder ownership', () => {
  it("lists only the buyer's own orders with pagination", async () => {
    const a = await seedBuyerWithCart({ productPrice: 50, cartQty: 1 });
    const b = await seedBuyerWithCart({ productPrice: 75, cartQty: 1 });
    await OrderService.createOrder(a.buyer.id, { paymentMethod: 'COD' });
    await OrderService.createOrder(b.buyer.id, { paymentMethod: 'COD' });

    const res = await OrderService.listOrders(a.buyer.id, { page: 1, limit: 20 });
    expect(res.total).toBe(1);
    expect(res.data).toHaveLength(1);
    expect(res.data[0].buyerId).toBe(a.buyer.id);
  });

  it("getOrder returns the buyer's own order and 404s another buyer's", async () => {
    const a = await seedBuyerWithCart({ cartQty: 1 });
    const b = await createUser({ role: 'BUYER' });
    await createShopProfile(b.id);
    const order = await OrderService.createOrder(a.buyer.id, { paymentMethod: 'COD' });

    const own = await OrderService.getOrder(a.buyer.id, order.id);
    expect(own.id).toBe(order.id);

    await expect(OrderService.getOrder(b.id, order.id)).rejects.toMatchObject({ status: 404 });
  });
});

describe('OrderService.cancelOrder — WALLET refund (audit-2 #2)', () => {
  it('restores the wallet balance and writes a CREDIT ledger row atomically', async () => {
    const { buyer } = await seedBuyerWithCart({
      productPrice: 100,
      quantityAvailable: 10,
      cartQty: 2, // total 200
      walletBalance: 500,
    });
    const order = await OrderService.createOrder(buyer.id, { paymentMethod: 'WALLET' });
    // sanity: debited to 300 at checkout
    expect(
      Number((await prisma.buyerWallet.findUnique({ where: { buyerId: buyer.id } }))?.balance),
    ).toBe(300);

    await OrderService.cancelOrder(buyer.id, order.id, { reason: 'changed my mind' });

    // balance restored to 500
    const wallet = await prisma.buyerWallet.findUnique({ where: { buyerId: buyer.id } });
    expect(Number(wallet?.balance)).toBe(500);

    // ledger has DEBIT(300) then CREDIT(500) whose balanceAfter matches the wallet
    const txns = await prisma.walletTransaction.findMany({
      where: { buyerId: buyer.id },
      orderBy: { createdAt: 'asc' },
    });
    expect(txns).toHaveLength(2);
    expect(txns[1].type).toBe('CREDIT');
    expect(Number(txns[1].amount)).toBe(200);
    expect(Number(txns[1].balanceAfter)).toBe(500);
    expect(txns[1].balanceAfter.toString()).toBe(wallet?.balance.toString());
    expect(txns[1].referenceOrderId).toBe(order.id);

    // reserved inventory released
    const inv = await prisma.productInventory.findMany({ where: { quantityReserved: { gt: 0 } } });
    expect(inv).toHaveLength(0);
  });

  it('does NOT refund a COD order (no wallet touch)', async () => {
    const { buyer } = await seedBuyerWithCart({
      productPrice: 100,
      cartQty: 1,
      walletBalance: 50,
    });
    const order = await OrderService.createOrder(buyer.id, { paymentMethod: 'COD' });
    await OrderService.cancelOrder(buyer.id, order.id, { reason: 'no longer needed' });

    const wallet = await prisma.buyerWallet.findUnique({ where: { buyerId: buyer.id } });
    expect(Number(wallet?.balance)).toBe(50); // unchanged
    expect(await prisma.walletTransaction.count({ where: { buyerId: buyer.id } })).toBe(0);
  });
});
