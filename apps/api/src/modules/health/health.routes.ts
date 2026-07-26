import { Router } from 'express';
import { env } from '../../lib/env';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';

export const healthRouter: Router = Router();

// B1-01 + B2-03: liveness + DB connectivity + uptime (UptimeRobot target).
healthRouter.get('/health', async (_req, res) => {
  const uptime = Math.round(process.uptime());
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', version: env.APP_VERSION, db: 'ok', uptime });
  } catch (err) {
    logger.error({ err }, 'health: DB check failed');
    res.status(503).json({ status: 'degraded', version: env.APP_VERSION, db: 'error', uptime });
  }
});
