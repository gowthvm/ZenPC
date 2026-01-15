/**
 * Compatibility Rules Engine
 * 
 * Evaluates compatibility between parts using rules from Supabase.
 * All logic is spec-driven - no hardcoded compatibility checks.
 */

import { supabase } from './supabaseClient';
import { getSpecDefinition } from './specDictionary';

export type CompatibilitySeverity = 'error' | 'warning' | 'info';
export type CompatibilityOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'greater_than' 
  | 'less_than' 
  | 'greater_than_or_equal' 
  | 'less_than_or_equal' 
  | 'includes' 
  | 'not_includes';

export interface CompatibilityRule {
  id: string;
  source_category: string;
  target_category: string;
  source_field: string;
  target_field: string;
  operator: CompatibilityOperator;
  severity: CompatibilitySeverity;
  message: string;
  description?: string;
}

export interface CompatibilityIssue {
  type: string;
  severity: CompatibilitySeverity;
  message: string;
  explanation: string;
  fix?: string;
  affected: string[];
  rule_id?: string;
}

export interface CompatibilityConfirmation {
  type: string;
  message: string;
  explanation: string;
}

/**
 * Extract spec value from a part's data structure
 * Supports both flat structure and nested data object
 */
function getSpecValue(part: any, specKey: string): any {
  if (!part) return undefined;
  
  // Try nested data structure first (Supabase format)
  if (part.data && typeof part.data === 'object') {
    // Check if it's grouped (e.g., data.performance.boost_clock_ghz)
    const groups = ['performance', 'compatibility', 'power', 'physical', 'memory', 'connectivity', 'features'];
    for (const group of groups) {
      if (part.data[group] && part.data[group][specKey] !== undefined) {
        return part.data[group][specKey];
      }
    }
    // Check flat structure in data
    if (part.data[specKey] !== undefined) {
      return part.data[specKey];
    }
  }
  
  // Try flat structure on part itself
  if (part[specKey] !== undefined) {
    return part[specKey];
  }
  
  return undefined;
}

/**
 * Evaluate a single compatibility rule
 */
function evaluateRule(
  rule: CompatibilityRule,
  sourcePart: any,
  targetPart: any
): CompatibilityIssue | null {
  const sourceValue = getSpecValue(sourcePart, rule.source_field);
  const targetValue = getSpecValue(targetPart, rule.target_field);
  
  // Skip evaluation if required values are missing
  if (sourceValue === undefined || targetValue === undefined) {
    return null;
  }
  
  let passes = false;
  
  switch (rule.operator) {
    case 'equals':
      passes = String(sourceValue).toLowerCase() === String(targetValue).toLowerCase();
      break;
    case 'not_equals':
      passes = String(sourceValue).toLowerCase() !== String(targetValue).toLowerCase();
      break;
    case 'greater_than':
      passes = Number(sourceValue) > Number(targetValue);
      break;
    case 'less_than':
      passes = Number(sourceValue) < Number(targetValue);
      break;
    case 'greater_than_or_equal':
      passes = Number(sourceValue) >= Number(targetValue);
      break;
    case 'less_than_or_equal':
      passes = Number(sourceValue) <= Number(targetValue);
      break;
    case 'includes':
      const sourceStr = String(sourceValue).toLowerCase();
      const targetStr = String(targetValue).toLowerCase();
      passes = sourceStr.includes(targetStr) || targetStr.includes(sourceStr);
      break;
    case 'not_includes':
      const sourceStr2 = String(sourceValue).toLowerCase();
      const targetStr2 = String(targetValue).toLowerCase();
      passes = !sourceStr2.includes(targetStr2) && !targetStr2.includes(sourceStr2);
      break;
    default:
      return null;
  }
  
  // Rule fails if it doesn't pass
  if (!passes) {
    const sourceSpec = getSpecDefinition(rule.source_field);
    const targetSpec = getSpecDefinition(rule.target_field);
    
    const sourceLabel = sourceSpec?.label || rule.source_field;
    const targetLabel = targetSpec?.label || rule.target_field;
    
    // Generate a helpful fix message
    let fix = '';
    if (rule.operator === 'equals') {
      fix = `Select a ${rule.target_category} with ${targetLabel} matching "${sourceValue}" or a ${rule.source_category} with ${sourceLabel} matching "${targetValue}".`;
    } else if (rule.operator === 'less_than_or_equal') {
      fix = `Select a ${rule.target_category} with ${targetLabel} of at least ${sourceValue}${sourceSpec?.unit || ''}, or a ${rule.source_category} with ${sourceLabel} of at most ${targetValue}${targetSpec?.unit || ''}.`;
    } else if (rule.operator === 'greater_than') {
      fix = `Select a ${rule.target_category} with ${targetLabel} greater than ${sourceValue}${sourceSpec?.unit || ''}.`;
    } else {
      fix = `Review the compatibility requirements between ${rule.source_category} and ${rule.target_category}.`;
    }
    
    return {
      type: rule.message.split(':')[0] || 'Compatibility Issue',
      severity: rule.severity,
      message: rule.message,
      explanation: rule.description || `The ${sourceLabel} of the ${rule.source_category} (${sourceValue}${sourceSpec?.unit || ''}) is incompatible with the ${targetLabel} of the ${rule.target_category} (${targetValue}${targetSpec?.unit || ''}).`,
      fix,
      affected: [rule.source_category, rule.target_category],
      rule_id: rule.id
    };
  }
  
  return null;
}

