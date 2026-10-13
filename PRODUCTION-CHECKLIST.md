# Production Readiness Checklist

## Done
- [x] Typecheck clean (`tsc --noEmit`)
- [x] Lint clean (`eslint`)
- [x] Unit + integration tests pass (95+)
- [x] Production build passes
- [x] SEO: sitemap.xml, robots.txt, manifest, OG/Twitter, JSON-LD
- [x] llms.txt added
- [x] 404 and 403 pages
- [x] Legal pages (privacy, terms, cookies)
- [x] URL shortener API (`/api/shorten`, `/s/[code]`)
- [x] PWA service worker + manifest
- [x] Companion mobile scaffold (`mobile/`)
- [x] Security headers (CSP nonce via middleware)

## Next
- [ ] Run Lighthouse in production mode
- [ ] Apply Supabase migration `0003_short_links.sql`
- [ ] Configure `NEXT_PUBLIC_APP_URL` for production
- [ ] Configure Supabase auth redirects
- [ ] Mobile feature parity (CRUD screens)
- [ ] E2E tests for new routes