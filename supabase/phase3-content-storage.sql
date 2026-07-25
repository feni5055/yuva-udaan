-- Phase 3: run this once in Supabase Dashboard -> SQL Editor.
-- It upgrades existing users, fixes public read policies, and creates secure
-- Storage buckets for magazine covers and PDFs.

begin;

-- Backfill profiles/authors for accounts created before the signup trigger.
insert into public.profiles (id, full_name)
select id, coalesce(raw_user_meta_data ->> 'full_name', '')
from auth.users
on conflict (id) do nothing;

insert into public.authors (profile_id, display_name)
select id, coalesce(nullif(raw_user_meta_data ->> 'full_name', ''), split_part(email, '@', 1))
from auth.users
on conflict (profile_id) do nothing;

-- Split public policies from authenticated/admin policies. This keeps the
-- SECURITY DEFINER admin helper unavailable to anonymous visitors.
drop policy if exists "Published magazines are public" on public.magazines;
drop policy if exists "Published magazines are readable by everyone" on public.magazines;
drop policy if exists "Owners and admins read unpublished magazines" on public.magazines;
create policy "Published magazines are readable by everyone"
  on public.magazines for select to anon, authenticated
  using (status = 'published');
create policy "Owners and admins read unpublished magazines"
  on public.magazines for select to authenticated
  using (created_by = auth.uid() or private.is_admin());

drop policy if exists "Published articles are public" on public.articles;
drop policy if exists "Published articles are readable by everyone" on public.articles;
drop policy if exists "Authors and admins read unpublished articles" on public.articles;
create policy "Published articles are readable by everyone"
  on public.articles for select to anon, authenticated
  using (status = 'published');
create policy "Authors and admins read unpublished articles"
  on public.articles for select to authenticated
  using (
    private.is_admin()
    or exists (
      select 1 from public.authors
      where id = author_id and profile_id = auth.uid()
    )
  );

drop policy if exists "Approved comments are public" on public.comments;
drop policy if exists "Approved comments are readable by everyone" on public.comments;
drop policy if exists "Owners and admins read pending comments" on public.comments;
create policy "Approved comments are readable by everyone"
  on public.comments for select to anon, authenticated
  using (is_approved);
create policy "Owners and admins read pending comments"
  on public.comments for select to authenticated
  using (profile_id = auth.uid() or private.is_admin());

drop policy if exists "Admins create articles" on public.articles;
create policy "Admins create articles"
  on public.articles for insert to authenticated
  with check (private.is_admin());

-- Storage buckets. Covers are public; PDFs are private and served through
-- short-lived signed links after an RLS check.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('magazine-covers', 'magazine-covers', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('magazine-pdfs', 'magazine-pdfs', false, 52428800, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users upload their own magazine covers" on storage.objects;
drop policy if exists "Users manage their own magazine covers" on storage.objects;
drop policy if exists "Users upload their own magazine PDFs" on storage.objects;
drop policy if exists "Published magazine PDFs are readable" on storage.objects;
drop policy if exists "Owners and admins read magazine PDFs" on storage.objects;
drop policy if exists "Owners and admins manage magazine PDFs" on storage.objects;

create policy "Users upload their own magazine covers"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'magazine-covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users manage their own magazine covers"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'magazine-covers'
    and ((storage.foldername(name))[1] = auth.uid()::text or private.is_admin())
  )
  with check (
    bucket_id = 'magazine-covers'
    and ((storage.foldername(name))[1] = auth.uid()::text or private.is_admin())
  );

create policy "Users upload their own magazine PDFs"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'magazine-pdfs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Published magazine PDFs are readable"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'magazine-pdfs'
    and exists (
      select 1 from public.magazines
      where magazines.pdf_url = storage.objects.name
        and magazines.status = 'published'
    )
  );

create policy "Owners and admins read magazine PDFs"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'magazine-pdfs'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or private.is_admin()
    )
  );

create policy "Owners and admins manage magazine PDFs"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'magazine-pdfs'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or private.is_admin()
    )
  );

commit;
