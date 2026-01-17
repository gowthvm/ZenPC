-- Enhanced Compatibility Rules Migration
-- V3 Enhancement: Comprehensive spec-driven compatibility validation
-- Date: 2026-01-17

-- ============================================================================
-- COMPREHENSIVE COMPATIBILITY RULES
-- ============================================================================
-- These rules implement all hard compatibility, performance, and educational checks

-- Clear existing rules (preserve data before running)
-- DELETE FROM compatibility_rules WHERE active = true;

-- ============================================================================
-- 1. HARD COMPATIBILITY RULES (ERRORS ONLY)
-- Build-breaking incompatibilities
-- ============================================================================

-- CPU ↔ Motherboard socket compatibility
INSERT INTO compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description, active)
VALUES ('cpu', 'motherboard', 'socket', 'socket', 'equals', 'error', 'CPU Socket Mismatch', 'CPU socket must match motherboard socket', true)
ON CONFLICT DO NOTHING;

-- RAM ↔ Motherboard memory type
INSERT INTO compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description, active)
VALUES ('ram', 'motherboard', 'memory_type', 'memory_type', 'equals', 'error', 'Memory Type Mismatch', 'RAM memory type must match motherboard support', true)
ON CONFLICT DO NOTHING;

-- Cooler ↔ Case height clearance (error severity - must fit physically)
INSERT INTO compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description, active)
VALUES ('cooler', 'case', 'height_mm', 'cpu_cooler_height_mm', 'less_than_or_equal', 'error', 'CPU Cooler Height Exceeds Case Maximum', 'CPU cooler height must not exceed case maximum clearance', true)
ON CONFLICT DO NOTHING;

-- GPU ↔ Case physical length clearance
INSERT INTO compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description, active)
VALUES ('gpu', 'case', 'length_mm', 'gpu_max_length_mm', 'less_than_or_equal', 'error', 'GPU Length Exceeds Case Maximum', 'GPU physical length must fit within case', true)
ON CONFLICT DO NOTHING;

-- Motherboard ↔ Case form factor
INSERT INTO compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description, active)
VALUES ('motherboard', 'case', 'form_factor', 'motherboard_form_factors', 'includes', 'error', 'Motherboard Form Factor Incompatible', 'Motherboard form factor must be supported by case', true)
ON CONFLICT DO NOTHING;

-- PSU ↔ Case form factor
INSERT INTO compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description, active)
VALUES ('psu', 'case', 'psu_form_factor_type', 'psu_form_factor', 'includes', 'error', 'PSU Form Factor Incompatible', 'PSU form factor must be supported by case', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 2. PERFORMANCE & LIMITATION WARNINGS (HEURISTIC)
-- Advisory warnings about suboptimal configurations
-- ============================================================================

-- RAM speed downclocking warning
INSERT INTO compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description, active)
VALUES ('ram', 'motherboard', 'ram_speed_mhz', 'max_ram_speed_mhz', 'less_than_or_equal', 'warning', 'RAM Speed Within Motherboard Limits', 'RAM will run at motherboard maximum if rated higher', true)
ON CONFLICT DO NOTHING;

-- PCIe generation mismatch (GPU to motherboard)
INSERT INTO compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description, active)
VALUES ('gpu', 'motherboard', 'pcie_generation', 'pcie_generation', 'equals', 'info', 'PCIe Generation Mismatch', 'GPU and motherboard have different PCIe generations (backward compatible)', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. INFORMATIONAL & EDUCATIONAL CHECKS
-- Best practices and educational information
-- ============================================================================

-- Storage interface support (informational)
INSERT INTO compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description, active)
VALUES ('storage', 'motherboard', 'interface', 'storage_interfaces', 'includes', 'info', 'Storage Interface Compatibility', 'Storage interface should be supported by motherboard', true)
ON CONFLICT DO NOTHING;

-- NVMe protocol support (informational)
INSERT INTO compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description, active)
VALUES ('storage', 'motherboard', 'nvme_pcie_gen', 'nvme_pcie_gen', 'equals', 'info', 'NVMe PCIe Generation Match', 'NVMe PCIe generation should match motherboard support', true)
ON CONFLICT DO NOTHING;

-- ECC RAM on consumer board (informational)
INSERT INTO compatibility_rules (source_category, target_category, source_field, target_field, operator, severity, message, description, active)
VALUES ('ram', 'motherboard', 'ecc_support', 'ecc_support', 'equals', 'info', 'ECC RAM Compatibility', 'ECC RAM works on non-ECC boards but without error correction', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DOCUMENTATION FOR ADVANCED ENGINE CHECKS
-- ============================================================================
-- The following compatibility checks are implemented in advancedCompatibilityEngine.ts
-- and do not require database rules (they use heuristics and spec values):
--
-- HARD COMPATIBILITY (ERRORS):
-- - CPU ↔ Motherboard socket compatibility [IMPLEMENTED]
-- - CPU ↔ RAM memory type (via RAM ↔ Motherboard) [IMPLEMENTED]
-- - RAM ↔ Motherboard memory type [IMPLEMENTED]
-- - GPU ↔ Case physical clearance (length, height) [IMPLEMENTED]
-- - Cooler ↔ Socket compatibility [IMPLEMENTED - heuristic]
-- - Cooler ↔ Case height clearance [IMPLEMENTED]
-- - Motherboard ↔ Case form factor [IMPLEMENTED]
-- - PSU ↔ Case form factor [IMPLEMENTED]
-- - Required power connectors availability [IMPLEMENTED - heuristic]
--   * GPU power connectors (8-pin, 6-pin, 12VHPWR)
--   * Motherboard 24-pin connector
--   * CPU power connectors (4-pin, 8-pin)
--
-- PERFORMANCE WARNINGS (HEURISTIC):
-- - RAM speed exceeding motherboard support (downclocking) [IMPLEMENTED]
-- - PSU wattage vs estimated system draw with 30-40% headroom [IMPLEMENTED]
-- - CPU ↔ GPU performance tier mismatch (bottleneck warning) [IMPLEMENTED]
-- - Cooler TDP rating vs CPU TDP [IMPLEMENTED]
-- - PCIe generation mismatches (informational bandwidth) [IMPLEMENTED]
--
-- INFORMATIONAL CHECKS:
-- - PCIe backward compatibility explanations [IMPLEMENTED]
-- - ECC RAM behavior on consumer boards [IMPLEMENTED]
-- - NVMe speed limitations on older chipsets [IMPLEMENTED]
-- - Modular vs non-modular PSU cable considerations [IMPLEMENTED]
-- - Upgrade path hints based on socket longevity [IMPLEMENTED]
--
-- ============================================================================

-- ============================================================================
-- FUTURE: ADVANCED RULE SCHEMA (PLACEHOLDER)
-- ============================================================================
-- This shows the intended direction for more sophisticated rules
-- Currently, advanced checks are implemented directly in advancedCompatibilityEngine.ts
--
-- CREATE TABLE IF NOT EXISTS advanced_compatibility_rules (
--   id uuid primary key default gen_random_uuid(),
--   name text not null unique,
--   category text not null check (category in ('hard', 'warning', 'info')),
--   eval_logic jsonb not null, -- Complex evaluation rules
--   message text not null,
--   description text,
--   recommendation text,
--   active boolean default true,
--   created_at timestamptz default now(),
--   updated_at timestamptz default now()
-- );
--
-- This would enable:
-- - Conditional rule evaluation
-- - Multi-part comparisons
-- - Heuristic scoring
-- - Dynamic message generation
-- - Rule versioning and A/B testing
--
-- ============================================================================
