-- Local/demo seed data. Synthetic only — never real personal finance data.
-- Run against a local Supabase instance after signing up a demo user, then
-- replace the placeholder user id below with that user's auth.users.id.
--
-- Kept to exactly one account / one transaction / one budget — just enough
-- to visually confirm data flows through the dashboard, ledger, and budget
-- progress bar, not a populated demo dataset.

do $$
declare
  demo_user_id uuid := '00000000-0000-0000-0000-000000000000';
  bank_account_id uuid;
  food_category_id uuid;
begin
  if not exists (select 1 from public.profiles where id = demo_user_id) then
    raise notice 'Demo user % not found — sign up first, then update this script with the real id.', demo_user_id;
    return;
  end if;

  insert into public.accounts (user_id, name, type, opening_balance)
  values (demo_user_id, 'Everyday Bank', 'bank', 2500)
  returning id into bank_account_id;

  select id into food_category_id from public.categories where slug = 'food-dining' and user_id is null;

  insert into public.transactions (user_id, account_id, category_id, type, amount, merchant, note, occurred_at) values
    (demo_user_id, bank_account_id, food_category_id, 'expense', 9.75, 'Corner Cafe', 'Coffee', now() - interval '1 days');

  insert into public.budgets (user_id, category_id, month_start, amount) values
    (demo_user_id, food_category_id, date_trunc('month', now())::date, 400);
end $$;
