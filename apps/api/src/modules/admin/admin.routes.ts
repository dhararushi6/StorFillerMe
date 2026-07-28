import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { adminOrdersQuerySchema, orderIdParamsSchema, assignAgentSchema } from './admin.schemas';
import {
  listAdminOrdersHandler,
  confirmOrderHandler,
  assignAgentHandler,
  getDashboardHandler,
} from './admin.controller';

// B1-11 — Admin order routes, mounted at /api/v1/admin.
// Separate router from adminCatalogRouter so order logic lives in its own module.
export const adminOrderRouter: Router = Router();

adminOrderRouter.use(requireAuth, requireRole('ADMIN'));

// GET /admin/orders?status=PENDING_PAYMENT&page=1
adminOrderRouter.get(
  '/orders',
  validate({ query: adminOrdersQuerySchema }),
  listAdminOrdersHandler,
);

// PATCH /admin/orders/:id/confirm — manual COD confirmation
adminOrderRouter.patch(
  '/orders/:id/confirm',
  validate({ params: orderIdParamsSchema }),
  confirmOrderHandler,
);

// PATCH /admin/orders/:id/assign-agent — assign agent to order
adminOrderRouter.patch(
  '/orders/:id/assign-agent',
  validate({ params: orderIdParamsSchema, body: assignAgentSchema }),
  assignAgentHandler,
);

// GET /admin/dashboard — summary counts
adminOrderRouter.get('/dashboard', getDashboardHandler);
