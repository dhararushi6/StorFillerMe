import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.middleware';
import { env } from '../../lib/env';

// GET /api/v1/app-config — the mobile control plane. Called on every cold start,
// before auth, so a client can be told to update, or a feature switched off,
// without waiting for a store review.
//
// No auth: the update gate has to work for a user who cannot log in because the
// build is broken. Rate-limited by the global limiter in app.ts.

export const appConfigRouter: Router = Router();

const appConfigQuerySchema = z.object({
  platform: z.enum(['ios', 'android']),
  // Client's own build version. Optional — omit it to just read the config.
  version: z
    .string()
    .regex(/^\d{1,5}(\.\d{1,5}){0,2}$/, 'version must look like 1 or 1.2 or 1.2.3')
    .optional(),
});
type AppConfigQuery = z.infer<typeof appConfigQuerySchema>;

/** Compares dotted numeric versions. Returns <0, 0, >0. Missing parts are 0, so
 *  "1.2" === "1.2.0". Numeric compare, not string: "1.10.0" > "1.9.0". */
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff < 0 ? -1 : 1;
  }
  return 0;
}

appConfigRouter.get('/app-config', validate({ query: appConfigQuerySchema }), (req, res) => {
  const { platform, version } = req.query as unknown as AppConfigQuery;
  const isIos = platform === 'ios';

  const minSupportedVersion = isIos ? env.MIN_APP_VERSION_IOS : env.MIN_APP_VERSION_ANDROID;
  const latestVersion = isIos ? env.LATEST_APP_VERSION_IOS : env.LATEST_APP_VERSION_ANDROID;

  res.json({
    platform,
    minSupportedVersion,
    latestVersion,
    storeUrl: isIos ? env.IOS_STORE_URL : env.ANDROID_STORE_URL,
    // Blocking prompt: this build is below the floor and must not be used.
    updateRequired: version ? compareVersions(version, minSupportedVersion) < 0 : false,
    // Dismissible nudge.
    updateAvailable: version ? compareVersions(version, latestVersion) < 0 : false,
    maintenanceMode: env.MAINTENANCE_MODE,
    disabledFeatures: env.DISABLED_FEATURES.split(',')
      .map((f) => f.trim())
      .filter(Boolean),
  });
});
