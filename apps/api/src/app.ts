import express, { type Express } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { logger } from './lib/logger';
import { healthRouter } from './modules/health/health.routes';
import { authRouter } from './modules/auth/auth.routes';
import { shopRouter } from './modules/shop/shop.routes';
import { productImageWebhook } from './modules/catalog/product-webhook.controller';
import { adminCatalogRouter } from './modules/catalog/admin.routes';
import { catalogRouter } from './modules/catalog/catalog.routes';
import { paymentsRouter } from './modules/payments/payments.routes';
import { notificationsRouter } from './modules/notifications/notifications.routes';
import { errorHandler, notFoundHandler } from './middleware/error-handler.middleware';

const API = '/api/v1';

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
function registerRawBodyRoutes(app: express.Express) {
  // Cloudinary product image webhook (B2-02 skeleton, B2-06 full) — raw body.
  app.post(`${API}/products/image-confirm`, express.raw({ type: '*/*' }), productImageWebhook);
  // Week 3: Razorpay payment webhook (raw) — see modules/payments.
}

/** Routes that consume parsed JSON (registered after express.json). Filled in Weeks 1-4. */
function registerJsonRoutes(app: express.Express) {
  app.use(`${API}/auth`, authRouter);
  app.use(`${API}/shop`, shopRouter);
  app.use(`${API}/payments`, paymentsRouter);
  app.use(`${API}/users/me`, notificationsRouter); // B2-04: device tokens + notification prefs
  // admin MUST mount before the bare-`/api/v1` catalogRouter: catalog's router-level
  // BUYER guard otherwise intercepts /admin/* and 403s admins before they reach their
  // own routes. (ponytail: known minor ceiling — an unmatched /admin/* sub-path falls
  // through to catalog's BUYER guard and returns 403 instead of 404; acceptable while
  // admin paths are all known.)
  app.use(`${API}/admin`, adminCatalogRouter); // B1-08/B1-09: admin product + category CRUD
  app.use(`${API}`, catalogRouter); // B1-09: GET /categories (buyer); /products in B2-06
  // cart, orders, wallet, delivery, etc. — added per task.
}
