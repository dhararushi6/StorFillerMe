import { createApp } from './app';
import { env } from './lib/env';
import { logger } from './lib/logger';
import { registerCronJobs } from './jobs';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`Storefiller API v${env.APP_VERSION} listening on :${env.PORT} [${env.NODE_ENV}]`);
  registerCronJobs();
});

const shutdown = (signal: string) => {
  logger.info(`${signal} received — shutting down`);
  server.close(() => process.exit(0));
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
