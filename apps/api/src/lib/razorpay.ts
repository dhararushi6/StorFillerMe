import crypto from 'node:crypto';
import Razorpay from 'razorpay';
import { env } from './env';
import { logger } from './logger';

export const razorpayStubbed = !(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);

/** Razorpay SDK client. Null in stub mode (no keys) so nothing throws at import. */
export const razorpay = razorpayStubbed
  ? null
  : new Razorpay({
      key_id: env.RAZORPAY_KEY_ID as string,
      key_secret: env.RAZORPAY_KEY_SECRET as string,
    });

if (razorpayStubbed) {
  logger.warn('Razorpay creds not set — payments running in STUB mode (dev only).');
}

export const razorpayKeyId = env.RAZORPAY_KEY_ID ?? 'rzp_test_stub';

/**
 * Verifies a webhook HMAC against the RAW request body (arch §4.3). Timing-safe.
 * Returns false when the webhook secret is unset (can't verify → reject).
 */
export function verifyWebhookSignature(rawBody: Buffer, signature: string | undefined): boolean {
  const secret = env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
