# 03 — UI / UX Design System

## 1. Design direction

Use the supplied dashboard image as the **visual reference**, especially for:
- cool blue primary accent
- left navigation
- roomy desktop content area
- compact finance summary modules
- clean charts
- strong dashboard title
- restrained white surfaces

Do not clone the composition pixel-for-pixel.

The target should feel like a designer-built finance product with its own identity.

Reference asset:
`public/design-reference/dashboard-reference.png`

## 2. Visual personality

Keywords:
**calm, precise, modern, trustworthy, practical, human**

Avoid:
- giant gradients everywhere
- excessive glassmorphism
- every section inside a floating rounded rectangle
- huge icon circles
- fake “AI” language
- generic SaaS buzzwords
- meaningless decorative dashboards
- excessive animation
- overuse of blue in every element

## 3. Color system

Start with a light theme.

Suggested semantic tokens:
```text
--background
--surface
--surface-muted
--foreground
--foreground-muted
--border
--primary
--primary-foreground
--success
--warning
--danger
--chart-1
--chart-2
--chart-3
```

Use the reference's blue family as inspiration but tune contrast for accessibility.

Dark mode can be added after the light theme is stable.

## 4. Typography

Use a clean sans-serif with strong numerals.

Hierarchy:
- Display: large, confident, not oversized.
- Page title: clear and compact.
- Section title: medium weight.
- Body: comfortable reading size.
- Metadata: smaller and muted.
- Money figures: use tabular/lining numerals where available.

Do not use more than two font families.

## 5. Spacing

Use a consistent spacing scale.

Desktop:
- Main content max-width around 1400px.
- Comfortable 24–32px section gaps.
- 16–24px internal component spacing.

Mobile:
- Page padding around 16px.
- Reduce decorative spacing before reducing readable text size.
- Keep touch targets large enough for comfortable use.

## 6. Corners, borders, shadows

Use modest radii.

Suggested:
- controls: 8–10px
- medium surfaces: 12px
- major surfaces: 14–18px

Do not use very large “pill” shapes for ordinary buttons.

Borders should do more work than shadows.

Shadows:
- subtle
- sparse
- used mainly for menus/dialogs and elevated interactive elements

## 7. Navigation

Desktop:
- Slim left sidebar.
- Product mark and product name.
- Dashboard
- Transactions
- Budgets
- Analytics
- Settings

Mobile:
- Compact top bar.
- Bottom navigation for the most important destinations or an accessible drawer.
- Add-transaction action should remain easy to reach.

Active state should use a subtle filled background and clear icon/text contrast.

## 8. Dashboard layout

Recommended desktop structure:

```text
┌─────────────┬────────────────────────────────────────────┐
│ Sidebar     │ Top bar                                     │
│             ├─────────────────────────────────────────────┤
│             │ Page title + date/filter controls            │
│             ├─────────────────────────────────────────────┤
│             │ Summary metrics                              │
│             ├───────────────────────┬─────────────────────┤
│             │ Spending trend        │ Category breakdown  │
│             ├───────────────────────┼─────────────────────┤
│             │ Recent transactions   │ Budget progress     │
│             └───────────────────────┴─────────────────────┘
```

Do not force the reference's exact card arrangement if the real data makes another hierarchy clearer.

## 9. Summary metrics

Examples:
- Total spent
- Income
- Net change
- Budget remaining

Each metric needs:
- clear number
- time period
- small context or comparison
- optional trend indicator

Do not show decorative percentages that are not backed by real data.

## 10. Charts

Chart rules:
- Meaning before decoration.
- Use labels and tooltips.
- Always have a text alternative or nearby summary.
- Avoid 3D charts.
- Avoid too many series.
- Use consistent category mapping.

Recommended charts:
- Line/area trend for monthly spending.
- Horizontal bars for category ranking.
- Donut only when the number of categories is small and a legend is clear.

## 11. Transaction list

A useful row contains:
- category icon
- merchant/title
- category + date
- amount
- income/expense indicator

Desktop can show columns.

Mobile should stack the information without creating a horizontal-scroll table.

Use realistic content:
- “Grocery Market”
- “Metro”
- “Electricity”
- “Movie night”
rather than lorem ipsum.

## 12. Forms

Add transaction form fields:
```text
Type
Amount
Category
Account
Merchant
Date
Note
Receipt
```

Behavior:
- autofocus amount when appropriate
- numeric keyboard on mobile
- sensible defaults
- inline validation
- preserve input if submission fails
- clear success feedback

Prefer a focused modal/sheet on desktop/mobile for quick entry, while still supporting full-page editing when useful.

## 13. Home carousel

Use a product-focused visual carousel rather than stock-photo slides.

Each slide:
- product screenshot/mockup
- short title
- one sentence of benefit
- small progression indicator

Motion:
- 300–500ms transitions
- no constant bouncing
- pause on hover/focus
- respect reduced motion

## 14. Imagery rules

For marketing visuals, prefer:
- real lifestyle photographs from Pexels or Unsplash
- simple product screenshots
- subtle texture only when useful

Do not:
- use copyrighted UI screenshots from competitors
- scrape random Google image results
- ship hotlinked remote images with unknown licensing
- use identifiable people as fake testimonials
- use visible logos/brands without checking rights

For every downloaded external image keep:
```json
{
  "file": "public/images/hero-money.jpg",
  "source": "Pexels",
  "author": "...",
  "sourceUrl": "...",
  "license": "Pexels License",
  "downloadedAt": "YYYY-MM-DD"
}
```

## 15. Accessibility

Minimum:
- WCAG-aware color contrast.
- Visible focus state.
- Full keyboard support.
- Form labels.
- Meaningful button names.
- `aria-live` for async success/errors where appropriate.
- Accessible chart summaries.
- No critical information conveyed only by color.
- Reduced-motion support.

## 16. Responsive breakpoints

Use content-driven breakpoints around:
- mobile: < 640px
- tablet: 640–1023px
- desktop: 1024–1279px
- wide: >= 1280px

Do not assume all users have a 1440px monitor.

## 17. Humanization rules for AI-generated UI/code

The coding AI must:
- Write natural product copy.
- Choose component names that describe real responsibility.
- Keep comments short and explain **why**, not what obvious code does.
- Avoid comments like “This button component renders a button.”
- Avoid generic placeholder data in the final UI.
- Avoid naming things “AIInsightCard”, “SmartMoneyBox”, or similar gimmicks.
- Prefer domain language: `SpendingSummary`, `BudgetProgress`, `TransactionList`.
- Use empty states that tell people what to do next.
- Keep visual repetition intentional.
