import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { sendEmail } from '../../lib/mailer';
import { logger } from '../../lib/logger';
import { unauthorized } from '../../lib/http-error';
import { issueSession, findUserByEmail, type SessionResult } from './auth.service';

const OTP_TTL_MS = 10 * 60_000;
const MAX_ATTEMPTS = 5;
const BCRYPT_ROUNDS = 10;

/** Generates + stores (hashed) an email OTP and sends it. Always safe to call —
 * returns void so the controller can respond 200 without leaking account existence. */
export async function sendEmailOtp(email: string): Promise<void> {
  const otp = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
  const otpHash = await bcrypt.hash(otp, BCRYPT_ROUNDS);
  await prisma.emailOtp.create({
    data: { email, otpHash, expiresAt: new Date(Date.now() + OTP_TTL_MS) },
  });
  await sendEmail(
    email,
    'Your Storefiller login code',
    `Your Storefiller verification code is ${otp}. It expires in 10 minutes.`,
  );
  logger.info({ email }, 'Email OTP issued');
}

/** Validates an OTP and issues the SAME session shape as the Firebase path. */
export async function verifyEmailOtp(email: string, otp: string): Promise<SessionResult> {
  const record = await prisma.emailOtp.findFirst({
    where: { email, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });
  if (!record) throw unauthorized('Invalid or expired code');

  if (record.attempts >= MAX_ATTEMPTS) {
    await prisma.emailOtp.update({ where: { id: record.id }, data: { consumedAt: new Date() } });
    throw unauthorized('Too many attempts — request a new code');
  }
  await prisma.emailOtp.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });

  const match = await bcrypt.compare(otp, record.otpHash);
  if (!match) throw unauthorized('Invalid or expired code');

  await prisma.emailOtp.update({ where: { id: record.id }, data: { consumedAt: new Date() } });

  // Fallback login resolves an EXISTING user by email (User.phone is required, so a
  // brand-new email-only signup isn't possible here — the account is created during
  // phone onboarding). See report note.
  const user = await findUserByEmail(email);
  return issueSession(user);
}

/** node-cron hourly cleanup (B1-06). */
export async function cleanupExpiredOtps(): Promise<number> {
  const { count } = await prisma.emailOtp.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return count;
}
