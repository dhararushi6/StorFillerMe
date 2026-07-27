import type { RequestHandler } from 'express';
import { getCategoryTree } from './catalog.service';

// B1-09 — buyer-facing catalog read handlers.

/** GET /categories — returns the full category tree, subcategories nested (arch §3). */
export const getCategoryTreeHandler: RequestHandler = async (_req, res) => {
  const categories = await getCategoryTree();
  res.json({ categories });
};
