import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';
import { logger } from './logger';

export const cloudinaryStubbed = !(
  env.CLOUDINARY_API_SECRET &&
  env.CLOUDINARY_API_KEY &&
  env.CLOUDINARY_CLOUD_NAME
);

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME || 'stub-cloud',
  api_key: env.CLOUDINARY_API_KEY || 'stub-key',
  api_secret: env.CLOUDINARY_API_SECRET || 'stub-secret',
  secure: true,
});

if (cloudinaryStubbed) {
  logger.warn('Cloudinary creds not set — upload-signature endpoint in STUB mode (dev only).');
}

export interface UploadSignature {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

/**
 * Produces signed params for a direct mobile->Cloudinary upload. Image bytes never
 * touch the API — the client uploads straight to Cloudinary using these params.
 */
export function signUpload(folder: string): UploadSignature {
  const timestamp = Math.round(Date.now() / 1000);
  const cfg = cloudinary.config();
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    cfg.api_secret as string,
  );
  return {
    timestamp,
    signature,
    apiKey: cfg.api_key as string,
    cloudName: cfg.cloud_name as string,
    folder,
  };
}

/** Standard delivery transform (f_auto,q_auto keeps bandwidth inside the 25GB free tier). */
export function thumbnailUrl(publicId: string, width = 400, height = 300): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    fetch_format: 'auto',
    quality: 'auto',
    secure: true,
  });
}

// Unsigned upload presets (B2-02) — created in the Cloudinary dashboard / via
// scripts/cloudinary-presets.ts, each locked to its own folder.
export const PRODUCT_UPLOAD_PRESET = 'storefiller_products';
export const DELIVERY_UPLOAD_PRESET = 'storefiller_delivery';
export const PRODUCT_UPLOAD_FOLDER = env.CLOUDINARY_PRODUCT_FOLDER;
export const DELIVERY_UPLOAD_FOLDER = env.CLOUDINARY_DELIVERY_FOLDER;

/** Product thumbnail: w_400,h_300,c_fill,f_webp (B2-02 transform pattern). */
export function productThumbnailUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    width: 400,
    height: 300,
    crop: 'fill',
    format: 'webp',
    quality: 'auto',
    secure: true,
  });
}

export { cloudinary };
