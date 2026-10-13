-- Short links for URL shortener
create table if not exists public.short_links (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  original_url text not null,
  user_id uuid references auth.users(id) on delete set null,
  hit_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.short_links enable row level security;

-- Anyone can read a link that exists (needed for redirect lookup on server).
create policy "short_links_select_all"
  on public.short_links for select
  using (true);

-- Authenticated users can create short links owned by themselves.
create policy "short_links_insert_own"
  on public.short_links for insert
  with check (auth.uid() = user_id or user_id is null);

create index if not exists short_links_code_idx on public.short_links(code);

create or replace function public.increment_short_link_hits(p_code text)
returns void
language sql
as $$
  update public.short_links set hit_count = hit_count + 1 where code = p_code;
$$;