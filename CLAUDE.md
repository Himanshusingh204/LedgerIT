# Expense Tracker — Master Build Plan (read this first, every session)

This file is the single source of truth for **what to build, in what order, and what has already
shipped**. Update the checklists as work lands so a future session (or a fresh subagent) never has
to re-derive context. The detailed specs live in `docs/01..05-*.md` — this file is the executable
plan on top of them, plus the decisions that adjust those docs.

Next.js also generates `AGENTS.md` in this repo (framework-version notes, re-created by `next dev`).
That file is unrelated to this plan — do not merge the two or let a scaffold re-run overwrite this one.

## 0. Source docs (read in this order before touching code)

1. `README.md`
2. `docs/01-product-requirements.md` — scope, MVP features, states, success criteria
3. `docs/02-system-architecture.md` — stack, layering, data model, security, rendering strategy
4. `docs/03-ui-ux-design-system.md` — visual language, tokens, layout, accessibility
5. `docs/04-development-plan.md` — phased delivery, testing matrix, PR gate
6. `docs/05-ai-build-prompt.md` — non-negotiable engineering rules, build order
7. `docs/image-sources.md` — image licensing registry rules (must be kept up to date)
8. `public/design-reference/dashboard-reference.png` — visual reference ONLY, never clone pixel-for-pixel
9. `MASTER-PLAN.md` (project root) — senior-engineer architecture review, data-flow diagrams,
   gap analysis vs docs/01-05, and the prioritized roadmap from "all phases done locally" to
   "deployed and defensible." Read this before starting any new session of work — it tracks what's
   left, not just what shipped.

## 1. Decisions that override/clarify the docs

| Topic | Docs say | Decision for this build |
|---|---|---|
| Animation | Framer Motion | **`motion` npm package (motion.dev)** — the rebranded Framer Motion, same team/API family. Use `motion/react` imports. |
| Icons | Lucide | **`lucide-react`** — confirmed. |
| Images | Pexels/Unsplash, self-hosted | **Lorem Picsum** (Unsplash-backed, no API key required). Download real photos, rename to unique descriptive slugs (no generic `img1.jpg`), self-host under `public/images/`, record every asset in `public/images/credits.json` per the schema in `docs/image-sources.md`. |
| Scope | Phased (0-6) | Build **everything** in this session: foundation, DB schema, auth, finance domain, transactions, dashboard, budgets, analytics, landing page, export. Supabase project credentials must come from the user — the app is wired to Supabase but won't run against a live DB until `.env.local` is filled in. |

## 2. Tech stack (locked)

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres, RLS everywhere)
- Zod + React Hook Form
- Recharts (charts)
- `motion` (motion.dev) for animation
- `lucide-react` for icons
- Vitest + Testing Library (unit/integration), Playwright (e2e)
- Vercel target deployment

## 3. Build phases & status

Mark `[x]` when a phase is functionally complete (builds, typechecks, has the states/tests the docs require).

