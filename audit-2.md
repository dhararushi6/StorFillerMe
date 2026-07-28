# Audit 2 — Logic / Validation / Jobs / Storage Deep Pass

**Date:** 2026-07-28
**Scope:** Second full read of all 82 source files + Prisma schema + migrations + shared packages, after `audit.md`. Focus: storage/indexing, per-endpoint logic, validation coverage, cron jobs. Read-only; no code changed.
**Supersedes:** two findings from `audit.md` (see "Corrections").

---

## Corrections to audit.md (now stale)

1. **"Zero automated tests" (P1) — RESOLVED.** Six test files + a `src/test/` harness landed after the first audit: `payments.webhook.test.ts`, `order.service.test.ts`, `auth.service.test.ts`, `order.fsm.test.ts`, `jwt.test.ts`, `duration.test.ts`. They run against a real test Postgres (`global-setup.ts` does `db push`, `setup-db.ts` truncates per worker, `maxWorkers: 1`) and cover exactly the invariants the first audit flagged: webhook P2002→idempotent-200, wallet `balanceAfter`==balance atomicity, insufficient-stock no-leak, refresh-family revocation, and **buyer ownership on `getOrder`/`listOrders`**. This was the single highest-value gap and it is now genuinely well-tested. Remaining sub-point: `--passWithNoTests` is still in the npm script (`package.json:18`) — harmless now that tests exist, but remove it so CI fails loudly if the suite is ever emptied.

2. **"Pathological cart → hundreds of FOR UPDATE locks" (P2) — DOWNGRADED to non-issue.** Cart quantity is capped at `9999` per line (`cart.schemas.ts:9,13`) and cart **line count is bounded in practice** by the `@@unique([buyerId, productId])` upsert (re-adding a product increments, never adds a row). The sequential lock loop is bounded and not a realistic contention vector. Withdrawn.

---

## New Findings

### P1 — Major

#### 1. `GET /orders/:id/tracking` leaks any order's live GPS — no ownership check (IDOR)

- **Category:** Security / logic
- **Location:** `apps/api/src/modules/orders/order.controller.ts:38-42` → `apps/api/src/modules/agent/agent.service.ts:109-116`; route `order.routes.ts:31` (guarded only by `requireRole('BUYER')`).
- **Issue:** `getTrackingHandler` calls `AgentService.getTracking(id)` with **only the order id** — it never passes the requesting buyer's id and never verifies the order belongs to them. `getTracking` does a bare `liveTracking.findUnique({ where: { orderId } })`. Any authenticated BUYER can enumerate order UUIDs and read the **real-time GPS coordinates of any delivery agent on any order**.
- **Contrast:** the sibling read `getOrder` does check ownership (`order.service.ts:251`), and there is even a test asserting that 404-on-other-buyer's-order behavior — but no equivalent test or check exists for tracking. This is precisely the "one missed manual ownership check = IDOR" systemic risk called out in audit.md, now confirmed live.
- **User impact:** A buyer (or anyone with a stolen buyer token) can track the live location of every delivery agent in the system — a privacy/safety exposure for agents and a data leak for other buyers' orders.
- **Fix:** Pass `req.user.id` into the tracking path and verify the order's `buyerId` before returning coordinates (mirror `getOrder`'s `if (!order || order.buyerId !== buyerId) throw notFound`). Add a test: buyer B requesting buyer A's tracking → 404.

#### 2. Wallet-paid order cancellation never refunds the wallet (money loss)

- **Category:** Logic / money correctness
- **Location:** `apps/api/src/modules/orders/order.service.ts:267-295` (`cancelOrder`).
- **Issue:** `cancelOrder` releases reserved inventory and sets status CANCELLED, and for online payments logs that a refund is "not yet processed (B3-08)". But for **WALLET** payments the money was already debited from the buyer's `BuyerWallet` inside `createOrder` (a real, completed debit with a ledger row), and cancellation does **nothing** to put it back — no `CREDIT` ledger row, no balance increment. The wallet refund is lumped in with the Razorpay "stub refund" comment, but wallet refunds need no external API: the money is already in the system's own DB.
- **User impact:** A buyer who pays by wallet and cancels a still-cancellable order **loses the money permanently** — the wallet is debited, the order is cancelled, and no credit ever arrives. Direct financial harm, and a support nightmare. (UPI/CARD refund via Razorpay is legitimately deferred to B3-08; wallet is not.)
- **Fix:** In `cancelOrder`, when `paymentMethod === 'WALLET'`, write a `CREDIT` `WalletTransaction` for `totalAmount` and increment `BuyerWallet.balance` **inside the same transaction** as the inventory release + status flip (exactly the inverse of the debit path in `createOrder`). UPI/CARD can stay deferred. Add a test: wallet order cancelled → balance restored + a CREDIT ledger row whose `balanceAfter` matches.

