create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  username text not null unique,
  is_lp_active boolean not null default false,
  referred_by text
);

create index if not exists profiles_referred_by_idx
  on public.profiles (referred_by);

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

drop policy if exists "profiles_select_active_public" on public.profiles;
create policy "profiles_select_active_public"
  on public.profiles
  for select
  to anon, authenticated
  using (is_lp_active = true);

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
