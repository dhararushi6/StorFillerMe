import admin from 'firebase-admin';
import { env } from './env';
import { logger } from './logger';
import { unauthorized } from './http-error';

export interface FirebaseIdentity {
  uid: string;
  phone?: string;
  email?: string;
}

export const firebaseStubbed = !env.FIREBASE_SERVICE_ACCOUNT;

let app: admin.app.App | null = null;
if (!firebaseStubbed) {
  const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT as string);
  app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} else {
  logger.warn(
    'FIREBASE_SERVICE_ACCOUNT not set — firebase-admin running in STUB mode (dev/test only). ' +
      'Accepts tokens shaped "stub:<uid>:<phone>[:<email>]" and rejects everything else.',
  );
}

/**
 * Verifies a Firebase ID token and returns the identity. In stub mode (no service
 * account) it validates a fixed dev token shape so the auth flow stays testable
 * locally; any malformed token throws 401 — matching real verifyIdToken behaviour.
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<FirebaseIdentity> {
  if (firebaseStubbed) return verifyStubToken(idToken);
  try {
    const decoded = await admin.auth(app as admin.app.App).verifyIdToken(idToken);
    return { uid: decoded.uid, phone: decoded.phone_number, email: decoded.email };
  } catch {
    throw unauthorized('Invalid Firebase ID token');
  }
}

function verifyStubToken(idToken: string): FirebaseIdentity {
  const parts = idToken.split(':');
  if (parts[0] !== 'stub' || parts.length < 3 || !parts[1] || !parts[2]) {
    throw unauthorized('Invalid Firebase ID token');
  }
  return { uid: parts[1], phone: parts[2], email: parts[3] || undefined };
}
