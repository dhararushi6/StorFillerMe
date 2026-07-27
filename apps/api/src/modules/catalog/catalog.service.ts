import { Prisma, type Category } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { badRequest, conflict, notFound } from '../../lib/http-error';
import type {
  CreateProductInput,
  UpdateProductInput,
  CreateCategoryInput,
  UpdateInventoryInput,
  ProductQuery,
} from './catalog.schemas';

/** Shape returned to the admin client — always includes inventory row. */
async function loadProduct(id: string) {
  return prisma.product.findUniqueOrThrow({
    where: { id },
    include: { inventory: true, category: true },
  });
}

// B1-08 — create product + seed ProductInventory(@0) in one tx.
export async function createProduct(input: CreateProductInput) {
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) throw badRequest(`Category ${input.categoryId} does not exist`);

  try {
    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: input.name,
          brand: input.brand,
          sku: input.sku,
          categoryId: input.categoryId,
          unit: input.unit,
          unitSize: input.unitSize,
          caseQty: input.caseQty,
          mrp: input.mrp,
          sellingPrice: input.sellingPrice,
          imageUrl: input.imageUrl,
          description: input.description,
          inventory: { create: { quantityAvailable: 0 } },
        },
        include: { inventory: true },
      });
      return product;
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw conflict('SKU already exists');
    }
    throw err;
  }
}

// B1-08 — optimistic version lock: updateMany WHERE id+version, increment.
// 0 rows → either missing (404) or stale version (409). Disambiguate via findUnique.
export async function updateProduct(id: string, input: UpdateProductInput) {
  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) throw badRequest(`Category ${input.categoryId} does not exist`);
  }

  try {
    const result = await prisma.product.updateMany({
      where: { id, version: input.version },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.brand !== undefined && { brand: input.brand }),
        ...(input.sku !== undefined && { sku: input.sku }),
        ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
        ...(input.unit !== undefined && { unit: input.unit }),
        ...(input.unitSize !== undefined && { unitSize: input.unitSize }),
        ...(input.caseQty !== undefined && { caseQty: input.caseQty }),
        ...(input.mrp !== undefined && { mrp: input.mrp }),
        ...(input.sellingPrice !== undefined && { sellingPrice: input.sellingPrice }),
        ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
        version: { increment: 1 },
      },
    });

    if (result.count === 0) {
      // Distinguish 404 (no row at all) from 409 (row exists, version mismatch).
      const existing = await prisma.product.findUnique({
        where: { id },
        select: { version: true },
      });
      if (!existing) throw notFound(`Product ${id} not found`);
      throw conflict('Stale version — reload the product and retry');
    }

    return loadProduct(id);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw conflict('SKU already exists');
    }
    throw err;
  }
}

// B1-10 — admin inventory update. Optimistic version lock on Product.version
// (ProductInventory has no version col): updateMany WHERE id+version bumps version,
// 0 rows → 404 vs 409 disambiguate via findUnique; then upsert inventory quantity in
// the same tx so the version bump and the quantity write commit atomically.
export async function updateInventory(id: string, input: UpdateInventoryInput) {
  return prisma.$transaction(async (tx) => {
    const result = await tx.product.updateMany({
      where: { id, version: input.version },
      data: { version: { increment: 1 } },
    });
    if (result.count === 0) {
      const existing = await tx.product.findUnique({
        where: { id },
        select: { version: true },
      });
      if (!existing) throw notFound(`Product ${id} not found`);
      throw conflict('Stale version — reload the product and retry');
    }
    // Inventory row is seeded on product create; upsert guards a missing row.
    return tx.productInventory.upsert({
      where: { productId: id },
      create: { productId: id, quantityAvailable: input.quantityAvailable },
      update: { quantityAvailable: input.quantityAvailable },
    });
  });
}

