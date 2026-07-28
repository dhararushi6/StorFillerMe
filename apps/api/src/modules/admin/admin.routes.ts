import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { writeAuditLog } from '../../middleware/audit-log.middleware';
import { adminOrdersQuerySchema, orderIdParamsSchema, assignAgentSchema } from './admin.schemas';
import { auditLogQuerySchema } from './audit-log.schemas';
import {
  listAdminOrdersHandler,
  confirmOrderHandler,
  assignAgentHandler,
  listAuditLogsHandler,
  cleanupDeliveryLogsHandler,
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
  writeAuditLog({ action: 'ORDER_CONFIRM', entityType: 'Order', paramKey: 'id' }),
  confirmOrderHandler,
);

// PATCH /admin/orders/:id/assign-agent — assign agent to order
adminOrderRouter.patch(
  '/orders/:id/assign-agent',
  validate({ params: orderIdParamsSchema, body: assignAgentSchema }),
  writeAuditLog({ action: 'ORDER_ASSIGN', entityType: 'Order', paramKey: 'id' }),
  assignAgentHandler,
);

// GET /admin/audit-logs
adminOrderRouter.get('/audit-logs', validate({ query: auditLogQuerySchema }), listAuditLogsHandler);

// POST /admin/delivery-logs/cleanup — manual trigger for the 30-day prune (B2-08)
adminOrderRouter.post(
  '/delivery-logs/cleanup',
  writeAuditLog({ action: 'DELIVERY_LOG_CLEANUP', entityType: 'System' }),
  cleanupDeliveryLogsHandler,
);

// GET /admin/dashboard — summary counts
adminOrderRouter.get('/dashboard', getDashboardHandler);
