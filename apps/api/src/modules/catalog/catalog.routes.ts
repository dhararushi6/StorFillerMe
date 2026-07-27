import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { productQuerySchema, productIdParamsSchema } from './catalog.schemas';
import {
  getCategoryTreeHandler,
  searchProductsHandler,
  getProductByIdHandler,
} from './catalog.controller';

// B1-09/B2-06 — buyer catalog routes, mounted at /api/v1. arch §3: GET /categories
// and the product search/detail endpoints are Buyer auth (mobile HomeScreen etc.).
export const catalogRouter: Router = Router();

catalogRouter.use(requireAuth, requireRole('BUYER'));

catalogRouter.get('/categories', getCategoryTreeHandler);
catalogRouter.get('/products', validate({ query: productQuerySchema }), searchProductsHandler);
catalogRouter.get(
  '/products/:id',
  validate({ params: productIdParamsSchema }),
  getProductByIdHandler,
);
