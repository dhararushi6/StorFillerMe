import type { CronJob } from './types';
import { cleanupExpiredOtps } from '../modules/auth/email-otp.service';
import { logger } from '../lib/logger';

// Hourly at minute 5 (staggered off the top of the hour). B1-06.
export const otpCleanupJob: CronJob = {
  name: 'otp-cleanup',
  schedule: '5 * * * *',
  run: async () => {
    const deleted = await cleanupExpiredOtps();
    if (deleted > 0) logger.info({ deleted }, 'otp-cleanup: removed expired OTP rows');
  },
};
