-- Phase 4: run once in the Supabase SQL Editor.
-- Removes legacy public SECURITY DEFINER functions and locks the private helpers.

begin;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

drop function if exists public.is_admin();
drop function if exists public.handle_new_user();

revoke all on function private.is_admin() from public, anon;
revoke all on function private.handle_new_user() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

alter function private.is_admin() set search_path = pg_catalog, public, auth;
alter function private.handle_new_user() set search_path = pg_catalog, public, auth;

-- Recreate the anonymous contact form rule with validation, never USING (true).
drop policy if exists "Anyone can submit a contact message" on public.contact_messages;
drop policy if exists "Anyone can submit a validated contact message" on public.contact_messages;
create policy "Anyone can submit a validated contact message"
on public.contact_messages
for insert
to anon, authenticated
with check (
  char_length(trim(name)) between 1 and 120
  and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  and char_length(trim(subject)) <= 200
  and char_length(trim(message)) between 1 and 5000
);

commit;
