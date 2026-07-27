import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { createTicketSchema } from './support.schemas';
import { createTicketHandler, listTicketsHandler } from './support.controller';

// B2-05 — mounted at /api/v1/support. Buyer-only at the router level.
export const supportRouter: Router = Router();

supportRouter.use(requireAuth, requireRole('BUYER'));

supportRouter.post('/tickets', validate({ body: createTicketSchema }), createTicketHandler);
supportRouter.get('/tickets', listTicketsHandler);
