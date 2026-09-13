# Handoff — resume here

Read this first, then `CLAUDE.md` (master plan + phase checklist) and the `docs/01..05-*.md` specs
it points to. This file is the "what happened last session and what to do next" note; `CLAUDE.md`
is the durable plan and status tracker — keep both in sync as work continues.

## State at pause

**All ten build phases are functionally complete and verified.** `npx tsc --noEmit`, `npx eslint .`,
`npm run build`, `npx vitest run` (14 tests), and `npx playwright test` (both the `chromium` and
`mobile` projects, against a real live database) all pass clean.

No git repo exists yet (`git init` was never run) — confirm with the user before creating one.
Nothing is stashed or uncommitted-at-risk; there's simply no VCS yet.

**A local Supabase stack is running** (Docker Desktop + `npx supabase start`) — this is how Phase 10
got verified, since no hosted Supabase project exists. See `CLAUDE.md` §9 for how to start/stop it
and what's in `.env.local`. The Next.js dev server may or may not still be running depending on
whether the session that started it is still alive — check with `curl http://localhost:3000` and
restart with `npm run dev` if needed.

## What's done

All of Phases 0–10 (see `CLAUDE.md` §3). Nothing from the original build plan remains unstarted.

## What could still be improved (optional, not blocking)

Nothing is broken or missing, but if picking this up again, worth considering:

- **A hosted Supabase project.** Everything so far runs against a local Docker-based instance. Before
  deploying to Vercel, create a real Supabase project, run the same two migrations against it, and
  swap `.env.local` → your deployment platform's env vars.
- **Receipt image upload** — mentioned in `docs/01-product-requirements.md` (optional receipt image
  per transaction, with type/size validation) but not built. `transactions.receipt_url` exists in
  the schema and type, unused by the UI. Would need Supabase Storage wired up (no bucket exists yet).
- **Magic-link sign-in** — docs mention it as optional; only password auth was built.
- **e2e coverage is one happy-path spec** (`e2e/app-flow.spec.ts`). It's not testing error states,
  RLS from the browser (only verified via raw REST calls this session), or budget-editing edge cases.
- **Account balances shown in the UI are opening balances**, not a running balance computed from
  transaction history — there was no data-layer function for that and the docs didn't require it.
  Worth flagging if a user expects to see a live balance.

## Things a fresh session must know that aren't obvious from the code

- **Supabase generic types must use `type`, not `interface`.** See `types/database.ts` — don't
  "clean up" these back to interfaces (breaks `.insert()`/`.update()` typing).
- **`middleware.ts` was renamed to `proxy.ts`** (Next.js 16 convention). `lib/supabase/middleware.ts`
  (the helper file) was kept as-is.
- **`lib/supabase/middleware.ts`'s `updateSession()` early-returns** when Supabase env vars are
  unset — keep that guard even though `.env.local` is now filled in, for a clean-checkout case.
- **Routing lives under `app/(app)/`** for every authenticated page (dashboard/transactions/budgets/
  analytics/settings) — a route group sharing `app/(app)/layout.tsx` + `components/layout/app-shell.tsx`
  (top nav, mobile menu, sign-out). New authenticated pages go there to inherit the shell.
- **Local Supabase, not hosted** — see `CLAUDE.md` §9. `.env.local` points at `127.0.0.1:54321` with
  the well-known local-dev demo keys `supabase start` prints (safe in a gitignored file, not secrets).
- **Category icons**: `categories.icon` is a kebab-case slug mapped to a `lucide-react` PascalCase
  icon via `components/shared/category-icon.tsx`, falling back to a plain circle if no match.
- **Recharts palette**: `components/dashboard/category-spend-chart.tsx`'s 3-color palette
  (`--chart-1/2/3`) was validated with the dataviz skill's `validate_palette.js` — re-validate if
  those token colors ever change.
- **CSV export** (`app/(app)/transactions/export/route.ts`) resolves account/category ids to names,
  never exposes raw ids, ignores pagination, and returns up to 10,000 rows matching current filters.
- **e2e test emails are randomized** (`e2e-${Date.now()}-${random}@example.com`) specifically because
  two Playwright projects (`chromium`/`mobile`) run in parallel and a plain timestamp once collided,
  causing a real "Database error saving new user" from a duplicate-email constraint. Don't revert to
  a plain timestamp.
- **Docker/WSL2 setup happened this session** on a machine that had neither — if this environment is
  ever reset, redo via: `winget install --id Docker.DockerDesktop`, then `wsl --install` as
  administrator (needs a UAC approval + the WSL2 kernel to initialize, no reboot was actually needed
  this time), then launch Docker Desktop once before `docker`/`supabase` commands work.
- **Product name "Clearledger"** — picked by the assistant, not specified in `docs/`. Still worth
  confirming with the user if they want something different.
