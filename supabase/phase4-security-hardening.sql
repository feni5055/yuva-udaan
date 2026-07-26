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

-- Keep a private, tamper-resistant history of magazine changes.
create table if not exists private.magazine_audit_log (
  id bigint generated always as identity primary key,
  magazine_id uuid,
  actor_id uuid,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  old_status text,
  new_status text,
  occurred_at timestamptz not null default now()
);

alter table private.magazine_audit_log enable row level security;
revoke all on table private.magazine_audit_log from public, anon, authenticated;

create or replace function private.audit_magazine_change()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, auth, private
as $$
begin
  insert into private.magazine_audit_log (
    magazine_id,
    actor_id,
    action,
    old_status,
    new_status
  )
  values (
    coalesce(new.id, old.id),
    auth.uid(),
    tg_op,
    case when tg_op in ('UPDATE', 'DELETE') then old.status else null end,
    case when tg_op in ('INSERT', 'UPDATE') then new.status else null end
  );
  return coalesce(new, old);
end;
$$;

revoke all on function private.audit_magazine_change() from public, anon, authenticated;
drop trigger if exists magazine_audit_trigger on public.magazines;
create trigger magazine_audit_trigger
after insert or update or delete on public.magazines
for each row execute function private.audit_magazine_change();

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
