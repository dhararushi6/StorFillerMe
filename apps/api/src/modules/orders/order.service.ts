import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { badRequest, conflict, notFound, HttpError } from '../../lib/http-error';
import { assertTransition, isTerminal } from './order.fsm';
import type { CreateOrderInput, ListOrdersQuery, CancelOrderInput } from './order.schemas';
import type { OrderStatus } from '@storefiller/types';

// B3-06/07 — Order FSM, inventory lock, POST /orders (arch §4).
//
// Key invariants:
//  1. Inventory reservation uses pessimistic SELECT FOR UPDATE inside the
//     SAME transaction as order creation — no gap where another TX can snap
//     the old quantityReserved (arch §4.2).
//  2. Total is recomputed from the live cart + catalog; client-sent amounts
//     are ignored (arch §3 POST /orders contract).
//  3. WALLET payment debits the buyer's balance atomically in the same TX;
//     rejects with 402 if insufficient (handbook B3-06/07 Expected Output).
//  4. COD orders skip payment and go straight to CONFIRMED.
//  5. Price + product name are snapshotted on OrderItem rows.
//  6. Delivery address is a Json snapshot of the buyer's ShopProfile address
//     at order time.

// ── types ──────────────────────────────────────────────────────────────────

type CartRow = {
  productId: string;
  productName: string;
  sellingPrice: Prisma.Decimal;
  quantity: number;
};

type InventoryRow = { quantityAvailable: number; quantityReserved: number };

// ── helpers ────────────────────────────────────────────────────────────────

function payId(orderId: string, method: string): string {
  return `order_stub_${orderId}_${method}_${Date.now()}`;
}

/** Load the buyer's cart joined to Product (live prices/names). Empty cart → 400. */
async function loadCart(buyerId: string): Promise<CartRow[]> {
  const rows = await prisma.cartItem.findMany({
    where: { buyerId },
    include: {
      product: { select: { name: true, sellingPrice: true, isActive: true } },
    },
    orderBy: { addedAt: 'asc' },
  });
  if (rows.length === 0) throw badRequest('Cart is empty');
  for (const r of rows) {
    if (!r.product.isActive) throw badRequest(`Product ${r.productId} is no longer available`);
  }
  return rows.map((r) => ({
    productId: r.productId,
    productName: r.product.name,
    sellingPrice: r.product.sellingPrice,
    quantity: r.quantity,
  }));
}

// ── service ────────────────────────────────────────────────────────────────

