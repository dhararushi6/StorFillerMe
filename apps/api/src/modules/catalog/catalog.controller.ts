import type { RequestHandler } from 'express';
import { getCategoryTree, searchProducts, getProductById } from './catalog.service';
import type { ProductQuery, ProductDetailParams } from './catalog.schemas';

// B1-09 — buyer-facing catalog read handlers.

/** GET /categories — returns the full category tree, subcategories nested (arch §3). */
export const getCategoryTreeHandler: RequestHandler = async (_req, res) => {
  const categories = await getCategoryTree();
  res.json({ categories });
};

// B2-06 — GET /products (query validated into ProductQuery by validate({query})).
export const searchProductsHandler: RequestHandler = async (req, res) => {
  const page = await searchProducts(req.query as unknown as ProductQuery);
  res.json(page);
};

// B2-06 — GET /products/:id (params validated into { id } by validate({params})).
export const getProductByIdHandler: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as ProductDetailParams;
  const result = await getProductById(id);
  res.json(result);
};