---

### P2 — Minor

#### 3. `DeliveryLocationLog.recordedAt` has no index — nightly cleanup seq-scans the largest table

- **Category:** Storage / performance
- **Location:** schema `apps/api/prisma/schema.prisma:358-368` (only `@@index([orderId])`); migration `20260726173650_init_tracking_ops/migration.sql:115`; consumer `apps/api/src/jobs/delivery-log-cleanup.job.ts:14-16`.
- **Issue:** The 30-day cleanup runs `deleteMany({ where: { recordedAt: { lt: cutoff } } })` but the only index on the table is on `orderId`. Every nightly run (and every manual admin trigger via `POST /admin/delivery-logs/cleanup`) full-scans the fastest-growing append-only table in the schema (one row per agent GPS ping, ~every 15s per active delivery).
- **User impact:** As delivery history grows, the nightly cleanup gets slower and holds a longer delete lock — eventually a multi-minute seq-scan/delete on the busiest table. No user-facing breakage today.
- **Fix:** Add `@@index([recordedAt])` (a hand-edited migration, matching the existing raw-SQL supplement pattern). This also future-proofs any "replay order X's trail by time" query.

#### 4. `registerDeviceToken` upserts by global token and can reassign ownership

- **Category:** Security / logic
- **Location:** `apps/api/src/modules/notifications/notifications.service.ts:62-67`.
- **Issue:** The upsert key is `token` (globally `@unique`). The `update` branch sets `userId` to the **caller's** id. If user B registers a token string that user A already registered, the row's `userId` flips to B — A stops getting pushes and B starts receiving pushes intended for that device. Device tokens are supposed to be per-device, but nothing prevents one user from (accidentally or maliciously) submitting another's token.
- **User impact:** Push-notification misdelivery/hijack: order-status pushes route to the wrong user. Low likelihood (requires knowing/guessing a token), but the failure mode is silent.
- **Fix:** Scope the token to the user — e.g. make the unique constraint `@@unique([userId, token])` and upsert on that compound key, or on conflict verify `userId` matches and 409 if it belongs to someone else.

#### 5. `PATCH /shop/photo/confirm` accepts an arbitrary URL without verifying the upload

- **Category:** Logic / validation
- **Location:** `apps/api/src/modules/shop/shop.service.ts:49-53`; schema `shop.schemas.ts:16-19` (requires `publicId` but the service ignores it).
- **Issue:** `confirmPhoto` writes `req.body.cloudinaryUrl` straight to `shopPhotoUrl`. The schema collects a `publicId` (implying intent to verify the upload exists/belongs to the shop folder) but the service never uses it — no Cloudinary lookup, no folder/host check, no association with the signed upload flow. Any authenticated buyer can set their shop photo to any URL.
- **User impact:** A buyer can point their shop photo at an arbitrary external/inappropriate image URL, which then renders in the app. Minor content-integrity issue; not a vector for much on its own.
- **Fix:** Either drop `publicId` from the schema (if URL-trust is the intent) or — better — verify: check the URL host is the configured Cloudinary cloud and the `publicId` resolves under `CLOUDINARY_SHOP_FOLDER`, ideally via the same webhook/signed-confirm pattern used for product images.

#### 6. `Order.version` is dead — never read or written

- **Category:** Storage / logic (dead column)
- **Location:** schema `schema.prisma:273` (`version Int @default(1)`); `grep` confirms **no** read/write anywhere in `src/modules/orders` or `src/modules/agent` (exit 1).
- **Issue:** The `Order` model carries an optimistic-concurrency `version` column (mirroring the working one on `Product`), but no order mutation uses updateMany-WHERE-version — status transitions go through `prisma.order.update` with no version guard. The column is inert.
- **User impact:** None directly, but it's a false signal (looks concurrency-guarded, isn't) and means concurrent order mutations (e.g. two admins confirming, or admin-assign racing agent-deliver) have no lost-update protection beyond the FSM check, which is not atomic with the write.
- **Fix:** Either wire `version` into the order status transitions (updateMany WHERE id+version, like `updateProduct`) for real optimistic locking, or drop the column. Given the FSM already rejects most illegal double-transitions, dropping is the honest lazy fix; wire it only if admin/agent races are observed.

---

### P3 — Polish

#### 7. `JobRecovery` table is unused dead schema

- **Category:** Storage
- **Location:** schema `schema.prisma:425-435`; only referenced in `src/test/setup-db.ts` (truncation list), never read/written in `src/`.
- **Issue:** `JobRecovery` exists for "restart-safety for in-memory node-cron" (§4.5) but no job writes to it and no boot replay reads it. The three cron jobs (`otp-cleanup`, `product-image-cleanup`, `delivery-log-cleanup`) are all idempotent deletes/selects that don't need crash recovery.
- **User impact:** None — dead table + dead intent. Misleads a reader into thinking restart-replay exists.
- **Fix:** Drop the model, or implement the boot-replay it promises. Dropping is correct for the current idempotent jobs.

