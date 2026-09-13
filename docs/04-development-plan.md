# 04 — Development Plan

## 1. Delivery strategy

Build in vertical slices instead of creating every component first.

A vertical slice should include:
- database schema
- validation
- data access
- UI
- states
- tests

This reduces the chance of a beautiful UI sitting on incomplete business logic.

## 2. Phase 0 — Project foundation

Deliver:
- Next.js TypeScript app
- Tailwind
- linting/formatting
- environment template
- Supabase clients
- basic route groups
- global design tokens
- CI check for typecheck/lint/test
- README setup instructions

Exit criteria:
- local app starts cleanly
- production build succeeds
- no secrets committed

## 3. Phase 1 — Authentication + profile

Deliver:
- sign up/sign in/sign out
- protected routes
- profile bootstrap
- default categories
- navigation shell

Tests:
- auth redirects
- unauthenticated protection
- profile creation

## 4. Phase 2 — Accounts + transactions

Deliver:
- accounts CRUD
- categories CRUD
- transaction create/edit/delete
- validation
- transaction list
- filters
- pagination

Tests:
- cannot access another user's records
- invalid amounts rejected
- archived accounts handled correctly
- transaction totals are correct

## 5. Phase 3 — Dashboard

Deliver:
- summary metrics
- recent transactions
- spending category chart
- monthly trend chart
- account snapshot
- date/category/account filters
- loading/empty/error states

Important:
Dashboard should consume real queries, not duplicated client-side mock logic.

## 6. Phase 4 — Budgets + analytics

Deliver:
- budget CRUD
- progress calculations
- previous-period comparison
- analytics charts
- merchant/category analysis

Tests:
- budget progress
- over-budget thresholds
- month boundaries
- timezone edge cases

## 7. Phase 5 — Home page + carousel + polish

Deliver:
- responsive marketing page
- product carousel
- product imagery
- polished copy
- SEO metadata
- Open Graph image
- subtle motion

Use the supplied reference for visual direction but create an original layout.

## 8. Phase 6 — Export + production hardening

Deliver:
- filtered CSV export
- rate/abuse considerations
- error pages
- observability/logging
- performance review
- security review
- mobile QA

## 9. Testing matrix

### Unit
- amount parsing
- currency formatting
- net change
- budget progress
- date ranges
- previous-period math
- Zod schemas

### Integration
- authenticated CRUD
- RLS behavior
- dashboard aggregation
- export filters

### E2E
1. Visit home page.
2. Create account.
3. Sign in.
4. Create account.
5. Add expense.
6. Confirm dashboard update.
7. Add income.
8. Confirm net change.
9. Create monthly budget.
10. Confirm progress.
11. Filter transaction list.
12. Export CSV.
13. Test mobile navigation.

## 10. Pull-request quality gate

Before merge:
- typecheck passes
- lint passes
- tests pass
- production build passes
- no console errors on critical flows
- responsive review completed
- accessibility keyboard check completed
- no new secrets
- database migration included for schema changes

## 11. Git strategy

Use small feature branches:
```text
feat/auth
feat/transactions
feat/dashboard
feat/budgets
feat/analytics
fix/mobile-nav
```

Commit messages should describe intent:
```text
feat: add transaction creation flow
fix: handle empty dashboard month
refactor: isolate dashboard queries
test: cover budget progress rules
```

## 12. Deployment

Recommended:
- Vercel for application
- Supabase for database/auth/storage

Environments:
- local
- preview
- production

Use separate Supabase projects for serious staging/production work.

Deployment checklist:
- environment variables configured
- migrations applied
- RLS verified
- storage policies verified
- production URL configured
- auth redirect URLs configured
- build tested
- backups/retention understood

## 13. Seed data

Local/demo seed should contain realistic but clearly synthetic examples:
- grocery
- rent
- transport
- entertainment
- salary
- subscriptions

Never use real personal finance data in the repository.

## 14. Definition of done

A feature is done only when:
- behavior works
- responsive layout works
- loading/empty/error states work
- validation exists
- authorization exists
- tests exist
- analytics/dashboard numbers reconcile
- no placeholder text remains
- accessibility basics pass
- docs are updated
