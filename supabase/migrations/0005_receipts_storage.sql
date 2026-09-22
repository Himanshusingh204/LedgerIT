-- Private Storage bucket for transaction receipts. Per docs/02-system-architecture.md §7:
-- "Do not make receipt storage public by default" — `public = false` means every read needs a
-- signed URL generated on demand (see lib/data/receipts.ts), never a bare public URL.
--
-- Objects are stored at "<user_id>/<uuid>.<ext>" — storage.foldername(name) splits that path, and
-- [1] (Postgres arrays are 1-indexed) is the first segment, i.e. the owning user's id. This is the
-- standard Supabase Storage RLS pattern for per-user folders.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'receipts',
  'receipts',
  false,
  5242880, -- 5 MiB
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);

create policy "receipts are readable by owner" on storage.objects
  for select using (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "receipts are insertable by owner" on storage.objects
  for insert with check (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "receipts are deletable by owner" on storage.objects
  for delete using (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);
