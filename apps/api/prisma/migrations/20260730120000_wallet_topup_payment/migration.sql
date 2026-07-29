-- B3-07 fix: wallet top-up had no Payment row, so the Razorpay capture webhook
-- matched nothing and 404'd — the buyer was charged and the balance never moved.
-- A Payment now settles either an Order or a wallet top-up, so orderId becomes
-- nullable and buyerId carries the owner of a top-up.
--
-- Hand-written (not `migrate dev`) for the same reason as 20260730020000: migrate
-- dev emits spurious DROP INDEX for the PostGIS GIST indexes. All statements are
-- guarded so a re-run and a fresh deploy both succeed.

DO $$ BEGIN
  CREATE TYPE "PaymentKind" AS ENUM ('ORDER', 'WALLET_TOPUP');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "kind" "PaymentKind" NOT NULL DEFAULT 'ORDER';
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "buyerId" TEXT;
ALTER TABLE "Payment" ALTER COLUMN "orderId" DROP NOT NULL;

CREATE INDEX IF NOT EXISTS "Payment_buyerId_idx" ON "Payment"("buyerId");

-- One Razorpay order maps to exactly one Payment; the webhook matches on it.
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_razorpayOrderId_key" ON "Payment"("razorpayOrderId");

DO $$ BEGIN
  ALTER TABLE "Payment" ADD CONSTRAINT "Payment_buyerId_fkey"
    FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
