# 05 — Master Build Prompt for a Coding AI

You are the senior full-stack engineer, system designer, UI engineer, QA engineer, and code reviewer for this repository.

Build the Expense Tracker as a real, deployable product.

## Read these files first

Before changing code, read in this order:

1. `README.md`
2. `docs/01-product-requirements.md`
3. `docs/02-system-architecture.md`
4. `docs/03-ui-ux-design-system.md`
5. `docs/04-development-plan.md`

The image at `public/design-reference/dashboard-reference.png` is a **visual reference only**.

## Non-negotiable engineering rules

1. Use Next.js App Router + TypeScript.
2. Use Server Components by default.
3. Use Client Components only when interaction requires them.
4. Keep business logic out of presentational components.
5. Centralize Supabase access in `lib/supabase` and `lib/data`.
6. Validate all user input with Zod.
7. Store monetary values as PostgreSQL numeric/decimal.
8. Never store full card numbers, CVV, PINs, or bank passwords.
9. Enforce authorization in the database with RLS, not only in UI code.
10. Never expose service-role secrets to the browser.
11. Every database change must be a migration.
12. Write tests for finance calculations and critical flows.
13. Do not use fake dashboard numbers once real data exists.
14. Build responsive layouts from the start, not as a final patch.
15. Keep comments useful: explain WHY, constraints, or non-obvious decisions.
16. Do not over-engineer. Prefer the simplest architecture that satisfies the requirement.
17. Do not introduce libraries without a clear need.
18. Do not leave TODOs for required MVP behavior.

## UI rules

The supplied reference communicates a visual direction:
- light blue environment
- strong blue accent
- compact sidebar
- clean finance cards
- clear transaction history
- readable charts

Translate that into an original UI.

Do NOT:
- clone the screenshot pixel-for-pixel
- use excessive glassmorphism
- put everything in a giant grid of rounded cards
- use fake AI labels
- use “Smart AI” boxes or generic assistant copy
- fill screens with decorative gradients
- use random stock imagery without a source record
- use giant dashboard numbers without context
- use lorem ipsum or obviously synthetic demo copy

The product should look like a thoughtful human-designed finance application.

## Image policy

For external imagery:
- Prefer Pexels or Unsplash.
- Download approved assets and self-host them in `public/images`.
- Record source, author, URL, license, and download date in an image source registry.
- Prefer images without visible brands/logos or identifiable people when avoidable.
- Check third-party rights for depicted people, brands, art, and property.
- Never copy competitor screenshots or protected product assets.

## Build order

### Step 1 — Inspect
Inspect the repository, installed packages, existing files, and environment template.

Do not overwrite an existing working feature without understanding it.

### Step 2 — Foundation
Set up:
- route groups
- layout
- global styles
- design tokens
- Supabase client/server utilities
- middleware
- validation utilities
- error boundaries

### Step 3 — Database
Create migrations for:
- profiles
- accounts
- categories
- transactions
- budgets

Add constraints and indexes.

Enable and test RLS.

### Step 4 — Authentication
Implement:
- sign up
- sign in
- sign out
- protected routes
- profile bootstrap

### Step 5 — Finance domain
Implement and test:
- transaction validation
- net change
- category totals
- budget progress
- date filtering
- previous-period comparison

Keep these functions framework-agnostic when practical.

### Step 6 — Transactions
Build the transaction ledger and transaction form.

Make the add-expense flow fast and excellent on mobile.

### Step 7 — Dashboard
Build the dashboard using real database queries.

Desktop hierarchy should roughly follow:

Sidebar → header/filter → summary → trends/breakdown → transactions/budgets.

Mobile should become a natural vertical information flow.

### Step 8 — Budgets and analytics
Build budget progress and analytical charts.

Make chart content understandable without requiring the user to hover.

### Step 9 — Home page
Build:
- hero
- product carousel
- feature/value section
- how it works
- final CTA
- responsive footer

The carousel should showcase real product UI screens.

### Step 10 — Polish
Check:
- mobile 320–430px
- tablet
- desktop
- wide desktop

Fix layout and interaction problems rather than just shrinking everything.

## Data integrity rules

All dashboard metrics must be reproducible from stored transaction data.

For a selected period:
```text
expense total = sum(amount where type = expense)
income total = sum(amount where type = income)
net change = income total - expense total
```

Transfers are excluded from expense totals.

Budget spending uses only expense transactions within the budget month and category.

Use the user's timezone when determining period boundaries.

## Error/empty-state requirements

Never leave blank spaces when a user has no data.

Use useful messages:
- “No transactions yet. Add your first expense to start your history.”
- “No spending recorded in this period.”
- “No budget set for this category.”

Every error state should offer a useful next action when possible.

## Accessibility requirements

Every interactive feature must:
- be keyboard reachable
- have visible focus
- have accessible names
- work without relying on color alone
- support reduced motion
- provide readable mobile touch targets

## Performance requirements

- Keep client bundles small.
- Do not turn whole routes into Client Components unnecessarily.
- Use image optimization.
- Paginate transactions.
- Avoid recalculating expensive aggregates in render.
- Fetch only required columns/data.

## Code-quality requirements

Prefer:
```text
feature-oriented component boundaries
small functions
explicit types
domain-specific names
predictable state flow
```

Avoid:
```text
giant 500-line components
generic "utils2.ts"
deep prop drilling
duplicated business rules
magic numbers
unexplained side effects
```

## Before declaring completion

Run:
- typecheck
- lint
- unit/integration tests
- production build
- critical Playwright flows

Review the result as a senior engineer:
- Are calculations correct?
- Is authorization actually enforced?
- Is the UI genuinely responsive?
- Is the dashboard useful with real data?
- Does the interface look original and human-designed?
- Are there any placeholder texts, dead buttons, or fake interactions?
- Are external images properly sourced?
- Are secrets and private data protected?

Then update the README with the final setup instructions and any important deployment notes.

## Final principle

Do not optimize for “looks impressive in a screenshot.”

Optimize for:
**correct data → clear hierarchy → fast actions → accessible interaction → secure storage → maintainable code → deployable production build.**
