import admin from 'firebase-admin';
import { prisma } from '../../lib/prisma';
import { firebaseStubbed } from '../../lib/firebase-admin';
import { logger } from '../../lib/logger';
import type { DeviceToken, User } from '@prisma/client';
import type { DeviceTokenInput, NotificationPrefsInput } from './notifications.schemas';

export interface PushResult {
  attempted: number;
  sent: number;
  failed: number;
  markedInactive: number;
}

export const NotificationService = {
  /**
   * Sends a push to every ACTIVE device token for the user. Respects the user's
   * pushEnabled preference FIRST (returns a zero-attempt result without touching
   * tokens). On a failed per-token send, marks that token isActive=false
   * (markInactive). Real FCM when FIREBASE_SERVICE_ACCOUNT is set; otherwise a
   * clearly-marked STUB that logs the payload and resolves — never throws, never
   * blocks the calling flow (e.g. an order-status update must not fail because a
   * push couldn't be delivered).
   *
   * STUB failure heuristic (dev/test only): a token containing "fail" is treated
   * as an invalid/unregistered token, exactly as real FCM rejects one, so the
   * markInactive path stays exercisable without FCM credentials. Real FCM rejects
   * such tokens natively (messaging/registration-token-not-registered et al).
   */
  async sendPush(
    userId: string,
    title: string,
    body: string,
    data: Record<string, string> = {},
  ): Promise<PushResult> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      logger.warn({ userId }, 'sendPush: user not found');
      return { attempted: 0, sent: 0, failed: 0, markedInactive: 0 };
    }
    // Preference gate — checked before any token work or send.
    if (!user.pushEnabled) {
      logger.info({ userId }, 'sendPush: pushEnabled=false, skipping');
      return { attempted: 0, sent: 0, failed: 0, markedInactive: 0 };
    }

    const tokens = await prisma.deviceToken.findMany({
      where: { userId, isActive: true },
    });
    if (tokens.length === 0) {
      logger.info({ userId }, 'sendPush: no active device tokens');
      return { attempted: 0, sent: 0, failed: 0, markedInactive: 0 };
    }

    if (firebaseStubbed) return sendPushStub(userId, title, body, data, tokens);
    return sendPushFcm(userId, title, body, data, tokens);
  },

  /** POST /users/me/device-token — store or re-activate a device token. Upsert by
   * token (its unique key): re-registering an existing token flips isActive back
   * on and refreshes platform; a new token inserts. */
  async registerDeviceToken(userId: string, input: DeviceTokenInput): Promise<DeviceToken> {
    return prisma.deviceToken.upsert({
      where: { token: input.token },
      create: { userId, token: input.token, platform: input.platform },
      update: { userId, platform: input.platform, isActive: true },
    });
  },

  /** PATCH /users/me/notification-preferences — update only the supplied columns.
   * Returns the updated user (public shape is applied in the controller). */
  async updatePreferences(userId: string, input: NotificationPrefsInput): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.pushEnabled !== undefined && { pushEnabled: input.pushEnabled }),
        ...(input.orderUpdatesOptIn !== undefined && {
          orderUpdatesOptIn: input.orderUpdatesOptIn,
        }),
        ...(input.promoOptIn !== undefined && { promoOptIn: input.promoOptIn }),
      },
    });
    return user;
  },
};

/** Marks a device token inactive (markInactive) on a failed send. */
async function markInactive(tokenId: string): Promise<void> {
  await prisma.deviceToken.update({
    where: { id: tokenId },
    data: { isActive: false },
  });
}

// ── STUB path (no FIREBASE_SERVICE_ACCOUNT) ──────────────────────────────────

async function sendPushStub(
  userId: string,
  title: string,
  body: string,
  data: Record<string, string>,
  tokens: DeviceToken[],
): Promise<PushResult> {
  let sent = 0;
  let failed = 0;
  let markedInactive = 0;
  for (const t of tokens) {
    const isInvalid = /fail/i.test(t.token);
    if (isInvalid) {
      await markInactive(t.id);
      markedInactive += 1;
      failed += 1;
      logger.info({ userId, tokenId: t.id }, 'STUB push: invalid token → markInactive');
    } else {
      sent += 1;
      logger.info({ userId, title, body, data, platform: t.platform }, 'STUB push delivered');
    }
  }
  return { attempted: tokens.length, sent, failed, markedInactive };
}

// ── Real FCM path (FIREBASE_SERVICE_ACCOUNT set) ─────────────────────────────

async function sendPushFcm(
  userId: string,
  title: string,
  body: string,
  data: Record<string, string>,
  tokens: DeviceToken[],
): Promise<PushResult> {
  const messages = tokens.map((t) => ({
    token: t.token,
    notification: { title, body },
    data,
  }));
  const response = await admin.messaging().sendEach(messages);
  let sent = 0;
  let failed = 0;
  let markedInactive = 0;
  response.responses.forEach((r, i) => {
    if (r.success) {
      sent += 1;
    } else {
      failed += 1;
      // FCM marks a token unregistered/invalid → drop it so we stop retrying.
      const code = r.error?.code;
      logger.warn({ userId, token: tokens[i].token, code }, 'FCM send failed — marking inactive');
      void markInactive(tokens[i].id);
      markedInactive += 1;
    }
  });
  return { attempted: tokens.length, sent, failed, markedInactive };
}