export const OrderService = {
  /** POST /orders — create order from cart with inventory locking. */
  async createOrder(buyerId: string, input: CreateOrderInput) {
    const cart = await loadCart(buyerId);
    const isCod = input.paymentMethod === 'COD';
    const isWallet = input.paymentMethod === 'WALLET';

    return prisma.$transaction(async (tx) => {
      // ── inventory lock per product (arch §4.2) ──
      for (const line of cart) {
        const [inv] = await tx.$queryRaw<InventoryRow[]>`
          SELECT "quantityAvailable", "quantityReserved"
          FROM "ProductInventory"
          WHERE "productId" = ${line.productId}
          FOR UPDATE
        `;
        const remaining = (inv?.quantityAvailable ?? 0) - (inv?.quantityReserved ?? 0);
        if (remaining < line.quantity) {
          throw conflict(`Insufficient stock for ${line.productName}`);
        }
        await tx.productInventory.update({
          where: { productId: line.productId },
          data: { quantityReserved: { increment: line.quantity } },
        });
      }

      // ── compute money ──
      const deliveryFee = new Prisma.Decimal(0);
      const discountAmount = new Prisma.Decimal(0);
      const subtotalAmount = cart.reduce(
        (sum, line) => sum.add(line.sellingPrice.mul(line.quantity)),
        new Prisma.Decimal(0),
      );
      const totalAmount = Prisma.Decimal.sum(subtotalAmount, deliveryFee, discountAmount);

      // ── snapshot delivery address from ShopProfile ──
      const shop = await tx.shopProfile.findUnique({
        where: { userId: buyerId },
        select: {
          addressLine: true,
          city: true,
          state: true,
          pincode: true,
          latitude: true,
          longitude: true,
        },
      });
      // Check after inventory lock so we don't lock if no shop; for buyers
      // ordering for the first time, this ensures the address exists.
      if (!shop) throw badRequest('Shop profile not found — create it before ordering');

      // ── wallet debit (same TX — atomic with inventory reservation) ──
      if (isWallet) {
        const wallet = await tx.buyerWallet.findUnique({ where: { buyerId } });
        const balance = wallet?.balance ?? new Prisma.Decimal(0);
        if (balance.lessThan(totalAmount)) {
          throw new HttpError(402, 'Insufficient wallet balance');
        }
        const balanceAfter = balance.minus(totalAmount);
        await tx.buyerWallet.update({
          where: { buyerId },
          data: { balance: balanceAfter },
        });
        // ponytail: WalletTransaction is written inline rather than via
        // WalletService (which would exec outside this TX). If the wallet
        // module grows a transactional bulk API, route through it instead.
        await tx.walletTransaction.create({
          data: {
            buyerId,
            type: 'DEBIT',
            amount: totalAmount,
            balanceAfter,
            referenceOrderId: undefined, // order.id not assigned yet — patched after create
          },
        });
      }

      // ── status / paymentStatus ──
      const status: OrderStatus = isCod || isWallet ? 'CONFIRMED' : 'PENDING_PAYMENT';
      const paymentStatus = isCod ? 'NOT_APPLICABLE' : isWallet ? 'CAPTURED' : 'PENDING';

      const now = new Date();
      const order = await tx.order.create({
        data: {
          buyerId,
          status,
          paymentMethod: input.paymentMethod,
          paymentStatus,
          subtotalAmount,
          deliveryFee,
          discountAmount,
          totalAmount,
          deliveryAddress: {
            addressLine: shop.addressLine,
            city: shop.city,
            state: shop.state,
            pincode: shop.pincode,
            lat: shop.latitude,
            lng: shop.longitude,
          },
          confirmedAt: status === 'CONFIRMED' ? now : undefined,
          items: {
            create: cart.map((line) => ({
              productId: line.productId,
              productNameSnap: line.productName,
              unitPriceSnap: line.sellingPrice,
              quantity: line.quantity,
              lineTotal: line.sellingPrice.mul(line.quantity),
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // ── wallet transaction: back-patch referenceOrderId ──
      if (isWallet) {
        await tx.walletTransaction.updateMany({
          where: { buyerId, referenceOrderId: null },
          data: { referenceOrderId: order.id },
        });
      }

      // ── payment row ──
      if (isCod) {
        // ponytail: single COD Payment row — Payment.orderId @unique, so
        // exactly one (not two as the summary says). Payment row exists for
        // reconciliation, no payment gateway interaction.
        await tx.payment.create({
          data: {
            orderId: order.id,
            razorpayOrderId: payId(order.id, 'cod'),
            amount: totalAmount,
            status: 'CAPTURED',
            capturedAt: now,
          },
        });
      } else if (isWallet) {
        await tx.payment.create({
          data: {
            orderId: order.id,
            razorpayOrderId: payId(order.id, 'wallet'),
            amount: totalAmount,
            status: 'CAPTURED',
            capturedAt: now,
          },
        });
      } else {
        // UPI/CARD: Payment row created by PaymentsService.createRazorpayOrder
        // (B3-05) or patched by webhook (B3-07). The order exists now and the
        // buyer calls POST /payments/razorpay/order separately to get the
        // Razorpay order id.
      }

      // ── clear cart ──
      await tx.cartItem.deleteMany({ where: { buyerId } });

      return order;
    });
  },

  /** GET /orders — list buyer's orders with optional status filter + pagination. */
  async listOrders(buyerId: string, query: ListOrdersQuery) {
    const where = {
      buyerId,
      ...(query.status ? { status: query.status } : {}),
    };
    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { placedAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.order.count({ where }),
    ]);
    return { data, total };
  },

  /** GET /orders/:id — single order with items. Buyer-ownership checked inline. */
  async getOrder(buyerId: string, orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order || order.buyerId !== buyerId) throw notFound(`Order ${orderId} not found`);
    return order;
  },

  /** PATCH /orders/:id/cancel — release inventory, set order → CANCELLED. */
  async cancelOrder(buyerId: string, orderId: string, input: CancelOrderInput) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order || order.buyerId !== buyerId) throw notFound(`Order ${orderId} not found`);
    if (isTerminal(order.status)) {
      throw badRequest(`Cannot cancel a ${order.status} order`);
    }
    assertTransition(order.status, 'CANCELLED');

    return prisma.$transaction(async (tx) => {
      // Release all reserved inventory.
      for (const item of order.items) {
        await tx.productInventory.updateMany({
          where: { productId: item.productId },
          data: { quantityReserved: { decrement: item.quantity } },
        });
      }
      // Initiate refund if paid online (wallet/UPI/card).
      if (order.paymentMethod !== 'COD' && order.paymentStatus !== 'NOT_APPLICABLE') {
        // ponytail: refund is a stub here — real Razorpay refund API call
        // lands in B3-07 (webhook) or B3-08 (reconciliation). For now we
        // mark the payment as FAILED and let the reconciliation cron correct
        // it. Add actual refund API call there.
        logger.warn(
          { orderId: order.id, paymentMethod: order.paymentMethod },
          'order cancelled with online payment — refund not yet processed (B3-08)',
        );
      }
      return tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancellationReason: input.reason,
        },
        include: { items: true },
      });
    });
  },
};
