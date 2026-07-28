import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { signAccessToken } from '../lib/jwt';
import type { Role } from '@storefiller/types';

// Test factories. Each creates the minimum row graph a flow needs, with unique
// values per call so tests never collide on @@unique columns.

let seq = 0;
const uniq = () => `${Date.now().toString(36)}${(seq++).toString(36)}`;

/** JWT access token for a user (bypasses Firebase; exercises the RS256 path). */
export function bearerFor(userId: string, role: Role): string {
  return `Bearer ${signAccessToken(userId, role)}`;
}

export async function createUser(
  overrides: Partial<{
    role: Role;
    phone: string;
    email: string | null;
    isActive: boolean;
    pushEnabled: boolean;
  }> = {},
) {
  const u = uniq();
  return prisma.user.create({
    data: {
      phone: overrides.phone ?? `+91${String(Math.floor(7e9 + Math.random() * 2e9))}`,
      email: overrides.email === undefined ? `u${u}@test.dev` : overrides.email,
      role: overrides.role ?? 'BUYER',
      firebaseUid: `fb-${u}`,
      isActive: overrides.isActive ?? true,
      pushEnabled: overrides.pushEnabled ?? true,
    },
  });
}

export async function createShopProfile(
  userId: string,
  overrides: Partial<{
    latitude: number;
    longitude: number;
  }> = {},
) {
  const lat = overrides.latitude ?? 28.6139; // Delhi
  const lng = overrides.longitude ?? 77.209;
  const profile = await prisma.shopProfile.create({
    data: {
      userId,
      shopName: `Shop ${uniq()}`,
      ownerName: 'Test Owner',
      addressLine: '12 Market Road',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      latitude: lat,
      longitude: lng,
    },
  });
  await prisma.$executeRaw`
    UPDATE "ShopProfile"
    SET location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
    WHERE id = ${profile.id}`;
  return profile;
}

export async function createAgent(
  userId: string,
  overrides: Partial<{
    isAvailable: boolean;
  }> = {},
) {
  return prisma.agentProfile.create({
    data: {
      userId,
      vehicleType: 'bike',
      isAvailable: overrides.isAvailable ?? true,
    },
  });
}

export async function createCategory(
  overrides: Partial<{
    name: string;
    isActive: boolean;
  }> = {},
) {
  const name = overrides.name ?? `Cat ${uniq()}`;
  return prisma.category.create({
    data: {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      isActive: overrides.isActive ?? true,
    },
  });
}

export async function createProduct(
  categoryId: string,
  overrides: Partial<{
    name: string;
    brand: string | null;
    sellingPrice: number;
    isActive: boolean;
    quantityAvailable: number;
  }> = {},
) {
  const u = uniq();
  const product = await prisma.product.create({
    data: {
      name: overrides.name ?? `Product ${u}`,
      brand: overrides.brand === undefined ? `Brand ${u}` : overrides.brand,
      sku: `SKU-${u}`,
      categoryId,
      unit: 'PACK',
      unitSize: '500g',
      caseQty: 12,
      mrp: new Prisma.Decimal(overrides.sellingPrice ?? 100),
      sellingPrice: new Prisma.Decimal(overrides.sellingPrice ?? 100),
      isActive: overrides.isActive ?? true,
    },
  });
  await prisma.productInventory.create({
    data: {
      productId: product.id,
      quantityAvailable: overrides.quantityAvailable ?? 50,
      quantityReserved: 0,
    },
  });
  return product;
}

/** Buyer + shop + one in-cart product with inventory. Returns everything a
 *  checkout test needs. */
export async function seedBuyerWithCart(opts: {
  productPrice?: number;
  quantityAvailable?: number;
  cartQty?: number;
  walletBalance?: number;
}) {
  const buyer = await createUser({ role: 'BUYER' });
  await createShopProfile(buyer.id);
  const category = await createCategory();
  const product = await createProduct(category.id, {
    sellingPrice: opts.productPrice ?? 100,
    quantityAvailable: opts.quantityAvailable ?? 50,
  });
  await prisma.cartItem.create({
    data: { buyerId: buyer.id, productId: product.id, quantity: opts.cartQty ?? 2 },
  });
  if (opts.walletBalance !== undefined) {
    await prisma.buyerWallet.create({
      data: { buyerId: buyer.id, balance: new Prisma.Decimal(opts.walletBalance) },
    });
  }
  return { buyer, category, product };
}
