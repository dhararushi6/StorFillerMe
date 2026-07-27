import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { topupSchema } from './wallet.schemas';
import {
  getWalletHandler,
  listWalletTransactionsHandler,
  createTopupOrderHandler,
} from './wallet.controller';

// B3-04 — wallet routes, mounted at /api/v1/wallet. Buyer auth at the router
// level: the wallet is scoped to the requesting buyer (req.user.id).
export const walletRouter: Router = Router();

walletRouter.use(requireAuth, requireRole('BUYER'));

walletRouter.get('/', getWalletHandler);
walletRouter.get('/transactions', listWalletTransactionsHandler);
walletRouter.post(
  '/topup/razorpay-order',
  validate({ body: topupSchema }),
  createTopupOrderHandler,
);
