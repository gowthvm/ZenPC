-- Supabase schema for ZenPC

-- Parts table (for demo, minimal fields)
create table if not exists parts (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  data jsonb not null,
  created_at timestamptz default now()
);

-- Builds table
create table if not exists builds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  parts jsonb not null,
  created_at timestamptz default now()
);

-- Index for user builds
create index if not exists builds_user_id_idx on builds(user_id);
