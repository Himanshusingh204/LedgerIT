# Clearledger

A personal expense tracker for logging spending, staying inside monthly budgets, and
exporting a clean record when you need one. Built with Next.js, Supabase and Tailwind.

- Quick expense and income entry, with optional receipt photos
- Accounts, categories and monthly budgets with live progress
- Dashboard, analytics and top-merchant breakdowns for any date range
- CSV export that respects the filters you have set
- Installable on phones and desktops (PWA)
- Every record is protected by Postgres row-level security

## Stack

| Layer | Tools |
|---|---|
| Web app | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS v4, Geist typefaces |
| Motion and charts | motion, Recharts |
| Data and auth | Supabase (Postgres, Auth, Storage) |
| Validation | Zod, React Hook Form |
| Testing | Vitest, Testing Library, Playwright |

## Getting started

Requirements: Node.js 20 or later, and Docker Desktop if you run Supabase locally.

```bash
npm install
cp .env.example .env.local      # then fill in the values below
npx supabase start              # optional: local database, Auth and Storage
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public key, safe in the browser |
| `NEXT_PUBLIC_APP_URL` | Public site URL, used for links and metadata |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. Used to delete accounts. Never commit or expose it. |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Unit and integration tests |
| `npm run e2e` | End-to-end tests (needs a running Supabase stack) |

On Windows, `run-website.bat` starts the server on port 3005 and opens the browser, and
`test.bat` runs the full check suite.

## Database

Schema changes live in `supabase/migrations/` and are applied in order:

1. `0001_init`: profiles, accounts, categories, transactions, budgets, RLS and triggers
2. `0002_default_categories`: system categories
3. `0003_admin`: admin roles
4. `0004_site_feedback`: feedback form storage
5. `0005_receipts_storage`: private receipts bucket
6. `0006_admin_features`: admin tooling
7. `0007_short_links`: short links

`supabase/seed.sql` adds a small synthetic example, not real data.

## Project layout

```
app/
  (marketing)/   public pages: home, features, pricing, about, security, legal
  (auth)/        sign in, sign up, password reset
  (app)/         dashboard, transactions, budgets, analytics, settings
  admin/         admin console
components/      UI primitives and feature components
lib/
  actions/       server actions (validate input, then call data access)
  data/          Supabase queries
  finance/       pure calculation and date-range logic
  validations/   Zod schemas
supabase/        migrations and seed data
tests/           unit and integration tests
e2e/             Playwright specs
docs/            product, architecture and design notes
```

## Security

- Row-level security on every user table. The database enforces ownership, not the UI.
- The service-role key is used in one server action only: account deletion.
- Receipts live in a private bucket and are served through short-lived signed URLs.

To report a vulnerability, see [SECURITY.md](SECURITY.md).

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md). The app is a standard Next.js application. It deploys to
Vercel with a hosted Supabase project.

## Contributing

Open an issue before starting a large change. Run the checks in [CLAUDE.md](CLAUDE.md) before
opening a pull request.

## License

MIT. See [LICENSE](LICENSE).
