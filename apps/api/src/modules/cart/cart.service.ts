import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { notFound } from '../../lib/http-error';
import type { AddToCartInput, UpdateCartInput } from './cart.schemas';

// B2-06 — arch §3 Cart (server-side, persists across app restart since rows
// live in Postgres, not memory). Live prices: every read joins CartItem→Product
// and recomputes subtotal from product.sellingPrice, so a price change shows up
// immediately (no stale cached total).

type CartItemWithProduct = Prisma.CartItemGetPayload<{ include: { product: true } }>;

/** All cart rows for a buyer, joined to Product for live sellingPrice. */
async function loadCartItems(buyerId: string): Promise<CartItemWithProduct[]> {
  return prisma.cartItem.findMany({
    where: { buyerId },
    include: { product: true },
    orderBy: { addedAt: 'asc' },
  });
}

/** Sum of product.sellingPrice * quantity across the cart, in Decimal precision
 *  (matches Decimal(10,2) money storage; JSON-serializes to a string). */
function computeSubtotal(items: CartItemWithProduct[]): Prisma.Decimal {
  return items.reduce(
    (sum, item) => sum.add(item.product.sellingPrice.mul(item.quantity)),
    new Prisma.Decimal(0),
  );
}

export const CartService = {
  /** GET /cart → { items, subtotal }. */
  async getCart(buyerId: string) {
    const items = await loadCartItems(buyerId);
    return { items, subtotal: computeSubtotal(items) };
  },

  /** POST /cart/items → { items }. Upsert on @@unique([buyerId, productId]):
   *  new product inserts a row; re-adding increments quantity (no dup row).
   *  Product must exist and be active before it can enter a cart. */
  async addItem(buyerId: string, input: AddToCartInput) {
    const product = await prisma.product.findUnique({
      where: { id: input.productId },
      select: { id: true, isActive: true },
    });
    if (!product || !product.isActive) throw notFound(`Product ${input.productId} not found`);

    await prisma.cartItem.upsert({
      where: { buyerId_productId: { buyerId, productId: input.productId } },
      create: { buyerId, productId: input.productId, quantity: input.quantity },
      update: { quantity: { increment: input.quantity } },
    });
    return { items: await loadCartItems(buyerId) };
  },

  /** PATCH /cart/items/:productId → { items }. 404 if the line isn't in the cart. */
  async updateItem(buyerId: string, productId: string, input: UpdateCartInput) {
    try {
      await prisma.cartItem.update({
        where: { buyerId_productId: { buyerId, productId } },
        data: { quantity: input.quantity },
      });
    } catch (err) {
      // P2025 = record not found for the (buyerId, productId) key.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw notFound('Item not in cart');
      }
      throw err;
    }
    return { items: await loadCartItems(buyerId) };
  },

  /** DELETE /cart/items/:productId → { items }. deleteMany is idempotent: a
   *  missing line is a no-op, not an error (REST DELETE semantics). */
  async removeItem(buyerId: string, productId: string) {
    await prisma.cartItem.deleteMany({ where: { buyerId, productId } });
    return { items: await loadCartItems(buyerId) };
  },

  /** DELETE /cart → { message }. Wipes every line for the buyer. */
  async clearCart(buyerId: string) {
    await prisma.cartItem.deleteMany({ where: { buyerId } });
    return { message: 'Cart cleared' };
  },
};