/**
 * Fetch all active compatibility rules from Supabase
 */
export async function fetchCompatibilityRules(): Promise<CompatibilityRule[]> {
  const { data, error } = await supabase
    .from('compatibility_rules')
    .select('*')
    .eq('active', true)
    .order('severity', { ascending: false });
  
  if (error) {
    console.error('Error fetching compatibility rules:', error);
    return [];
  }
  
  return (data || []) as CompatibilityRule[];
}

/**
 * Evaluate compatibility for a set of selected parts
 */
export async function evaluateCompatibility(
  selectedParts: Record<string, any>
): Promise<{
  issues: CompatibilityIssue[];
  confirmations: CompatibilityConfirmation[];
}> {
  const rules = await fetchCompatibilityRules();
  const issues: CompatibilityIssue[] = [];
  const confirmations: CompatibilityConfirmation[] = [];
  
  // Evaluate each rule
  for (const rule of rules) {
    const sourcePart = selectedParts[rule.source_category];
    const targetPart = selectedParts[rule.target_category];
    
    // Skip if required parts are not selected
    if (!sourcePart || !targetPart) {
      continue;
    }
    
    const issue = evaluateRule(rule, sourcePart, targetPart);
    
    if (issue) {
      issues.push(issue);
    } else {
      // Rule passed - create a confirmation
      const sourceSpec = getSpecDefinition(rule.source_field);
      const targetSpec = getSpecDefinition(rule.target_field);
      
      const sourceValue = getSpecValue(sourcePart, rule.source_field);
      const targetValue = getSpecValue(targetPart, rule.target_field);
      
      if (sourceValue !== undefined && targetValue !== undefined) {
        confirmations.push({
          type: rule.message.split(':')[0] || 'Compatibility Confirmed',
          message: `${sourceSpec?.label || rule.source_field} and ${targetSpec?.label || rule.target_field} are compatible.`,
          explanation: rule.description || `The ${rule.source_category} and ${rule.target_category} are compatible.`
        });
      }
    }
  }
  
  // Sort issues by severity (error > warning > info)
  const severityOrder: Record<CompatibilitySeverity, number> = {
    error: 0,
    warning: 1,
    info: 2
  };
  
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  
  return { issues, confirmations };
}

/**
 * Get estimated power requirements for a build
 * This is a helper function that uses spec values
 */
export function estimatePowerRequirements(selectedParts: Record<string, any>): {
  estimated: number;
  psuWattage: number;
  headroom: number;
  sufficient: boolean;
} {
  const cpu = selectedParts.cpu;
  const gpu = selectedParts.gpu;
  const psu = selectedParts.psu;
  
  const cpuTdp = getSpecValue(cpu, 'tdp_watts') || getSpecValue(cpu, 'tdp_w') || 100;
  const gpuTdp = getSpecValue(gpu, 'tdp_watts') || getSpecValue(gpu, 'tdp_w') || 250;
  const psuWattage = getSpecValue(psu, 'wattage') || 0;
  
  // Base system overhead (motherboard, RAM, storage, fans, etc.)
  const baseOverhead = 150;
  const estimated = cpuTdp + gpuTdp + baseOverhead;
  
  const headroom = psuWattage - estimated;
  const sufficient = psuWattage > 0 && headroom >= 0;
  
  return {
    estimated,
    psuWattage,
    headroom,
    sufficient
  };
}
