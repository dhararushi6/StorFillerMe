import { Router } from 'express';
import { env } from '../../lib/env';

export const healthRouter: Router = Router();

// B1-01: liveness. Extended with DB connectivity check in B2-03.
healthRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: env.APP_VERSION });
});
