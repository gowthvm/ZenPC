/**
 * Bulk Part Import System
 * 
 * Supports CSV and JSON imports with validation against Spec Dictionary
 */

import { supabase } from './supabaseClient';
import { validatePart, getValidSpecKeysForCategory, type PartCategory } from './specValidator';
import { SPEC_DICTIONARY, getSpecDefinition } from './specDictionary';

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: Array<{ row: number; message: string }>;
  warnings: Array<{ row: number; message: string }>;
}

export interface PartImportRow {
  name: string;
  category: PartCategory;
  price?: number;
  [key: string]: any; // Spec values
}

/**
 * Map flat column names to nested spec structure
 */
function mapFlatToNested(row: Record<string, any>, category: PartCategory): any {
  const data: any = {
    performance: {},
    compatibility: {},
    power: {},
    physical: {},
    memory: {},
    connectivity: {},
    features: {}
  };

  // Extract base fields
  const { name, category: _, price, ...specFields } = row;

  // Map each field to its group
  for (const [key, value] of Object.entries(specFields)) {
    // Try to find the spec definition
    const definition = getSpecDefinition(key);
    
    if (definition && definition.categories.includes(category)) {
      const group = definition.group;
      if (data[group]) {
        data[group][key] = value;
      }
    } else {
      // Unknown spec - store in a catch-all or skip
      // For now, we'll skip unknown specs (they'll be caught by validation)
    }
  }

  // Clean up empty groups
  Object.keys(data).forEach(group => {
    if (Object.keys(data[group]).length === 0) {
      delete data[group];
    }
  });

  return {
    name,
    category,
    data: {
      ...data,
      price // Price is stored at top level of data
    }
  };
}

/**
 * Parse CSV content
 */
function parseCSV(content: string): Array<Record<string, string>> {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  // Parse header
  const header = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  // Parse rows
  const rows: Array<Record<string, string>> = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    header.forEach((key, idx) => {
      row[key] = values[idx] || '';
    });
    rows.push(row);
  }

  return rows;
}

/**
 * Convert string values to appropriate types based on spec definition
 */
function convertValueType(key: string, value: string, category: PartCategory): any {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  const definition = getSpecDefinition(key);
  if (!definition || !definition.categories.includes(category)) {
    return value; // Return as string if unknown
  }

  switch (definition.type) {
    case 'number':
      const num = parseFloat(value);
      return isNaN(num) ? undefined : num;
    case 'boolean':
      const lower = value.toLowerCase();
      return lower === 'true' || lower === 'yes' || lower === '1';
    case 'string':
      return value;
    default:
      return value;
  }
}

/**
 * Import parts from CSV
 */
export async function importPartsFromCSV(
  csvContent: string,
  category: PartCategory
): Promise<ImportResult> {
  const rows = parseCSV(csvContent);
  const result: ImportResult = {
    success: true,
    imported: 0,
    failed: 0,
    errors: [],
    warnings: []
  };

  const partsToInsert: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // +2 because CSV is 1-indexed and has header

    try {
      // Convert string values to proper types
      const typedRow: any = {};
      for (const [key, value] of Object.entries(row)) {
        typedRow[key] = convertValueType(key, value, category);
      }

      // Map to nested structure
      const part = mapFlatToNested(typedRow, category);

      // Validate
      const validation = validatePart(part, category);
      
      if (!validation.valid) {
        result.failed++;
        validation.errors.forEach(err => {
          result.errors.push({
            row: rowNum,
            message: `${err.specKey}: ${err.message}`
          });
        });
        validation.warnings.forEach(warn => {
          result.warnings.push({
            row: rowNum,
            message: `${warn.specKey}: ${warn.message}`
          });
        });
        continue;
      }

      // Add warnings
      validation.warnings.forEach(warn => {
        result.warnings.push({
          row: rowNum,
          message: `${warn.specKey}: ${warn.message}`
        });
      });

      partsToInsert.push(part);
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        row: rowNum,
        message: `Parse error: ${error.message}`
      });
    }
  }

  // Bulk insert valid parts
  if (partsToInsert.length > 0) {
    const { error } = await supabase
      .from('parts')
      .insert(partsToInsert);

    if (error) {
      result.success = false;
      result.errors.push({
        row: 0,
        message: `Database error: ${error.message}`
      });
    } else {
      result.imported = partsToInsert.length;
    }
  }

  return result;
}

/**
 * Import parts from JSON array
 */
export async function importPartsFromJSON(
  jsonData: Array<Record<string, any>>,
  category: PartCategory
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    imported: 0,
    failed: 0,
    errors: [],
    warnings: []
  };

  const partsToInsert: any[] = [];

  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    const rowNum = i + 1;

    try {
      // Map to nested structure
      const part = mapFlatToNested(row, category);

      // Validate
      const validation = validatePart(part, category);
      
      if (!validation.valid) {
        result.failed++;
        validation.errors.forEach(err => {
          result.errors.push({
            row: rowNum,
            message: `${err.specKey}: ${err.message}`
          });
        });
        validation.warnings.forEach(warn => {
          result.warnings.push({
            row: rowNum,
            message: `${warn.specKey}: ${warn.message}`
          });
        });
        continue;
      }

      // Add warnings
      validation.warnings.forEach(warn => {
        result.warnings.push({
          row: rowNum,
          message: `${warn.specKey}: ${warn.message}`
        });
      });

      partsToInsert.push(part);
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        row: rowNum,
        message: `Parse error: ${error.message}`
      });
    }
  }

  // Bulk insert valid parts
  if (partsToInsert.length > 0) {
    const { error } = await supabase
      .from('parts')
      .insert(partsToInsert);

    if (error) {
      result.success = false;
      result.errors.push({
        row: 0,
        message: `Database error: ${error.message}`
      });
    } else {
      result.imported = partsToInsert.length;
    }
  }

  return result;
}

/**
 * Generate CSV template for a category
 */
export function generateCSVTemplate(category: PartCategory): string {
  const validSpecs = getValidSpecKeysForCategory(category);
  const specs = validSpecs.map(key => {
    const def = getSpecDefinition(key);
    return def;
  }).filter(Boolean);

  // Build header
  const header = ['name', 'category', 'price', ...validSpecs];

  // Build sample row
  const sampleRow: any[] = [
    `Sample ${category}`,
    category,
    '100.00',
    ...validSpecs.map(key => {
      const def = getSpecDefinition(key);
      if (!def) return '';
      switch (def.type) {
        case 'number':
          return def.unit === 'GHz' ? '3.5' : def.unit === 'W' ? '100' : '1';
        case 'boolean':
          return 'true';
        case 'string':
          return 'Example';
        default:
          return '';
      }
    })
  ];

  // Add comment row with descriptions
  const commentRow = [
    '# Description',
    '# Category',
    '# Price in USD',
    ...validSpecs.map(key => {
      const def = getSpecDefinition(key);
      return def ? `# ${def.label} (${def.type}${def.unit ? `, ${def.unit}` : ''})` : '';
    })
  ];

  return [
    commentRow.join(','),
    header.join(','),
    sampleRow.join(',')
  ].join('\n');
}
