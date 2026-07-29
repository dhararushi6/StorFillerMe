# MOB-1 — store-readiness build spec

Scope: `apps/mobile`, Expo React Native, single role-routed app (BUYER / AGENT / ADMIN), iOS + Android, India.

How to use this: every item is a merge gate, not advice. §0 items are pass/fail before submission — store review has no partial credit. §1–§12 mirror the twelve audit areas, so a post-build audit re-runs against the same list. Items marked **[server: done]** are already live in `apps/api`; the app only has to honour the contract in §13.

Minimum supported OS: iOS 15, Android 8 (API 26) — matches Expo SDK support and covers the low-end Android install base this market actually runs. Test on Android Go-class hardware, not a flagship.

---

## 0. Submission gates (pass/fail)

- [ ] Privacy policy URL live, reachable, linked in-app **and** in both store listings.
- [ ] iOS `PrivacyInfo.xcprivacy` present with required-reason API declarations (`NSPrivacyAccessedAPICategoryUserDefaults`, `…FileTimestamp`, `…DiskSpace` as used). Expo: `ios.privacyManifests` in `app.config.ts`.
- [ ] Third-party SDK privacy manifests + signatures present for every SDK on Apple's required-reason list.
- [ ] App Store privacy labels and Play Data Safety form match what the build actually sends — audited against the real network trace, not the intent.
- [ ] In-app account deletion reachable in ≤3 taps from profile. **[server: done]** `DELETE /api/v1/users/me`.
- [ ] Payments: Razorpay is used for physical goods only. No digital-goods purchase anywhere in the app, or IAP is required instead.
- [ ] Every permission has a specific rationale string (no boilerplate): camera (shop photo, delivery proof), location (agent tracking, delivery geofence), notifications (order status).
- [ ] No placeholder content, lorem ipsum, TODO copy, or dead links in any screen reachable by a reviewer.
- [ ] No crash on launch on iOS 15 and Android 8, cold, on a low-end device.
- [ ] Age rating filled and consistent (17+ not required; commerce app).
- [ ] Play `targetSdkVersion` meets the current requirement (API 35 as of 2026) and 16 KB page-size compliance verified.
- [ ] Release build points at production API only — no staging/localhost host reachable, no debug menu, no verbose logging.
- [ ] Reviewer test account provisioned: a BUYER with a seeded shop profile, catalog, and wallet balance, plus notes explaining the phone-OTP login (reviewers cannot receive Indian SMS — provide the email-OTP fallback path or a fixed test OTP).

Reviewer note to include in App Review notes: account deletion is blocked while an order is in flight (`409`), by design — the message tells the user to cancel or wait. Deletion anonymises personal data and retains order/payment records for statutory accounting retention; the privacy policy states this.

---

## 1. Visual design and consistency

- [ ] One theme source (`theme/tokens.ts`): color, spacing scale, radii, type ramp. Zero raw hex or magic padding in screens — enforce with an ESLint rule or a CI grep for `#[0-9a-fA-F]{6}` under `app/`.
- [ ] Shared primitives for Button, Input, Card, Sheet, EmptyState, ErrorState, Skeleton. A screen composes primitives; it does not restyle them.
- [ ] All icons vector (`@expo/vector-icons` or local SVG via `react-native-svg`). No raster icons.
- [ ] Product images served from Cloudinary with explicit `w_`/`q_auto`/`f_auto` transforms per display size — never the original asset.
- [ ] Dark mode: either every screen and modal supports it, or the app pins `userInterfaceStyle: "light"` in config. Half-themed is a defect.
- [ ] App icon, adaptive icon (Android), splash at all required sizes; splash matches first frame background so there is no flash.
- [ ] Platform idiom respected: Android back/ripple/Material sheets, iOS swipe-back/SF-style nav. Do not ship iOS chrome on Android.

---

## 2. Navigation and information architecture

