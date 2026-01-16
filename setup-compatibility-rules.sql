-- ============================================================================
-- COMPATIBILITY RULES TABLE SETUP
-- ============================================================================

-- Create the compatibility_rules table if it doesn't exist
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

-- Create indexes for better performance
create index if not exists compatibility_rules_source_category_idx on compatibility_rules(source_category);
create index if not exists compatibility_rules_target_category_idx on compatibility_rules(target_category);
create index if not exists compatibility_rules_active_idx on compatibility_rules(active);

-- Enable Row Level Security
alter table compatibility_rules enable row level security;

-- Allow everyone to read compatibility rules
create policy "Compatibility rules are viewable by everyone"
  on compatibility_rules for select
  using (true);

-- ============================================================================
-- BASIC COMPATIBILITY RULES
-- ============================================================================

-- CPU socket must match motherboard socket
insert into compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description)
values 
  ('cpu', 'motherboard', 'socket', 'socket', 'equals', 'error', 'CPU socket must match motherboard socket', 'The CPU and motherboard must use the same socket type to physically connect.')
on conflict do nothing;

-- RAM speed should not exceed motherboard maximum
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

-- Power supply wattage check (warning only)
insert into compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description)
values 
  ('psu', 'gpu', 'wattage', 'tdp_watts', 'greater_than', 'warning', 'PSU wattage may be insufficient', 'The PSU may not provide enough power for the GPU under load. Consider a higher wattage PSU. This is a heuristic check - actual power needs depend on all components.')
on conflict do nothing;

-- Motherboard form factor must match case
insert into compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description)
values 
  ('motherboard', 'case', 'form_factor', 'form_factor', 'equals', 'error', 'Motherboard form factor must match case', 'The motherboard form factor (ATX, mATX, ITX) must be supported by the case.')
on conflict do nothing;

-- CPU cooler height must fit in case
insert into compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description)
values 
  ('cooler', 'case', 'height_mm', 'cpu_cooler_height_mm', 'less_than_or_equal', 'error', 'CPU cooler height exceeds case maximum', 'The CPU cooler is too tall to fit in the selected case.')
on conflict do nothing;

-- Additional useful rules

-- Check if motherboard has enough PCIe slots for GPU (basic check)
insert into compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description)
values 
  ('gpu', 'motherboard', 'pcie_slots', 'pcie_slots', 'greater_than', 'info', 'PCIe slot availability', 'Ensure the motherboard has sufficient PCIe slots for your GPU and other expansion cards.')
on conflict do nothing;

-- Storage interface compatibility with motherboard
insert into compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description)
values 
  ('storage', 'motherboard', 'interface', 'sata_ports', 'includes', 'info', 'Storage interface compatibility', 'Check that the storage interface (SATA, NVMe) is supported by the motherboard.')
on conflict do nothing;

-- ============================================================================
-- TRIGGER FOR UPDATED_AT
-- ============================================================================

-- Create trigger function to update updated_at timestamp
create or replace function update_compatibility_rules_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger
create trigger update_compatibility_rules_updated_at
  before update on compatibility_rules
  for each row
  execute function update_compatibility_rules_updated_at();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check that rules were inserted correctly
select 
  id,
  source_category || ' → ' || target_category as relationship,
  source_field || ' ' || operator || ' ' || target_field as rule,
  severity,
  message
from compatibility_rules 
where active = true 
order by severity desc, source_category, target_category;

-- Count rules by severity
select 
  severity,
  count(*) as rule_count
from compatibility_rules 
where active = true 
group by severity 
order by 
  case severity 
    when 'error' then 1 
    when 'warning' then 2 
    when 'info' then 3 
    else 4 
  end;
