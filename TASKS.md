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
  below and needs you to create it.

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

### Phase 3 — Security headers + ownership-check comments + Node version pin

Self-contained, no external accounts needed. From `MASTER-PLAN.md` Tier 1, items 1, 3, 5:
- Add a `headers()` export to `next.config.ts`: `Strict-Transport-Security`,
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, and a
  Content-Security-Policy scoped to `'self'` + Supabase's domain.
- Add a one-line comment at each of the four action functions that rely solely on RLS for ownership
  (`updateTransactionAction`, `deleteTransactionAction`, `archiveAccountAction`,
  `deleteBudgetAction`) explaining why that's correct and warning against "optimizing" it away.
- Add `"engines": { "node": ">=20" }` to `package.json` (or an `.nvmrc`) so a fresh clone doesn't
  silently pick up an incompatible Node version.
- Verify: `tsc --noEmit`, `eslint`, `vitest run`, `next build` all still clean; commit.

### Phase 4 — Running account balances

From `MASTER-PLAN.md` Tier 2 item 1 — the single most visible "looks like a bug" gap. Plan:
- Add `calculateAccountBalance(openingBalance, transactions)` to `lib/finance/calculations.ts`
  (pure function, unit-tested like every other function in that file). Sums income (+) and expense
  (−); **explicitly excludes transfers**, matching the precedent already set by
  `calculateNetChange`/`calculateDailyTrend` — see the note below, this needs your input.
- Add `listAccountsWithBalances` to `lib/data/accounts.ts`: one lightweight query for
  `{account_id, type, amount}` across *all* of the user's transactions (not just the current
  dashboard date range — a balance has to reflect full history), reduced per-account through the
  new pure function.
- Wire it into `lib/data/dashboard.ts`'s snapshot and `components/dashboard/accounts-summary.tsx`
  (shows the computed balance instead of the raw opening balance).
- Relabel `components/settings/account-list.tsx`'s figure as "Opening balance: $X" instead of a
  bare number, so it's clear that row is account *setup* metadata, not a live balance (cheaper and
  more honest than running the full-history query on a page that doesn't need it).
- **Needs your call:** the `transactions` table has no destination account or direction for a
  `transfer` row — just one `account_id` and a always-positive `amount`. That means a transfer
  can't be resolved to "money in" or "money out" of the account it's posted against without a
  schema change. I'm planning to exclude transfers from the balance calculation entirely (same as
  the existing net-change/trend functions already do) rather than guess a direction, but this means
  a transfer transaction won't move the balance shown on screen — worth flagging before I build it,
  in case you'd rather I add a `direction` column (`in`/`out`) now instead of after the fact.
- Verify + commit.

### Phase 5 — SEO basics

From `MASTER-PLAN.md` Tier 3. No external accounts needed:
- `app/sitemap.ts` and `app/robots.ts` (standard Next.js App Router conventions).
- An OG image via `app/opengraph-image.tsx` (Next's built-in `next/og` `ImageResponse` — generates
  the image from code, no new binary asset needed) so sharing the marketing URL renders a preview
  card instead of nothing.
- Verify + commit.

### Phase 6 — CI workflow file

From `MASTER-PLAN.md` Tier 5 item 1. I can write `.github/workflows/ci.yml` now (runs `npm ci` →
`tsc --noEmit` → `eslint` → `vitest run` → `next build` on every PR), but it can't actually *run*
until Phase 2's remote exists — writing it now just means it's ready the moment the repo is pushed.

### Phase 7 — User category management

From `MASTER-PLAN.md` Tier 2 item 2. The biggest of the near-term feature gaps:
- `lib/data/categories.ts`: add `createCategory`, `updateCategory`, `archiveCategory`.
- `lib/validations/category.ts` (new Zod schema).
- `lib/actions/categories.ts` (new server actions, same shape as `lib/actions/accounts.ts`).
- `components/settings/category-list.tsx` + `add-category-form.tsx` (system categories stay
  read-only; only user-created ones get edit/archive).
- Verify + commit.

### Phase 8 — Password reset

From `MASTER-PLAN.md` Tier 2 item 3:
- `app/(auth)/forgot-password/page.tsx` + `components/auth/forgot-password-form.tsx`
  (`supabase.auth.resetPasswordForEmail()`).
- `app/(auth)/update-password/page.tsx` for the post-email-link flow.
- A "forgot password?" link on the sign-in page.
- Verify + commit.

### Phase 9 — Testing gaps

From `MASTER-PLAN.md` Tier 6, items 1–2 (items 3–4 need a live Supabase instance running, so they're
grouped separately below):
- Create `tests/integration/` (already referenced by `vitest.config.ts` but doesn't exist).
- Table-driven unit tests for every `lib/validations/*.ts` schema.
- Verify + commit.

### Phase 10 — Receipt upload

From `MASTER-PLAN.md` Tier 2 item 4. Largest single remaining feature:
- A **private** Supabase Storage bucket (migration or dashboard-created).
- MIME-type/size validation in the transaction form.
- Signed-URL-on-demand display (never a public URL).
- Wiring into `transaction-form.tsx` + `lib/actions/transactions.ts`.
- Needs the local Supabase stack running (`npx supabase start`) to build and test against.

### Phase 11 — E2E expansion + browser-driven RLS check

From `MASTER-PLAN.md` Tier 6, items 3–4. Needs the local Supabase stack running:
- Expand `e2e/app-flow.spec.ts` (or split into new spec files): failed login, budget edit/delete,
  account archive, export-correctness (download the CSV, parse it, assert contents).
- New spec: sign in as user A, capture an id, sign in as user B, assert user A's data isn't
  reachable through the UI (Phase 10 of the *original* build only checked this via raw REST calls).

### Phase 12 — Performance polish

From `MASTER-PLAN.md` Tier 7, remaining items:
- Cap `listTransactionsInRange` with a sane upper bound + a "narrow your date range" fallback
  message (dashboard/analytics/budgets all call it with no limit today).
- Accessible chart summaries — a visually-hidden table/text alongside each Recharts component.

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

---

## Notes for tomorrow

- Everything in "Next up" is unstarted — no code has changed for Phases 2–12, only Phase 1 (git).
- Phase 4 (account balances) has one open question for you about how transfers should behave —
  see that section. Worth deciding before I start it, since it affects a schema/behavior choice.
- Phase 6 (CI file) is safe to do anytime, but is genuinely useless until Phase 2 (a remote) exists
  — consider doing them back-to-back.
- Everything else has no hidden dependencies beyond what's listed and can be done in any order —
  pick whichever phases matter most and tell me to start there.