// B1-09 — create category; parentId (when set) must reference an existing category.
export async function createCategory(input: CreateCategoryInput) {
  if (input.parentId) {
    const parent = await prisma.category.findUnique({ where: { id: input.parentId } });
    if (!parent) throw badRequest(`Parent category ${input.parentId} does not exist`);
  }

  try {
    return await prisma.category.create({
      data: {
        name: input.name,
        slug: input.slug,
        iconUrl: input.iconUrl,
        parentId: input.parentId,
        displayOrder: input.displayOrder ?? 0,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw conflict('Slug already exists');
    }
    throw err;
  }
}

// B1-09 — flat fetch + in-memory nested tree by parentId (arch §3 GET /categories).
// ponytail: single query + JS build; fine while category count stays small. If it
// grows large, push the recursion into a recursive CTE.
export type CategoryNode = Category & { subcategories: CategoryNode[] };

export async function getCategoryTree(): Promise<CategoryNode[]> {
  const all = await prisma.category.findMany({
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
  });
  const byParent = new Map<string | null, Category[]>();
  for (const c of all) {
    const key = c.parentId ?? null;
    const list = byParent.get(key);
    if (list) list.push(c);
    else byParent.set(key, [c]);
  }
  const build = (parentId: string | null): CategoryNode[] =>
    (byParent.get(parentId) ?? []).map((c) => ({
      ...c,
      subcategories: build(c.id),
    }));
  return build(null);
}

// B2-06 — buyer product search (arch §3 GET /products → { data, total, page }).
// Empty q → plain paginated list of active products. Present q → pg_trgm search.
// Each predicate runs in its own UNION branch so the planner attaches it to the
// matching GIN index (products_name_trgm / products_brand_trgm) → Bitmap Index Scan
// per branch. An OR of all four on one scan degrades to a seq scan, hence the split.
// `%` = similarity above pg_trgm.similarity_threshold (typo tolerance); ILIKE '%q%'
// = substring, catches below-threshold partial/short queries. UNION dedups;
// similarity() only orders the already-filtered set (not a filter, need not index).
// total = COUNT(*) OVER() so we scan once instead of running the filter twice.
type ProductSearchRow = {
  id: string;
  name: string;
  brand: string | null;
  sku: string;
  categoryId: string;
  unit: string;
  unitSize: string;
  caseQty: number;
  mrp: Prisma.Decimal;
  sellingPrice: Prisma.Decimal;
  imageUrl: string | null;
  description: string | null;
  isActive: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  full_count: number;
};

export interface ProductPage {
  data: Omit<ProductSearchRow, 'full_count'>[];
  total: number;
  page: number;
}

export async function searchProducts(query: ProductQuery): Promise<ProductPage> {
  const page = query.page;
  const limit = query.limit;
  const offset = (page - 1) * limit;
  const activeWhere = {
    isActive: true,
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
  };

  if (!query.q) {
    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where: activeWhere,
        orderBy: { name: 'asc' },
        skip: offset,
        take: limit,
      }),
      prisma.product.count({ where: activeWhere }),
    ]);
    return { data, total, page };
  }

  const q = query.q;
  // ponytail: OR across two indexed columns forces a seq scan (planner sees the OR
  // as one predicate, not 4 indexable branches). UNION splits each branch onto its
  // own GIN index → Bitmap Index Scan per branch (handbook B2-06 blocker cleared).
  // % is typo-tolerant above similarity_threshold; ILIKE '%q%' catches substring
  // matches below it (short queries, partial words). UNION dedups; the btree
  // Product_categoryId_idx filters categoryId inside each branch.
  const cat = query.categoryId ? Prisma.sql`AND "categoryId" = ${query.categoryId}` : Prisma.empty;
  const branch = (cond: Prisma.Sql) => Prisma.sql`
    SELECT id, name, brand, sku, "categoryId", unit, "unitSize", "caseQty",
           mrp, "sellingPrice", "imageUrl", description, "isActive", version,
           "createdAt", "updatedAt"
    FROM "Product"
    WHERE "isActive" = true ${cat} AND ${cond}`;

  const rows = await prisma.$queryRaw<ProductSearchRow[]>`
    SELECT *, COUNT(*) OVER()::int AS full_count FROM (
      ${branch(Prisma.sql`name % ${q}`)}
      UNION
      ${branch(Prisma.sql`brand % ${q}`)}
      UNION
      ${branch(Prisma.sql`name ILIKE '%' || ${q} || '%'`)}
      UNION
      ${branch(Prisma.sql`brand ILIKE '%' || ${q} || '%'`)}
    ) p
    ORDER BY
      GREATEST(similarity(p.name, ${q}), COALESCE(similarity(p.brand, ${q}), 0)) DESC,
      p.name
    LIMIT ${limit}::int OFFSET ${offset}::int`;

  const total = rows.length > 0 ? Number(rows[0].full_count) : 0;
  const data = rows.map(({ full_count: _fc, ...rest }) => rest);
  return { data, total, page };
}

// B2-06 — buyer product detail (arch §3 GET /products/:id → { product, inventory }).
// Inactive products are hidden from buyers (treated as not found).
export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { inventory: true },
  });
  if (!product || !product.isActive) throw notFound(`Product ${id} not found`);
  const { inventory } = product;
  return { product, inventory };
}
