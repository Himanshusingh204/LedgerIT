-- Migration 0006: Enhanced Admin Features, Analytics RPC, Profiles Access, and Audit Logging

-- 1. Security-definer RPC to gather high-level platform health and analytics
-- Strictly guarded: only users where is_admin(auth.uid()) = true can execute this.
create or replace function public.get_admin_stats()
returns json
language plpgsql
security definer set search_path = public
as $$
declare
  v_user_count bigint := 0;
  v_tx_count bigint := 0;
  v_feedback_count bigint := 0;
  v_categories_count bigint := 0;
  v_accounts_count bigint := 0;
  v_budgets_count bigint := 0;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Access denied: caller is not an administrator.';
  end if;

  select count(*) into v_user_count from public.profiles;
  select count(*) into v_tx_count from public.transactions;
  select count(*) into v_feedback_count from public.site_feedback;
  select count(*) into v_categories_count from public.categories where user_id is null;
  select count(*) into v_accounts_count from public.accounts;
  select count(*) into v_budgets_count from public.budgets;

  return json_build_object(
    'user_count', v_user_count,
    'transaction_count', v_tx_count,
    'feedback_count', v_feedback_count,
    'system_categories_count', v_categories_count,
    'accounts_count', v_accounts_count,
    'budgets_count', v_budgets_count,
    'generated_at', now()
  );
end;
$$;

-- 2. Allow admins to view the profiles table for the User Directory
-- Without this, only the profile owner can read their own profile row.
create policy "profiles are readable by admins" on public.profiles
  for select using (public.is_admin(auth.uid()));

-- 3. Allow admins to delete or triage visitor feedback
create policy "site_feedback is deletable by admins" on public.site_feedback
  for delete using (public.is_admin(auth.uid()));

-- 4. Audit & Monitoring Log table for tracking admin operations and system events
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references public.profiles (id) on delete set null,
  action text not null,
  target_type text not null,
  target_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_audit_logs enable row level security;

create policy "admin_audit_logs are readable by admins" on public.admin_audit_logs
  for select using (public.is_admin(auth.uid()));

create policy "admin_audit_logs are insertable by admins" on public.admin_audit_logs
  for insert with check (public.is_admin(auth.uid()));

create index if not exists admin_audit_logs_created_at_idx on public.admin_audit_logs (created_at desc);
