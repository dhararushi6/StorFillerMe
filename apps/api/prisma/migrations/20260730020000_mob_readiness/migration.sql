-- MOB readiness: account deletion + idempotent order creation.
--
-- Hand-written (not `migrate dev`) because `migrate dev` emits spurious
-- DROP INDEX for the PostGIS GIST indexes it cannot express in schema.prisma.
-- IF NOT EXISTS keeps it re-runnable against a `db push`-created test DB.

-- DELETE /users/me marks the row instead of deleting it: Order, Payment and
-- Settlement are financial records that must be retained and all FK to User.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

-- Idempotency-Key for POST /orders. Nullable + UNIQUE: Postgres allows many
-- NULLs, so pre-mobile clients that send no key are unaffected, while a retried
-- checkout collides and returns the original order.
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "clientRequestId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Order_clientRequestId_key" ON "Order" ("clientRequestId");
