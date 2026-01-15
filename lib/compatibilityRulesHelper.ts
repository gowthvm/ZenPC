/**
 * Compatibility Rules Helper
 * 
 * Utility functions for managing compatibility rules in Supabase.
 * Use these functions to add, update, or manage compatibility rules.
 */

import { supabase } from './supabaseClient';
import type { CompatibilityRule, CompatibilityOperator, CompatibilitySeverity } from './compatibilityEngine';

/**
 * Add a new compatibility rule
 */
export async function addCompatibilityRule(
  sourceCategory: string,
  targetCategory: string,
  sourceField: string,
  targetField: string,
  operator: CompatibilityOperator,
  severity: CompatibilitySeverity,
  message: string,
  description?: string
) {
  const { data, error } = await supabase
    .from('compatibility_rules')
    .insert({
      source_category: sourceCategory,
      target_category: targetCategory,
      source_field: sourceField,
      target_field: targetField,
      operator,
      severity,
      message,
      description,
      active: true
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding compatibility rule:', error);
    throw error;
  }
  
  return data;
}

/**
 * Update an existing compatibility rule
 */
export async function updateCompatibilityRule(
  ruleId: string,
  updates: Partial<CompatibilityRule>
) {
  const { data, error } = await supabase
    .from('compatibility_rules')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', ruleId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating compatibility rule:', error);
    throw error;
  }
  
  return data;
}

/**
 * Deactivate a compatibility rule (soft delete)
 */
export async function deactivateCompatibilityRule(ruleId: string) {
  return updateCompatibilityRule(ruleId, { active: false });
}

/**
 * Activate a compatibility rule
 */
export async function activateCompatibilityRule(ruleId: string) {
  return updateCompatibilityRule(ruleId, { active: true });
}

/**
 * Get all compatibility rules (including inactive)
 */
export async function getAllCompatibilityRules() {
  const { data, error } = await supabase
    .from('compatibility_rules')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching compatibility rules:', error);
    return [];
  }
  
  return data as CompatibilityRule[];
}

/**
 * Example: Add a rule for CPU cooler height compatibility
 */
export async function addCpuCoolerHeightRule() {
  return addCompatibilityRule(
    'cooler',
    'case',
    'height_mm',
    'cpu_cooler_height_mm',
    'less_than_or_equal',
    'error',
    'CPU Cooler Height Exceeds Case Maximum',
    'The CPU cooler is too tall to fit in the selected case.'
  );
}

/**
 * Example: Add a rule for storage interface compatibility
 */
export async function addStorageInterfaceRule() {
  return addCompatibilityRule(
    'storage',
    'motherboard',
    'interface',
    'storage_interfaces',
    'includes',
    'warning',
    'Storage Interface Compatibility',
    'Ensure the motherboard supports the storage interface (SATA, NVMe, etc.).'
  );
}
