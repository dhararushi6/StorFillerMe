import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { getCategoryTreeHandler } from './catalog.controller';

// B1-09 — buyer catalog routes, mounted at /api/v1. arch §3: GET /categories is
// Buyer auth (primary consumer is the mobile HomeScreen/CategoryScreen).
// Product list/detail search endpoints (GET /products, GET /products/:id) land
// here too in B2-06.
export const catalogRouter: Router = Router();

catalogRouter.use(requireAuth, requireRole('BUYER'));

catalogRouter.get('/categories', getCategoryTreeHandler);