- [ ] `expo-router` file-based tree, one route group per role (`(buyer)`, `(agent)`, `(admin)`), gated by the `role` claim in the access token — never by a client-stored flag.
- [ ] BUYER tabs: Home/Catalog, Cart, Orders, Profile. Four peers, no drawer.
- [ ] Core tasks in ≤3 taps: search a product, add to cart, place an order, track an order, reorder a past order.
- [ ] Android hardware/gesture back never exits mid-checkout — confirm-to-discard on cart and checkout screens; never strands the user on a dead screen.
- [ ] iOS swipe-back works on every pushed screen.
- [ ] Deep links: `storefiller://order/:id`, `/product/:id`, plus universal/app links on the production domain. Each opens the right screen with a sensible synthetic back stack (order detail → orders list → home), including from a cold start.
- [ ] State restored after background kill: cart is server-side already, so restore the route and any in-progress form.
- [ ] No dead ends. Every empty, error, and "not found" state offers a next action.

---

## 3. Accessibility and inclusivity

Highest-failure area. Budget real time here.

- [ ] Full task completion with TalkBack and with VoiceOver: browse → cart → checkout → track. Every interactive element reachable, labelled, and announcing role + state.
- [ ] `accessibilityLabel` on every icon-only control; `accessibilityRole`; `accessibilityState` for selected/disabled/busy; `accessibilityHint` where the action is not obvious.
- [ ] Decorative images `accessibilityElementsHidden` / `importantForAccessibility="no"`.
- [ ] Dynamic Type / font scale at max: no clipping, no overlap, layouts reflow. Do not disable `allowFontScaling` to "fix" it; cap with `maxFontSizeMultiplier` only where a hard cap is unavoidable.
- [ ] Touch targets ≥44pt iOS / ≥48dp Android, including the quantity steppers and the cart-remove control.
- [ ] Text contrast ≥4.5:1 in both themes, verified per token pair, not per screenshot.
- [ ] Color is never the only signal: order status carries an icon + text label, not just a colored dot.
- [ ] Form fields have labels and announce validation errors; errors move focus to the offending field.
- [ ] `useReducedMotion()` respected — skip the transition, keep the state change.
- [ ] Custom controls (bottom sheet, stepper, rating) expose correct traits; verify with Accessibility Inspector and Android Accessibility Scanner, then by hand. Automated tools catch about a third.
- [ ] Hindi + English strings load correctly; no truncation in the longer language. Numerals and currency formatted with `Intl` (`en-IN`, ₹, lakh grouping).

---

## 4. Device and screen adaptability

- [ ] Verified on: iPhone SE (smallest), a notched/Dynamic Island iPhone, Android 8 low-end 720p, a large Android, and one tablet/iPad if the store listing claims tablet support (otherwise declare phone-only).
- [ ] `react-native-safe-area-context` insets on every screen; nothing under the notch or the Android gesture bar; sticky checkout bars clear both.
- [ ] Orientation: portrait-locked unless landscape is designed — declare it in config rather than letting it rotate into a broken layout.
- [ ] Android split-screen / multi-window does not crash or clip the primary action.
- [ ] Keyboard: `KeyboardAvoidingView` (or `react-native-keyboard-controller`) keeps the focused field **and its submit button** visible on the address, search, and support forms.
- [ ] Graceful degradation when hardware is absent: no camera (skip photo step with a message), no GPS/permission denied (manual pincode entry), no biometrics (fall back to OTP login).
- [ ] Low storage and low memory: image cache bounded; app does not crash when the OS trims it.

---

## 5. Data protection in transit and at rest

- [ ] HTTPS only. `NSAllowsArbitraryLoads` absent; Android `usesCleartextTraffic=false` and no permissive `networkSecurityConfig`. Any cleartext exception in a release build is a submission blocker.
- [ ] Access + refresh tokens in `expo-secure-store` (Keychain / Android Keystore). Never `AsyncStorage`, never MMKV unencrypted, never in a log line or a crash breadcrumb.
- [ ] No secrets in the JS bundle. Razorpay **key id** is public and fine; key secret, Firebase service account, Cloudinary API secret, and webhook secrets must never appear. Verify by unzipping the release `.apk`/`.ipa` and grepping the bundle — the bundle is readable to anyone.
- [ ] `android:allowBackup="false"` (via `expo-build-properties`); iOS excludes any local cache holding personal data from backup.
- [ ] Local cache: catalog and order lists may be cached in plain storage; anything with a phone number, address, or token must not be. Wipe all local caches on logout and on account deletion.
- [ ] App switcher snapshot: no order/payment screen leaks into the OS snapshot — `expo-screen-capture` or an obscuring overlay on payment screens.
- [ ] Clipboard: no auto-copy of sensitive values; OTP autofill uses the platform SMS/one-time-code affordance, not clipboard polling.
- [ ] Certificate pinning: **not** required for v1. Documented decision — pinning without a rotation plan is a self-inflicted outage. Revisit only if the threat model changes.
- [ ] No PII in analytics event properties, screen names, or Sentry breadcrumbs. **[server: done]** the API already redacts phone, email, tokens, OTP hashes from its logs.

