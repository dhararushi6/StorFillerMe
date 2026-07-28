# Site Audit Report

**Date:** 2026-07-28
**Project:** Storefiller — B2B wholesale restocking marketplace API
**Detected stack:** Node ≥20 · Express 5.1 · Prisma 6.1 (PostgreSQL + PostGIS) · TypeScript 5.6 · pnpm 10.16 workspace · node-cron · Firebase Admin · Razorpay · Cloudinary · Resend · pino · zod · helmet. Deployed to Railway (single replica), Neon free-tier Postgres.
**Detected audience/goal:** Indian B2B buyers (retail shops) restocking wholesale inventory, plus AGENT (delivery) and ADMIN (catalog/order ops) roles. Goal is a mobile-app backend (React Native client consumes it; **no web/frontend code exists in this repo**). Money flows: COD, wallet, UPI/card via Razorpay.
**Design system maturity:** N/A — no UI layer present. Tokens/theming/responsive/accessibility dimensions apply to a frontend that does not exist in this repository.

> ## Scope note (read first)
>
> This is a **backend-only API**. The repository contains no `.tsx`, `.html`, CSS, or any client bundle — only `apps/api` plus shared `packages/types` and `packages/config`. The audit prompt's UI/UX, visual-accessibility, theming, responsive-design, and AI-visual-pattern dimensions target a web UI that isn't here. Those dimensions are scored against what exists (API design surface, DX consistency, response shapes) and marked where not applicable. Security, performance (query/transaction design), and the API-specific legal/compliance surface are audited in full. **The mobile app that consumes this API is a separate, un-audited surface.**

---

## Anti-Pattern Verdict

**No — this does not look AI-generated in the slop sense.** The code shows deliberate, hand-tuned engineering that AI defaults don't produce: Prisma `Decimal` money math everywhere instead of `number`, `SELECT … FOR UPDATE` inventory locking inside the order transaction, refresh-token family-reuse detection, HMAC webhooks computed over raw bodies with explicit ordering comments (`app.ts:36-47`), optimistic-lock versioning on inventory, and a consistent `ponytail:` convention documenting known ceilings.

What it _does_ have are honest, self-documented stub modes (Firebase/Razorpay/Cloudinary/Resend) — a deliberate zero-budget dev strategy, not AI tells. The risk is that those stubs are not gated by `NODE_ENV`, which is a real security finding (P0), not a stylistic one.

No fabricated metrics, no gradient-text hero, no card-grid, no emoji-as-icons, no decorative glassmorphism — none of the visual tells apply because there is no visual layer.

---

## Audit Health Score

| #   | Dimension               | Score | Key finding                                                                                                                      |
| --- | ----------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Accessibility           | n/a   | No UI layer in repo — not applicable to a JSON API                                                                               |
| 2   | Performance             | 3/4   | Good query design (FOR UPDATE, indexed search, pagination); `SELECT *` in search + no N+1 guard on some includes                 |
| 3   | Security                | 2/4   | Strong HMAC/auth/money handling undercut by **un-gated stub modes** that bypass auth & payment verification if prod env is unset |
| 4   | Theming & design system | n/a   | No UI layer — API consistency covered under findings instead                                                                     |
| 5   | Responsive design       | n/a   | No UI layer in repo                                                                                                              |
| 6   | Anti-patterns           | 4/4   | No AI/visual slop; code is intentional and consistent                                                                            |

**Total (applicable dims 2,3,6): 9/12** — Good, with one blocking security gate missing.

Rating bands: 21-24 Excellent · 16-20 Good · 11-15 Acceptable · 6-10 Poor · 0-5 Critical _(scaled: only 3 of 6 dimensions are applicable to a backend-only repo)_

**Legal & compliance flags:** Privacy Policy **missing** · Terms **missing** · Cookie consent **n/a** (no cookies; bearer-token API) · GDPR signals **missing** (collects phone, email, GPS location, delivery tracking history — no deletion/export endpoint) · COPPA **n/a** (B2B wholesale, adult merchants, no under-13 vector)

---

## Executive Summary

