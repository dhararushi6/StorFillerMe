import { Resend } from 'resend';
import { env } from './env';
import { logger } from './logger';

export const mailerStubbed = !env.RESEND_API_KEY;

const resend = mailerStubbed ? null : new Resend(env.RESEND_API_KEY);

if (mailerStubbed) {
  logger.warn('RESEND_API_KEY not set — mailer in STUB mode; OTP emails are logged, not sent.');
}

/** Sends an email. In stub mode the body is logged (dev only) instead of sent. */
export async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  if (mailerStubbed || !resend) {
    logger.info({ to, subject }, `[STUB EMAIL] ${text}`);
    return;
  }
  await resend.emails.send({ from: env.RESEND_FROM, to, subject, text });
}
