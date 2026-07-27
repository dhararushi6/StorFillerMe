import crypto from 'node:crypto';
import { env } from './env';

/**
 * Cloudinary upload-notification webhook signature. arch §2 (Cloud -- "upload
 * webhook" --> API): mobile uploads straight to Cloudinary; Cloudinary notifies
 * this API, which stamps Product.imageUrl. The handbook does not pin a signature
 * scheme, so this mirrors the Razorpay convention (HMAC-SHA256 over the RAW body)
 * using a dedicated CLOUDINARY_WEBHOOK_SECRET. Stub mode (no secret) accepts the
 * notification with a logged warning so dev flows that never configure a webhook
 * still work — but a configured secret is ALWAYS enforced (security boundary).
 */
export function verifyCloudinaryWebhookSignature(
  rawBody: Buffer,
  signature: string | undefined,
): boolean {
  const secret = env.CLOUDINARY_WEBHOOK_SECRET;
  // No secret configured → can't verify. Stub mode: caller logs + accepts.
  if (!secret) return false;
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** True when Cloudinary webhook verification is in STUB mode (no secret set). */
export const cloudinaryWebhookStubbed = !env.CLOUDINARY_WEBHOOK_SECRET;
