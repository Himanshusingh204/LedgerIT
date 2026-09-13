-- Expense Tracker initial schema
-- Profiles, accounts, categories, transactions, budgets + RLS + indexes.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  currency char(3) not null default 'USD',
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by owner" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles are updatable by owner" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles are insertable by owner" on public.profiles
  for insert with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- accounts
-- ---------------------------------------------------------------------------
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  type text not null check (type in ('cash', 'bank', 'debit_card', 'credit_card', 'other')),
  currency char(3) not null default 'USD',
  last_four text,
  opening_balance numeric(14, 2) not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint accounts_last_four_length check (last_four is null or char_length(last_four) = 4)
);

alter table public.accounts enable row level security;

create policy "accounts are owned" on public.accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index accounts_user_id_idx on public.accounts (user_id);

-- ---------------------------------------------------------------------------
-- categories (user_id null = system default category, visible to everyone)
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  name text not null,
  slug text not null,
  icon text not null default 'circle',
  kind text not null check (kind in ('expense', 'income')),
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  constraint categories_user_slug_unique unique (user_id, slug)
);

alter table public.categories enable row level security;

create policy "categories are readable by owner or system" on public.categories
  for select using (user_id is null or auth.uid() = user_id);

create policy "categories are writable by owner" on public.categories
  for insert with check (auth.uid() = user_id);

create policy "categories are updatable by owner" on public.categories
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "categories are deletable by owner" on public.categories
  for delete using (auth.uid() = user_id);

create index categories_user_id_idx on public.categories (user_id);

-- ---------------------------------------------------------------------------
-- transactions
-- ---------------------------------------------------------------------------
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  account_id uuid not null references public.accounts (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  type text not null check (type in ('expense', 'income', 'transfer')),
  amount numeric(14, 2) not null check (amount > 0),
  currency char(3) not null default 'USD',
  merchant text,
  note text,
  receipt_url text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "transactions are owned" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index transactions_user_occurred_idx on public.transactions (user_id, occurred_at desc);
create index transactions_user_category_occurred_idx on public.transactions (user_id, category_id, occurred_at desc);
create index transactions_user_account_occurred_idx on public.transactions (user_id, account_id, occurred_at desc);

-- ---------------------------------------------------------------------------
-- budgets
-- ---------------------------------------------------------------------------
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  month_start date not null,
  amount numeric(14, 2) not null check (amount > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint budgets_user_category_month_unique unique (user_id, category_id, month_start)
);

alter table public.budgets enable row level security;

create policy "budgets are owned" on public.budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index budgets_user_month_idx on public.budgets (user_id, month_start);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger accounts_set_updated_at before update on public.accounts
  for each row execute function public.set_updated_at();

create trigger transactions_set_updated_at before update on public.transactions
  for each row execute function public.set_updated_at();

create trigger budgets_set_updated_at before update on public.budgets
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- profile bootstrap: create a profile row the moment a user signs up
-- ---------------------------------------------------------------------------
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
