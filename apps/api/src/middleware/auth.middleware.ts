import type { RequestHandler } from 'express';
import { verifyAccessToken } from '../lib/jwt';
import { unauthorized } from '../lib/http-error';

/** Requires a valid Bearer access token; attaches { id, role } to req.user. */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(unauthorized('Missing bearer token'));
  }
  try {
    const claims = verifyAccessToken(header.slice(7));
    req.user = { id: claims.sub, role: claims.role };
    next();
  } catch (err) {
    next(err);
  }
};
