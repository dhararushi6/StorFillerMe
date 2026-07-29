import crypto from 'node:crypto';
import type { Role } from '@storefiller/types';
import type { User } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { signAccessToken, generateRefreshToken, hashRefreshToken } from '../../lib/jwt';
import { verifyFirebaseIdToken } from '../../lib/firebase-admin';
import { env } from '../../lib/env';
import { parseDurationMs } from '../../utils/duration';
import { unauthorized, notFound } from '../../lib/http-error';

/** Reuse of an already-rotated refresh token within this window is tolerated
 * (network retry / double submit); outside it, the whole family is revoked. */
const REFRESH_GRACE_MS = 10_000;
const REFRESH_TTL_MS = parseDurationMs(env.JWT_REFRESH_TTL);

export interface SessionResult {
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
}

export interface PublicUser {
  id: string;
  phone: string;
  email: string | null;
  role: Role;
  isActive: boolean;
  pushEnabled: boolean;
  orderUpdatesOptIn: boolean;
  promoOptIn: boolean;
}

export function toPublicUser(u: User): PublicUser {
  return {
    id: u.id,
    phone: u.phone,
    email: u.email,
    role: u.role as Role,
    isActive: u.isActive,
    pushEnabled: u.pushEnabled,
    orderUpdatesOptIn: u.orderUpdatesOptIn,
    promoOptIn: u.promoOptIn,
  };
}

/** Issues a fresh access+refresh pair, persisting the refresh hash in a family. */
async function issuePair(user: User, familyId?: string): Promise<SessionResult> {
  const { token, hash } = generateRefreshToken();
  const family = familyId ?? crypto.randomUUID();
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      familyId: family,
      hashedToken: hash,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    },
  });
  return {
    accessToken: signAccessToken(user.id, user.role as Role),
    refreshToken: token,
    user: toPublicUser(user),
  };
}

/** Public entry: issue a session for an already-resolved user (shared by the
 * Firebase path and the email-OTP fallback so both return an identical shape). */
export async function issueSession(user: User): Promise<SessionResult> {
  return issuePair(user);
}

/** POST /auth/token/verify — verify Firebase ID token, upsert user, issue session. */
export async function loginWithFirebase(firebaseIdToken: string): Promise<SessionResult> {
  const identity = await verifyFirebaseIdToken(firebaseIdToken);
  if (!identity.phone) {
    // Phone auth always carries a phone number; anything else can't satisfy the
    // required User.phone column.
    throw unauthorized('Firebase token has no phone number');
  }

  const user = await prisma.user.upsert({
    where: { phone: identity.phone },
    update: { firebaseUid: identity.uid, email: identity.email ?? undefined },
    create: {
      phone: identity.phone,
      firebaseUid: identity.uid,
      email: identity.email ?? null,
      role: 'BUYER',
    },
  });
  if (!user.isActive) throw unauthorized('Account disabled');
  return issueSession(user);
}

/** POST /auth/refresh — rotate the refresh token; detect + punish family reuse. */
export async function refreshSession(refreshToken: string): Promise<SessionResult> {
  const hash = hashRefreshToken(refreshToken);
  const record = await prisma.refreshToken.findUnique({ where: { hashedToken: hash } });
  if (!record) throw unauthorized('Invalid refresh token');
  if (record.revokedAt) throw unauthorized('Refresh token family revoked');
  if (record.expiresAt.getTime() < Date.now()) throw unauthorized('Refresh token expired');

  if (record.usedAt) {
    // Token already rotated once — either a benign retry or a stolen-token replay.
    const sinceUsed = Date.now() - record.usedAt.getTime();
    if (sinceUsed > REFRESH_GRACE_MS) {
      // Reuse outside grace window → revoke the entire family.
      await prisma.refreshToken.updateMany({
        where: { familyId: record.familyId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw unauthorized('Refresh token reuse detected — session revoked');
    }
  }

  const user = await prisma.user.findUnique({ where: { id: record.userId } });
  if (!user || !user.isActive) throw unauthorized('Account not found or disabled');

  // Mark this token used and issue a new one in the same family.
  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { usedAt: record.usedAt ?? new Date() },
  });
  return issuePair(user, record.familyId);
}

/** POST /auth/logout — revoke every active refresh token for the user, and stop
 *  push to their devices. Logout already ends every session (all families are
 *  revoked), so the device tokens go with them: otherwise order notifications
 *  keep arriving on a signed-out phone, which on a shared device leaks another
 *  user's order activity onto the lock screen. Re-registered on next login by
 *  POST /users/me/device-token (upsert flips isActive back on). */
export async function logout(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  await prisma.deviceToken.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });
}

/** Used by the email-OTP fallback (B1-06): resolve an existing user by email. */
export async function findUserByEmail(email: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw notFound('No account found for this email');
  return user;
}
