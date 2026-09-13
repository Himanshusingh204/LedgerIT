-- Local/demo seed data. Synthetic only — never real personal finance data.
-- Run against a local Supabase instance after signing up a demo user, then
-- replace the placeholder user id below with that user's auth.users.id.

do $$
declare
  demo_user_id uuid := '00000000-0000-0000-0000-000000000000';
  cash_account_id uuid;
  bank_account_id uuid;
  food_category_id uuid;
  transport_category_id uuid;
  housing_category_id uuid;
  entertainment_category_id uuid;
  salary_category_id uuid;
begin
  if not exists (select 1 from public.profiles where id = demo_user_id) then
    raise notice 'Demo user % not found — sign up first, then update this script with the real id.', demo_user_id;
    return;
  end if;

  insert into public.accounts (user_id, name, type, opening_balance)
  values (demo_user_id, 'Everyday Bank', 'bank', 2500)
  returning id into bank_account_id;

  insert into public.accounts (user_id, name, type, opening_balance)
  values (demo_user_id, 'Cash Wallet', 'cash', 120)
  returning id into cash_account_id;

  select id into food_category_id from public.categories where slug = 'food-dining' and user_id is null;
  select id into transport_category_id from public.categories where slug = 'transport' and user_id is null;
  select id into housing_category_id from public.categories where slug = 'housing' and user_id is null;
  select id into entertainment_category_id from public.categories where slug = 'entertainment' and user_id is null;
  select id into salary_category_id from public.categories where slug = 'salary' and user_id is null;

  insert into public.transactions (user_id, account_id, category_id, type, amount, merchant, note, occurred_at) values
    (demo_user_id, bank_account_id, salary_category_id, 'income', 3200, 'Employer Payroll', 'Monthly salary', now() - interval '20 days'),
    (demo_user_id, bank_account_id, housing_category_id, 'expense', 1100, 'Skyline Apartments', 'Rent', now() - interval '18 days'),
    (demo_user_id, bank_account_id, food_category_id, 'expense', 64.50, 'Grocery Market', null, now() - interval '10 days'),
    (demo_user_id, cash_account_id, transport_category_id, 'expense', 12, 'Metro', 'Weekly pass top-up', now() - interval '9 days'),
    (demo_user_id, bank_account_id, entertainment_category_id, 'expense', 28, 'Movie night', null, now() - interval '4 days'),
    (demo_user_id, cash_account_id, food_category_id, 'expense', 9.75, 'Corner Cafe', 'Coffee', now() - interval '1 days');

  insert into public.budgets (user_id, category_id, month_start, amount) values
    (demo_user_id, food_category_id, date_trunc('month', now())::date, 400),
    (demo_user_id, transport_category_id, date_trunc('month', now())::date, 80),
    (demo_user_id, entertainment_category_id, date_trunc('month', now())::date, 100);
end $$;
