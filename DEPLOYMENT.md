# Deployment

## 1. Create the hosted Supabase project

1. Create a project in the Supabase dashboard.
2. Link the repository and apply the migrations in order:

   ```bash
   npx supabase link --project-ref <project-ref>
   npx supabase db push
   ```

3. In Authentication settings, set the Site URL to your production domain and add
   `https://<your-domain>/callback` to the redirect URLs.
4. Set the email sending limits and sign-up protection you want. The relaxed local rate
   limits in `supabase/config.toml` do not apply to a hosted project.
5. Confirm that the `receipts` bucket (created by migration `0005`) is private.

## 2. Configure the host

Set these environment variables in the host, for example Vercel:

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project API URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public key |
| `NEXT_PUBLIC_APP_URL` | Production URL, no trailing slash |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. Store it as a secret. |

## 3. Deploy

Connect the repository and deploy the `main` branch. Each push to `main` triggers a build.

## 4. Check each release

- Sign up with a new account and confirm the dashboard loads.
- Add an expense, a budget and an account, then export CSV.
- Change the currency in Settings and confirm it shows on the dashboard.
- If a staging URL exists, run the end-to-end tests against it.

## Running the end-to-end tests locally

The Playwright config starts the dev server on port 3000. Point it at the local stack first:

```bash
npx supabase start
set -a; eval "$(npx supabase status -o env | sed 's/^/export /')"; set +a
export NEXT_PUBLIC_SUPABASE_URL="$API_URL" NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="$PUBLISHABLE_KEY"
export SUPABASE_SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY" NEXT_PUBLIC_APP_URL=http://localhost:3000
npx playwright test
```
