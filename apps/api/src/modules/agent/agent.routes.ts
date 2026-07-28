import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { orderIdParamsSchema, locationUpdateSchema } from './agent.schemas';
import {
  listAgentOrdersHandler,
  updateLocationHandler,
  deliverOrderHandler,
} from './agent.controller';

// B2-07 — Agent delivery routes, mounted at /api/v1/agent.
export const agentRouter: Router = Router();

agentRouter.use(requireAuth, requireRole('AGENT'));

agentRouter.get('/orders', listAgentOrdersHandler);
agentRouter.post(
  '/orders/:id/location',
  validate({ params: orderIdParamsSchema, body: locationUpdateSchema }),
  updateLocationHandler,
);
// B2-08 — geofenced delivery confirmation.
agentRouter.patch(
  '/orders/:id/deliver',
  validate({ params: orderIdParamsSchema, body: locationUpdateSchema }),
  deliverOrderHandler,
);
