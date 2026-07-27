import { z } from 'zod';

// B2-04 — Notification preferences live as columns on User (pushEnabled,
// orderUpdatesOptIn, promoOptIn); no separate model. Device tokens are their own
// table (DeviceToken). arch §3:
//   POST /users/me/device-token      Buyer/Agent/Admin { token, platform } → { message }
//   PATCH /users/me/notification-    Buyer/Agent { pushEnabled, orderUpdatesOptIn,
//        preferences                                    promoOptIn } → { user }

/** platform is a free string (DB column is String); constrained to a sensible
 * length. Real values are "android" | "ios" | "web". */
export const deviceTokenSchema = z.object({
  token: z.string().min(1).max(512),
  platform: z.string().min(1).max(20),
});
export type DeviceTokenInput = z.infer<typeof deviceTokenSchema>;

/** All three optional — PATCH updates only the supplied fields. */
export const notificationPrefsSchema = z.object({
  pushEnabled: z.boolean().optional(),
  orderUpdatesOptIn: z.boolean().optional(),
  promoOptIn: z.boolean().optional(),
});
export type NotificationPrefsInput = z.infer<typeof notificationPrefsSchema>;
