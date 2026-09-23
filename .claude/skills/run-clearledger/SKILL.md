---
name: run-clearledger
description: Build, launch, and drive the Clearledger expense tracker (Next.js + local Supabase) — use to run/start the app, sign in, screenshot pages, or verify a change works in the real dev server rather than just tests.
---

Clearledger is a single Next.js (App Router) web app backed by a local Supabase
stack (Postgres + Auth via Docker). It's driven with a small Playwright-based
REPL, `driver.mjs`, in this skill directory — `chromium-cli` itself isn't
installed on this host, so the driver talks to the `playwright` package
(already a project devDependency) directly, with the same nav/wait-for/click/
fill/screenshot vocabulary.

All paths below are relative to the repo root (`Expense Tracker/`).

## Prerequisites

- Docker Desktop running (the local Supabase stack runs in containers).
- Node deps installed: `npm install` (already done if `node_modules/` exists).
- Playwright's Chromium browser installed: `npx playwright install chromium`
  (already present in this checkout at
  `~/AppData/Local/ms-playwright/chromium-1243`).

## Start the stack

```bash
npx supabase start        # starts/resumes the local Postgres + Auth containers
                           # (needs Docker Desktop already running)
npm run dev &              # Next.js dev server on :3000, backed by .env.local
```

`.env.local` already points at the local Supabase stack
(`http://127.0.0.1:54321` + the local demo keys) — nothing to configure.

Wait for both before driving anything:

```bash
timeout 30 bash -c 'until curl -sf http://127.0.0.1:54321/auth/v1/health >/dev/null; do sleep 2; done'
timeout 30 bash -c 'until curl -sf http://localhost:3000 >/dev/null; do sleep 2; done'
```

Stop when done: `npx supabase stop` (preserves data) and kill the `next dev`
process (there's no separate "stop" command — the dev server has no lockfile
port cleanup, so `lsof`/`netstat`-kill port 3000, or just kill the background
job).

## Run (agent path) — the driver

Pipe a line-based script to `driver.mjs`, same shape as `chromium-cli`:

```bash
cat <<'EOF' | node .claude/skills/run-clearledger/driver.mjs
nav http://localhost:3000
wait-for text=Clearledger
screenshot 01-landing
nav http://localhost:3000/sign-in
wait-for text=Sign in
fill input[name="email"] you@example.com
fill input[name="password"] YourPassword123!
click button[type="submit"]
wait-for text=Dashboard
sleep 1000
screenshot 02-dashboard-after-signin
console
EOF
```

Commands: `nav <url>`, `wait-for text=<substring>` or `wait-for <css-selector>`,
`click <css-selector>` / `click text=<substring>`, `fill <css-selector> <value>`,
`press <Key>`, `screenshot [name]`, `screenshot-element <sel> [name]`,
`eval <js>`, `console` (prints buffered console/page errors, then clears the
buffer), `sleep <ms>`, `quit`. Full doc comment at the top of `driver.mjs`.

Screenshots land in
`.claude/skills/run-clearledger/screenshots/<name>.png` (full-page PNG).

**Every command in one `driver.mjs` invocation shares one browser context**
(one set of cookies) — that's what makes a sign-in → protected-page flow
work. Two separate `node driver.mjs` invocations do **not** share
cookies/session; keep a whole user flow in one heredoc.

This was verified in this session against a real (fresh) signed-up user on
the local Supabase stack: landing page render, sign-up ("check your email"
screen — see Gotchas), sign-in landing on `/dashboard` with a real session
cookie, and `/settings` rendering the authenticated shell with the user's
name pre-filled. Screenshots from that run are committed in `screenshots/`.

### Creating a throwaway test user

