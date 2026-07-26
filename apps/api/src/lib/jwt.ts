import crypto from 'node:crypto';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { Role } from '@storefiller/types';
import { env, pem } from './env';
import { unauthorized } from './http-error';

const privateKey = pem(env.JWT_PRIVATE_KEY);
const publicKey = pem(env.JWT_PUBLIC_KEY);

export interface AccessClaims {
  sub: string;
  role: Role;
}

/** Signs a short-lived RS256 access token. */
export function signAccessToken(userId: string, role: Role): string {
  if (!privateKey) throw new Error('JWT_PRIVATE_KEY is not configured');
  return jwt.sign({ role }, privateKey, {
    algorithm: 'RS256',
    subject: userId,
    issuer: env.JWT_ISSUER,
    expiresIn: env.JWT_ACCESS_TTL as SignOptions['expiresIn'],
  });
}

/** Verifies an RS256 access token; throws 401 on any failure. */
export function verifyAccessToken(token: string): AccessClaims {
  if (!publicKey) throw new Error('JWT_PUBLIC_KEY is not configured');
  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: env.JWT_ISSUER,
    }) as jwt.JwtPayload & { role: Role };
    if (!decoded.sub || !decoded.role) throw new Error('malformed');
    return { sub: decoded.sub, role: decoded.role };
  } catch {
    throw unauthorized('Invalid or expired access token');
  }
}

/** Opaque refresh token: random secret + its sha256 hash (only the hash is stored). */
export function generateRefreshToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(32).toString('base64url');
  return { token, hash: hashRefreshToken(token) };
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
