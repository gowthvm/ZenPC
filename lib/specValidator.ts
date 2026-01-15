/**
 * Spec Validator - Validates parts against Spec Dictionary
 * 
 * Ensures data integrity and warns about unknown specs
 */

import { SPEC_DICTIONARY, getSpecDefinition, type PartCategory, type SpecType } from './specDictionary';
import { getSpecValue } from './specDictionary';

export interface ValidationError {
  specKey: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  unknownSpecs: string[];
}

/**
 * Validate a single spec value against its definition
 */
function validateSpecValue(
  specKey: string,
  value: any,
  definition: ReturnType<typeof getSpecDefinition>
): ValidationError | null {
  if (!definition) {
    return {
      specKey,
      message: `Unknown spec key: ${specKey}`,
      severity: 'warning'
    };
  }

  // Type validation
  if (value === null || value === undefined) {
    return null; // Missing specs are allowed
  }

  const expectedType = definition.type;
  const actualType = typeof value;

  if (expectedType === 'number') {
    if (typeof value !== 'number' || isNaN(value)) {
      return {
        specKey,
        message: `Expected number, got ${actualType}`,
        severity: 'error'
      };
    }
  } else if (expectedType === 'boolean') {
    if (typeof value !== 'boolean') {
      return {
        specKey,
        message: `Expected boolean, got ${actualType}`,
        severity: 'error'
      };
    }
  } else if (expectedType === 'string') {
    if (typeof value !== 'string') {
      return {
        specKey,
        message: `Expected string, got ${actualType}`,
        severity: 'error'
      };
    }
  }

  return null;
}

/**
 * Validate a part's data structure against Spec Dictionary
 */
export function validatePart(
  part: any,
  category: PartCategory
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const unknownSpecs: string[] = [];

  if (!part || !part.data) {
    return {
      valid: true,
      errors: [],
      warnings: [],
      unknownSpecs: []
    };
  }

  // Extract all spec keys from part data
  const specKeys = new Set<string>();
  
  // Check grouped structure
  const groups = ['performance', 'compatibility', 'power', 'physical', 'memory', 'connectivity', 'features'];
  for (const group of groups) {
    if (part.data[group] && typeof part.data[group] === 'object') {
      Object.keys(part.data[group]).forEach(key => specKeys.add(key));
    }
  }
  
  // Check flat structure
  if (typeof part.data === 'object') {
    Object.keys(part.data).forEach(key => {
      if (!groups.includes(key)) {
        specKeys.add(key);
      }
    });
  }

  // Validate each spec
  for (const specKey of specKeys) {
    const definition = getSpecDefinition(specKey);
    const value = getSpecValue(part, specKey);

    if (!definition) {
      unknownSpecs.push(specKey);
      warnings.push({
        specKey,
        message: `Unknown spec key: ${specKey}. This spec is not defined in the Spec Dictionary.`,
        severity: 'warning'
      });
      continue;
    }

    // Check if spec applies to this category
    if (!definition.categories.includes(category)) {
      warnings.push({
        specKey,
        message: `Spec ${specKey} is not applicable to category ${category}`,
        severity: 'warning'
      });
      continue;
    }

    // Validate value type
    const error = validateSpecValue(specKey, value, definition);
    if (error) {
      if (error.severity === 'error') {
        errors.push(error);
      } else {
        warnings.push(error);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    unknownSpecs
  };
}

/**
 * Validate multiple parts (bulk validation)
 */
export function validateParts(
  parts: Array<{ part: any; category: PartCategory }>
): {
  results: Array<{ part: any; category: PartCategory; validation: ValidationResult }>;
  summary: {
    total: number;
    valid: number;
    invalid: number;
    totalErrors: number;
    totalWarnings: number;
    uniqueUnknownSpecs: Set<string>;
  };
} {
  const results = parts.map(({ part, category }) => ({
    part,
    category,
    validation: validatePart(part, category)
  }));

  const uniqueUnknownSpecs = new Set<string>();
  let totalErrors = 0;
  let totalWarnings = 0;

  results.forEach(({ validation }) => {
    validation.errors.forEach(e => totalErrors++);
    validation.warnings.forEach(w => totalWarnings++);
    validation.unknownSpecs.forEach(s => uniqueUnknownSpecs.add(s));
  });

  return {
    results,
    summary: {
      total: parts.length,
      valid: results.filter(r => r.validation.valid).length,
      invalid: results.filter(r => !r.validation.valid).length,
      totalErrors,
      totalWarnings,
      uniqueUnknownSpecs
    }
  };
}

/**
 * Get all valid spec keys for a category (for filtering/import)
 */
export function getValidSpecKeysForCategory(category: PartCategory): string[] {
  return Object.entries(SPEC_DICTIONARY)
    .filter(([_, def]) => def.categories.includes(category))
    .map(([key]) => key);
}

/**
 * Check if a spec key is valid
 */
export function isValidSpecKey(specKey: string): boolean {
  return specKey in SPEC_DICTIONARY;
}

/**
 * Developer warning for unknown spec keys (console only in dev)
 */
export function warnUnknownSpec(specKey: string, context?: string) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[Spec Dictionary] Unknown spec key encountered: "${specKey}"${context ? ` in ${context}` : ''}. ` +
      `This spec is not defined in the Spec Dictionary. ` +
      `Please add it to lib/specDictionary.ts or remove it from the data.`
    );
  }
}
