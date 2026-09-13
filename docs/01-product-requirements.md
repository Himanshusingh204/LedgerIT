# 01 — Product Requirements

## 1. Product vision

Build a personal expense tracker that answers three questions quickly:

1. How much did I spend?
2. Where did the money go?
3. What should I pay attention to next?

The product should feel like a polished financial utility, not a generic dashboard template.

## 2. Primary user

A person who wants lightweight control over everyday money without the complexity of accounting software.

Typical actions:
- Add an expense in seconds.
- See today's/month's spending.
- Understand category distribution.
- Review unusual or high-value transactions.
- Set a monthly category budget.
- Filter and export transaction history.

## 3. MVP scope

### Authentication
- Sign up, sign in, sign out.
- Password reset.
- Optional magic-link flow.
- Protected application routes.
- Session-aware navigation.

### Accounts
- Create an account such as Cash, Bank, Debit Card, Credit Card.
- Store only safe metadata: name, type, currency, optional masked last-four.
- Never store full card numbers, CVV, PIN, or banking passwords.
- Archive an account without deleting its history.

### Transactions
Every transaction supports:
- Amount
- Type: expense, income, transfer
- Category
- Account
- Merchant/payee
- Note
- Transaction date
- Optional receipt image
- Created/updated timestamps

Validation:
- Amount must be greater than zero.
- Expense and income semantics must be explicit.
- Category must belong to the authenticated user or a trusted system category.
- Date cannot be malformed.
- File uploads must be type/size checked.

### Categories
Seed a useful default set:
- Housing
- Food & Dining
- Transport
- Shopping
- Entertainment
- Health
- Bills
- Education
- Travel
- Personal
- Other

Allow users to rename, create, archive, and choose an icon.

### Dashboard
Show:
- Current-period spending
- Current-period income
- Net balance change
- Budget progress
- Account snapshots
- Recent transactions
- Category breakdown
- Monthly trend
- Date-range filter
- Category filter
- Account filter

Dashboard values must be derived from real transaction data.

### Budgets
- Monthly budget per category.
- Progress = spent / budget.
- Remaining = budget - spent.
- Over-budget state.
- Current month + previous/next month navigation.

### Analytics
- Spending by category.
- Spending over time.
- Income vs expense.
- Top merchants.
- Comparison with previous period.

### Export
- CSV export for filtered transactions.
- Exports should respect the current filter.
- Do not expose internal IDs unless useful.

## 4. Home page

The home page is public and should contain:

### Hero
Headline should communicate the value, not describe the software.

Example direction:
“Know where your money is going.”

Supporting copy:
“Track everyday spending, understand your habits, and make the next decision with confidence.”

Primary CTA:
“Start tracking”

Secondary CTA:
“See how it works”

### Product carousel
A 3–4 slide carousel showing different product views:
1. Dashboard overview
2. Transaction entry
3. Budget progress
4. Analytics

Use the supplied dashboard image as a design reference, not as a product asset.

Carousel requirements:
- Autoplay with pause-on-hover.
- Manual previous/next controls.
- Dot indicators.
- Keyboard accessible.
- Swipe support on touch screens.
- Respect `prefers-reduced-motion`.
- Captions explain what the user gains from each screen.

### Supporting sections
Keep it focused:
- Why it is useful
- Three-step workflow
- Feature highlights
- Final CTA

Do not build a wall of cards.

## 5. Dashboard interaction rules

The dashboard should feel alive because data changes, not because every element animates.

Interactions:
- Change date range → totals/charts/recent transactions refresh.
- Click a category → related transaction list can be filtered.
- Click a chart legend item → series toggles where useful.
- Hover/tap chart points → readable tooltip.
- Add transaction → dashboard updates without a full page refresh.
- Delete transaction → confirmation and optimistic or immediate refresh.
- Empty month → explain what to do next, with a clear “Add transaction” action.

## 6. States

Every data-driven component needs:
- Loading
- Empty
- Error
- Success
- Disabled

Avoid generic “Something went wrong” when a more useful explanation is possible.

Examples:
- Empty transactions: “No transactions yet. Add your first expense to start your history.”
- Empty budget: “No budgets for this month. Set one to see your progress.”
- Failed chart: “We could not load this chart. Your transactions are still safe.”

## 7. Non-goals for MVP

Do not build initially:
- Bank account linking
- Open banking
- Investment tracking
- Tax filing
- Credit scoring
- AI financial advice
- Multi-user family finance
- Complex recurring billing

These can be future modules after the core product is stable.

## 8. Success criteria

A first-time user should be able to:
- Create an account.
- Add an expense.
- See it reflected on the dashboard.
- Filter it in transactions.
- Assign a budget.
- Understand whether the category is on track.
- Export transactions.

A returning user should understand the current financial picture within a few seconds of opening the dashboard.
