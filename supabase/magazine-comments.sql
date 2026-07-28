-- Magazine comments: run once in Supabase Dashboard -> SQL Editor.
-- Adds comments to published magazines while retaining article comments.

begin;

alter table public.comments
  alter column article_id drop not null;

alter table public.comments
  add column if not exists magazine_id uuid references public.magazines(id) on delete cascade;

alter table public.comments
  drop constraint if exists comments_one_parent_check;

alter table public.comments
  add constraint comments_one_parent_check check (
    (article_id is not null and magazine_id is null)
    or (article_id is null and magazine_id is not null)
  );

create index if not exists comments_magazine_id_idx
  on public.comments(magazine_id);

-- Recreate the policies explicitly so the intended ownership rules remain
-- clear and idempotent after this migration.
drop policy if exists "Approved comments are readable by everyone" on public.comments;
drop policy if exists "Owners and admins read pending comments" on public.comments;
drop policy if exists "Signed-in users create their own comments" on public.comments;
drop policy if exists "Admins moderate comments" on public.comments;
drop policy if exists "Users delete their own comments or admins delete" on public.comments;

create policy "Approved comments are readable by everyone"
  on public.comments for select to anon, authenticated
  using (is_approved);

create policy "Owners and admins read pending comments"
  on public.comments for select to authenticated
  using (profile_id = auth.uid() or private.is_admin());

create policy "Signed-in users create their own comments"
  on public.comments for insert to authenticated
  with check (
    profile_id = auth.uid()
    and is_approved = false
    and (
      (article_id is not null and magazine_id is null)
      or (article_id is null and magazine_id is not null)
    )
  );

create policy "Admins moderate comments"
  on public.comments for update to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "Users delete their own comments or admins delete"
  on public.comments for delete to authenticated
  using (profile_id = auth.uid() or private.is_admin());

commit;