---

## 6. Authentication, authorization, session handling

- [ ] Firebase phone auth via the native SDK / system flow; email-OTP as the documented fallback. No embedded webview for auth.
- [ ] Access token (15 min) held in memory; refresh token (30 d) in SecureStore. Single-flight refresh: concurrent 401s trigger one `POST /auth/refresh`, not one per request. **[server: done]** rotation with family reuse-detection is already enforced — a replayed refresh token outside the 10 s grace window revokes the whole family, so a buggy client that refreshes twice in parallel will log the user out. Build the mutex.
- [ ] Logout calls `POST /auth/logout`, then clears SecureStore, query cache, and disk cache. **[server: done]** revokes every refresh family and deactivates device tokens.
- [ ] Role gating is a UX convenience only. Never assume the client's route guard is a control: every privileged call is authorized server-side by role.
- [ ] Biometric unlock (if built) is bound to a SecureStore item retrieved under `requireAuthentication`, not a boolean the app checks after `LocalAuthentication.authenticateAsync()` returns true. The boolean pattern is bypassable on a rooted device.
- [ ] Non-biometric fallback always available.
- [ ] Account deletion flow: profile → delete → typed `DELETE` confirmation → `DELETE /api/v1/users/me` with `{ "confirm": "DELETE" }` → local wipe → back to the login screen. Handle `409` (orders in flight) with the server's message.
- [ ] No passwords exist in this product, so no rotation policy, no composition rules. Do not add either.

---

## 7. Security testing, hardening, and update path

- [ ] `pnpm audit` in CI, failing the build on **high** and above. Current baseline: 4 findings (1 high `brace-expansion` via eslint — dev-only; 3 moderate incl. `uuid` via `firebase-admin`, `node-cron`). Re-run and record per release.
- [ ] Every third-party SDK justified in a one-line table: what it does, what it collects, why it ships. An SDK whose data collection nobody can account for does not ship.
- [ ] R8/ProGuard enabled for Android release with a checked-in rules file; Hermes bytecode for both platforms; source maps uploaded to Sentry and **not** shipped in the bundle.
- [ ] Release signing keys in EAS-managed credentials, never in the repo. Repo history is currently clean of keys and `.env` — keep it that way (`.secrets/`, `.env*` are gitignored).
- [ ] Root/jailbreak detection: **not** shipping in v1. Documented decision — the app holds no offline value and the server authorizes everything; detection is bypassable and costs support tickets on rooted-but-legitimate devices. Revisit if fraud appears.
- [ ] Update path exists and is wired on cold start. **[server: done]** `GET /api/v1/app-config` returns `updateRequired`, `updateAvailable`, `maintenanceMode`, `disabledFeatures`, `storeUrl`. The app must: block on `updateRequired`, nudge on `updateAvailable`, show a maintenance screen on `maintenanceMode`, and hide any feature named in `disabledFeatures`.
- [ ] `expo-updates` configured for JS-only hotfixes, with the caveat documented: a native-module change still needs a store release. Version floor via `MIN_APP_VERSION_*` is the only mechanism that can retire a broken build the same day.
- [ ] Kill-switch drill run once before launch: set `DISABLED_FEATURES=wallet_topup`, confirm the app hides it within one cold start, then unset.

---

## 8. Startup, runtime, and rendering performance

Numbers are targets on a low-end Android 8 device, not a flagship. Record actuals per release.

