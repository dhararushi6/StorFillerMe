import type { RequestHandler } from 'express';
import { CartService } from './cart.service';
import type { AddToCartInput, UpdateCartInput, CartItemParams } from './cart.schemas';

// B2-06 — cart handlers. Buyer identity comes from req.user (requireAuth).
// Body/params are already validated into shape by the validate middleware.

export const getCartHandler: RequestHandler = async (req, res) => {
  const cart = await CartService.getCart(req.user!.id);
  res.json(cart);
};

// 200 (not 201): add-item is an idempotent upsert, not a guaranteed create.
export const addCartItemHandler: RequestHandler = async (req, res) => {
  const result = await CartService.addItem(req.user!.id, req.body as AddToCartInput);
  res.json(result);
};

export const updateCartItemHandler: RequestHandler = async (req, res) => {
  const { productId } = req.params as unknown as CartItemParams;
  const result = await CartService.updateItem(req.user!.id, productId, req.body as UpdateCartInput);
  res.json(result);
};

export const removeCartItemHandler: RequestHandler = async (req, res) => {
  const { productId } = req.params as unknown as CartItemParams;
  const result = await CartService.removeItem(req.user!.id, productId);
  res.json(result);
};

export const clearCartHandler: RequestHandler = async (req, res) => {
  const result = await CartService.clearCart(req.user!.id);
  res.json(result);
};
