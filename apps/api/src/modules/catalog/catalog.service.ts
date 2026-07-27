import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { badRequest, conflict, notFound } from '../../lib/http-error';
import type { CreateProductInput, UpdateProductInput } from './catalog.schemas';

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
