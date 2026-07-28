import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import {
  createOrderSchema,
  listOrdersSchema,
  orderIdParamsSchema,
  cancelOrderSchema,
} from './order.schemas';
import {
  createOrderHandler,
  listOrdersHandler,
  getOrderHandler,
  cancelOrderHandler,
} from './order.controller';

// B3-06/07 — order routes, mounted at /api/v1/orders. Buyer auth at router level.
export const orderRouter: Router = Router();

orderRouter.use(requireAuth, requireRole('BUYER'));

orderRouter.post('/', validate({ body: createOrderSchema }), createOrderHandler);
orderRouter.get('/', validate({ query: listOrdersSchema }), listOrdersHandler);
orderRouter.patch(
  '/:id/cancel',
  validate({ params: orderIdParamsSchema, body: cancelOrderSchema }),
  cancelOrderHandler,
);
orderRouter.get('/:id', validate({ params: orderIdParamsSchema }), getOrderHandler);
