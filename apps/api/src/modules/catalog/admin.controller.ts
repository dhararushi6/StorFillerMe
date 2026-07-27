import type { RequestHandler } from 'express';
import { createProduct, updateProduct } from './catalog.service';

// B1-08 — admin product CRUD handlers.

export const createProductHandler: RequestHandler = async (req, res) => {
  const product = await createProduct(req.body);
  res.status(201).json({ product });
};

export const updateProductHandler: RequestHandler = async (req, res) => {
  const product = await updateProduct(req.params.id as string, req.body);
  res.json({ product });
};
