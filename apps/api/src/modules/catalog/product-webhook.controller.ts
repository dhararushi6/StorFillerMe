import type { RequestHandler } from 'express';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import {
  verifyCloudinaryWebhookSignature,
  cloudinaryWebhookStubbed,
} from '../../lib/cloudinary-webhook';
import { productThumbnailUrl } from '../../lib/cloudinary';

/**
 * POST /products/image-confirm — Cloudinary upload-notification webhook (B3-04/05).
 * Mobile uploads product images directly to Cloudinary (signed unsigned-preset,
 * arch §2 — biggest bandwidth saver on Railway free tier). Cloudinary then
 * notifies this endpoint, which stamps Product.imageUrl.
 *
 * Consumes the RAW body (registered before express.json in app.ts) so the HMAC
 * can be computed over the exact bytes Cloudinary sent. Body shape (Cloudinary
 * upload notification): { public_id, secure_url, ... }. We use public_id to find
 * the product (mobile uploads with public_id = <product uuid>, optionally
 * folder-prefixed) and store the w_400 webp thumbnail URL (B2-02 transform).
 */
export const productImageWebhook: RequestHandler = async (req, res) => {
  const signature = req.headers['x-cld-signature'] as string | undefined;
  const rawBody = req.body as Buffer;

  // Security boundary: enforce the HMAC when a secret is configured. In stub
  // mode (no secret) we accept with a warning so dev/test flows that never set
  // up a Cloudinary webhook still work — but a configured secret is non-negotiable.
  if (!cloudinaryWebhookStubbed) {
    if (!verifyCloudinaryWebhookSignature(rawBody, signature)) {
      res.status(401).json({ error: { message: 'Invalid Cloudinary webhook signature' } });
      return;
    }
  } else {
    logger.warn('Cloudinary webhook in STUB mode — signature not verified (dev only)');
  }

  const payload = parseBody(rawBody);
  if (!payload) {
    res.status(400).json({ error: { message: 'Malformed webhook body' } });
    return;
  }

  const productId = extractProductId(payload.public_id);
  if (!productId) {
    res.status(400).json({ error: { message: 'public_id does not resolve to a product UUID' } });
    return;
  }

  // Store the transformed thumbnail (w_400 webp) rather than the raw upload —
  // what buyers see on HomeScreen. Falls back to secure_url if the SDK cannot
  // build the transform (stub mode without a real public_id format).
  const imageUrl = payload.secure_url ? productThumbnailUrl(payload.public_id) : null;
  if (!imageUrl) {
    res.status(400).json({ error: { message: 'Webhook missing secure_url' } });
    return;
  }

  // updateMany → idempotent: if the product was deactivated/deleted between
  // upload and notification we silently no-op (count 0) rather than 404, since
  // Cloudinary retries on non-2xx and a gone-product should not block the queue.
  const result = await prisma.product.updateMany({
    where: { id: productId },
    data: { imageUrl },
  });

  logger.info({ productId, updated: result.count }, 'product-image-webhook: imageUrl stamped');
  res.status(200).json({ received: true, updated: result.count });
};

interface CloudinaryNotification {
  public_id: string;
  secure_url?: string;
}

/** Parses the raw JSON body; returns null on any decode error. */
function parseBody(rawBody: Buffer): CloudinaryNotification | null {
  try {
    const parsed = JSON.parse(rawBody.toString('utf8')) as CloudinaryNotification;
    if (!parsed || typeof parsed.public_id !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Cloudinary public_id may be folder-prefixed (e.g. "products/<uuid>"). The
 * mobile upload uses public_id = <product uuid>; tolerate an optional prefix
 * and extract the trailing UUID. Returns null when no UUID is present.
 */
function extractProductId(publicId: string): string | null {
  const last = publicId.split('/').pop() ?? publicId;
  return UUID_RE.test(last) ? last.toLowerCase() : null;
}
