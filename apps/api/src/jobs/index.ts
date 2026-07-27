import cron from 'node-cron';
import type { CronJob } from './types';
import { env, isTest } from '../lib/env';
import { logger } from '../lib/logger';
import { otpCleanupJob } from './otp-cleanup.job';
import { productImageCleanupJob } from './product-image-cleanup.job';

/** All cron jobs. Schedules are staggered to avoid overlap (audited in B2-10/B3-09). */
export const cronJobs: CronJob[] = [otpCleanupJob, productImageCleanupJob];

/** Registers every cron job. Relies on Railway replicas:1 so each fires once (§6). */
export function registerCronJobs(): void {
  if (isTest) return; // never schedule crons in the test process
  for (const job of cronJobs) {
    cron.schedule(
      job.schedule,
      async () => {
        try {
          await job.run();
        } catch (err) {
          logger.error({ err, job: job.name }, 'cron job failed');
        }
      },
      { timezone: env.CRON_TZ },
    );
    logger.info({ job: job.name, schedule: job.schedule, tz: env.CRON_TZ }, 'cron registered');
  }
}
