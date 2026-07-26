import type { Prisma, ShopProfile } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { signUpload, type UploadSignature } from '../../lib/cloudinary';
import { env } from '../../lib/env';
import { conflict, notFound } from '../../lib/http-error';
import type { CreateProfileInput, UpdateProfileInput } from './shop.schemas';

/** Writes the PostGIS geography point in the SAME transaction as lat/lng (§2.2). */
async function writeLocation(tx: Prisma.TransactionClient, id: string, lat: number, lng: number) {
  await tx.$executeRaw`
    UPDATE "ShopProfile"
    SET location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
    WHERE id = ${id}`;
}

export async function createProfile(
  userId: string,
  input: CreateProfileInput,
): Promise<ShopProfile> {
  const existing = await prisma.shopProfile.findUnique({ where: { userId } });
  if (existing) throw conflict('Shop profile already exists — use PATCH to update');

  return prisma.$transaction(async (tx) => {
    const profile = await tx.shopProfile.create({ data: { userId, ...input } });
    await writeLocation(tx, profile.id, input.latitude, input.longitude);
    return profile;
  });
}

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<ShopProfile> {
  const existing = await prisma.shopProfile.findUnique({ where: { userId } });
  if (!existing) throw notFound('Shop profile not found — create it first');

  return prisma.$transaction(async (tx) => {
    const profile = await tx.shopProfile.update({ where: { userId }, data: input });
    // Keep the geography point in sync whenever both coordinates are provided.
    const lat = input.latitude ?? existing.latitude;
    const lng = input.longitude ?? existing.longitude;
    if (input.latitude !== undefined || input.longitude !== undefined) {
      await writeLocation(tx, profile.id, lat, lng);
    }
    return profile;
  });
}

export async function confirmPhoto(userId: string, cloudinaryUrl: string): Promise<ShopProfile> {
  const existing = await prisma.shopProfile.findUnique({ where: { userId } });
  if (!existing) throw notFound('Shop profile not found');
  return prisma.shopProfile.update({ where: { userId }, data: { shopPhotoUrl: cloudinaryUrl } });
}

export function getUploadSignature(): UploadSignature {
  return signUpload(env.CLOUDINARY_SHOP_FOLDER);
}
