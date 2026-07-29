-- B2-06 — server-side cart (arch §3 Cart). CartItem only.
-- NOTE: Prisma migrate dev also emitted DROP INDEX for live_tracking_location_gist
-- and shop_profile_location_gist (PostGIS GIST indexes not expressible in
-- schema.prisma → Prisma sees them as drift). Those indexes belong to B3
-- delivery geofencing and aren't created yet, so the drops were removed to avoid
-- (a) failing migrate deploy on a fresh DB (index absent) and (b) clobbering B3
-- work. They'll be created by their own B3 migration when that task lands.

-- CreateTable
CREATE TABLE IF NOT EXISTS "CartItem" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex — @@unique([buyerId, productId]): upsert on add-item; buyerId
-- prefix doubles as the index for "load this buyer's cart".
CREATE UNIQUE INDEX IF NOT EXISTS "CartItem_buyerId_productId_key" ON "CartItem"("buyerId", "productId");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
