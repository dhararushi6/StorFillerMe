-- Raw SQL supplement (arch §2.2): fuzzy product search via pg_trgm GIN indexes.
-- Prisma can't express gin_trgm_ops operator classes natively.
CREATE INDEX IF NOT EXISTS products_name_trgm ON "Product" USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_brand_trgm ON "Product" USING GIN (brand gin_trgm_ops);
