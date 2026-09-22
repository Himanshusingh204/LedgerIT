-- Admin role: a separate table (not a profiles column) so multiple admins with
-- different grant provenance can exist later without a schema change.

create table public.admin_users (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  granted_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Security-definer helper so RLS policies elsewhere (and the app's server-side
-- admin check) can test admin status without every policy re-deriving it, and
-- without granting normal users select access to the admin_users table itself
-- (that would leak who the admins are).
create function public.is_admin(check_user_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = check_user_id);
$$;

-- Only an existing admin can read the admin list (via is_admin(), not a direct
-- self-referencing policy, to avoid recursive RLS evaluation).
create policy "admin_users are readable by admins" on public.admin_users
  for select using (public.is_admin(auth.uid()));

-- No insert/update/delete policy: granting admin is a deliberate, out-of-band
-- action (service-role key from a trusted context), never a client-side write.
