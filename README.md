# Clearledger

A personal expense tracker built with Next.js and Supabase. Track spending, set monthly budgets
per category, and see where your money goes — without spreadsheets.

> Built as a full-stack reference implementation: typed data access, Postgres row-level security,
> server actions for every mutation, and a small design system rather than a component library.

## Features

- **Authentication** — email/password sign-up and sign-in, session-aware route protection
- **Transactions** — a searchable, filterable, paginated ledger with add/edit/delete and CSV export
- **Dashboard** — income/expense/net-change KPIs vs. the previous period, category breakdown, recent activity
- **Budgets** — a monthly limit per category with progress bars and over-budget warnings
- **Analytics** — spending trends over time, category breakdown, and top merchants
- **Settings** — profile (name, currency, timezone) and account management
- Every page has loading, empty, error, and success states, and is responsive from 320px up

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router, Turbopack) + TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Backend | [Supabase](https://supabase.com) — Postgres + Auth, with row-level security on every table |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Charts | [Recharts](https://recharts.org) |
| Animation | [motion](https://motion.dev) (the successor to Framer Motion) |
| Icons | [lucide-react](https://lucide.dev) |
| Testing | [Vitest](https://vitest.dev) + Testing Library (unit), [Playwright](https://playwright.dev) (e2e) |
| Deployment target | [Vercel](https://vercel.com) |

## Getting started

### Prerequisites

- Node.js 20+
- A Supabase project — either [a free hosted project](https://supabase.com/dashboard) or a local
  instance via the [Supabase CLI](https://supabase.com/docs/guides/local-development) (requires
  Docker Desktop)

### Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your Supabase project's URL and publishable key (find these under
**Project Settings → API** in the Supabase dashboard, or printed by `supabase start` for a local
instance):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Apply the database schema — either against a hosted project:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

or against a local instance:

```bash
npx supabase start   # starts Postgres, Auth, and Studio in Docker
```

Then start the app:

```bash
npm run dev
```

The app is now running at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Run a production build |
| `npm run lint` | Lint the codebase |
| `npm test` | Run unit tests once |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run e2e` | Run the Playwright end-to-end suite (needs a live Supabase instance) |

## Project structure

```text
app/
├─ (marketing)/          public landing page
├─ (auth)/               sign-in, sign-up, OAuth/email callback
├─ (app)/                authenticated app — dashboard, transactions, budgets, analytics, settings
│                         (shares one nav shell via (app)/layout.tsx)
├─ error.tsx             global error boundary
└─ not-found.tsx         404 page

components/
├─ ui/                   generic primitives (button, input, dialog, ...)
├─ layout/               the authenticated app's nav shell
├─ marketing/            landing page sections
└─ <feature>/            page-specific components (dashboard/, transactions/, budgets/, ...)

lib/
├─ supabase/             browser/server Supabase clients + session middleware
├─ data/                 typed data-access functions — every Supabase query lives here
├─ finance/              pure domain logic (totals, budget progress, date ranges) — unit tested
├─ validations/          Zod schemas, one per form
└─ actions/              server actions, one file per domain, each backed by a validation schema

types/database.ts        hand-written types matching the Supabase schema
supabase/                SQL migrations, seed data, local dev config
tests/unit/               Vitest unit tests (finance domain logic)
e2e/                      Playwright end-to-end tests
docs/                    product requirements, architecture, and design-system specs
```

## Architecture notes

- **Server Components by default.** Pages fetch data directly in `async` Server Components;
  Client Components are used only where interaction requires them (forms, filters, charts, modals).
- **No business logic in components.** Domain calculations (net change, budget progress, category
  spend, date ranges) live in `lib/finance/` and are unit tested independently of the UI.
- **All Supabase access goes through `lib/data/`.** No component queries Supabase directly.
- **Every mutation is a server action** (`lib/actions/`), validated with the matching Zod schema
  from `lib/validations/` before touching the database.
- **Row-level security enforces `auth.uid() = user_id`** on every user-owned table — the app never
  relies on client-side filtering for data isolation. See `supabase/migrations/0001_init.sql`.
- **Money is stored as `numeric`** in Postgres, never floating point.

## Testing

```bash
npm test          # unit tests — finance calculations, date ranges, validation schemas
npm run e2e        # end-to-end — full signup-to-export flow, desktop + mobile viewports
```

The e2e suite exercises real authentication and database writes, so it needs a live Supabase
instance (local or hosted) with `.env.local` configured. It signs up a fresh randomized user on
every run.

## License

Private project — no license granted for reuse.
