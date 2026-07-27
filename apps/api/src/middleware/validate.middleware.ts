import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

/** Validates and replaces req.body/query/params with the parsed (typed) result. */
export function validate(schemas: {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}): RequestHandler {
  return (req, _res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      // Express 5: req.query is a prototype getter that re-parses the URL on every
      // access, so Object.assign(req.query, parsed) is silently discarded on the next
      // read (handler would see raw URL strings, not Zod-coerced numbers). Replace it
      // with an own data property holding the coerced result. req.params is a plain
      // writable object, so Object.assign persists there.
      if (schemas.query) {
        Object.defineProperty(req, 'query', {
          value: schemas.query.parse(req.query),
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }
      if (schemas.params) Object.assign(req.params, schemas.params.parse(req.params));
      next();
    } catch (err) {
      next(err);
    }
  };
}