Local Supabase has `enable_confirmations = false` (see
`supabase/config.toml`), so `/sign-up` creates an immediately-usable account
even though the UI always shows a static "check your email" screen (the form
doesn't branch on whether confirmation is actually required — see Gotchas).
Sign up, then sign in with the same credentials directly:

```bash
cat <<'EOF' | node .claude/skills/run-clearledger/driver.mjs
nav http://localhost:3000/sign-up
wait-for text=Create account
fill input[name="displayName"] Test User
fill input[name="email"] test-123@example.com
fill input[name="password"] TestPass123!
click button[type="submit"]
sleep 1500
nav http://localhost:3000/sign-in
wait-for text=Sign in
fill input[name="email"] test-123@example.com
fill input[name="password"] TestPass123!
click button[type="submit"]
wait-for text=Dashboard
screenshot signed-in
EOF
```

## Run (human path)

`npm run dev`, open `http://localhost:3000`. Useless in a headless/agent
context — no browser window to see.

## Studio / inspecting the local DB

`http://127.0.0.1:54323` while the stack is running (table browser, SQL
editor, auth users list).

## Gotchas

- **On this Windows host, a `(npm run dev > log 2>&1 &)` backgrounded dev
  server can silently die between separate Bash tool calls** — it serves
  requests fine within the call that started it, then is gone (connection
  refused) by the next call, sometimes after exiting with code 127 on its
  own with no obvious trigger. Don't chase this as an app bug. When a test
  needs the server alive across multiple steps (e.g. a script that requests
  a password-reset email, then needs to fetch that email and act on the
  link — see the password-reset gotcha below), start the server **and**
  run the whole test **in one Bash call**, chained with `;`, e.g.:
  `(npm run dev > log 2>&1 &) ; for i in $(seq 1 15); do curl -sf
  http://localhost:3000 >/dev/null && break; sleep 1; done ; node
  your-script.mjs`. Splitting startup and usage across separate tool calls
  is what triggers this.
- **Testing password reset (or any PKCE email-link flow) needs one
  continuous browser context, not the line-based driver.** The reset link
  only works in the *same* browser session that requested it (the PKCE code
  verifier is stored client-side) — a fresh `node driver.mjs` invocation is
  a fresh context with no verifier, so following the link there always
  fails with `?error=auth-callback-failed`, which looks exactly like a real
  bug until you realize it's a test-setup issue. To actually test this
  flow, write a one-off Playwright script (not the line-based driver) that:
  requests the reset in a context, fetches the email from Mailpit's API
  (`http://127.0.0.1:54324/api/v1/messages`, then `.../message/<id>`) with
  plain `fetch()`, extracts the link via a URL regex on `.Text`/`.HTML`,
  and navigates **that same page** to it before filling the new password.
- **`npm run dev` can hide CSP/security bugs that only reproduce in a real
  production build.** This project's CSP uses a per-request nonce
  (`lib/supabase/middleware.ts`) — on `next dev` everything looked fine, but
  a real `next build && next start` revealed every script on `/` and
  `/sign-up` was silently blocked by the browser (the nonce on those
  statically-prerendered pages was baked in at build time and could never
  match the fresh per-request nonce in the CSP header). Caught it via
  `console --errors` after a Lighthouse run, not by visual inspection — the
  page *looked* fine because `<a href>` navigation still worked without any
  JS. **When verifying anything CSP/script/hydration-related, test against
  `npx next build && npm run start`, not just `npm run dev`.** See
  `TASKS.md`'s Phase 16 entry and `ARCHITECTURE.md` §4 for the full story.
- **Sign-up always shows "Check your email," even with confirmations
  disabled.** `components/auth/sign-up-form.tsx` doesn't branch on Supabase's
  actual response — it shows the same success screen either way. On this repo's
  local stack (`enable_confirmations = false`), the account is already
  usable; just go sign in with the same credentials instead of trying to
  find a confirmation link in Mailpit.
- **The account-add button is "Add account," not "Add an account."** Easy
  copy to get wrong when scripting a `wait-for`/`click text=`.
- **The account form's balance field is `name="openingBalance"`**, not
  `startingBalance` or `balance` — check `components/settings/add-account-form.tsx`
  before scripting a fill.
- **A `nav` to a protected route immediately after a sign-in redirect can
  bounce back to `/sign-in?redirectTo=...`** — the auth cookie can lag the
  page's own client-side redirect by a beat in headless mode. `driver.mjs`'s
  `nav` command auto-retries once after a 1s wait if this happens, but for
  reliability still put a `sleep 800`+ between "just signed in" and the next
  `nav` in your script.
- **`click button[type="submit"]` is not specific enough on `/settings`.**
  The header's "Sign out" button is *also* `type="submit"` (a
  `<form action={signOutAction}>`) and sits earlier in the DOM than any
  dialog content, so `.first()` matches it instead of whatever form you
  actually meant — this looked exactly like a random session-drop bug (the
  page bounces to `/sign-in`, and the dev server log shows
  `signOutAction()` fired) until traced back to the selector. Always target
  a dialog's submit button by its visible text instead, e.g.
  `click button:has-text("Add account")`.
- **Long chained scripts can crash the headless Chromium tab** after several
  dozen commands in one run. If a script that used to work starts throwing
  `Target crashed`/`Page crashed` partway through, split it into several
  **shorter** driver invocations (e.g. one for sign-in + a screenshot, a
  fresh one for the next mutation) rather than debugging the crash itself.
- **`docker ps` failing with `open //./pipe/dockerDesktopLinuxEngine`** means
  Docker Desktop isn't running yet — `Start-Process 'C:\Program
  Files\Docker\Docker\Docker Desktop.exe'` and poll `docker ps` until it
  succeeds (took ~5s in this session; container set was already provisioned
  from a prior session, so `npx supabase start` just resumed it).
- **React controlled inputs need `fill`, not `eval el.value = ...`** — the
  latter doesn't fire React's `onChange`, so the form state never updates.

## Troubleshooting

- `docker ps` errors with a named-pipe connection failure → Docker Desktop
  isn't running; start it and wait before running `npx supabase start`.
- Driver commands all time out with `err ... Timeout 15000ms exceeded` right
  after a sign-in → you're mid-race on the auth cookie (see Gotchas); add a
  `sleep` before the next `nav`, or re-run.
- `err ... Target crashed` / `Page crashed` → the headless Chromium tab died;
  `quit` (or let the script end) and start a fresh `driver.mjs` invocation
  rather than continuing to send it commands.
