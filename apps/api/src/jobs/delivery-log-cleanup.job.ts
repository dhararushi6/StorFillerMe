import type { CronJob } from './types';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

/**
 * B2-08 — delete DeliveryLocationLog rows older than 30 days. The log is
 * append-only history for audit/replay; the live read path uses LiveTracking
 * so pruning never slows tracking. Runs nightly at 03:30 IST (staggered off
 * the other crons, audited in B2-10/B3-09). `runCleanup` is exported so an
 * admin can trigger the same logic on demand.
 */
export async function runDeliveryLogCleanup(): Promise<{ deleted: number }> {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const { count } = await prisma.deliveryLocationLog.deleteMany({
    where: { recordedAt: { lt: cutoff } },
  });
  if (count > 0) {
    logger.info({ deleted: count }, 'delivery-log-cleanup: pruned rows older than 30 days');
  }
  return { deleted: count };
}

export const deliveryLogCleanupJob: CronJob = {
  name: 'delivery-log-cleanup',
  schedule: '30 3 * * *',
  run: async () => {
    await runDeliveryLogCleanup();
  },
};