- [x] **Phase 0 — Foundation**: Next.js+TS scaffold (via create-next-app, app router, Tailwind v4, ESLint), `.env.example`, Supabase client/server/proxy(middleware) utilities, route groups, global design tokens, base layout. `middleware.ts` renamed to `proxy.ts` (Next 16 convention — see §8).
- [x] **Phase 1 — Database**: `supabase/migrations/0001_init.sql` (profiles/accounts/categories/transactions/budgets, RLS, indexes, triggers, profile-bootstrap-on-signup trigger) + `0002_default_categories.sql` (system categories) + `supabase/seed.sql` (synthetic demo data). NOT yet applied to a real Supabase project — no project exists yet, needs user's credentials in `.env.local`.
- [x] **Phase 2 — Auth**: `app/(auth)/layout.tsx` (shared branded shell), `app/(auth)/sign-in/page.tsx` + `components/auth/sign-in-form.tsx` (email/password, `redirectTo` query param support, inline errors), `app/(auth)/sign-up/page.tsx` + `components/auth/sign-up-form.tsx` (passes `display_name` metadata for the profile-bootstrap trigger, "check your email" success state), `app/(auth)/callback/route.ts` (PKCE `exchangeCodeForSession`, redirects to `/sign-in?error=auth-callback-failed` on failure), `lib/actions/auth.ts` (`signOutAction` server action for reuse in nav later). New shared primitives: `components/ui/{button,input,label}.tsx`. Typecheck/lint/build/tests all green; visually verified via Playwright at 1440px + 390px. Not yet exercised against a live Supabase project (none exists).
- [x] **Phase 3 — Finance domain**: `lib/finance/calculations.ts` + `lib/finance/date-range.ts`, fully unit-tested (`tests/unit/calculations.test.ts`, `tests/unit/date-range.test.ts` — 12 tests passing via `npm test`).
- [x] **Phase 4 — Data access**: `lib/data/{accounts,categories,transactions,budgets,dashboard}.ts` written against the typed Supabase client. Untested against a live DB (no project yet) but typechecks clean.
- [x] **Phase 5 — Transactions**: `app/transactions/page.tsx` (+ `loading.tsx`) — server-rendered ledger with filters (`components/transactions/transaction-filters.tsx`, URL-search-param driven: type/account/category/search), pagination (`transaction-pagination.tsx`), desktop table + mobile card list (`transaction-list.tsx`) with edit/delete, add/edit modal (`components/ui/dialog.tsx` + `transaction-form.tsx` using `useActionState` + `lib/actions/transactions.ts` server actions). New shared bits: `components/shared/category-icon.tsx` (maps `categories.icon` kebab-case slugs to `lucide-react` icons). Typecheck/lint/build all green. NOT yet exercised against a live Supabase project — the ledger requires an authenticated user, so it couldn't be visually verified via Playwright the way the marketing pages were (no project/credentials yet).
- [x] **Phase 6 — Dashboard**: `app/(app)/dashboard/page.tsx` (+ `loading.tsx`) using `getDashboardSnapshot`. KPI cards with vs-previous-period comparison (`components/dashboard/kpi-card.tsx`), range selector (week/month/quarter/year, URL-driven), category spend bar chart — first real Recharts usage (`category-spend-chart.tsx`, validated against the dataviz skill's categorical-palette checker), recent transactions list, accounts summary. Added `lib/data/profile.ts` (`getProfile`/`updateProfile`, needed for the user's timezone and later Settings). **Restructured routing**: moved `dashboard/transactions/budgets/analytics/settings` into a shared `app/(app)/` route group with `app/(app)/layout.tsx` + `components/layout/app-shell.tsx` (top nav, mobile menu, sign-out) — URLs are unchanged (route groups don't affect paths), this only added shared chrome the ledger was missing.
- [x] **Phase 7 — Budgets & Analytics**: Budgets — `app/(app)/budgets/page.tsx`, month navigation (`components/budgets/month-selector.tsx`), per-category progress bars with inline set/edit/remove (`budget-row.tsx` + new `lib/actions/budgets.ts` + a `deleteBudget` added to `lib/data/budgets.ts`, the only new data-layer function this phase needed). Analytics — `app/(app)/analytics/page.tsx` reusing the dashboard's range selector/KPI cards/category chart, plus a new income-vs-expense trend line chart (`components/analytics/trend-chart.tsx`) and top-merchants list (`top-merchants.tsx`). Two new pure functions added to `lib/finance/calculations.ts` for this (`calculateDailyTrend`, `calculateTopMerchants`) — both unit-tested (`tests/unit/calculations.test.ts`, now 14 tests). Typecheck/lint/build/tests all green.
- [x] **Phase 8 — Landing page**: DONE and visually verified via Playwright screenshots (desktop 1440px + mobile 390px). `app/(marketing)/page.tsx` + `layout.tsx` compose `components/marketing/{site-header,hero,product-carousel,mockup-screens,value-props,how-it-works,feature-highlights,final-cta,site-footer}.tsx`. Carousel uses `motion/react` (autoplay+pause-on-hover, prev/next, dot indicators, keyboard, swipe via drag, `useReducedMotion`). Icons via `lucide-react`. Mobile hamburger menu added to header. Product name chosen: **"Clearledger"** (not specified in docs — free to rename if the user wants something else).
- [x] **Phase 9 — Settings & Export**: `app/(app)/settings/page.tsx` — profile form (name/currency/timezone via `lib/actions/profile.ts` + new `lib/validations/profile.ts`) and account management (`components/settings/account-list.tsx` + `add-account-form.tsx`, `lib/actions/accounts.ts`, plus a `createAccount` added to `lib/data/accounts.ts` — the only new data-layer function this phase needed; `archiveAccount` already existed). CSV export: `app/(app)/transactions/export/route.ts` (GET route handler, respects the ledger's current filters, resolves account/category ids to names, never exposes raw ids) + an `ExportButton` link on the transactions page that carries the current URL search params through.
- [x] **Phase 10 — Hardening**: Done, verified against a **live local Supabase instance** (Docker Desktop + `supabase start`, not a hosted project — see §9). Typecheck/lint/build/unit-tests (14) all green. Migrations applied cleanly to real Postgres; profile-bootstrap trigger confirmed firing on signup. Full E2E flow (`e2e/app-flow.spec.ts`, Playwright) passes on both desktop and mobile viewports: sign up → sign in → create account → add expense → dashboard reflects it → add income → net change updates → create budget → filter transactions → export CSV → mobile nav. RLS verified with raw REST calls under two real user tokens: each user sees only their own accounts/transactions, a spoofed `user_id` on insert is rejected, unauthenticated requests return nothing, system categories (`user_id null`) are readable by everyone. One real bug found and fixed this pass: `components/dashboard/kpi-card.tsx` colored an *increase* in spending green (as if favorable) — inverted for any `tone="negative"` tile. Also added `components/ui/dialog.tsx` focus-trap/scroll-lock/focus-restore (was focus-on-open only), `app/error.tsx` + `app/not-found.tsx` boundaries, and `playwright.config.ts` + the e2e spec itself (didn't exist before this pass).

## 4. Non-negotiable rules (from `docs/05-ai-build-prompt.md`, do not relax)

1. Server Components by default; Client Components only where interaction requires them.
2. No business logic in presentational components — domain logic lives in `lib/finance`.
3. All Supabase access goes through `lib/supabase` + `lib/data`, never ad hoc in components.
4. Validate all input with Zod.
5. Money is `numeric`/`decimal` in Postgres, never floats for persisted balances.
6. RLS enforces `auth.uid() = user_id` on every user-owned table — never rely on client filtering.
7. No service-role secrets in browser code.
8. Every schema change is a migration file under `supabase/migrations/`.
9. Finance calculations and critical flows need tests.
10. No fake/placeholder numbers once real data exists; no lorem ipsum in shipped UI.
11. Responsive from the start (mobile <640, tablet 640–1023, desktop 1024–1279, wide ≥1280).
12. Every data view needs loading/empty/error/success/disabled states with useful copy.

## 5. Image workflow (do this every time an image is added)

1. Pick from Lorem Picsum (`https://picsum.photos/id/<id>/<w>/<h>`) or an approved Pexels/Unsplash photo.
2. Download it into `public/images/` with a **unique, descriptive, non-generic filename** (e.g. `calm-desk-budgeting-session.jpg`, not `img1.jpg`).
3. Append an entry to `public/images/credits.json` (file, source, author if known, sourceUrl, license, downloadedAt, notes).
4. Reference the local self-hosted path in code — never hotlink the remote URL in production UI.

## 6. Where things live (once scaffolded)

See `docs/02-system-architecture.md §repository structure` for the full tree. Key entry points:
- Landing page: `app/(marketing)/page.tsx` + `app/(marketing)/components/`
- Auth pages: `app/(auth)/{sign-in,sign-up,callback}` (shared shell in `app/(auth)/layout.tsx`)
- Authenticated app: `app/(app)/{dashboard,transactions,budgets,analytics,settings}` — all share one nav shell via `app/(app)/layout.tsx` + `components/layout/app-shell.tsx`. The `(app)` segment is a route group only — it does not appear in the URL (`/dashboard`, not `/app/dashboard`).
- Finance domain: `lib/finance/`
- Data access: `lib/data/`
- Server actions: `lib/actions/` (auth, transactions, budgets, accounts, profile — each pairs with a `lib/validations/*` schema)
- Supabase clients: `lib/supabase/{client,server,middleware}.ts`
- Shared UI primitives: `components/ui/` (button, input, label, dialog)
- DB migrations: `supabase/migrations/`
- Image credits: `public/images/credits.json`

## 7. Session log

- 2026-09-13 — Read all docs + `.claudeskills` skill index. Confirmed decisions in §1 with user (motion.dev, lucide-react, Picsum-sourced self-hosted images, full-scope build). Scaffolded Next.js app via create-next-app into project root. Built and shipped Phases 0, 1, 3, 4, 8 (see §3). Session paused mid-build (user stepped away) right after a full green typecheck/lint/build/test pass — see §8 for exact resume point.
- 2026-09-13 (resumed) — Shipped Phases 2, 5, 6, 7, and 9 in one continuous run (Auth → Transactions → Dashboard → Budgets & Analytics → Settings & Export), following the handoff note's ordering exactly. Along the way: restructured routing into an `app/(app)/` route group with a shared nav shell; added a handful of small data-layer functions the plan hadn't anticipated (`lib/data/profile.ts`, `deleteBudget`, `createAccount`) plus two new unit-tested finance functions (`calculateDailyTrend`, `calculateTopMerchants`); validated the new Recharts charts against the dataviz skill's palette checker. Full green typecheck/lint/build/unit-test pass after every phase.
- 2026-09-13 (same session, continued) — User asked to "complete everything," i.e. close out Phase 10. No Docker or Supabase project existed. Installed Docker Desktop (winget) + enabled the WSL2 backend (needed one UAC approval from the user mid-install), then ran a **local** Supabase stack via `supabase start` — no hosted project was created. Applied both migrations to real Postgres, wrote `playwright.config.ts` + `e2e/app-flow.spec.ts` (didn't exist before), and ran the full signup→CRUD→export flow end-to-end on desktop and mobile viewports — all green. Verified RLS directly against the REST API with two real user tokens (cross-user isolation, spoofed-`user_id` rejection, anon rejection, shared system categories). Found and fixed one real bug this pass: `kpi-card.tsx`'s up/down coloring was inverted for expense-tone tiles. Also hardened `components/ui/dialog.tsx` (focus trap, scroll lock, focus restore — was focus-on-open only) and added `app/error.tsx` / `app/not-found.tsx`. All ten phases are now functionally complete and verified. See §9 for how to keep working against this local database in a future session.
- 2026-09-14 — User asked for a senior-engineer master plan (architecture + data flow + gap analysis + "next level, ready to deploy" roadmap), real matching copyright-free imagery instead of generic stock photos, and removal of any "AI" framing from shipped copy. Wrote `MASTER-PLAN.md` at the project root (originally drafted as `docs/06-launch-readiness-plan.md`, then moved to the root and that file deleted, per a follow-up request for a dedicated top-level master-plan file alongside `CLAUDE.md`/`HANDOFF.md`): a full repo audit table by layer, three Mermaid diagrams (system architecture, mutation data-flow sequence, ER diagram), a line-by-line gap check against `docs/01`'s MVP scope, and an 8-tier prioritized roadmap (git init → hosted Supabase/Vercel → security headers → running account balances → CI → remaining feature gaps → SEO/observability/testing/perf polish) with a risk register and suggested execution order. Also did the two concrete, low-risk fixes directly rather than just planning them: replaced `sunlit-desk-workspace-flatlay.jpg` (generic Apple-hardware flatlay, unrelated to budgeting) and `hands-reviewing-paper-receipts.jpg` (its alt text claimed receipts but the photo was actually a MacBook + UX sketchbook) with `calculator-and-budget-worksheet.jpg` and `stack-of-shopping-receipts.jpg` — both CC0 1.0 public-domain photos sourced via Openverse from Rawpixel's collection, verified by visual inspection before download, credited in `public/images/credits.json`. Removed the literal "no AI advice column" line from `feature-highlights.tsx` (→ "no gimmicks"). Verified with `tsc --noEmit`, `eslint`, `vitest run` (14/14), `next build`, and a live-dev-server screenshot of the landing page — all clean. Confirmed via HANDOFF.md and a fresh audit that no git repo exists yet, which the new plan's Tier 0 flags as the single highest-priority next step.

## 8. Handoff

Detailed pause-state, exact resume steps, and non-obvious gotchas from the last session live in
**`HANDOFF.md`** at the project root. Read it before continuing work — it's the "what happened and
what to do next" note that complements this file's durable plan/status view.

## 9. Local Supabase (live, already running)

Phase 10 was verified against a **local** Supabase stack, not a hosted project — no supabase.com
account was created. To keep using it in a future session:

- **Start it**: `npx supabase start` (Docker Desktop must be running first — it auto-installs and
  updates its own containers, no manual image management needed). Prints an API URL + keys block;
  those already match what's in `.env.local` — hasn't been changed since this session, so normally
  you can just start Docker Desktop and run `npm run dev`, no key updates needed.
- **Stop it**: `npx supabase stop` (add `--no-backup` only if you explicitly want to wipe the local
  DB; the default preserves data across stop/start).
- **Studio UI** (browse tables, run SQL, inspect auth users): `http://127.0.0.1:54323` while running.
- **Reset to a clean DB** (re-run migrations + seed from scratch): `npx supabase db reset`.
- **`.env.local` currently points at this local stack** (`http://127.0.0.1:54321` + the local
  demo keys `supabase start` printed — these are well-known local-dev-only defaults, not secrets,
  safe to keep in a gitignored `.env.local`). Swapping to a real hosted project later is just
  replacing these three values — nothing else in the code changes.
- **E2E tests** (`npx playwright test`, or `--project=chromium` / `--project=mobile` individually)
  need this local stack (or another live Supabase project) running — they sign up real users via
  the actual auth flow. Each run uses a randomized email so re-running doesn't collide with prior
  runs' data.
