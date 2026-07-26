import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { HttpError } from '../../lib/http-error';

export const paymentsRouter: Router = Router();

// B3-03 skeleton. Full order-creation logic is wired in B3-05 (Week 2); the
// Razorpay webhook (raw body) is wired in B3-07 (Week 3).
paymentsRouter.post('/razorpay/order', requireAuth, requireRole('BUYER'), () => {
  throw new HttpError(501, 'Razorpay order creation is wired in B3-05');
});
