import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { createProductSchema, updateProductSchema, productIdParamsSchema } from './catalog.schemas';
import { createProductHandler, updateProductHandler } from './admin.controller';

// B1-08 — admin catalog routes, mounted at /api/v1/admin.
export const adminCatalogRouter: Router = Router();

adminCatalogRouter.use(requireAuth, requireRole('ADMIN'));

adminCatalogRouter.post('/products', validate({ body: createProductSchema }), createProductHandler);
adminCatalogRouter.patch(
  '/products/:id',
  validate({ params: productIdParamsSchema, body: updateProductSchema }),
  updateProductHandler,
);
