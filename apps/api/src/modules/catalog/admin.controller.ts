import type { RequestHandler } from 'express';
import { createProduct, updateProduct, updateInventory, createCategory } from './catalog.service';

// B1-08 — admin product CRUD handlers.

export const createProductHandler: RequestHandler = async (req, res) => {
  const product = await createProduct(req.body);
  res.status(201).json({ product });
};

export const updateProductHandler: RequestHandler = async (req, res) => {
  const product = await updateProduct(req.params.id as string, req.body);
  res.json({ product });
};

// B1-09 — admin category create handler.
export const createCategoryHandler: RequestHandler = async (req, res) => {
  const category = await createCategory(req.body);
  res.status(201).json({ category });
};

// B1-10 — admin inventory update handler. arch §3 → { inventory }.
export const updateInventoryHandler: RequestHandler = async (req, res) => {
  const inventory = await updateInventory(req.params.id as string, req.body);
  res.json({ inventory });
};