- [ ] Cold start to first meaningful paint ≤2.5 s; warm ≤1.2 s; hot ≤0.4 s.
- [ ] Nothing blocks first render: Sentry, analytics, and notification registration initialize **after** the first frame. Serial SDK init at launch is the usual cause of a slow cold start.
- [ ] `app-config` check does not block first paint — render, then gate.
- [ ] Catalog list uses `FlashList` (or `FlatList` with `windowSize`/`removeClippedSubviews` tuned), stable `keyExtractor`, memoized rows. 60 fps scroll with 500+ products; no blank cells on fast scroll.
- [ ] Images downsampled to display size via Cloudinary transforms + `expo-image` with a bounded memory/disk cache. Never decode a full-resolution asset into a 96 px thumbnail.
- [ ] Pagination on catalog, search, orders, and wallet transactions — the API already paginates (`page`, `limit≤50`).
- [ ] Skeletons on every first load; no spinner-only screens.
- [ ] No memory growth across 20 navigation cycles through catalog → product → cart; listeners and subscriptions cleaned up in effect teardown.
- [ ] Release bundle: Hermes, `expo-asset` pruning, unused deps removed. Android app bundle ≤30 MB download; document the number.

---

## 9. Battery, network, and resource efficiency

- [ ] Agent location tracking is the one real battery risk. Use `expo-location` background updates with `distanceInterval` throttling and the OS significant-change API where possible; run only while an order is `OUT_FOR_DELIVERY`, and stop on delivery, cancel, or app logout. Never a fixed-interval timer.
- [ ] Buyer app requests location **in context** (at address entry), not at launch, and works with it denied (manual pincode).
- [ ] Order tracking polls at 15 s **only while the tracking screen is foregrounded**; stop on blur, resume on focus. Prefer push for status changes; polling is for the live map only.
- [ ] Retries use exponential backoff with jitter and a cap. No tight retry loops on failure.
- [ ] Requests coalesced through one query client with sane `staleTime`; catalog and categories cached, not refetched per screen focus.
- [ ] Respect Low Power Mode / Battery Saver and Data Saver: skip prefetch, drop image quality, lengthen poll interval.
- [ ] Manifest permissions are exactly the ones used — no leftovers. Each requested at point of need with the rationale string from §0.
- [ ] Background work (if any) via `expo-task-manager` / WorkManager constraints, deferred to Wi-Fi and charging where it is not user-visible.

---

## 10. Offline behaviour, resilience, error handling

The target market has intermittent 3G/4G. Treat "no network" as a normal state, not an exception.

- [ ] Connectivity state observed (`expo-network` / `@react-native-community/netinfo`) and surfaced as a persistent banner, not a modal that blocks the screen.
- [ ] Read path: last-fetched catalog, categories, order list, and order detail render from cache when offline, with an "updated X ago" marker. Cache the list, not the personal data (§5).
- [ ] Write path: never optimistic-commit money. Cart mutations may be optimistic with rollback; **checkout, wallet top-up, and delivery confirmation must not be queued silently** — either the request completes or the user is told it did not.
- [ ] Every retryable write carries an `Idempotency-Key` (UUID v4 generated once per user intent, reused across retries, discarded on success). **[server: done]** `POST /orders` replays the original order for a repeated key instead of double-charging.
- [ ] Request timeouts set explicitly (connect ~10 s, total ~30 s). No request may hang forever on a stalled socket — the default is no timeout.
- [ ] One error taxonomy mapped to one message each: network unreachable, timeout, `401` (refresh then retry once), `403` (wrong role — do not offer retry), `409` (state conflict — show the server message), `422`/`400` (field errors), `429` (back off, show wait), `5xx` (retry with backoff), version gate. No raw status codes or JSON shown to a user.
- [ ] Server error messages are surfaced verbatim where the server writes them for humans (`409` on account deletion, order-state conflicts, insufficient stock, insufficient wallet balance) instead of being replaced with a generic string.
- [ ] Error boundary at the route group level: a render crash shows a recoverable screen with "try again" and a report action, not a white screen.
- [ ] Global crash handler wired to Sentry with a release + dist tag matching the build; JS and native crashes both captured; source maps uploaded (§7).
- [ ] Zero unhandled promise rejections and zero `console.error` in a clean run through the primary flows.
- [ ] Payment interruption cases explicitly handled: app backgrounded during Razorpay checkout, killed after payment but before the webhook lands, network lost on return. The order status from the server is the truth — never the client's local guess. Poll or refetch order state on return from the payment sheet.
- [ ] Pull-to-refresh on every list; a failed refresh keeps the stale data visible rather than emptying the screen.

