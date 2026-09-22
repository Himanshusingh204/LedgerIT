# 🏛️ LedgerIT

> **Ultra-Fast, Zero-Gimmick Personal Finance & Expense Ledger**  
> Built with Next.js 16 (App Router), Supabase (PostgreSQL + RLS), Tailwind CSS v4, and TypeScript.

[![CI](https://github.com/Himanshusingh204/LedgerIT/actions/workflows/ci.yml/badge.svg)](https://github.com/Himanshusingh204/LedgerIT/actions/workflows/ci.yml)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20RLS-3ecf8e?logo=supabase)](https://supabase.com/)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-99%20%7C%20100%20%7C%20100%20%7C%20100-success)](https://github.com/Himanshusingh204/LedgerIT)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Overview

**LedgerIT** is a privacy-first personal finance tracker engineered for speed, clarity, and rock-solid accounting integrity.

Most modern financial apps force third-party bank linking, hide features behind paywalls, or rely on AI gimmicks. LedgerIT takes the opposite approach: **honest, private, manual logging with instant category budgeting, high-performance analytics, receipt management, and filtered CSV exports.**

Designed with an ultra-premium **Midnight Obsidian** aesthetic (`#24243e`, `#302b63`, `#0f0c29`), LedgerIT achieves **100% Lighthouse scores** across Accessibility, Best Practices, and SEO.

---

## 🚀 Key Features

* **🛡️ Private & Local-First Mindset**: Zero bank linking required. Your financial records are isolated through strict PostgreSQL Row-Level Security (RLS).
* **⚡ Server-First App Router Architecture**: Dynamic Server Components fetch data on the edge and server; interactive widgets use minimal client-side bundles.
* **💳 Multi-Account Ledger**: Manage checking, savings, credit cards, and cash accounts with real-time balance calculations derived from raw transaction ledgers.
* **🧾 Receipt Storage**: Upload and manage transaction receipts securely using private Supabase Storage buckets with short-lived signed URLs.
* **🎯 Category-Based Budgeting**: Set monthly budgets per category with real-time spend meters, warning thresholds, and month-over-month comparisons.
* **📊 Visual Analytics**: Spending breakdown charts, monthly cash-flow trends, and top-merchant intelligence powered by Recharts and accessible data fallbacks.
* **📥 Filter-Aware CSV Export**: Export your complete transaction history respecting active search query, category, account, and date filters.
* **♿ Accessible UI Primitives**: Custom Select/Combobox primitive with full keyboard navigation (`Arrow keys`, `Home/End`, `Enter`, `Escape`) and WCAG 2.1 AA screen reader compliance.
* **🌙 Dynamic Theme System**: Sleek Midnight Obsidian dark mode with automatic system-preference detection and an instant header theme switcher.
* **🌐 Comprehensive SEO & GEO Suite**: Dynamic `sitemap.xml`, `robots.txt`, PWA `manifest.webmanifest`, OpenGraph cards, Twitter cards, and Schema.org JSON-LD structured data.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | [Next.js 16.3.5](https://nextjs.org) (App Router, Turbopack) | Async Server Components, Server Actions, per-request CSP nonces |
| **Language** | [TypeScript 5.x](https://www.typescriptlang.org) | Strict type safety across database schemas, finance logic, and UI |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) (`@tailwindcss/postcss`) | CSS-first custom design tokens, zero-runtime overhead |
| **Database & Auth** | [Supabase](https://supabase.com) (PostgreSQL 15 + GoTrue) | Multi-tenant Row-Level Security, PKCE auth, private Storage |
| **Form Management** | [React Hook Form](https://react-hook-form.com) + [Zod v4](https://zod.dev) | Schema-driven validation at forms and server boundaries |
| **Data Visualization** | [Recharts v3](https://recharts.org) | Responsive, SVG-based charts with accessible semantic table fallbacks |
| **Micro-Animations** | [motion](https://motion.dev) | Fluid scroll reveals, spring transitions, and marquee carousels |
| **Icons** | [lucide-react](https://lucide.dev) | Clean, accessible SVG iconography |
| **Testing** | [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev) | Fast unit tests for finance logic; cross-browser E2E testing |

---

## 🔒 Architectural Invariants

LedgerIT enforces strict software architecture principles to ensure long-term stability and security:

1. **Double-Layer Authorization**: The application layer checks authentication, while PostgreSQL RLS independently checks `auth.uid() = user_id`. Even if an app bug bypassed a check, database RLS prevents unauthorized data access.
2. **Single Database Access Layer (`lib/data/*`)**: Components and Server Actions never call Supabase queries directly. All database access is encapsulated inside `lib/data/*`.
3. **Validated Mutations (`lib/actions/*`)**: Every database mutation is executed via a Server Action backed by a strict Zod validation schema.
4. **Currency Representation**: Money is stored as `numeric(14,2)` in PostgreSQL and handled as whole units during display. Floating-point arithmetic is never persisted.
5. **No Service-Role Key on Client**: The Supabase `service_role` key is strictly kept in server environments and never bundled into client or edge code.
6. **Dynamic CSP Nonce**: Every page response generates a unique per-request Content Security Policy (CSP) nonce inside middleware.

---

## 📁 Repository Structure

```text
├── app/
│   ├── (marketing)/         # Public landing page with bento grid & testimonials
│   ├── (auth)/              # Sign-in, sign-up, password reset, and PKCE callback
│   ├── (app)/               # Protected app shell: dashboard, transactions, budgets, analytics, settings
│   ├── admin/               # Role-gated admin feedback portal
│   ├── layout.tsx           # Root layout with CSP nonce and metadata
│   ├── sitemap.ts           # Dynamic XML sitemap generator
│   ├── robots.ts            # Dynamic robots.txt
│   └── manifest.ts          # PWA Web Manifest
├── components/
│   ├── ui/                  # Accessible primitives (Select combobox, Dialog, Button, Input)
│   ├── layout/              # Authenticated app shell and responsive navigation
│   ├── marketing/           # Landing sections (Hero, Bento Features, Marquee, Pricing)
│   ├── dashboard/           # KPIs, Sparklines, Budget meters, and Spending charts
│   ├── transactions/        # Ledger table, Filter controls, and Receipt upload modal
│   ├── budgets/             # Monthly category budget progress cards
│   └── analytics/           # Trendline charts and Top merchant widgets
├── lib/
│   ├── actions/             # Validated 'use server' mutation handlers
│   ├── data/                # Typed data access layer (Supabase queries)
│   ├── finance/             # Pure mathematical finance calculations (100% unit-tested)
│   ├── formatters/          # Currency and locale presentation formatters
│   ├── supabase/            # SSR client, server client, and auth middleware
│   └── validations/         # Zod schemas for all forms and actions
├── supabase/
│   ├── migrations/          # Sequential, numbered SQL migrations
│   └── seed.sql             # Reproducible local development seed data
└── tests/
    ├── unit/                # Vitest unit tests (finance math, date ranges, Zod schemas)
    ├── integration/         # Integration tests for live Row-Level Security
    └── e2e/                 # Playwright browser end-to-end tests
```

---

## 🚦 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) `>= 20.9.0` (LTS recommended)
* [Git](https://git-scm.com/)
* Optional: [Docker Desktop](https://www.docker.com/) (for running Supabase locally)

### 1. Clone the Repository

```bash
git clone https://github.com/Himanshusingh204/LedgerIT.git
cd LedgerIT
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Populate `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sbp_...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Server-only (Required for administrative functions, never expose to client)
SUPABASE_SERVICE_ROLE_KEY=ey...

# Optional Cloudflare Turnstile bot protection
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

### 4. Database Setup

#### Option A: Hosted Supabase Project (Recommended for production)
Link your hosted project and apply the migrations:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

#### Option B: Local Supabase with Docker
```bash
npx supabase start
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts local Next.js dev server with Turbopack at `localhost:3000` |
| `npm run build` | Compiles the production build with typechecking and linting |
| `npm start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint 9 across all application files |
| `npm test` | Executes Vitest unit and integration test suite |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run e2e` | Executes Playwright end-to-end tests across desktop & mobile viewports |

---

## 🧪 Testing & Verification

LedgerIT maintains a comprehensive test suite to ensure mathematical accuracy and data isolation:

```bash
# Run unit & RLS integration tests
npm test

# Run TypeScript typecheck
npx tsc --noEmit
```

### Audit Performance
Lighthouse desktop audit results on production build:
* **Performance**: `99%`
* **Accessibility**: `100%`
* **Best Practices**: `100%`
* **SEO**: `100%`

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project into your [Vercel Dashboard](https://vercel.com).
3. Set the Environment Variables:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   * `NEXT_PUBLIC_APP_URL` (set to your Vercel URL, e.g. `https://your-domain.vercel.app`)
   * `SUPABASE_SERVICE_ROLE_KEY`
4. In your Supabase Dashboard under **Authentication → URL Configuration**, add your production domain to the redirect whitelist:
   * `https://<your-domain>.vercel.app/**`
5. Click **Deploy**.

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
