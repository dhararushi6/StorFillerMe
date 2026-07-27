import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { deviceTokenSchema, notificationPrefsSchema } from './notifications.schemas';
import { registerDeviceTokenHandler, updatePreferencesHandler } from './notifications.controller';

// B2-04 — mounted at /api/v1/users/me. All routes require auth; the role scope
// differs per route so requireRole is applied per-route, not at the router level.
export const notificationsRouter: Router = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.post(
  '/device-token',
  validate({ body: deviceTokenSchema }),
  requireRole('BUYER', 'AGENT', 'ADMIN'),
  registerDeviceTokenHandler,
);

notificationsRouter.patch(
  '/notification-preferences',
  validate({ body: notificationPrefsSchema }),
  requireRole('BUYER', 'AGENT'),
  updatePreferencesHandler,
);
