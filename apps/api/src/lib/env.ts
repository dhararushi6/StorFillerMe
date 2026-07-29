import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

loadDotenv();

/**
 * Central env validation. External-service secrets are OPTIONAL: when absent the
 * corresponding lib/* client runs in clearly-marked STUB mode instead of crashing,
 * so the whole API boots and every non-secret-dependent path stays testable.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  APP_VERSION: z.string().default('1.0.0'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // Database — defaults to the local docker PostGIS container for dev.
  DATABASE_URL: z
    .string()
    .default('postgresql://storefiller:storefiller@localhost:5433/storefiller?schema=public'),

  // JWT (RS256). PEM contents passed via env; private key NEVER committed.
  JWT_PRIVATE_KEY: z.string().optional(),
  JWT_PUBLIC_KEY: z.string().optional(),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('30d'),
  JWT_ISSUER: z.string().default('storefiller'),

  // Firebase Admin — service account JSON (stringified) or path.
  FIREBASE_SERVICE_ACCOUNT: z.string().optional(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_SHOP_FOLDER: z.string().default('shop_photos'),
  CLOUDINARY_PRODUCT_FOLDER: z.string().default('products'),
  CLOUDINARY_DELIVERY_FOLDER: z.string().default('delivery_photos'),
  // Cloudinary upload-notification webhook HMAC secret (B3-04/05). Absent → stub
  // mode (webhook accepted with a warning). Set in prod to enforce the signature.
  CLOUDINARY_WEBHOOK_SECRET: z.string().optional(),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  // Resend (email OTP fallback)
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().default('Storefiller <onboarding@storefiller.in>'),

  // Referral reward amount (INR) credited on referred buyer's first order.
  REFERRAL_REWARD_AMOUNT: z.coerce.number().default(100),

  // Timezone for cron jobs.
  CRON_TZ: z.string().default('Asia/Kolkata'),

  // ── Mobile app control plane (GET /app-config) ────────────────────────────
  // Without these the only way to stop a broken release is a store submission
  // plus user upgrade lag — days to weeks. The version gate and the flag list
  // are server-side so a bad build can be blocked or a feature disabled now.
  MIN_APP_VERSION_IOS: z.string().default('1.0.0'),
  MIN_APP_VERSION_ANDROID: z.string().default('1.0.0'),
  LATEST_APP_VERSION_IOS: z.string().default('1.0.0'),
  LATEST_APP_VERSION_ANDROID: z.string().default('1.0.0'),
  IOS_STORE_URL: z.string().default('https://apps.apple.com/app/storefiller/id000000000'),
  ANDROID_STORE_URL: z
    .string()
    .default('https://play.google.com/store/apps/details?id=in.storefiller.app'),
  // 'true' puts every client into a read-only maintenance screen.
  MAINTENANCE_MODE: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
  // Comma-separated kill switches, e.g. "wallet_topup,referral".
  DISABLED_FEATURES: z.string().default(''),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

/** Newlines in PEM env vars are often escaped as \\n — normalise them. */
export function pem(value: string | undefined): string | undefined {
  return value?.replace(/\\n/g, '\n');
}

export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
