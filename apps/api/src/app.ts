import express, { type Express } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { logger } from './lib/logger';
import { healthRouter } from './modules/health/health.routes';
import { errorHandler, notFoundHandler } from './middleware/error-handler.middleware';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(pinoHttp({ logger }));

  // ── Health (mounted at root AND under /api so both /health and /api/health work) ──
  app.use('/api', healthRouter);
  app.use('/', healthRouter);

  // ════════════════════════════════════════════════════════════════════════════
  // CRITICAL ORDERING (non-negotiable #2): any route needing the RAW request body
  // for HMAC verification (Razorpay webhook, Cloudinary webhook) MUST register its
  // own express.raw() parser BEFORE the global express.json() below. Those routers
  // are mounted here in Week 2/3 via registerRawBodyRoutes(app).
  // ════════════════════════════════════════════════════════════════════════════
  registerRawBodyRoutes(app);

  // Global JSON parser — everything after this point gets a parsed req.body.
  app.use(express.json({ limit: '1mb' }));

  registerJsonRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

/** Routes that consume the raw body (registered before express.json). Filled in Week 2/3. */
function registerRawBodyRoutes(_app: express.Express) {
  // Week 2: Cloudinary product image webhook (raw).
  // Week 3: Razorpay payment webhook (raw) — see modules/payments.
}

/** Routes that consume parsed JSON (registered after express.json). Filled in Weeks 1-4. */
function registerJsonRoutes(_app: express.Express) {
  // Auth, shop, catalog, cart, orders, payments, wallet, delivery, admin, etc.
}
