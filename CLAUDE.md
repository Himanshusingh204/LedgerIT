# Clearledger: working notes

This is the short, current reference for working in this repository. Product and architecture
detail is in `docs/`, `ARCHITECTURE.md` and `DEPLOYMENT.md`. The dashboard plan is in
`docs/DASHBOARD-MASTER-PLAN.md`.

## Rules that do not change

1. Server components by default. Client components only where interaction needs them.
2. Business logic lives in `lib/finance`, not in components.
3. All database access goes through `lib/data`. Components never query Supabase directly.
4. Validate all input with Zod, on the server.
5. Money is `numeric` in Postgres. Never store balances as floats.
6. RLS enforces ownership on every user table. Never rely on client-side filtering.
7. The service-role key stays on the server. Only `lib/actions/account.ts` uses it.
8. Every schema change is a new migration in `supabase/migrations/`. Migration numbers must be unique.
9. Money calculations and critical flows need tests.
10. No placeholder numbers in shipped UI, and no lorem ipsum.
11. Layouts are responsive from 360px up, with no horizontal scroll.
12. Every data view has loading, empty, error and success states, with plain copy.
13. Copy is plain and specific. No em dashes and no marketing filler.

## Verification before a change is done

```bash
npx tsc --noEmit
npx eslint . --max-warnings=0
npx vitest run
npx playwright test        # needs `npx supabase start` and the env overrides in DEPLOYMENT.md
npx next build             # stop the dev server first: both write to .next
```

## Local development

- Local stack: `npx supabase start`. Point `.env.local` at the hosted project only when you
  intend to use it. Local runs can override the URL and keys in the shell.
- Auth rate limits are relaxed in `supabase/config.toml` for local testing. Do not copy those
  values to a hosted project.
- Demo data used for screenshots is synthetic and local only. Never use real personal data.

## Where things are

| What | Where |
|---|---|
| Public pages and homepage sections | `app/(marketing)`, `components/marketing` |
| App shell and screens | `app/(app)`, `components/layout`, `components/dashboard` |
| Server actions | `lib/actions` |
| Queries | `lib/data` |
| Finance rules | `lib/finance` |
| Schemas | `lib/validations` |
| Design tokens | `app/globals.css` (light by default, `data-theme="dark"` opt-in) |