This is a well-engineered, security-conscious API with money handling done correctly (Decimal precision, atomic transactions, idempotent webhooks, optimistic locking) — genuinely rare in zero-budget builds. The single blocking problem is architectural: **the dev-only stub modes for Firebase auth and Razorpay payments are gated only on the presence of env vars, not on `NODE_ENV`**, so a production deploy missing one variable silently runs with auth and payment verification disabled. Beyond that, the codebase has **zero automated tests** (3,591 lines, money + auth + FSM paths all uncovered), and it collects substantial PII (phone, email, live GPS, delivery-location history) with **no privacy policy, no data-deletion, and no data-export path** — a real regulatory exposure for an Indian-market app under DPDP Act 2023, not just GDPR.

Launch-readiness: **not safe to deploy to production as-is.** The stub-gate fix is small; the test and privacy gaps are structural.

Total findings by severity: **P0 1 · P1 4 · P2 4 · P3 2**

---

## Quick Wins

1. **Un-gated stub auth/payments** (P0) — add a single `isProd` guard that refuses to boot (or refuses the request) when a stub mode is active in production.
2. **Dead `isProd` branch in Prisma log config** (P3) — `prisma.ts:9` has identical values on both sides of the ternary; collapse it or make dev actually verbose.
3. **`SELECT *` in product search** (P2) — `catalog.service.ts:250` selects all columns then discards one in JS; project the needed columns in the inner query.

---

## Findings

### P0 — Blocking

#### Stub auth & payment verification are not gated by NODE_ENV

