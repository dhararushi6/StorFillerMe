import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { AccountService } from './account.service';

// Mounted at /api/v1/users/me alongside notificationsRouter.
//
// ADMIN is excluded on purpose: an admin deleting itself would anonymise the
// actor on its own AuditLog rows and can lock the last admin out of ops. Admin
// offboarding is an admin-console action, not a self-service one.

export const accountRouter: Router = Router();

/** Typed confirmation so a stray client-side DELETE can't wipe an account. */
const deleteAccountSchema = z.object({ confirm: z.literal('DELETE') });

accountRouter.delete(
  '/',
  requireAuth,
  requireRole('BUYER', 'AGENT'),
  validate({ body: deleteAccountSchema }),
  async (req, res) => {
    const result = await AccountService.deleteAccount(req.user!.id);
    res.json({ ...result, message: 'Account deleted' });
  },
);