---

## 11. Notifications and engagement

- [ ] Push permission requested **in context** (after the first order is placed — "know when your order ships"), never on first launch. iOS grants once; a cold prompt is a permanent no.
- [ ] Device token registered on login and on token refresh, and de-registered on logout. **[server: done]** `POST /api/v1/users/me/device-tokens`; `POST /auth/logout` deactivates every token for the user.
- [ ] Notification preferences respected and editable in-app (`orderUpdatesOptIn`, `promoOptIn`). **[server: done]** the API stores both; transactional order updates and promos must be separately toggleable, and a promo must never be sent to a user who only opted into order updates.
- [ ] Notification payload carries a deep link; tapping opens the specific order, not the home tab. Handle cold start, background, and foreground delivery — all three paths, tested.
- [ ] Foreground notifications shown as in-app banners, not silently dropped.
- [ ] Android notification channels declared (Order updates, Delivery, Promotions) so users can mute promos without losing order status. Android 13+ `POST_NOTIFICATIONS` runtime permission handled.
- [ ] No PII in the notification body beyond what is safe on a lock screen — order id and status, not address or phone.
- [ ] Badge/unread counts, if used, cleared on read. A count that never clears trains users to ignore it.
- [ ] No dark patterns: no fake-urgency copy, no re-prompting for a permission the user denied, no notification that cannot be turned off from inside the app.

---

## 12. Analytics, instrumentation, release operations

- [ ] Event taxonomy defined **before** instrumenting: `app_open`, `login_success`, `catalog_view`, `search`, `product_view`, `add_to_cart`, `checkout_start`, `order_placed`, `payment_result`, `order_tracked`, `reorder`. Named consistently, documented in one file.
- [ ] Every event property audited for PII (§5). User identified by the server user id only — never phone, email, or shop name.
- [ ] Analytics consent honoured where required, and analytics initialization deferred past first frame (§8).
- [ ] Crash-free session rate tracked per release, with a threshold that triggers a rollback decision (≥99.5% target; below 99% is a release incident).
- [ ] Release process written down: EAS build profiles (`development`, `preview`, `production`), version + build number bumped automatically, changelog per release, staged Play rollout (10% → 50% → 100%) with crash-rate gates at each step.
- [ ] `MIN_APP_VERSION_*` raised as part of the release checklist once a build is confirmed healthy — the floor is what retires the previous broken build.
- [ ] Rollback runbook exists and names the three levers, in order of speed: `DISABLED_FEATURES` (minutes), `MAINTENANCE_MODE` (minutes), `expo-updates` JS revert (~an hour), store rollback / halt staged rollout (hours to days). Drill the first two before launch (§7).
- [ ] Log/telemetry retention and access documented; nobody needs raw event logs in perpetuity.
- [ ] Store listing assets ready: screenshots at every required size for both stores, description, keywords, support URL, marketing URL, privacy policy URL. Screenshots taken from the real build, not a mockup.

---

## 13. Backend contract the app must honour

Already live in `apps/api` and verified by `src/test/mob-readiness.test.ts`. The app has no discretion here — these are the shapes it must speak.

