import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { createRazorpayOrderSchema } from './payments.schemas';
import { createRazorpayOrderHandler } from './payments.controller';

// B3-05/BE-3 — payments routes, mounted at /api/v1/payments.
export const paymentsRouter: Router = Router();

// Buyer order creation (JSON). The Razorpay webhook (raw body) is wired in B3-07
// and registered in app.ts registerRawBodyRoutes before express.json.
paymentsRouter.post(
  '/razorpay/order',
  requireAuth,
  requireRole('BUYER'),
  validate({ body: createRazorpayOrderSchema }),
  createRazorpayOrderHandler,
);
