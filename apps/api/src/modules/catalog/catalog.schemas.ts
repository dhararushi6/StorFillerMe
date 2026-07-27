import { z } from 'zod';
import { ProductUnitSchema } from '@storefiller/types';

// B1-08 — Admin Product CRUD with optimistic version lock.

/** Money fields stored as Decimal(10,2). JS number is safe within this range
 * (max 99999999.99 ≪ 2^53); Prisma converts to Decimal on write. */
const money = z.number().min(0).max(99_999_999.99);

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  brand: z.string().max(100).optional(),
  sku: z.string().min(1).max(50),
  categoryId: z.string().uuid(),
  unit: ProductUnitSchema,
  unitSize: z.string().min(1).max(50),
  caseQty: z.number().int().min(1).default(1),
  mrp: money,
  sellingPrice: money,
  imageUrl: z.string().url().optional(),
  description: z.string().max(2000).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  brand: z.string().max(100).nullable().optional(),
  sku: z.string().min(1).max(50).optional(),
  categoryId: z.string().uuid().optional(),
  unit: ProductUnitSchema.optional(),
  unitSize: z.string().min(1).max(50).optional(),
  caseQty: z.number().int().min(1).optional(),
  mrp: money.optional(),
  sellingPrice: money.optional(),
  imageUrl: z.string().url().nullable().optional(),
  description: z.string().max(2000).nullable().optional(),
  isActive: z.boolean().optional(),
  // Required: optimistic-concurrency guard (arch §3 PATCH /admin/products/:id).
  version: z.number().int().min(1),
});

export const productIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// B1-09 — Admin Category CRUD. arch §3 POST /admin/categories body: { name, slug,
// parentId?, iconUrl? }. displayOrder is an optional extra (DB has the column and
// the tree sorts by it) so admins can order siblings; defaults to 0.
export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  parentId: z.string().uuid().optional(),
  iconUrl: z.string().url().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
