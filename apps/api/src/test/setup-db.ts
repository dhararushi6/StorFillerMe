import { beforeEach, afterAll } from '@jest/globals';
import { prisma } from '../lib/prisma';

// Per-worker DB lifecycle: wipe every table before each test for isolation, and
// disconnect once when the worker's suite finishes. Tables are truncated in
// dependency order with CASCADE so FK order never matters. RESTART IDENTITY is
// irrelevant (ids are uuids) but harmless.

const TABLES = [
  'DeliveryLocationLog',
  'LiveTracking',
  'Settlement',
  'OrderRating',
  'OrderItem',
  'Payment',
  'WalletTransaction',
  'BuyerWallet',
  'Order',
  'CartItem',
  'ProductInventory',
  'Product',
  'Category',
  'SupportTicket',
  'Referral',
  'ReferralCode',
  'DeviceToken',
  'EmailOtp',
  'RefreshToken',
  'AgentProfile',
  'ShopProfile',
  'AuditLog',
  'JobRecovery',
  'User',
];

export async function resetDatabase(): Promise<void> {
  // Single TRUNCATE ... CASCADE over all tables is one round-trip and FK-safe.
  const list = TABLES.map((t) => `"${t}"`).join(', ');
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`);
}

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});
