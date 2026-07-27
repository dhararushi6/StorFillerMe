import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { getReferralCodeHandler, getReferralHistoryHandler } from './referral.controller';

// B2-05 — mounted at /api/v1/referral. Buyer-only; both routes are GET (no body
// to validate, hence no schemas file for this module).
export const referralRouter: Router = Router();

referralRouter.use(requireAuth, requireRole('BUYER'));

referralRouter.get('/code', getReferralCodeHandler);
referralRouter.get('/history', getReferralHistoryHandler);