#### 8. Redundant `@@index([phone])` on User (unique already indexes)

- **Category:** Storage
- **Location:** schema `schema.prisma:84,109` — `phone String @unique` plus a separate `@@index([phone])`; migration `20260726123723_init_auth_shop/migration.sql:77` creates `User_phone_idx` alongside the unique constraint's index.
- **Issue:** `@unique` on `phone` already creates a unique btree; the additional `@@index([phone])` builds a second, redundant index on the same column — wasted write amplification and storage on every User insert.
- **User impact:** None — pure waste. Same class of redundancy does **not** recur elsewhere (checked: `CartItem` buyerId prefix is legitimately load-bearing, and other `@@index` targets aren't unique).
- **Fix:** Drop `@@index([phone])`.

#### 9. `parseDurationMs` has no upper bound — a bad env value can set absurd TTLs

- **Category:** Validation
- **Location:** `apps/api/src/utils/duration.ts:2-15`; consumed by `auth.service.ts:14` for `JWT_REFRESH_TTL`.
- **Issue:** The regex accepts any integer + unit with no ceiling. `JWT_REFRESH_TTL=99999d` parses fine and yields a ~273-year refresh token. The value comes from env (trusted-ish), but a typo (`30d` → `3000d`) silently weakens session security.
- **User impact:** None under correct config; a misconfigured TTL silently turns short-lived sessions into effectively-permanent ones.
- **Fix:** Clamp/validate at the env layer (`env.ts`): assert refresh TTL ≤ some sane max (e.g. 90 days) at boot, or add an upper bound in `parseDurationMs` callers. Boot-time fail beats silent misconfig.

---

## Jobs — reviewed

| Job                     | Schedule                     | Logic                               | Verdict                                                                                                                                                                                                                                                                   |
| ----------------------- | ---------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `otp-cleanup`           | `5 * * * *` (hourly :05)     | `deleteMany` expired `EmailOtp`     | Correct. Idempotent. `expiresAt` unindexed but table is tiny (rows self-delete hourly) — fine.                                                                                                                                                                            |
| `product-image-cleanup` | `*/5 * * * *` (every 5 min)  | `findMany` active+null-image, log   | Correct but **noisy**: re-logs the same missing-image products every 5 min forever. Partial index on `(isActive) WHERE imageUrl IS NULL` only helps once count grows. Consider a `imageFlaggedAt` marker so each product is flagged once, or accept log spam. P3 at most. |
| `delivery-log-cleanup`  | `30 3 * * *` (nightly 03:30) | `deleteMany` `recordedAt < now-30d` | Correct logic; **P2 #3** — missing `recordedAt` index makes it a seq-scan.                                                                                                                                                                                                |

Cron registration (`jobs/index.ts`) is clean: `isTest` guard, staggered schedules, per-job try/catch, timezone from env. Single-replica assumption is documented. No overlap risk between the three schedules.

## Validation — reviewed

Zod schemas are consistently applied via `validate({ body/query/params })` and are tight: money capped at `Decimal(10,2)` range with a comment justifying JS-number safety (`catalog.schemas.ts:8`), lat/lng bounded (`agent.schemas.ts`, `shop.schemas.ts`), pincode regexed, pagination `limit` capped (`50` admin/orders, `100` catalog/audit), UUID params enforced. The Express-5 `req.query` getter workaround in `validate.middleware.ts` is correct and well-commented. **No validation gaps found** beyond P3 #9 (env-side) and P2 #5 (semantics, not shape).

## Storage — reviewed

Decimal(10,2) money throughout (correct); snapshot `deliveryAddress` JSON on Order (correct denormalization); `LiveTracking` single-row-per-order O(1) read + append-only `DeliveryLocationLog` history is the right split; GIST spatial indexes exist and the cart-migration DROP was correctly caught/handled (comment in `20260727110149`). Findings: missing `recordedAt` index (#3), dead `Order.version` (#6), dead `JobRecovery` (#7), redundant `User.phone` index (#8).

---

## Recommended priority

1. **#1 tracking IDOR** — one-line ownership check + a test; closes a live privacy hole.
2. **#2 wallet cancel refund** — money correctness; inverse of the existing debit path, same transaction.
3. **#3 `recordedAt` index** — one migration; prevents a slow-scan liability on the biggest table.
4. **#4 device-token scoping** — compound unique + conflict guard.
5. **#5/#6/#7/#8/#9** — hygiene: photo-confirm verify, drop dead columns/table/index, clamp TTL.
