import type { RequestHandler } from 'express';
import { NotificationService } from './notifications.service';
import { toPublicUser } from '../auth/auth.service';

// B2-04 — notification handlers. { user } reuses the auth module's toPublicUser
// so PATCH /users/me/notification-preferences returns the identical shape as login.

export const registerDeviceTokenHandler: RequestHandler = async (req, res) => {
  await NotificationService.registerDeviceToken(req.user!.id, req.body);
  res.json({ message: 'Device token registered' });
};

export const updatePreferencesHandler: RequestHandler = async (req, res) => {
  const user = await NotificationService.updatePreferences(req.user!.id, req.body);
  res.json({ user: toPublicUser(user) });
};
