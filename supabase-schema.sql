-- Supabase schema for ZenPC (Production-Ready V2)
-- Spec-driven architecture with stabilized schema

-- ============================================================================
-- PARTS TABLE
-- ============================================================================
-- Product metadata in columns, specifications in data JSONB
create table if not exists parts (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooler')),
  name text not null,
  brand text,
  price numeric(10, 2),
  image_url text,
  data jsonb not null default '{}'::jsonb, -- Specifications only (must match Spec Dictionary keys)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for parts
create index if not exists parts_category_idx on parts(category);
create index if not exists parts_brand_idx on parts(brand);
create index if not exists parts_price_idx on parts(price);
create index if not exists parts_created_at_idx on parts(created_at);

-- ============================================================================
-- BUILDS TABLE
-- ============================================================================
-- User builds with sharing support
create table if not exists builds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  parts jsonb not null default '{}'::jsonb, -- Selected parts by category
  total_price numeric(10, 2),
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for builds
create index if not exists builds_user_id_idx on builds(user_id);
create index if not exists builds_is_public_idx on builds(is_public);
create index if not exists builds_created_at_idx on builds(created_at);

-- ============================================================================
-- COMPATIBILITY RULES TABLE
-- ============================================================================
-- Declarative compatibility logic using spec keys
create table if not exists compatibility_rules (
  id uuid primary key default gen_random_uuid(),
  source_category text not null check (source_category in ('cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooler')),
  target_category text not null check (target_category in ('cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooler')),
  source_field text not null, -- Must match Spec Dictionary key
  target_field text not null, -- Must match Spec Dictionary key
  operator text not null check (operator in ('equals', 'not_equals', 'greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal', 'includes', 'not_includes')),
  severity text not null check (severity in ('error', 'warning', 'info')),
  message text not null,
  description text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for compatibility rules
create index if not exists compatibility_rules_source_category_idx on compatibility_rules(source_category);
create index if not exists compatibility_rules_target_category_idx on compatibility_rules(target_category);
create index if not exists compatibility_rules_active_idx on compatibility_rules(active);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
alter table parts enable row level security;
alter table builds enable row level security;
alter table compatibility_rules enable row level security;

-- Parts: Readable by everyone
create policy "Parts are viewable by everyone"
  on parts for select
  using (true);

-- Compatibility Rules: Readable by everyone
create policy "Compatibility rules are viewable by everyone"
  on compatibility_rules for select
  using (true);

-- Builds: Users can read their own builds and public builds
create policy "Users can view their own builds"
  on builds for select
  using (auth.uid() = user_id);

create policy "Users can view public builds"
  on builds for select
  using (is_public = true);

-- Builds: Users can insert their own builds
create policy "Users can create their own builds"
  on builds for insert
  with check (auth.uid() = user_id);

-- Builds: Users can update their own builds
create policy "Users can update their own builds"
  on builds for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Builds: Users can delete their own builds
create policy "Users can delete their own builds"
  on builds for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_parts_updated_at
  before update on parts
  for each row
  execute function update_updated_at_column();

create trigger update_builds_updated_at
  before update on builds
  for each row
  execute function update_updated_at_column();

create trigger update_compatibility_rules_updated_at
  before update on compatibility_rules
  for each row
  execute function update_updated_at_column();

-- ============================================================================
-- EXAMPLE COMPATIBILITY RULES
-- ============================================================================
-- Note: All spec keys should use normalized names (e.g., tdp_watts, not tdp_w)

-- CPU socket must match motherboard socket
insert into compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description)
values 
  ('cpu', 'motherboard', 'socket', 'socket', 'equals', 'error', 'CPU socket must match motherboard socket', 'The CPU and motherboard must use the same socket type to physically connect.')
on conflict do nothing;

-- RAM speed should not exceed motherboard max
insert into compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description)
values 
  ('ram', 'motherboard', 'ram_speed_mhz', 'max_ram_speed_mhz', 'less_than_or_equal', 'warning', 'RAM speed exceeds motherboard maximum', 'The RAM will run at the motherboard''s maximum supported speed, not its rated speed.')
on conflict do nothing;

-- RAM type must match motherboard support
insert into compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description)
values 
  ('ram', 'motherboard', 'memory_type', 'memory_type', 'equals', 'error', 'RAM type must match motherboard support', 'The RAM type (DDR4/DDR5) must match what the motherboard supports.')
on conflict do nothing;

-- GPU length must fit in case
insert into compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description)
values 
  ('gpu', 'case', 'length_mm', 'gpu_max_length_mm', 'less_than_or_equal', 'error', 'GPU length exceeds case maximum', 'The GPU is too long to fit in the selected case.')
on conflict do nothing;

-- Power supply wattage check (heuristic - warning only)
-- Note: This is a simplified check. Real power requirements depend on all components.
insert into compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description)
values 
  ('psu', 'gpu', 'wattage', 'tdp_watts', 'greater_than', 'warning', 'PSU wattage may be insufficient', 'The PSU may not provide enough power for the GPU under load. Consider a higher wattage PSU. This is a heuristic check - actual power needs depend on all components.')
on conflict do nothing;
