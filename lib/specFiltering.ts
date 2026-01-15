/**
 * Spec-Based Filtering Engine
 * 
 * Dynamically generates filters from Spec Dictionary
 * No hardcoded filters - everything is data-driven
 */

import { 
  SPEC_DICTIONARY, 
  getSpecsForCategory, 
  getSpecValue,
  type PartCategory,
  type SpecType 
} from './specDictionary';

export interface FilterDefinition {
  specKey: string;
  label: string;
  type: 'range' | 'select' | 'toggle';
  category: PartCategory;
  importance: 'high' | 'medium' | 'low';
  // For range filters
  min?: number;
  max?: number;
  step?: number;
  // For select filters
  options?: Array<{ value: string; label: string }>;
  // For toggle filters
  defaultValue?: boolean;
}

export interface ActiveFilter {
  specKey: string;
  type: 'range' | 'select' | 'toggle';
  value: any; // number | [number, number] | string | boolean
}

/**
 * Generate filter definitions for a category based on available parts
 */
export function generateFiltersForCategory(
  category: PartCategory,
  parts: any[]
): FilterDefinition[] {
  const specs = getSpecsForCategory(category);
  const filters: FilterDefinition[] = [];

  // Collect all unique values for each spec from parts
  const specValues: Record<string, Set<any>> = {};
  const specNumbers: Record<string, number[]> = [];

  parts.forEach(part => {
    specs.forEach(({ key }) => {
      const value = getSpecValue(part, key);
      if (value !== undefined && value !== null) {
        if (!specValues[key]) {
          specValues[key] = new Set();
          specNumbers[key] = [];
        }
        specValues[key].add(value);
        if (typeof value === 'number') {
          specNumbers[key].push(value);
        }
      }
    });
  });

  // Generate filters
  specs.forEach(({ key, definition }) => {
    // Only create filters for specs that exist in parts
    if (!specValues[key] || specValues[key].size === 0) {
      return;
    }

    let filter: FilterDefinition | null = null;

    if (definition.type === 'boolean') {
      // Toggle filter
      filter = {
        specKey: key,
        label: definition.label,
        type: 'toggle',
        category,
        importance: definition.importance,
        defaultValue: false
      };
    } else if (definition.type === 'number') {
      const numbers = specNumbers[key] || [];
      if (numbers.length > 0) {
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        
        // Use range if there are many unique values, otherwise select
        if (specValues[key].size > 5) {
          filter = {
            specKey: key,
            label: definition.label,
            type: 'range',
            category,
            importance: definition.importance,
            min,
            max,
            step: definition.unit === 'GHz' ? 0.1 : definition.unit === 'W' ? 10 : 1
          };
        } else {
          // Select filter for small number of options
          const options = Array.from(specValues[key])
            .sort((a, b) => Number(a) - Number(b))
            .map(val => ({
              value: String(val),
              label: `${val}${definition.unit ? ` ${definition.unit}` : ''}`
            }));
          
          filter = {
            specKey: key,
            label: definition.label,
            type: 'select',
            category,
            importance: definition.importance,
            options
          };
        }
      }
    } else if (definition.type === 'string') {
      // Select filter for strings
      const uniqueValues = Array.from(specValues[key]);
      if (uniqueValues.length > 0 && uniqueValues.length <= 20) {
        // Only create select if reasonable number of options
        const options = uniqueValues
          .sort()
          .map(val => ({
            value: String(val),
            label: String(val)
          }));
        
        filter = {
          specKey: key,
          label: definition.label,
          type: 'select',
          category,
          importance: definition.importance,
          options
        };
      }
    }

    if (filter) {
      filters.push(filter);
    }
  });

  // Sort by importance (high first), then by label
  filters.sort((a, b) => {
    const importanceOrder = { high: 0, medium: 1, low: 2 };
    const importanceDiff = importanceOrder[a.importance] - importanceOrder[b.importance];
    if (importanceDiff !== 0) return importanceDiff;
    return a.label.localeCompare(b.label);
  });

  return filters;
}

/**
 * Apply filters to parts
 */
export function applyFilters(
  parts: any[],
  filters: ActiveFilter[]
): any[] {
  if (filters.length === 0) return parts;

  return parts.filter(part => {
    return filters.every(filter => {
      const partValue = getSpecValue(part, filter.specKey);
      
      if (partValue === undefined || partValue === null) {
        return false; // Missing spec doesn't match filter
      }

      switch (filter.type) {
        case 'range': {
          const [min, max] = Array.isArray(filter.value) ? filter.value : [filter.value, filter.value];
          const numValue = Number(partValue);
          return numValue >= min && numValue <= max;
        }
        case 'select': {
          return String(partValue) === String(filter.value);
        }
        case 'toggle': {
          if (filter.value === false) return true; // Toggle off = show all
          return Boolean(partValue) === Boolean(filter.value);
        }
        default:
          return true;
      }
    });
  });
}

/**
 * Get filter summary (how many parts match)
 */
export function getFilterSummary(
  parts: any[],
  filters: ActiveFilter[]
): {
  total: number;
  filtered: number;
  activeFilters: number;
} {
  const filtered = applyFilters(parts, filters);
  return {
    total: parts.length,
    filtered: filtered.length,
    activeFilters: filters.length
  };
}
