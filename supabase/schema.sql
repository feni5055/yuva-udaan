-- Run this in Supabase Dashboard → SQL Editor.
-- Supabase already owns auth.users. `profiles` is the public application-user table.

create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete set null,
  display_name text not null,
  bio text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.magazines (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  category text not null default '', -- compatibility with the current frontend
  category_id uuid references public.categories(id) on delete set null,
  volume text not null,
  year text not null,
  publication_date date,
  editors text not null default '',
  status text not null default 'draft' check (status in ('draft', 'review', 'published')),
  cover_url text,
  pdf_url text,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe upgrades if you already ran an earlier version of this schema.
alter table public.magazines add column if not exists category text not null default '';
alter table public.magazines add column if not exists category_id uuid references public.categories(id) on delete set null;
alter table public.magazines add column if not exists updated_at timestamptz not null default now();

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  magazine_id uuid references public.magazines(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid not null references public.authors(id) on delete cascade,
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  language text not null default 'hi' check (language in ('hi', 'en', 'bilingual')),
  status text not null default 'draft' check (status in ('draft', 'review', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade,
  magazine_id uuid references public.magazines(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  constraint comments_one_parent_check check (
    (article_id is not null and magazine_id is null)
    or (article_id is null and magazine_id is not null)
  )
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null check (char_length(message) between 1 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'resolved')),
  created_at timestamptz not null default now()
);

create index if not exists magazines_category_id_idx on public.magazines(category_id);
create index if not exists magazines_status_idx on public.magazines(status);
create index if not exists articles_magazine_id_idx on public.articles(magazine_id);
create index if not exists articles_category_id_idx on public.articles(category_id);
create index if not exists articles_status_idx on public.articles(status);
create index if not exists comments_article_id_idx on public.comments(article_id);
create index if not exists comments_magazine_id_idx on public.comments(magazine_id);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and is_admin = true);
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  name_value text := coalesce(new.raw_user_meta_data ->> 'full_name', '');
begin
  insert into public.profiles (id, full_name) values (new.id, name_value)
  on conflict (id) do nothing;
  insert into public.authors (profile_id, display_name) values (new.id, name_value)
  on conflict (profile_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure private.handle_new_user();

revoke all on function private.is_admin() from public;
revoke all on function private.handle_new_user() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.authors enable row level security;
alter table public.magazines enable row level security;
alter table public.articles enable row level security;
alter table public.comments enable row level security;
alter table public.contact_messages enable row level security;

-- Profiles and authors
create policy "Profiles are readable by their owner or an admin" on public.profiles for select to authenticated using (auth.uid() = id or private.is_admin());
create policy "Users can update their own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id and is_admin = (select is_admin from public.profiles where id = auth.uid()));
create policy "Authors are publicly readable" on public.authors for select using (true);
create policy "Authors can update their own profile" on public.authors for update to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- Categories
create policy "Categories are publicly readable" on public.categories for select using (true);
create policy "Admins manage categories" on public.categories for all to authenticated using (private.is_admin()) with check (private.is_admin());

-- Magazines and articles
create policy "Published magazines are public" on public.magazines for select using (status = 'published' or created_by = auth.uid() or private.is_admin());
create policy "Users create their own magazine drafts" on public.magazines for insert to authenticated with check (created_by = auth.uid() and status = 'draft');
create policy "Owners update their drafts and admins review" on public.magazines for update to authenticated using ((created_by = auth.uid() and status = 'draft') or private.is_admin()) with check ((created_by = auth.uid() and status = 'draft') or private.is_admin());
create policy "Admins or owners delete drafts" on public.magazines for delete to authenticated using ((created_by = auth.uid() and status = 'draft') or private.is_admin());

create policy "Published articles are public" on public.articles for select using (status = 'published' or private.is_admin() or exists (select 1 from public.authors where id = author_id and profile_id = auth.uid()));
create policy "Authors create their own drafts" on public.articles for insert to authenticated with check (status = 'draft' and exists (select 1 from public.authors where id = author_id and profile_id = auth.uid()));
create policy "Authors update drafts and admins review" on public.articles for update to authenticated using ((status = 'draft' and exists (select 1 from public.authors where id = author_id and profile_id = auth.uid())) or private.is_admin()) with check ((status = 'draft' and exists (select 1 from public.authors where id = author_id and profile_id = auth.uid())) or private.is_admin());
create policy "Authors delete drafts and admins delete" on public.articles for delete to authenticated using ((status = 'draft' and exists (select 1 from public.authors where id = author_id and profile_id = auth.uid())) or private.is_admin());

-- Comments and contact messages
create policy "Approved comments are public" on public.comments for select using (is_approved or profile_id = auth.uid() or private.is_admin());
create policy "Signed-in users create their own comments" on public.comments for insert to authenticated with check (profile_id = auth.uid() and is_approved = false);
create policy "Admins moderate comments" on public.comments for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Users delete their own comments or admins delete" on public.comments for delete to authenticated using (profile_id = auth.uid() or private.is_admin());
create policy "Anyone can submit a validated contact message" on public.contact_messages for insert to anon, authenticated with check (
  char_length(trim(name)) between 1 and 120
  and email ~* '^[^[:space:]@]+@[^[:space:]@]+\\.[^[:space:]@]+$'
  and char_length(trim(subject)) <= 200
  and char_length(trim(message)) between 1 and 5000
);
create policy "Admins can manage contact messages" on public.contact_messages for select to authenticated using (private.is_admin());
create policy "Admins update contact messages" on public.contact_messages for update to authenticated using (private.is_admin()) with check (private.is_admin());

-- Initial public categories. Re-running this will not create duplicates.
insert into public.categories (name, slug) values
  ('Poetry', 'poetry'), ('Short Story', 'short-story'), ('Essay', 'essay'),
  ('Culture & Tradition', 'culture-tradition'), ('Festivals', 'festivals'),
  ('Art & Illustration', 'art-illustration'), ('Photography', 'photography'),
  ('History & Heritage', 'history-heritage'), ('Youth & Student Life', 'youth-student-life')
on conflict (slug) do nothing;

-- After signing up, make your own account an admin by changing the email below:
-- update public.profiles set is_admin = true where id = (select id from auth.users where email = 'you@example.com');
