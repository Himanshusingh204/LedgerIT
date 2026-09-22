# Tasks — execution tracker for MASTER-PLAN.md

> This file breaks `MASTER-PLAN.md`'s roadmap into concrete, session-sized phases and tracks which
> ones are done. Read `MASTER-PLAN.md` first for the *why* behind each item — this file is the *what
> and in what order*. Mark a phase `[x]` when it's done, typechecked/linted/tested/built clean, and
> (where relevant) verified visually. Update this file as work lands, the same way `CLAUDE.md` §3
> tracks the original ten build phases.

**How this list was built:** every phase below maps to a specific tier/item in `MASTER-PLAN.md §6`.
Phases that need an external account or a decision only you can make are marked **(blocked on you)**
and pulled out of the normal order so they don't stall everything behind them.

---

## Done

- [x] **Phase 1 — Git repository.** `git init`, added `.claude/`, `.claudeskills/`, and the
  redundant `expense-tracker-master-plan.zip` (fully extracted into `docs/` already — see
  `.gitignore`'s comment) to `.gitignore`, staged the 117 real project files, made one clean initial
  commit (`f091dd2`). Working tree is clean. This was `MASTER-PLAN.md` Tier 0 item 1 — the single
  highest-priority item in the whole plan, since every later phase (CI, PRs, safe rollback) depends
  on it existing. **Nothing pushed to a remote** — no GitHub/GitLab repo exists yet; that's Phase 2
  below, deliberately deferred until you add a GitHub account/repo.

- [x] **Phase 3 — Security headers + ownership-check comments + Node version pin.** Static headers
  (`Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`) added via `next.config.ts`'s `headers()`. Content-Security-Policy needed a
  fresh nonce per request (so Next's own hydration/RSC inline scripts stay allowed), so it's built
  and set in `lib/supabase/middleware.ts` instead, following Next.js's documented nonce pattern —
  `script-src` uses `'nonce-<random>' 'strict-dynamic'`, `connect-src` is scoped to `'self'` plus
  whatever `NEXT_PUBLIC_SUPABASE_URL` is currently set to (works for both the local stack and a
  future hosted project without code changes), and `upgrade-insecure-requests` is only added in
  production (it would otherwise silently break every browser call to the local Supabase stack's
  plain-HTTP `127.0.0.1` API). Added a one-line ownership-check comment at each of the four actions
  that rely solely on RLS (`updateTransactionAction`, `deleteTransactionAction`,
  `archiveAccountAction`, `deleteBudgetAction`). Added `"engines": {"node": ">=20.9.0"}` to
  `package.json`. **Verified, not just written:** confirmed via `curl` that all five static headers
  and the CSP appear on a real response; confirmed via a headless-browser console check that
  hydration still works (the marketing carousel's buttons render and mount) and there are zero CSP
  violations or blocked-script errors — one real one was caught and fixed this way (React's dev-mode
  `eval()` for debugging was getting blocked; fixed by allowing `'unsafe-eval'` outside production
  only, since React itself never uses `eval()` in a production build). `tsc --noEmit`, `eslint`,
  `vitest run` (14/14), and `next build` all pass clean. Commit: see git log.

---

## Next up — review before I continue

Everything below is unstarted. Ordered the way `MASTER-PLAN.md §9` recommends, with the
account-blocked items pulled to their own section so they don't block the rest.

### Phase 2 — Push to a remote (blocked on you)

Needs a decision + an account action before I can do anything here:
- Do you want this on GitHub or GitLab, under which account/org?
- Repo name — keep "expense-tracker" or use the product name "Clearledger"?
- Public or private?

Once you tell me (or create the empty remote yourself and paste the URL), I can add the remote and
push in under a minute — the commit is already sitting there ready to go.

- [x] **Phase 4 — Running account balances (2026-09-15, "do not pause" continuation).** From
  `MASTER-PLAN.md` Tier 2 item 1 — the single most visible "looks like a bug" gap. You weren't asked
  the open transfer-direction question in real time (told me not to pause) — went with the plan's
  own stated fallback: `calculateAccountBalance` excludes transfers entirely, same precedent as
  `calculateNetChange`/`calculateDailyTrend`, documented inline with the same reasoning (the
  `transactions` table has no destination account or in/out direction for a `transfer` row, so one
  can't be resolved without a schema change). **Revisit this if you actually want transfers to move
  the balance** — it'd need a `direction` column or a destination-account column added via a new
  migration, not just a code change.
  - `calculateAccountBalance(openingBalance, transactions)` in `lib/finance/calculations.ts`, unit
    tested (4 new tests — sums correctly, excludes transfers, no-transactions passthrough, allows
    going negative).
  - `listAccountsWithBalances` in `lib/data/accounts.ts` — one query for `{account_id, type,
    amount}` across the user's *entire* transaction history (not just whatever range the dashboard
    is showing), reduced per-account through the pure function above.
  - Wired into `lib/data/dashboard.ts`'s snapshot and `components/dashboard/accounts-summary.tsx`.
  - `components/settings/account-list.tsx` relabeled to "Opening balance: $X" — that page still
    shows the static setup value on purpose (cheaper than running the full-history query on a page
    that doesn't need it), now honestly labeled instead of looking like a live balance.
  - Verified live, not just via unit tests: on the test account (`$500` opening, a `$64.50` and a
    `$28` expense already posted), the dashboard's Accounts card now shows `$407.50` instead of the
    static `$500`; Settings still correctly shows "Opening balance: $500.00" on the same account.
    `tsc`/`eslint`/`vitest` (18/18)/`next build` all clean.

- [x] **Phase 5 — SEO basics.** `app/sitemap.ts` (marketing/sign-up/sign-in only — deliberately
  excludes every authenticated route and `/admin`, which have no SEO value and shouldn't be
  advertised), `app/robots.ts` (same exclusions via `disallow`, points at the sitemap), and
  `app/opengraph-image.tsx` via `next/og`'s `ImageResponse` (tried `runtime = "edge"` first per the
  usual examples — Next 16 flagged it as deprecated and it disables static generation for the
  route, so switched to `runtime = "nodejs"`, which builds it as a static `○` route instead).
  Verified live: `curl`'d `/robots.txt` and `/sitemap.xml`, fetched `/opengraph-image` and visually
  confirmed the rendered PNG. `tsc`/`eslint`/`vitest` (14/14)/`next build` all clean.

- [x] **Phase 6 — CI workflow file (2026-09-15, "do not pause" continuation).** From
  `MASTER-PLAN.md` Tier 5 item 1. `.github/workflows/ci.yml` runs on every push to `main` and every
  PR: `npm ci` → typecheck → lint → unit tests → build, on Node 20.9 (matching the `engines` pin
  from Phase 3). The build step gets dummy `NEXT_PUBLIC_SUPABASE_*` env vars so it doesn't fail on
  missing config — safe because no route in this app talks to Supabase *during* `next build` itself
  (every Supabase-touching route is dynamically rendered, not statically prerendered, especially
  after the Phase 16 CSP fix pushed even more routes to dynamic). **Still can't actually run** —
  GitHub Actions needs a GitHub remote (Phase 2), which doesn't exist yet, so this is unverified
  until then; that's expected, not a gap in this pass.

- [x] **Phase 7 — User category management (2026-09-15, "do not pause" continuation).** From
  `MASTER-PLAN.md` Tier 2 item 2 — the biggest of the near-term feature gaps. `lib/data/categories.ts`
  gained `createCategory`/`updateCategory`/`archiveCategory` (slugifies the name for the
  `(user_id, slug)` unique constraint from `0001_init.sql`); `lib/validations/category.ts`;
  `lib/actions/categories.ts`, same shape as `lib/actions/accounts.ts` — ownership enforced by RLS,
  not an app-side check (a system category has `user_id null`, which can never match
  `auth.uid() = user_id`, so rename/archive on one is rejected by Postgres itself, not by any
  guard in this code). `components/settings/{category-list,add-category-form}.tsx`: system
  categories render read-only ("· Default", no action buttons); user-created ones get inline
  rename (click the pencil, edit, Enter to save) and archive. Wired into
  `app/(app)/settings/page.tsx` as a third section alongside Profile and Accounts.
  Verified the full CRUD cycle live, not just that it builds: created "Pet Care", renamed it to
  "Pet Expenses" inline, archived it, confirmed via the DOM that the name was actually gone after
  each step — not just that no error was thrown. `tsc`/`eslint`/`vitest` (60/60)/`next build` all
  clean.

- [x] **Phase 8 — Password reset (2026-09-15, "do not pause" continuation).** From
  `MASTER-PLAN.md` Tier 2 item 3. `app/(auth)/forgot-password/page.tsx` +
  `components/auth/forgot-password-form.tsx` (`resetPasswordForEmail`, with an intentionally
  non-committal "if an account exists, we sent a link" message — doesn't reveal whether the email
  is actually registered), `app/(auth)/update-password/page.tsx` +
  `components/auth/update-password-form.tsx` (`updateUser({ password })`, reuses the existing
  `/callback` route's `redirectTo` support with no changes needed there), a "Forgot password?" link
  added next to the Password label on the sign-in form, two new Zod schemas in
  `lib/validations/auth.ts`.
  - **Found and fixed a real, pre-existing config bug along the way**: `.env.local`'s
    `NEXT_PUBLIC_APP_URL` uses `localhost`, but `supabase/config.toml`'s `additional_redirect_urls`
    only allow-listed `127.0.0.1` origins. The very first live test of this feature reproduced it —
    the reset email's link had its `redirect_to` silently truncated to bare `site_url` (GoTrue drops
    an unrecognized redirect target rather than erroring), so the `/callback?redirectTo=...` path
    and query never survived. Fixed by adding `http://localhost:3000/**` (and the `127.0.0.1`
    http/https variants) to the allow-list; required a `supabase stop && supabase start` to take
    effect (config.toml is read at container startup, not per-request) — data was preserved
    (`supabase stop` backs up by default). This would have silently broken *any* redirect-based auth
    email flow whenever the browser's origin was `localhost` rather than `127.0.0.1`, not just this
    one.
  - Verified genuinely end-to-end, not just that the pages render: wrote a one-off Playwright script
    (not the line-based driver — PKCE needs one continuous browser context, see `SKILL.md`'s
    Gotchas) that requested a reset, pulled the actual email from Mailpit's API, followed the real
    recovery link, set a new password, landed on the dashboard, then opened a **second**, fresh
    browser session and signed in with the new password to confirm it actually took effect
    server-side. All of it passed. `tsc`/`eslint`/`vitest` (18/18) clean throughout.

- [x] **Phase 9 — Testing gaps (2026-09-15, "do not pause" continuation).** From
  `MASTER-PLAN.md` Tier 6. `tests/unit/validations.test.ts`: table-driven `it.each` coverage for
  all 6 `lib/validations/*.ts` schemas (39 cases) — first attempt used made-up UUIDs like
  `"11111111-…"` for fixtures and 3 tests failed, because Zod's `.uuid()` validates real RFC 4122
  version/variant nibbles, not just UUID *shape*; fixed with a properly-formatted example UUID.
  `tests/integration/rls.test.ts` (the directory existed but was empty — genuinely new file, not
  just "created the folder"): 3 real tests against the **live local Supabase stack**, not mocks —
  cross-user account isolation, spoofed-`user_id` insert rejection, and system-category visibility.
  Hit a real gotcha writing it: two Supabase client instances in the same test file share one
  jsdom `window.localStorage`, so by default the second `signUp()` silently clobbers the first
  client's persisted session — fixed with `persistSession: false, autoRefreshToken: false` so each
  client relies only on its own in-memory session. Also had to fix `vitest.config.ts` itself: unlike
  Next.js, Vite/Vitest never auto-load `.env.local`, so these tests would always silently skip
  (`describe.skipIf(!hasLiveSupabase)`) even with the local stack running — added
  `env: loadEnv("", process.cwd(), "")` so they actually run locally, while still verified to skip
  cleanly (not fail) when the env vars are absent, which is what keeps CI safe with no Supabase
  instance available. All 60 tests (18 finance + 39 validation + 3 integration) pass;
  `tsc`/`eslint`/`next build` all clean throughout.

- [x] **Phase 10 — Receipt upload (2026-09-15, "do not pause" continuation — the last item from
  the original `MASTER-PLAN.md` roadmap).** From Tier 2 item 4, the largest single remaining
  feature.
  - `supabase/migrations/0005_receipts_storage.sql`: a **private** `receipts` bucket
    (`public = false`, per `docs/02` §7's explicit "do not make receipt storage public by default")
    with bucket-level `file_size_limit` (5 MiB) and `allowed_mime_types` (JPEG/PNG/WEBP/PDF) as the
    real enforcement, plus RLS on `storage.objects` restricting read/insert/delete to the object's
    own `<user_id>/...` folder prefix (the standard Supabase per-user-folder storage RLS pattern).
  - `lib/data/receipts.ts`: `uploadReceipt` (client-side-controllable pre-check before the upload,
    for a fast clear error instead of a generic storage failure), `getReceiptSignedUrl` (60s TTL,
    generated fresh on demand — "never stored or reused" is called out at the one call site that
    matters, `components/transactions/transaction-list.tsx`), `deleteReceipt` (written, not wired
    to anything yet — no "remove receipt" UI this pass).
  - `components/transactions/transaction-form.tsx`: a file input with client-side MIME/size
    validation (blocks submit on an obviously-bad file, mirrors but doesn't replace the
    server-side/bucket-level checks); `lib/actions/transactions.ts`'s create/update actions upload
    before the DB write and store the storage **path** in `receipt_url` (never a URL — matches the
    column's existing name being slightly misleading, which was already true before this phase).
  - `transaction-list.tsx`: a paperclip icon appears only on rows with a receipt, generates a fresh
    signed URL client-side on click and opens it in a new tab — desktop table and mobile cards both.
  - Verified genuinely end-to-end against the live local stack, not just that it builds: uploaded a
    real PNG through the actual form, confirmed the paperclip icon appeared only on that one row,
    clicked it and fetched the resulting signed URL directly — got a real `200`, `image/png`, the
    exact 68 bytes of the source file back. Then verified the RLS boundary itself, not just the UI
    gate: attempted to sign a URL for that same object path as a **different** real authenticated
    user via a raw REST call — `404 NoSuchKey`, not a 403, meaning the row is genuinely invisible to
    them, not merely access-denied.
  - Added a `set-files` command to the `run-clearledger` skill's driver (`driver.mjs`) to support
    this — it had no file-upload capability before. Hit one driver-only snag doing this: a file path
    containing a space broke the driver's naive space-delimited argument parsing (same class of
    issue as the quoted-selector gotcha already in `SKILL.md`) — worked around by using a
    space-free temp path rather than fixing the parser itself, which is now a known gap worth
    fixing if a future session needs to upload from a path that can't avoid spaces.
  - `tsc`/`eslint`/`vitest` (60/60)/`next build`/Playwright e2e (3/3 on chromium) all clean.

- [x] **Phase 11 — E2E expansion + browser-driven RLS check (2026-09-15, "do not pause"
  continuation).** From `MASTER-PLAN.md` Tier 6, items 3–4. Expanded `e2e/app-flow.spec.ts`: budget
  edit + remove, account archive, a real CSV-content assertion (downloads the exported file, reads
  the stream, asserts the filtered merchant is present, the unfiltered one is absent, and no raw
  UUIDs leak into the file — not just that a file downloaded), and a new "failed sign-in" test.
  New `e2e/cross-user-isolation.spec.ts`: two real signed-in browser contexts, user A creates an
  account + a transaction, user B is asserted to never see either — on the dashboard, in settings,
  in the transaction list (including a search that should return zero results), or, critically, **in
  B's own "add transaction" dialog's account dropdown** (a dropdown populated from the wrong query
  would leak A's account's existence even if the row itself stayed hidden elsewhere) — going further
  than the original build's Phase 10, which only checked isolation via raw REST calls, never through
  the actual app UI.
  - Both new tests **failed on first run, for two different test-authoring bugs, not app bugs**: (1)
    the "sign up" step everywhere still expected the old "check your email" screen my earlier
    same-day sign-up fix (see the file-structure/captcha entry above) had deliberately removed for
    this local stack — updated every `signUp` helper to expect a direct `/dashboard` redirect
    instead; (2) the archive-account step didn't account for `account-list.tsx`'s `window.confirm()`
    — Playwright auto-*dismisses* browser dialogs unless a handler explicitly accepts them, so the
    archive silently never fired; fixed with `page.once("dialog", (d) => d.accept())`. Separately,
    the isolation spec's dropdown check initially hung because User B had no account of her own yet
    — `add-transaction-button.tsx` correctly disables "Add transaction" with zero accounts, so the
    dialog was never reachable; fixed by giving B an account first, which is also more realistic
    (the check is "B's own dropdown doesn't leak A's account," not "B can't even open the dialog").
  - All 3 spec files × 2 projects (chromium + mobile) = 6 runs, all green, run against the live
    local Supabase stack per `CLAUDE.md` §9.

- [x] **Phase 12a — Cap `listTransactionsInRange` (2026-09-15, "do not pause" continuation).**
  From `MASTER-PLAN.md` Tier 7. It now fetches at most 5,001 rows (`.limit(5000 + 1)`, the `+1` is
  just to detect overflow without a second `count` query) and returns `{transactions, isTruncated}`
  instead of a bare array — every one of its 3 call sites (`lib/data/dashboard.ts`,
  `app/(app)/analytics/page.tsx`, `app/(app)/budgets/page.tsx`) now surfaces a "this period has more
  transactions than can be shown" banner when `isTruncated` is true, instead of silently showing
  partial totals with no indication. **Deliberately did NOT apply the same cap to
  `listAccountsWithBalances`'s full-history query** — truncating a date-ranged query yields an
  honest "partial totals for this period," but truncating a balance calculation would produce a
  wrong number with no way to flag it as partial; left it uncapped with an inline comment on why,
  and what the real fix would be if it ever matters (a Postgres aggregate/RPC, not app-side
  truncation). `tsc`/`eslint`/`vitest` (18/18)/`next build` all clean; verified live that normal
  usage (well under the cap) shows no false-positive banner.
- [x] **Phase 12b — Accessible chart summaries (2026-09-15, "do not pause" continuation).** A
  `sr-only` `<table>` (proper `<caption>`, `scope="col"`/`scope="row"` headers) with the same data
  added alongside `components/dashboard/category-spend-chart.tsx` and
  `components/analytics/trend-chart.tsx` — the two components in this app built on Recharts SVG,
  which has no accessible text equivalent on its own; the chart `<div>` itself is now `aria-hidden`
  since the hidden table is the real accessible content and the chart would otherwise be announced
  twice. `components/analytics/top-merchants.tsx` needed no changes — it was already a plain
  accessible `<ul>`, never an SVG chart. Verified the tables are actually in the DOM (queried
  `table.sr-only` via the browser) and confirmed no visible layout changed.

---

## Phases 13–18 — redesign + admin + security + SEO request (2026-09-15)

Added from a direct user request (not from `MASTER-PLAN.md`): real Unsplash imagery, a minimalist
responsive redesign, an admin role/dashboard, transport-level security hardening, SEO/Lighthouse/
Search Console/analytics, and a comments feature. Scoped via three clarifying questions before
starting:
- **Admin** = a real new admin role + dashboard (not just hardening the existing user auth).
- **Encryption** = transport/infra only — enforce HTTPS, secure cookies, lean on Supabase's
  built-in at-rest encryption. **Not** app-level field encryption of transaction data (that would
  break search/sort/filter on those fields for comparatively little real benefit on a local/small
  hosted DB — revisit only if asked).
- **Execution** = phased, checking in between major pieces (this section), not one uninterrupted
  pass.

- [x] **Phase 13 — Real imagery + trim demo data.** `supabase/seed.sql` trimmed to 1 account / 1
  transaction / 1 budget. Sourced 4 new photos from `unsplash.com/s/photos/expense-tracker` for the
  redesign (Phase 14) — visually inspected all 4 before use and rejected 3 (one had a visible
  MacBook/Apple keyboard, one turned out to be an actual competitor utility bill with a Trustpilot
  badge, one was a CBD-product review clipboard with branded business cards); kept only
  `stacking-coins-savings.jpg`, `budget-planning-pen-calculator.jpg`,
  `notebook-with-pen-planning.jpg`. All logged in `public/images/credits.json`.

- [x] **Phase 14 — Landing page redesign ("full rebuild," per your answer).** New centered/minimal
  hero (was a two-column hero+mockup split) with real photography; the old product-mockup carousel
  moved into its own new `ProductShowcase` section below the hero instead of being deleted; new
  `Testimonials` section (deliberately **not** attributed to invented named people — Clearledger has
  no real users yet, so fabricating "customer" quotes with fake names would be misrepresenting them
  as genuine reviews; written as unattributed illustrative copy instead, swap in real testimonials
  once any exist); new visitor feedback form wired end-to-end (see Phase 18). Verified at desktop and
  390px mobile via the `run-clearledger` skill's driver — both clean, no overflow.

- [x] **Phase 15 — Admin role + dashboard.** Went with your answer (separate table, not a
  `profiles` column): `supabase/migrations/0003_admin.sql` adds `admin_users` + a
  `security definer` `is_admin(uuid)` Postgres function other policies and the app both call,
  instead of every policy re-deriving admin status. Real (non-route-group) `app/admin/` segment —
  URL is `/admin` — gated in `lib/supabase/middleware.ts` two ways: a redirect to `/dashboard` for
  signed-in non-admins (checked on **every** request via the RPC, not cached in the session, so a
  revoked admin loses access on their next navigation, not their next login), and RLS itself as the
  real boundary. Verified the RLS boundary directly, not just the redirect: pulled a real JWT for a
  freshly-signed-up non-admin user via the auth REST API and hit `/rest/v1/admin_users` and
  `/rest/v1/site_feedback` directly — both returned `[]`, confirming a client that bypasses the
  Next.js app entirely still can't read either table. Dashboard itself is intentionally scoped to
  feedback-only for this pass (not full users/accounts/transactions browsing) — flagged below as a
  deliberate cut, not an oversight.

- [x] **Phase 18 — Comments, all 3 interpretations (per your answer).** (1) Transaction notes
  already existed end-to-end (`transactions.note`, wired into the form) — no work needed, just
  confirmed. (2) Testimonials — see Phase 14. (3) Visitor feedback form:
  `supabase/migrations/0004_site_feedback.sql` (insert-open, admin-read-only via the same
  `is_admin()` function), `lib/validations/feedback.ts` + `lib/data/feedback.ts` +
  `lib/actions/feedback.ts`, `components/marketing/feedback-form.tsx` on the landing page, results
  readable at `/admin`. Verified live: submitted real feedback through the form, confirmed it
  appeared on `/admin` signed in as the granted-admin test user.

- [x] **File structure cleanup + `ARCHITECTURE.md` + sign-up/captcha fix (2026-09-15, same-day
  follow-up).** You flagged the file structure as hard to follow and asked for a reference doc.
  Found two real dead/empty directories left over from early scaffolding (`app/(marketing)/components/`
  — `CLAUDE.md` had pointed here, but the actual marketing components live in
  `components/marketing/` and always have; `lib/constants/`, unused) — removed both and corrected
  `CLAUDE.md`'s stale reference. Wrote `ARCHITECTURE.md` at the project root: directory map with the
  *why* behind each folder, a mutation-request sequence diagram, the auth/route-gating flowchart,
  and an ER diagram of the schema — Mermaid, renders natively on GitHub. Also found and fixed a real
  bug while investigating: `.gitignore`'s `.env*` pattern was silently excluding `.env.example` too,
  so the committed template CLAUDE.md's own Phase 0 claimed existed had in fact never once been
  committed — fixed with a `!.env.example` negation, now tracked. Separately, wired Cloudflare
  Turnstile as the CAPTCHA you asked for in place of relying on email confirmation for bot
  protection: `components/auth/sign-up-form.tsx` renders the widget and blocks submit until solved
  **only when** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set (inert no-op otherwise — sign-up keeps
  working exactly as before until you add a real key), CSP updated to allow its frame/connect, and
  `supabase/config.toml` has a ready-to-uncomment `[auth.captcha]` block with the exact 4 steps to
  turn it on. **Needs your action to actually activate** — moved to "Blocked on you" below. While in
  this form, also fixed the "always shows Check your email" gotcha the `run-clearledger` skill
  flagged: it now checks whether Supabase actually returned a session (confirmations are off on
  this local stack) and sends the user straight to `/dashboard` instead of a confirmation screen
  that would never resolve.

- [x] **Dashboard restyle from a pasted mockup (2026-09-15, same-day follow-up).** You pasted a
  Material-3-style enterprise expense-dashboard mockup and asked me to restyle the real dashboard to
  match it. Scoped first (mockup was for a very different product — multi-sig approvals, ERP sync,
  OCR invoice auditing, AI anomaly alerts, none of which fit a personal budget tracker): you
  confirmed strip the enterprise features, keep the visual *language* only. Before touching the
  category chart, loaded the `dataviz` skill (required before any chart work) — it explicitly
  recommends a bar chart with direct labels over a donut/pie for "part-to-whole" comparison (a pie
  is only endorsed for a 2-slice ratio, which this isn't), so `category-spend-chart.tsx` was left
  as-is rather than "restyled" into the donut the mockup used, which would have been a real
  regression dressed up as a redesign. What *did* ship, using the skill's own endorsed forms:
  - **Sparkline KPI tiles** (`components/dashboard/sparkline.tsx`, wired into `kpi-card.tsx`) — the
    skill's "stat tile = value + delta + sparkline" form. Fed by a new `dailyTrend` field on
    `getDashboardSnapshot` (reuses the already-unit-tested `calculateDailyTrend`, previously only
    used by Analytics).
  - **A real budget meter** (`components/dashboard/budget-meter.tsx`) — the skill's "single ratio
    against a limit → meter, same-ramp track" form, replacing nothing (the dashboard had no
    budget-at-a-glance tile before). Backed by a new `monthlyBudget` field on the same snapshot
    function, reusing the already-unit-tested `calculateBudgetProgress` and `listBudgetsForMonth`
    (previously only used by the Budgets page) — **always "this calendar month," independent of the
    range selector**, matching how the Budgets page itself defines a month, with an extra query only
    fired when the selected range isn't already "month."
  - Transaction list icon chips squared off (`rounded-full` → `var(--radius-control)`) and sized up
    to match the new denser card language.
  - KPI row went 3-column → 4-column to fit the new budget tile.
  Verified live with real data (not just empty states): added an account, two transactions on
  different days, and a budget, and confirmed the sparkline actually renders a trend line (not just
  that it doesn't crash), the meter recalculates its percentage/remaining live, and the layout holds
  at 390px mobile — all via the `run-clearledger` skill's driver. Found and fixed a real driver bug
  in the process, not an app bug: `click button[type="submit"]` on `/settings` was matching the
  header's persistent "Sign out" button (also `type="submit"`, earlier in the DOM) instead of the
  intended dialog button — looked exactly like a random session-drop bug until traced to the
  selector; `SKILL.md`'s Gotchas section now calls this out explicitly. `tsc`/`eslint`/`vitest`
  (14/14)/`next build` all clean throughout.

- [x] **Dashboard restyle, take 2 — actually apply the mockup's visual language (2026-09-16, same-day
  follow-up).** You flagged, correctly, that the first restyle pass only bolted on two new
  components (sparkline, budget meter) without ever adopting the mockup's actual look — its
  typography, numeral treatment, and card language. Recovered your original pasted mockup HTML from
  the session transcript (still had "Ledger — Expense Dashboard" in it) and read it closely this
  time instead of working from a paraphrased memory of it. What it actually uses: Hanken Grotesk for
  headings/body, JetBrains Mono for every numeric/currency figure, uppercase tracked-out
  `label-caps` captions above every stat, borderless `shadow-sm` cards, icon-avatar chips per
  merchant row, and uppercase pill badges for category tags — none of which had shipped. This pass:
  - `app/layout.tsx`: swapped `Inter` for `Hanken_Grotesk` + `JetBrains_Mono` (both via
    `next/font/google`, self-hosted at build time, no runtime fetch).
  - `app/globals.css`: new `--font-mono` token, `.label-caps` and `.text-num` utility classes, a
    `.card-surface` class (shadow instead of border, matching the mockup's card treatment), radius
    bumped slightly to match.
  - Applied consistently across `kpi-card.tsx`, `budget-meter.tsx`, `accounts-summary.tsx`,
    `recent-transactions.tsx`, `category-spend-chart.tsx`'s header, and both the desktop table and
    mobile card layouts of `transaction-list.tsx` (added a per-row icon avatar to the desktop table,
    which the mockup has and the old table didn't; category became an uppercase pill instead of
    plain text).
  - Still deliberately did **not** add the donut chart, multi-sig/ERP/OCR enterprise panels, or the
    fake "spending anomaly" AI alert — all struck from scope in the first pass per your own answer
    ("strip them, style only"), and nothing in this complaint reopened that scope.
  - Verified with real seeded data, not empty states: seeded a fresh test user directly in the local
    Postgres (one account, 6 transactions across 4 categories, matching per-category budgets) via
    `docker exec` into the `supabase_db` container — hit and fixed a real footgun along the way:
    two `INSERT` statements passed as one `-c` string to `psql` execute as a single implicit
    transaction, so an unrelated syntax error in the second statement (`budgets` uses `month_start`,
    not `month`) silently rolled back the first, already-successful insert too; re-ran each as its
    own standalone statement. Screenshotted the populated dashboard and transactions table at both
    1440px and 390px via the `run-clearledger` driver and a one-off Playwright script — confirms the
    mono numerals, uppercase labels, icon avatars, and pill badges all render correctly with real
    multi-category data, and that the layout holds at mobile width. One rendering artifact chased
    and ruled out as a real bug: the category bar chart showed a stuck-open Recharts tooltip in the
    first screenshot — caused by Playwright's headless virtual cursor landing on the chart's screen
    position left over from the sign-in button click a moment earlier, not an app bug; confirmed by
    moving the virtual mouse and re-capturing, which rendered cleanly. Deleted the seeded test user
    and its data afterward. `tsc`/`eslint`/`vitest` (60/60) all clean.

- [x] **Phase 16 — Security hardening (transport/infra), plus a critical CSP bug found along the
  way (2026-09-15, same-day follow-up).**
  - **Found and fixed a severe, previously-undetected production bug**: the app's own JavaScript
    was completely non-functional on every statically-prerendered route (`/`, `/sign-up`) in a real
    production build (`next build && next start`) — every single script tag, including Next's own
    framework chunks, was blocked by the CSP. Root cause: `lib/supabase/middleware.ts` generates a
    fresh nonce per request and puts it in the CSP header, but nothing in the app ever called
    `headers()` to read it — per Next's own documented CSP-nonce pattern, that call is what forces
    a route into dynamic (per-request) rendering, without which a static page's nonce is baked in
    at *build* time and can never match the *per-request* nonce in the CSP header, so literally
    every script fails the browser's nonce check. This was invisible until now because every prior
    verification pass in this project (Phase 3 originally, and every visual check since) used
    `next dev`, where this particular failure mode doesn't reproduce — only a real `next build` +
    `next start` exposes it. Caught it by actually running a Lighthouse pass against a production
    build (below) and noticing `errors-in-console` scored 0; confirmed via the `run-clearledger`
    skill's driver that clicking the landing page's carousel silently did nothing pre-fix and
    correctly advanced slides post-fix. Fix: `app/layout.tsx` now `await headers()`s (Next's
    documented trigger), and `app/(auth)/sign-up/page.tsx` threads the actual nonce value down as a
    prop to `SignUpForm` for its own explicit Turnstile `<Script>` tag. `/` and `/sign-up` are now
    `ƒ` (dynamic) instead of `○` (static) in the build output — a deliberate, necessary trade-off
    (a small performance cost for an app that actually works beats a fast app that doesn't).
  - Confirmed `upgrade-insecure-requests` + HSTS headers (already added in Phase 3) are present on
    responses — re-verified locally; a real deployed-URL check still needs Phase 2 (a remote) + a
    Vercel deploy to mean anything about real HTTPS behavior.
  - **Cookie flags**: `@supabase/ssr`'s own `DEFAULT_COOKIE_OPTIONS` never sets `secure` at all
    (verified by reading the library source) — confirmed via Playwright's `context.cookies()` API
    (not `document.cookie`, which can't see cookie flags) that the real cookie shipped with
    `secure: false` even in a production build. Fixed by passing `cookieOptions: { secure:
    NODE_ENV === "production" }` to all three Supabase client constructors
    (`lib/supabase/{client,server,middleware}.ts`). Re-verified after the fix: `false` in dev (as
    it must be — the cookie wouldn't work at all over plain `http://localhost` otherwise),
    `true` under `next start`. `httpOnly` stays `false` **on purpose** — the browser client reads
    this same cookie back via JS to rehydrate the session client-side, so `httpOnly: true` would
    break sign-in entirely; documented inline why this isn't "unfixed," just architecturally
    incompatible with using `@supabase/ssr`'s browser client at all.
  - Rate limiter still needs an Upstash Redis account — unchanged, see "Blocked on you" below.

### Phase 17 — SEO, Lighthouse, Search Console, analytics

**Lighthouse pass done** (installed via `npx lighthouse`, run against a real `next build`/`next
start` production server — a `next dev` server would've hidden the CSP bug above, so this had to be
production to mean anything). Landing page (`/`) scores, after the CSP fix and one more
accessibility fix below: Performance 93, Accessibility 97, Best Practices 100, SEO 100. (Before the
CSP fix: Performance 99 but Best Practices only 92, because the console was full of blocked-script
errors that a real browser — and a real user — would also hit; a misleadingly good score.)
Performance dropped 99→93 as the direct cost of the `/` route going static→dynamic — an accepted
trade-off, not a regression to chase back down (see above; PPR would claw some of it back but is
Next-canary-only, out of scope). Also fixed: the landing page carousel's slide-indicator dots
failed Lighthouse's `target-size` accessibility audit (visually 6×6px, below the 24×24px minimum
touch target) — `components/marketing/product-carousel.tsx` now wraps each visual dot in a 24×24px
button with the dot as a decorative inner `<span>`, so the touch target grew without changing how
it looks. Remaining Lighthouse findings (LCP timing, unused-JS, render-blocking-insight, etc.) are
either inherent to the static→dynamic trade-off above or genuinely need real hosting/CDN
infrastructure (Phase 2) to move further — not chased further this pass.

Still needed:
- Google Search Console verification needs a DNS TXT record or verification meta tag from your own
  Search Console account — **account-gated**, see "Blocked on you" below.
- Google Analytics needs a GA4 property + measurement ID from your own account — same.

- Builds on the already-planned Phase 5 (sitemap.ts/robots.ts/OG image) rather than duplicating it
  — do Phase 5 first, then layer this on top.
- Full Lighthouse pass (performance/accessibility/best-practices/SEO) with fixes for whatever it
  flags — "100%" is a target to chase, not a guarantee on every category (some, like performance,
  depend on hosting/CDN choices made in Phase 2's deploy, not just code).
- Google Search Console verification needs you to add a DNS TXT record or a verification meta tag
  from your own Search Console account — **account-gated**, moved to "Blocked on you" below.
- Google Analytics likewise needs a GA4 property + measurement ID from your account — same.

---

## Blocked on you — can't start without an account or a decision

Pulled out from the phase order above so they're easy to find. None of these are engineering work;
they're the account creation + decisions in `MASTER-PLAN.md §6` Tier 0, plus the Tier 4 items that
need a monitoring-service account:

- **Push to a remote** (Phase 2 above) — which host, which account, public/private.
- **A hosted Supabase project** — free tier is enough to start. Once it exists I can run both
  migrations against it and swap `.env.local`/Vercel env vars over from the local stack.
- **A Vercel project** connected to the repo, with the same env vars.
- **A domain** (or accept the default `*.vercel.app` one) — needed to finalize
  `NEXT_PUBLIC_APP_URL` and the Supabase Auth redirect allow-list.
- **Error monitoring** (Sentry or Vercel's own) — needs an account + a DSN/project id before I can
  wire it in. Until then, Phase 3's headers work doesn't include this; structured `console.error`
  logging in the data/action layers' catch blocks is a smaller, account-free stand-in worth doing
  in the meantime if you want it (not currently scheduled as its own phase — say the word and I'll
  fold it into Phase 3).
- **A rate limiter with real persistence** (Upstash Redis or similar) for the auth routes — a
  same-process in-memory limiter is possible without an account but is useless the moment the app
  runs on more than one serverless instance, so I've left it out of the phase list rather than ship
  something that looks like protection but isn't.
- **Cloudflare Turnstile activation** (the sign-up CAPTCHA from the file-structure/captcha pass
  above) — all the code is written and inert-safe, but doing nothing until you: create a free
  Turnstile site at <https://dash.cloudflare.com/?to=/:account/turnstile>, put the site key in
  `.env.local` as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, uncomment the `[auth.captcha]` block in
  `supabase/config.toml`, set `SUPABASE_AUTH_CAPTCHA_SECRET` in the shell `supabase start` runs in,
  and `npx supabase stop && npx supabase start`. Exact steps are also in a comment right above that
  config block.
- **Google Search Console + Google Analytics** (Phase 17) — need a Search Console verification
  token and a GA4 measurement ID from your own accounts before either can be wired in.

---

## Notes for tomorrow

- Everything in "Next up" is unstarted — no code has changed for Phases 2–12, only Phase 1 (git).
- Phase 4 (account balances) has one open question for you about how transfers should behave —
  see that section. Worth deciding before I start it, since it affects a schema/behavior choice.
- Phase 6 (CI file) is safe to do anytime, but is genuinely useless until Phase 2 (a remote) exists
  — consider doing them back-to-back.
- Everything else has no hidden dependencies beyond what's listed and can be done in any order —
  pick whichever phases matter most and tell me to start there.
