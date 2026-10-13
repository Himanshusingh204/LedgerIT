# Clearledger Mobile (Expo)

Companion mobile client that connects to the **same Supabase project** as the web app.

## Setup
1. Install Expo CLI deps: `npm install`
2. Create `.env` with:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Run: `npm start`

The mobile client shares auth, accounts, transactions, budgets and categories with the web app. Feature parity is incremental; today it supports sign-in and messaging. Full CRUD screens are next.