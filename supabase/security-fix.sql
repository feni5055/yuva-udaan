-- Run this once in Supabase SQL Editor to clear the Security Advisor findings
-- produced by the previous schema version.

begin;

create schema if not exists private;
revoke all on schema private from public;

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and is_admin = true);
$$;

create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare name_value text := coalesce(new.raw_user_meta_data ->> 'full_name', '');
begin
  insert into public.profiles (id, full_name) values (new.id, name_value) on conflict (id) do nothing;
  insert into public.authors (profile_id, display_name) values (new.id, name_value) on conflict (profile_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure private.handle_new_user();

drop policy if exists "Profiles are readable by their owner or an admin" on public.profiles;
drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Authors are publicly readable" on public.authors;
drop policy if exists "Authors can update their own profile" on public.authors;
drop policy if exists "Categories are publicly readable" on public.categories;
drop policy if exists "Admins manage categories" on public.categories;
drop policy if exists "Published magazines are public" on public.magazines;
drop policy if exists "Anyone can read published magazines" on public.magazines;
drop policy if exists "Users create their own magazine drafts" on public.magazines;
drop policy if exists "Authenticated users can create their own drafts" on public.magazines;
drop policy if exists "Owners update their drafts and admins review" on public.magazines;
drop policy if exists "Users can update their own drafts" on public.magazines;
drop policy if exists "Admins or owners delete drafts" on public.magazines;
drop policy if exists "Published articles are public" on public.articles;
drop policy if exists "Authors create their own drafts" on public.articles;
drop policy if exists "Authors update drafts and admins review" on public.articles;
drop policy if exists "Authors delete drafts and admins delete" on public.articles;
drop policy if exists "Approved comments are public" on public.comments;
drop policy if exists "Signed-in users create their own comments" on public.comments;
drop policy if exists "Admins moderate comments" on public.comments;
drop policy if exists "Users delete their own comments or admins delete" on public.comments;
drop policy if exists "Anyone can submit a contact message" on public.contact_messages;
drop policy if exists "Anyone can submit a validated contact message" on public.contact_messages;
drop policy if exists "Admins can manage contact messages" on public.contact_messages;
drop policy if exists "Admins update contact messages" on public.contact_messages;

drop function if exists public.handle_new_user();
drop function if exists public.is_admin();
revoke all on function private.is_admin() from public;
revoke all on function private.handle_new_user() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create policy "Profiles are readable by their owner or an admin" on public.profiles for select to authenticated using (auth.uid() = id or private.is_admin());
create policy "Users can update their own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id and is_admin = (select is_admin from public.profiles where id = auth.uid()));
create policy "Authors are publicly readable" on public.authors for select using (true);
create policy "Authors can update their own profile" on public.authors for update to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "Categories are publicly readable" on public.categories for select using (true);
create policy "Admins manage categories" on public.categories for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Published magazines are public" on public.magazines for select using (status = 'published' or created_by = auth.uid() or private.is_admin());
create policy "Users create their own magazine drafts" on public.magazines for insert to authenticated with check (created_by = auth.uid() and status = 'draft');
create policy "Owners update their drafts and admins review" on public.magazines for update to authenticated using ((created_by = auth.uid() and status = 'draft') or private.is_admin()) with check ((created_by = auth.uid() and status = 'draft') or private.is_admin());
create policy "Admins or owners delete drafts" on public.magazines for delete to authenticated using ((created_by = auth.uid() and status = 'draft') or private.is_admin());
create policy "Published articles are public" on public.articles for select using (status = 'published' or private.is_admin() or exists (select 1 from public.authors where id = author_id and profile_id = auth.uid()));
create policy "Authors create their own drafts" on public.articles for insert to authenticated with check (status = 'draft' and exists (select 1 from public.authors where id = author_id and profile_id = auth.uid()));
create policy "Authors update drafts and admins review" on public.articles for update to authenticated using ((status = 'draft' and exists (select 1 from public.authors where id = author_id and profile_id = auth.uid())) or private.is_admin()) with check ((status = 'draft' and exists (select 1 from public.authors where id = author_id and profile_id = auth.uid())) or private.is_admin());
create policy "Authors delete drafts and admins delete" on public.articles for delete to authenticated using ((status = 'draft' and exists (select 1 from public.authors where id = author_id and profile_id = auth.uid())) or private.is_admin());
create policy "Approved comments are public" on public.comments for select using (is_approved or profile_id = auth.uid() or private.is_admin());
create policy "Signed-in users create their own comments" on public.comments for insert to authenticated with check (profile_id = auth.uid() and is_approved = false);
create policy "Admins moderate comments" on public.comments for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Users delete their own comments or admins delete" on public.comments for delete to authenticated using (profile_id = auth.uid() or private.is_admin());
create policy "Anyone can submit a validated contact message" on public.contact_messages for insert to anon, authenticated with check (char_length(trim(name)) between 1 and 120 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\\.[^[:space:]@]+$' and char_length(trim(subject)) <= 200 and char_length(trim(message)) between 1 and 5000);
create policy "Admins can manage contact messages" on public.contact_messages for select to authenticated using (private.is_admin());
create policy "Admins update contact messages" on public.contact_messages for update to authenticated using (private.is_admin()) with check (private.is_admin());

commit;