| Call                                                         | Contract                                                                                                                                                                                                                                                                                                                                                   | Client obligation                                                                                                                                                                                                                            |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/v1/app-config?platform=ios\|android&version=x.y.z` | Unauthenticated. Returns `minSupportedVersion`, `latestVersion`, `storeUrl`, `updateRequired`, `updateAvailable`, `maintenanceMode`, `disabledFeatures[]`. Unknown platform → `400`.                                                                                                                                                                       | Call on every cold start and on resume-from-background after a long gap. Block on `updateRequired`, nudge on `updateAvailable`, maintenance screen on `maintenanceMode`, hide features in `disabledFeatures`. Never block first paint on it. |
| `POST /api/v1/orders`                                        | Honours `Idempotency-Key` (trimmed, first 128 chars). Same key + same buyer → the original order, no second charge and no second inventory reservation. Keys are buyer-scoped; another buyer's key is rejected, not returned. No key → a real new order every time.                                                                                        | Generate one UUID per checkout intent, reuse it for every retry of that intent, discard on success. Do not reuse across checkouts.                                                                                                           |
| `DELETE /api/v1/users/me`                                    | Body `{ "confirm": "DELETE" }`. `400` without it. `403` for ADMIN. `409` while an order is in a non-terminal state. `200 { deleted: true, alreadyDeleted }` — retry-safe. Anonymises PII in place (phone → `deleted:<id>`, email/`firebaseUid` nulled, `deletedAt` set), deletes cart + device tokens, revokes refresh families, keeps Order/Payment rows. | Reachable in ≤3 taps from Profile, typed `DELETE` confirmation, then wipe SecureStore + query cache + disk cache and return to login. Show the server's `409` message; do not retry past it.                                                 |
| `POST /api/v1/auth/refresh`                                  | Rotating refresh tokens with family reuse-detection and a 10 s grace window. A replayed token outside the grace window revokes the whole family.                                                                                                                                                                                                           | Single-flight mutex: concurrent `401`s trigger exactly one refresh. Parallel refreshes will log the user out.                                                                                                                                |
| `POST /api/v1/auth/logout`                                   | Revokes every refresh family and deactivates every device token for the user.                                                                                                                                                                                                                                                                              | Call it before clearing local state, and tolerate failure (clear locally anyway).                                                                                                                                                            |
| `POST /api/v1/users/me/device-tokens`                        | Registers an FCM token for the user.                                                                                                                                                                                                                                                                                                                       | Register after login and on every token refresh; the token is a send-credential — never log it.                                                                                                                                              |
| Rate limits                                                  | Global 600 req / 15 min per IP; `/auth/*` 40 / 15 min. `429` with standard headers.                                                                                                                                                                                                                                                                        | Back off on `429` using the response headers. Do not retry-storm — carrier NAT means many users share one IP.                                                                                                                                |
| Pagination                                                   | `page`, `limit` (max 50) on catalog, search, orders, wallet transactions.                                                                                                                                                                                                                                                                                  | Paginate everywhere; never request an unbounded list.                                                                                                                                                                                        |
| Errors                                                       | `{ error: { message, ... } }`. Messages on `409`/`400` are written for humans.                                                                                                                                                                                                                                                                             | Surface them; do not replace with a generic string.                                                                                                                                                                                          |

---

## 14. Known backend gaps that block or limit MOB-1

Server-side constraints the app must build around. **[server: done]** items are live; the rest are hard dependencies for the feature named.

- **Wallet top-up now works — verify it before enabling.** [server: done] `POST /wallet/topup/razorpay-order` writes a `PENDING` `Payment` with `kind = WALLET_TOPUP`, and the Razorpay capture webhook credits the balance and writes one `CREDIT` ledger row inside one transaction. Duplicate or concurrent captures are no-ops. The app still must not treat a successful payment sheet as a credited balance — refetch `GET /wallet` after returning from checkout, because the credit lands on the webhook, not on the client's return.
- **Refunds are stubbed.** Cancellation returns funds only in the wallet ledger, not to the original payment instrument. The cancel flow must say "refunded to your Storefiller wallet" and mean it — do not write "refunded to your bank" in the app copy.
- **No crash/error reporting on the API.** Sentry is wired on neither side yet. A client-side crash rate is only half the picture; add the server DSN before staged rollout so a `5xx` spike is attributable.
- **Email OTP is the only reviewer-usable login path.** Phone OTP requires Indian SMS delivery. Confirm the email-OTP path works end to end for the reviewer account before submission (§0), or provision a fixed test OTP.
- **Agent location ingestion endpoint is thin.** Delivery tracking exists (`B2-07`) but there is no rate limit or accuracy filter on position writes; a chatty client will be the first thing to hit the global limiter. Coordinate the client's `distanceInterval` (§9) with whatever the server accepts.

---

## Sign-off

This spec is the acceptance criteria for MOB-1. The post-build audit re-runs §1–§12 against the same twelve areas and scores each 0–5; §0 and §13 are pass/fail. An unchecked box is a finding, not a preference.
