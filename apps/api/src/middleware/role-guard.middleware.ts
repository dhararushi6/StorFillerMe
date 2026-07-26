import type { RequestHandler } from 'express';
import type { Role } from '@storefiller/types';
import { forbidden, unauthorized } from '../lib/http-error';

/** Restricts a route to one or more roles. Use after requireAuth. */
export function requireRole(...roles: Role[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(forbidden(`Requires role: ${roles.join(' or ')}`));
    }
    next();
  };
}
