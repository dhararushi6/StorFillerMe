import type { CronJob } from './types';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

/**
 * B3-04/M1-05 — every 5 minutes, flag ACTIVE products with no imageUrl for
 * admin review. "Flag" = log the list (the admin product endpoints already
 * surface imageUrl, so a buyer-facing product with no image is visible there).
 * ponytail: logging rather than a separate flags table — the handbook only asks
 * for "auto-detected by the cron"; add a dedicated queue/table if retries or
 * escalation routing become a requirement.
 */
export const productImageCleanupJob: CronJob = {
  name: 'product-image-cleanup',
  schedule: '*/5 * * * *',
  run: async () => {
    const missing = await prisma.product.findMany({
      where: { isActive: true, imageUrl: null },
      select: { id: true, name: true, sku: true },
      orderBy: { createdAt: 'asc' },
    });
    if (missing.length > 0) {
      logger.warn(
        { count: missing.length, products: missing },
        'product-image-cleanup: ACTIVE products with no image flagged for admin review',
      );
    }
  },
};