- **Category:** Security
- **Location:** `apps/api/src/lib/firebase-admin.ts:12,31,40-46` · `apps/api/src/lib/razorpay.ts:6` · `apps/api/src/lib/cloudinary-webhook.ts:28` · `apps/api/src/modules/payments/payments.webhook.ts:36-44`
- **Issue:** Every external-service integration runs in a "stub mode" keyed only on whether its env var is present — never on `NODE_ENV`. `firebaseStubbed = !env.FIREBASE_SERVICE_ACCOUNT` means that if the service-account JSON is unset in production, `verifyStubToken` accepts any token shaped `stub:<uid>:<phone>` and issues a **full session for any phone number**. Likewise, `razorpayStubbed` makes the webhook skip HMAC verification and accept any posted payload as a captured payment, auto-confirming orders. `grep` confirms no `isProd` check exists anywhere near these paths (`isProd` is used only for logger/prisma cosmetics).
- **User impact:** A misconfigured Railway deploy (one forgotten/typo'd env var) turns the live API into one where anyone can log in as any buyer and mark any order paid without paying. This is silent — the app boots fine and only logs a `warn`. Real consequence: account takeover of every buyer, fraudulent order confirmation, inventory loss.
- **Fix:** Add a hard production guard at startup (in `env.ts` or each lib): when `NODE_ENV === 'production'` and any critical secret is absent, `process.exit(1)` with a loud message — do not allow stub mode to activate. Alternatively gate `verifyStubToken`/stub-webhook behind `if (isProd) throw`. Startup-fail is safer than request-time-fail because it surfaces in CI/deploy, not in a 3am log.

---

### P1 — Major

#### Zero automated tests across money, auth, and order-FSM paths

- **Category:** Security / correctness
- **Location:** repo-wide — `git ls-files | grep -iE '\.test\.|\.spec\.'` returns 0; `apps/api/package.json` test script is `jest --runInBand --passWithNoTests` (the `--passWithNoTests` flag masks the absence).
- **Issue:** 3,591 lines covering Razorpay webhook idempotency, wallet debit/credit invariants, refresh-token family revocation, the order FSM, and geofenced delivery — none of it has a single test. The highest-risk invariants (wallet balance never disagrees with ledger; P2002 → idempotent 200; FOR UPDATE stock lock) are asserted only in comments.
- **User impact:** A regression in the wallet ledger or the webhook idempotency path ships undetected and directly costs buyers money (double-debit, double-confirm, lost stock). Every refactor is a coin-flip on the money paths.
- **Fix:** Add integration tests (supertest is already a devDependency) for the three money invariants first: (1) Razorpay webhook duplicate → 200 idempotent, single CAPTURED; (2) wallet debit → `balanceAfter` equals wallet balance, atomic with order create; (3) insufficient stock → 409, no reservation leak. Then FSM transition table and refresh-family revocation. Remove `--passWithNoTests` so CI fails on an empty suite.

#### Personal data collected with no deletion or export path (DPDP/GDPR)

- **Category:** Legal & compliance
- **Location:** repo-wide — `User` (phone, email), `ShopProfile` (address + GPS `latitude/longitude`), `LiveTracking`, `DeliveryLocationLog` (agent GPS history), `DeviceToken`. No `/users/me/delete`, no data-export endpoint, no retention policy beyond two cleanup jobs.
- **Issue:** The API persists phone numbers, emails, shop addresses, precise geolocation, and continuous delivery-agent GPS trails, but exposes no way for a user to request deletion or a copy of their data. The delivery-log cleanup (`delivery-log-cleanup.job.ts`) deletes after 30 days — good — but that's an operational decision, not a user right. For an India-market app this is a **Digital Personal Data Protection Act 2023** exposure (erasure + access are statutory rights); if any EU user is served, GDPR Art. 17/20 apply with the same gap.
- **User impact:** Users cannot exercise legal rights over their own data; the business carries regulatory and deletion-request liability it currently cannot honor programmatically.
- **Fix:** Add `DELETE /users/me` (soft-delete/anonymize PII, keep financial ledger rows for reconciliation) and `GET /users/me/export` (JSON dump of user-owned rows). Publish a Privacy Policy and link it from wherever the client surfaces account settings.

#### No privacy policy or terms linked/present anywhere

- **Category:** Legal & compliance
- **Location:** repo-wide — no `PRIVACY`, `TERMS`, legal route, or static asset; nothing in `app.ts` serves one.
- **Issue:** The product collects personal and payment-adjacent data but ships no Privacy Policy or Terms & Conditions. This is independent of the API/UI split — the policy document itself must exist and be reachable.
- **User impact:** Regulatory exposure (India DPDP; FTC-style penalties in other jurisdictions) and app-store rejection risk (Google Play / Apple require a privacy policy URL for apps collecting location + personal data).
- **Fix:** Author Privacy Policy + ToS, host at a stable URL, link from the mobile client's onboarding and settings. Block launch on it.

#### No rate limiting on any route except email-OTP send

- **Category:** Security
- **Location:** `apps/api/src/modules/auth/auth.routes.ts:21-32` (only limiter in the codebase). Unprotected: `/auth/token/verify`, `/auth/refresh`, all `/orders`, `/payments/*`, `/wallet/*`, `/admin/*`.
- **Issue:** Only `POST /auth/email-otp/send` is rate-limited (5/hr). The Firebase token-verify, refresh, payment-order creation, and order-placement endpoints have none. `POST /payments/razorpay/order` and `POST /orders` are the expensive/abusable ones (payment-gateway calls + inventory locking).
- **User impact:** Credential-stuffing and OTP-verify brute force are unthrottled; a scripted caller can hammer order creation (locking inventory rows) and Razorpay order creation (paid upstream API) with no brake. DoS and direct cost.
- **Fix:** Apply a global baseline limiter in `app.ts` (e.g. 100/15min per IP) plus tighter route-specific limits on `/auth/*` (verify/refresh) and the payment/order-creation routes. Key by user id where authenticated, IP otherwise.

---

### P2 — Minor

#### Product search does `SELECT *` then drops a column in JS

- **Category:** Performance
- **Location:** `apps/api/src/modules/catalog/catalog.service.ts:250,264-265`
- **Issue:** The search query does `SELECT *, COUNT(*) OVER() …` across a 4-branch UNION, then `rows.map(({ full_count: _fc, ...rest }) => rest)` strips the count column in JavaScript. Every row carries the redundant `full_count` over the wire from Postgres.
- **User impact:** Minor — wasted bytes per search row and a slightly wider row than needed; negligible at current scale, wasteful under load. No user-visible breakage.
- **Fix:** Project the explicit column list in the inner UNION branches (they're already enumerated in `branch()`) and select `full_count` once at the outer level, rather than `*`.

#### No request-body size guard beyond the global 1mb, and no per-endpoint payload schema ceiling on nested arrays

- **Category:** Performance / Security
- **Location:** `apps/api/src/app.ts:45` (`express.json({ limit: '1mb' })`); cart/order creation accept array inputs.
- **Issue:** A single global 1mb JSON cap is the only bound. Order creation iterates the cart and runs a `FOR UPDATE` lock per line — a pathological cart with hundreds of lines turns one request into hundreds of sequential row locks inside one transaction.
- **User impact:** A crafted large cart makes one request hold many inventory row locks for the transaction's duration, degrading concurrent order throughput for all buyers (lock contention). Edge case, not routine.
- **Fix:** Cap cart line count (zod `.max()` on the items array, or a service-level guard rejecting carts above N lines before the lock loop).

#### Prisma `log` config has an identical both-branch ternary (dead conditional)

- **Category:** Consistency / correctness
- **Location:** `apps/api/src/lib/prisma.ts:9`
- **Issue:** `log: isProd ? ['warn', 'error'] : ['warn', 'error']` — both branches identical. Either a leftover or the dev branch was meant to be more verbose (`['query','info','warn','error']`) and got reverted. As written the `isProd` import and conditional do nothing.
- **User impact:** None at runtime — but it reads as a bug-in-waiting and misleads the next editor into thinking prod/dev logging differs.
- **Fix:** Collapse to `log: ['warn', 'error']`, or make dev emit `query`/`info` if that was the intent.

#### Webhook stub modes log at `warn` but still return 200 — indistinguishable success in monitoring

- **Category:** Security / observability
- **Location:** `apps/api/src/modules/payments/payments.webhook.ts:36-44` · `apps/api/src/modules/catalog/product-webhook.controller.ts:34-36`
- **Issue:** In stub mode the Razorpay webhook accepts and processes the payload (auto-confirming the order) and the Cloudinary webhook accepts with only a `warn`. A log-scraper watching for 4xx/5xx sees a clean 200; only a human reading the `warn` line knows verification was skipped.
- **User impact:** In a non-prod-but-shared environment (staging), an attacker who reaches the webhook can confirm orders or stamp product images, and nothing in status-code-based alerting fires.
- **Fix:** This is largely subsumed by the P0 NODE_ENV gate. Additionally, tag stub-mode webhook responses with a distinct header or emit a metric/structured `stub_mode=true` field so dashboards can alert on it.

---

### P3 — Polish

#### Refresh-token grace window allows one silent replay

- **Category:** Security (hardening)
- **Location:** `apps/api/src/modules/auth/auth.service.ts:13,102-113`
- **Issue:** `REFRESH_GRACE_MS = 10_000` tolerates reuse of an already-rotated refresh token for 10s (for network retries). Within that window a replayed token re-issues a session. This is a deliberate, documented trade-off — reasonable — but it's the kind of thing worth a second look.
- **User impact:** Effectively none for real users; a token stolen and replayed within 10s of legitimate use could mint one extra session. Very narrow window, mitigated by family revocation outside it.
- **Fix:** None required. Optionally return the _same_ rotated token within the grace window instead of minting a new pair (idempotent replay), which closes the window entirely.

#### Health endpoint leaks version and uptime

- **Category:** Security (informational)
- **Location:** `apps/api/src/modules/health/health.routes.ts:9-17`
- **Issue:** `/health` is unauthenticated and returns `version`, `db` status, and `uptime`. Version disclosure aids targeted exploit lookup; uptime leaks restart cadence.
- **User impact:** None for users; marginal reconnaissance value to an attacker. Low.
- **Fix:** Return bare `{ status: 'ok' }` publicly; move version/db/uptime behind an authenticated `/admin/health` if ops needs it.

---

## Systemic Patterns

- **Stub-mode strategy without an environment gate (root cause of the only P0).** Four integrations (`firebase-admin`, `razorpay`, `cloudinary-webhook`, `mailer`) all use the same `XStubbed = !env.SECRET` pattern, and none consults `isProd`. This is a single systemic decision — a sensible dev-ergonomics choice — that is one missing guard away from being safe. Fix once, centrally, and every integration inherits the protection.

- **Security-critical invariants documented only in comments, not tests.** The wallet "ledger can never disagree" invariant, the webhook "P2002 → idempotent 200" invariant, and the FSM "never silently allowed" invariant are all correct _and_ all enforced by nothing but the code as written today. The codebase's correctness is real but fragile — it depends on the next editor reading every comment. The zero-test state turns each careful invariant into a future regression.

- **Ownership scoping is consistently done by hand and consistently correct.** Every service re-derives `buyerId`/`userId`/`agentId` from `req.user` and re-checks ownership inline (`agent.service.ts:29,74`, `order.service.ts:229,247`, `payments.service.ts:22`). Good — but it's repeated manual work; one missed check in a future endpoint is an IDOR. Not a defect today; flag as the pattern to keep disciplined.

---

## Strengths

1. **Money handling is textbook.** `Prisma.Decimal` for every amount (`order.service.ts:91-97`, `cart.service.ts:24-29`), paise conversion done via `Decimal.mul(100).toFixed(0)` (`payments.service.ts:39`), wallet debit + ledger write + inventory reserve + order create all in **one transaction** (`order.service.ts:71-223`). The wallet ledger writes `balanceAfter` in the same tx as the balance update so the audit trail can't diverge (`wallet.service.ts:9-11` comment, honored in `order.service.ts:130-138`).

2. **Webhook security is done right where it's enforced.** Raw-body HMAC with `crypto.timingSafeEqual` (`razorpay.ts:26-33`, `cloudinary-webhook.ts:21-24`), explicit router-ordering comments so the raw parser registers before `express.json()` (`app.ts:36-47`), and idempotency via the `@unique razorpayPaymentId` → P2002 → 200 path (`payments.webhook.ts:84-93,113-117`). This is the correct pattern.

3. **Refresh-token rotation with family-reuse detection.** `auth.service.ts:94-124` implements real OAuth-style rotation: single-use tokens, a family id, reuse outside the grace window revokes the entire family. Most production apps don't bother; this is a genuine hardening win.

4. **Inventory race safety.** `SELECT … FOR UPDATE` inside the order transaction (`order.service.ts:74-79`) prevents the classic oversell race, and admin inventory updates use optimistic version checks (`admin.routes.ts:47-48`). Correct concurrency control on the two hottest paths.

5. **Consistent, self-aware documentation.** The `ponytail:` convention and `// Bx-y` task tags make known ceilings explicit (`app.ts:76-78`, `order.service.ts:127-129`). The code repeatedly chooses the boring-correct option over the clever one. Log redaction of phone/email/tokens/OTP (`logger.ts:10-24`) shows real thought about PII in logs.

---

## Recommended Priority Order

1. **Gate all stub modes behind `isProd` and fail-fast at boot in production** — closes the single P0; one central change in `env.ts`/each lib, protects auth + payments + webhooks at once.
2. **Add integration tests for the three money invariants + FSM + refresh revocation, and drop `--passWithNoTests`** — the codebase is correct today but has no safety net; protect the invariants before the next refactor.
3. **Ship Privacy Policy + ToS, and add `DELETE`/`GET export` self-service data endpoints** — DPDP/GDPR exposure and app-store blocker; structural, not a one-liner, so start now.
4. **Add baseline + auth/payment route rate limiting** — cheap (`express-rate-limit` already installed), removes brute-force and cost-amplification vectors on unauthenticated expensive routes.
5. **Trim `SELECT *` in search, cap cart line count, fix the dead Prisma ternary** — performance and hygiene polish once the blocking and structural items are underway.

---

_Audit method: read-only inspection of all 82 TypeScript source files under `apps/api/src`, plus root config, `.gitignore`, `.env.example`, and the Prisma/schema-adjacent raw queries. No code was changed. Findings were verified by grep + direct read before inclusion; stub-mode and ownership claims were traced to their call sites._
