-- Extensions (for gen_random_uuid)
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

create table if not exists public.hutbas (
  id uuid primary key default gen_random_uuid(),
  published_at timestamptz not null default now(),
  created_by text,
  title jsonb not null,
  content jsonb not null
);

-- RLS
alter table public.hutbas enable row level security;

-- Public read
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'hutbas' and policyname = 'Public read hutbas'
  ) then
    create policy "Public read hutbas"
      on public.hutbas
      for select
      to anon
      using (true);
  end if;
end $$;