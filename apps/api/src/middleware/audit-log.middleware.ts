import type { RequestHandler } from 'express';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

// B1-12 — Audit log middleware. Writes an AuditLog row after every SUCCESSFUL
// admin mutation (product edit, inventory update, order confirm, order assign).
//
// The write fires on `res.on('finish')` and only when statusCode < 400, so a
// failed mutation (e.g. inventory version conflict) does NOT get an audit row
// claiming the action happened. Audit is fire-and-forget: a DB failure is
// logged and swallowed — auditing must never block the actual request.

export type AuditMeta = {
  action: string;
  entityType: string;
  paramKey?: string; // req.params key to extract entity id from
  bodyKey?: string; // req.body key to extract entity id from
};

/** Create a middleware that writes an AuditLog row for every successful request. */
export function writeAuditLog(meta: AuditMeta): RequestHandler {
  return (req, res, next) => {
    const adminId = req.user!.id;
    // Stash on res so the finish handler can read the captured admin id.
    res.on('finish', () => {
      if (res.statusCode >= 400) return; // failed — don't audit as if it succeeded
      const entityId =
        (meta.paramKey ? (req.params as Record<string, string>)[meta.paramKey] : undefined) ??
        (meta.bodyKey ? (req.body as Record<string, unknown>)[meta.bodyKey] : undefined) ??
        'unknown';

      prisma.auditLog
        .create({
          data: {
            adminId,
            action: meta.action,
            entityType: meta.entityType,
            entityId: String(entityId),
          },
        })
        .catch((err: unknown) => {
          logger.error({ err, action: meta.action, entityId }, 'audit log write failed');
        });
    });

    next();
  };
}
