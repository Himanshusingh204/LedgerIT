## Summary
<!-- Provide a brief description of the changes in this PR. -->

## Changes Made
- 

## Verification & Testing
- [ ] `npx tsc --noEmit` passed (0 errors)
- [ ] `npm test` passed (all unit & integration tests green)
- [ ] `npm run build` succeeded
- [ ] Tested locally in browser

## Architectural Invariants Check
- [ ] Server Components by default (`"use client"` only where necessary)
- [ ] Zero database calls outside `lib/data/*`
- [ ] All mutations routed through `lib/actions/*` with Zod validation
- [ ] RLS policies respected; no service role key used in client code
- [ ] Money stored as `numeric(14,2)`
