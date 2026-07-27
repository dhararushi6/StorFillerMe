import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import {
  createProductSchema,
  updateProductSchema,
  productIdParamsSchema,
  createCategorySchema,
  updateInventorySchema,
} from './catalog.schemas';
import {
  createProductHandler,
  updateProductHandler,
  createCategoryHandler,
  updateInventoryHandler,
  listMissingImageHandler,
} from './admin.controller';

// B1-08/B1-09 — admin catalog routes, mounted at /api/v1/admin.
export const adminCatalogRouter: Router = Router();

adminCatalogRouter.use(requireAuth, requireRole('ADMIN'));

adminCatalogRouter.post('/products', validate({ body: createProductSchema }), createProductHandler);
// B3-04/M1-05 — must precede /products/:id so the static segment isn't captured
// as a product UUID.
adminCatalogRouter.get('/products/missing-image', listMissingImageHandler);
adminCatalogRouter.patch(
  '/products/:id',
  validate({ params: productIdParamsSchema, body: updateProductSchema }),
  updateProductHandler,
);
adminCatalogRouter.post(
  '/categories',
  validate({ body: createCategorySchema }),
  createCategoryHandler,
);
// B1-10 — admin inventory update. { quantityAvailable, version } → { inventory };
// 409 on stale version (guarded in service via updateMany WHERE id+version).
adminCatalogRouter.patch(
  '/products/:id/inventory',
  validate({ params: productIdParamsSchema, body: updateInventorySchema }),
  updateInventoryHandler,
);
