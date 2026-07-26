import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../lib/http-error';
import { logger } from '../lib/logger';

/** 404 for unmatched routes. */
export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: { message: `Route not found: ${req.method} ${req.path}` } });
};

/** Central error handler. Must be registered last. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: { message: 'Validation failed', details: err.flatten() } });
    return;
  }
  if (err instanceof HttpError) {
    if (err.status >= 500) logger.error({ err }, err.message);
    res.status(err.status).json({ error: { message: err.message, details: err.details } });
    return;
  }
  // Prisma unique-constraint violation surfaced as a generic 409 when not caught locally.
  if (typeof err === 'object' && err && (err as { code?: string }).code === 'P2002') {
    res.status(409).json({ error: { message: 'Resource already exists' } });
    return;
  }
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ error: { message: 'Internal server error' } });
};
