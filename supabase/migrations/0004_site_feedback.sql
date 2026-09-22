-- Visitor feedback form on the marketing site. Anonymous (not signed in) or
-- signed-in submissions are both accepted; nobody but an admin can read them
-- back — this is a one-way mailbox, not a public comment thread.

create table public.site_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  name text not null,
  email text,
  message text not null,
  created_at timestamptz not null default now(),
  constraint site_feedback_name_length check (char_length(name) between 1 and 120),
  constraint site_feedback_message_length check (char_length(message) between 1 and 2000)
);

alter table public.site_feedback enable row level security;

create policy "site_feedback is insertable by anyone" on public.site_feedback
  for insert with check (true);

create policy "site_feedback is readable by admins" on public.site_feedback
  for select using (public.is_admin(auth.uid()));

create index site_feedback_created_at_idx on public.site_feedback (created_at desc);
