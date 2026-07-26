import type { RequestHandler } from 'express';

/**
 * POST /products/image-confirm — Cloudinary upload webhook.
 * B2-02: skeleton that acknowledges receipt. B2-06 wires signature verification
 * and Product.imageUrl update. Consumes the RAW body (registered before json()).
 */
export const productImageWebhook: RequestHandler = (_req, res) => {
  res.status(200).json({ received: true });
};
