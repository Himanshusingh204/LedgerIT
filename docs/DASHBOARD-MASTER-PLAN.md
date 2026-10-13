# Dashboard and Homepage Master Plan

Status as of this plan. "Verified" means exercised in a browser against the local
Supabase stack, not just type-checked.

## 1. Audit findings and fixes

| Area | Problem found | Fix | Status |
|---|---|---|---|
| Settings: currency | Saved correctly, but ~15 display sites never received it and fell back to USD | Currency threaded as a prop from each page (profile loaded once) into every formatter | Fixed, verified: EUR shows on dashboard, transactions, budgets |
| Settings: after save | Form kept stale values; no confirmation | Form remounts on saved profile; "Profile saved." status | Fixed, verified |
| Settings: revalidation | Only /settings and /dashboard were revalidated | Whole app revalidated on profile save | Fixed |
| KPI badges | Percent vs. a tiny baseline shown as +4455% or +3229% | No badge when baseline < $1 or change > 999% | Fixed |
| Budget meter | Percent unbounded | Capped display at 999% | Fixed |
| Account deletion | Missing; privacy copy promised it | Settings > Delete account, typed DELETE confirmation, storage cleanup, admin auth delete | Built, E2E test added |
| Migrations | Duplicate `0003` version broke `supabase start` | Renamed to `0007_short_links.sql` | Fixed |

## 2. Dashboard backlog (next, in priority order)

1. **Receipts:** a remove-receipt control on the transaction form (`deleteReceipt` exists in `lib/data/receipts.ts`, no UI yet).
2. **Account currency:** accounts still carry their own currency field, which the UI now ignores. Either remove it or make it editable per account.
3. **Categories:** add/rename/archive flows are present; verify each in the browser and add an E2E test.
4. **Timezone:** the profile timezone drives period boundaries; add a test that a late-night transaction lands in the right day.
5. **Empty and error states:** every data view already has loading and empty copy; confirm error copy on each page.
6. **Mobile:** review dashboard, transactions and budgets at 390px; KPI cards should stack without horizontal scroll.

## 3. Homepage

- Hero: left copy and CTA, right real product screenshot in a pointer-tilted frame (no `<div>` mockups).
- Product tour: alternating real screenshots (transactions, budgets).
- Features bento, principles list, pricing (free, real features only), FAQ, final CTA, feedback form.
- Pages: /features, /pricing, /about, /security, /privacy, /terms, /cookies.

Real screenshots are captured from the local demo account (`maya.demo@example.com`, synthetic data
only). Recapture them after any dashboard visual change.

## 4. Verification gate (run before every release)

- `npx tsc --noEmit`, `npx eslint . --max-warnings=0`, `npx vitest run`
- `npx playwright test` (desktop and mobile) against the local stack
- `npx next build`
- Overflow check: `document.documentElement.scrollWidth <= innerWidth` on every public and app page at 390px.
