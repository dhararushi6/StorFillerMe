import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role-guard.middleware';
import { addToCartSchema, updateCartSchema, cartItemParamsSchema } from './cart.schemas';
import {
  getCartHandler,
  addCartItemHandler,
  updateCartItemHandler,
  removeCartItemHandler,
  clearCartHandler,
} from './cart.controller';

// B2-06 — server-side cart routes, mounted at /api/v1/cart. Buyer auth at the
// router level: every cart belongs to the requesting buyer (req.user.id).
export const cartRouter: Router = Router();

cartRouter.use(requireAuth, requireRole('BUYER'));

cartRouter.get('/', getCartHandler);
cartRouter.post('/items', validate({ body: addToCartSchema }), addCartItemHandler);
cartRouter.patch(
  '/items/:productId',
  validate({ params: cartItemParamsSchema, body: updateCartSchema }),
  updateCartItemHandler,
);
cartRouter.delete(
  '/items/:productId',
  validate({ params: cartItemParamsSchema }),
  removeCartItemHandler,
);
cartRouter.delete('/', clearCartHandler);
