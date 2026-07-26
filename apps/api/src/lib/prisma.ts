import { PrismaClient } from '@prisma/client';
import { env, isProd } from './env';

/**
 * Single PrismaClient for the whole process. Neon free tier: keep the pool small
 * and idle timeout short so autosuspend can kick in between bursts (§6 risk table).
 */
export const prisma = new PrismaClient({
  log: isProd ? ['warn', 'error'] : ['warn', 'error'],
  datasources: { db: { url: env.DATABASE_URL } },
});

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
