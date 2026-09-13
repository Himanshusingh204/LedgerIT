# 02 — System Architecture

## 1. Architecture style

Use a **modular monolith** first.

Why:
- One deployable web app.
- One database.
- Clear internal boundaries.
- Easier for a small team or solo builder.
- Can later extract jobs/services if real scale requires it.

Avoid microservices for the first version.

## 2. Recommended stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js App Router + TypeScript | Production-ready full-stack React architecture |
| Styling | Tailwind CSS | Fast, consistent responsive styling |
| UI primitives | Radix-based accessible primitives | Interaction and accessibility without visual lock-in |
| Icons | Lucide | Clean open-source icon set |
| Auth | Supabase Auth | Simple authentication integrated with database |
| Database | Supabase PostgreSQL | Relational data, strong constraints, RLS |
| Validation | Zod | Shared runtime validation |
| Forms | React Hook Form | Reliable form state |
| Charts | Recharts | Good React dashboard/chart fit |
| Animation | Framer Motion | Selective, restrained motion |
| Testing | Vitest + Testing Library + Playwright | Unit/component + browser coverage |
| Hosting | Vercel | Straightforward Next.js deployment |

## 3. Application layering

### Presentation
`app/` and `components/`

Responsible for:
- Routing
- Layout
- User interaction
- Rendering
- Accessibility

### Domain
`lib/finance/`, `lib/validations/`, `lib/formatters/`

Responsible for:
- Money calculations
- Budget calculations
- Date-range behavior
- Validation schemas
- Currency formatting

Business rules should not be hidden inside UI components.

### Data access
`lib/data/`

Responsible for:
- Query functions
- Mutation functions
- Mapping database rows to application types
- Keeping Supabase access out of random components

Example modules:
```text
lib/data/accounts.ts
lib/data/categories.ts
lib/data/transactions.ts
lib/data/budgets.ts
lib/data/dashboard.ts
```

### Infrastructure
`lib/supabase/`

Keep browser/server Supabase clients separate:
```text
lib/supabase/
├─ client.ts
├─ server.ts
└─ middleware.ts
```

## 4. Rendering strategy

Prefer Server Components for:
- Initial dashboard data
- Read-only page content
- SEO-friendly marketing sections

Use Client Components for:
- Filters
- Forms
- Charts
- Carousels
- Interactive dialogs
- Local UI state

Do not mark entire route trees as `"use client"`.

## 5. Data model

### profiles
```text
id UUID PK → auth.users.id
display_name TEXT
avatar_url TEXT nullable
currency CHAR(3)
timezone TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

### accounts
```text
id UUID PK
user_id UUID FK profiles.id
name TEXT
type TEXT
currency CHAR(3)
last_four TEXT nullable
opening_balance NUMERIC(14,2)
is_archived BOOLEAN
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Allowed account types:
`cash | bank | debit_card | credit_card | other`

### categories
```text
id UUID PK
user_id UUID nullable
name TEXT
slug TEXT
icon TEXT
kind TEXT
is_archived BOOLEAN
created_at TIMESTAMPTZ
```

`user_id = null` may represent system categories.

### transactions
```text
id UUID PK
user_id UUID FK profiles.id
account_id UUID FK accounts.id
category_id UUID FK categories.id nullable
type TEXT
amount NUMERIC(14,2)
currency CHAR(3)
merchant TEXT nullable
note TEXT nullable
receipt_url TEXT nullable
occurred_at TIMESTAMPTZ
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Allowed transaction types:
`expense | income | transfer`

### budgets
```text
id UUID PK
user_id UUID FK profiles.id
category_id UUID FK categories.id
month_start DATE
amount NUMERIC(14,2)
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Add a unique constraint on:
`(user_id, category_id, month_start)`

## 6. Important finance rules

Store money as **numeric/decimal**, never JavaScript floating-point values for persisted balances.

For totals:
- Expenses are positive transaction amounts in storage and interpreted by `type`.
- Income is also stored as a positive amount.
- Net change is computed as `income - expense`.
- Transfers should not count as spending.
- Dashboard totals must use the same date boundaries as the user's chosen timezone.

Create reusable functions:
```text
calculateNetChange()
calculateBudgetProgress()
calculateCategorySpend()
calculatePreviousPeriod()
buildDateRange()
```

Test them heavily.

## 7. Security

Use Supabase Row Level Security on all user-owned tables. Policies should make the database enforce `auth.uid() = user_id` or the correct ownership relationship.

Do not trust client-side filtering for authorization.

Never place service-role credentials in browser code.

Sensitive operations:
- Account deletion
- Export
- Receipt access
- Profile updates

should be checked server-side.

Receipt storage:
- Private bucket.
- Generate temporary signed URLs only when needed.
- Validate MIME type and file size.
- Do not make receipt storage public by default.

## 8. API / mutation strategy

Prefer Server Actions for straightforward authenticated mutations inside the Next.js app.

Use Route Handlers when:
- An endpoint must be consumed independently.
- A download/stream response is needed.
- A webhook or external callback is required.

Every mutation follows:
```text
UI
→ validated input
→ server action
→ domain validation
→ authenticated data access
→ database mutation
→ cache/path revalidation
→ UI feedback
```

## 9. URL-driven filtering

For shareable/reloadable application state:
- date range
- category
- account
- transaction type
- search text

use URL search params.

Example:
```text
/dashboard?range=month&category=food
/transactions?type=expense&category=shopping
```

This improves back/forward navigation and makes debugging easier.

## 10. Caching/revalidation

Do not introduce a complex client cache library unless the interaction requires it.

Start with:
- Server-rendered reads.
- `revalidatePath()` / targeted cache invalidation after mutations.
- Local component state for small interactions.

Add TanStack Query later only when live/high-frequency client synchronization becomes necessary.

## 11. Error handling

Use:
- schema errors for invalid input
- domain errors for business rules
- friendly user-facing messages
- structured logs for debugging

Never return raw database errors to users.

## 12. Performance

Targets:
- Fast initial dashboard render.
- Charts should not block useful summary information.
- Lazy-load heavy interactive sections when appropriate.
- Optimize images with `next/image`.
- Avoid huge client component bundles.
- Paginate long transaction histories.
- Index user/date/category fields used in queries.

Recommended indexes:
```text
transactions(user_id, occurred_at DESC)
transactions(user_id, category_id, occurred_at DESC)
transactions(user_id, account_id, occurred_at DESC)
budgets(user_id, month_start)
```

## 13. Testing boundaries

Unit:
- finance calculations
- date range calculations
- validators
- formatters

Integration:
- data access functions
- authenticated mutation behavior

E2E:
- sign in
- add expense
- edit/delete expense
- dashboard updates
- budget creation
- CSV export
- mobile navigation
