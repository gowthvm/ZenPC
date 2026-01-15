/**
 * Spec Dictionary - Single Source of Truth for PC Part Specifications
 * 
 * This dictionary defines all possible specs that can exist in parts.data.
 * It provides metadata for rendering, validation, and compatibility checking.
 * 
 * Rules:
 * - All Supabase part specs MUST use dictionary keys
 * - No UI labels or units are hardcoded elsewhere
 * - Dictionary is version-controlled
 */

export type SpecType = 'number' | 'string' | 'boolean';
export type SpecGroup = 'performance' | 'compatibility' | 'power' | 'physical' | 'memory' | 'connectivity' | 'features';
export type SpecImportance = 'high' | 'medium' | 'low';
export type PartCategory = 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case' | 'cooler';

export interface SpecDefinition {
  label: string;
  categories: PartCategory[];
  group: SpecGroup;
  unit: string | null;
  importance: SpecImportance;
  type: SpecType;
  description?: string;
  order?: number; // Display order within group (lower = higher priority)
}

/**
 * SPEC DICTIONARY V1 - FROZEN
 * 
 * This dictionary is locked as of V2. Changes to keys require:
 * - Migration plan
 * - Version bump
 * - Documentation update
 * 
 * To add new specs, append to the dictionary (never modify existing keys).
 */

export type SpecDictionary = Record<string, SpecDefinition>;

export const SPEC_DICTIONARY: SpecDictionary = {
  // ==================== PERFORMANCE SPECS ====================
  boost_clock_ghz: {
    label: 'Boost Clock',
    categories: ['cpu'],
    group: 'performance',
    unit: 'GHz',
    importance: 'high',
    type: 'number',
    description: 'Maximum single-core boost frequency',
    order: 1
  },
  base_clock_ghz: {
    label: 'Base Clock',
    categories: ['cpu'],
    group: 'performance',
    unit: 'GHz',
    importance: 'high',
    type: 'number',
    description: 'Base operating frequency',
    order: 2
  },
  cores: {
    label: 'Cores',
    categories: ['cpu'],
    group: 'performance',
    unit: null,
    importance: 'high',
    type: 'number',
    description: 'Number of CPU cores',
    order: 3
  },
  threads: {
    label: 'Threads',
    categories: ['cpu'],
    group: 'performance',
    unit: null,
    importance: 'medium',
    type: 'number',
    description: 'Number of simultaneous threads',
    order: 4
  },
  memory_clock_mhz: {
    label: 'Memory Clock',
    categories: ['gpu'],
    group: 'performance',
    unit: 'MHz',
    importance: 'medium',
    type: 'number'
  },
  core_clock_mhz: {
    label: 'Core Clock',
    categories: ['gpu'],
    group: 'performance',
    unit: 'MHz',
    importance: 'medium',
    type: 'number'
  },
  boost_clock_mhz: {
    label: 'Boost Clock',
    categories: ['gpu'],
    group: 'performance',
    unit: 'MHz',
    importance: 'medium',
    type: 'number'
  },

  // ==================== COMPATIBILITY SPECS ====================
  socket: {
    label: 'Socket',
    categories: ['cpu', 'motherboard'],
    group: 'compatibility',
    unit: null,
    importance: 'high',
    type: 'string',
    description: 'CPU socket type (must match between CPU and motherboard)'
  },
  chipset: {
    label: 'Chipset',
    categories: ['motherboard'],
    group: 'compatibility',
    unit: null,
    importance: 'high',
    type: 'string',
    description: 'Motherboard chipset'
  },
  memory_type: {
    label: 'Memory Type',
    categories: ['ram', 'motherboard'],
    group: 'compatibility',
    unit: null,
    importance: 'high',
    type: 'string',
    description: 'DDR generation (DDR4, DDR5, etc.)'
  },
  max_ram_speed_mhz: {
    label: 'Max RAM Speed',
    categories: ['motherboard'],
    group: 'compatibility',
    unit: 'MHz',
    importance: 'high',
    type: 'number',
    description: 'Maximum supported RAM speed'
  },
  ram_speed_mhz: {
    label: 'RAM Speed',
    categories: ['ram'],
    group: 'compatibility',
    unit: 'MHz',
    importance: 'high',
    type: 'number',
    description: 'RAM operating speed'
  },
  form_factor: {
    label: 'Form Factor',
    categories: ['motherboard', 'case'],
    group: 'compatibility',
    unit: null,
    importance: 'high',
    type: 'string',
    description: 'Physical size standard (ATX, mATX, ITX, etc.)'
  },
  pcie_slots: {
    label: 'PCIe Slots',
    categories: ['motherboard'],
    group: 'compatibility',
    unit: null,
    importance: 'medium',
    type: 'number',
    description: 'Number of PCIe expansion slots'
  },
  sata_ports: {
    label: 'SATA Ports',
    categories: ['motherboard'],
    group: 'compatibility',
    unit: null,
    importance: 'low',
    type: 'number',
    description: 'Number of SATA ports'
  },
  m2_slots: {
    label: 'M.2 Slots',
    categories: ['motherboard'],
    group: 'compatibility',
    unit: null,
    importance: 'medium',
    type: 'number',
    description: 'Number of M.2 storage slots'
  },

  // ==================== POWER SPECS ====================
  tdp_watts: {
    label: 'TDP',
    categories: ['cpu', 'gpu'],
    group: 'power',
    unit: 'W',
    importance: 'high',
    type: 'number',
    description: 'Thermal Design Power',
    order: 1
  },
  // Legacy alias for backward compatibility (deprecated - use tdp_watts)
  tdp_w: {
    label: 'TDP',
    categories: ['cpu', 'gpu'],
    group: 'power',
    unit: 'W',
    importance: 'high',
    type: 'number',
    description: 'Thermal Design Power (legacy alias - use tdp_watts)',
    order: 1
  },
  wattage: {
    label: 'Wattage',
    categories: ['psu'],
    group: 'power',
    unit: 'W',
    importance: 'high',
    type: 'number',
    description: 'Power supply maximum output'
  },
  efficiency_rating: {
    label: 'Efficiency Rating',
    categories: ['psu'],
    group: 'power',
    unit: null,
    importance: 'medium',
    type: 'string',
    description: '80 Plus rating (Bronze, Silver, Gold, Platinum, Titanium)'
  },
  power_connectors: {
    label: 'Power Connectors',
    categories: ['gpu', 'psu'],
    group: 'power',
    unit: null,
    importance: 'medium',
    type: 'string',
    description: 'Required power connectors (e.g., "8-pin + 8-pin")'
  },

  // ==================== PHYSICAL SPECS ====================
  length_mm: {
    label: 'Length',
    categories: ['gpu', 'case'],
    group: 'physical',
    unit: 'mm',
    importance: 'high',
    type: 'number',
    description: 'Component length'
  },
  width_mm: {
    label: 'Width',
    categories: ['gpu', 'case'],
    group: 'physical',
    unit: 'mm',
    importance: 'medium',
    type: 'number'
  },
  height_mm: {
    label: 'Height',
    categories: ['gpu', 'case', 'cooler'],
    group: 'physical',
    unit: 'mm',
    importance: 'medium',
    type: 'number'
  },
  gpu_max_length_mm: {
    label: 'Max GPU Length',
    categories: ['case'],
    group: 'physical',
    unit: 'mm',
    importance: 'high',
    type: 'number',
    description: 'Maximum GPU length supported by case'
  },
  cpu_cooler_height_mm: {
    label: 'Max CPU Cooler Height',
    categories: ['case'],
    group: 'physical',
    unit: 'mm',
    importance: 'medium',
    type: 'number',
    description: 'Maximum CPU cooler height supported'
  },
  weight_kg: {
    label: 'Weight',
    categories: ['case', 'psu'],
    group: 'physical',
    unit: 'kg',
    importance: 'low',
    type: 'number'
  },

  // ==================== MEMORY SPECS ====================
  vram_gb: {
    label: 'VRAM',
    categories: ['gpu'],
    group: 'memory',
    unit: 'GB',
    importance: 'high',
    type: 'number',
    description: 'Video memory capacity'
  },
  size_gb: {
    label: 'Capacity',
    categories: ['ram', 'storage'],
    group: 'memory',
    unit: 'GB',
    importance: 'high',
    type: 'number',
    description: 'Storage or memory capacity'
  },
  capacity_tb: {
    label: 'Capacity',
    categories: ['storage'],
    group: 'memory',
    unit: 'TB',
    importance: 'high',
    type: 'number',
    description: 'Storage capacity in terabytes'
  },

  // ==================== CONNECTIVITY SPECS ====================
  usb_ports: {
    label: 'USB Ports',
    categories: ['motherboard', 'case'],
    group: 'connectivity',
    unit: null,
    importance: 'medium',
    type: 'number',
    description: 'Number of USB ports'
  },
  usb_c_ports: {
    label: 'USB-C Ports',
    categories: ['motherboard', 'case'],
    group: 'connectivity',
    unit: null,
    importance: 'medium',
    type: 'number'
  },
  display_ports: {
    label: 'Display Ports',
    categories: ['gpu', 'motherboard'],
    group: 'connectivity',
    unit: null,
    importance: 'medium',
    type: 'number'
  },
  hdmi_ports: {
    label: 'HDMI Ports',
    categories: ['gpu', 'motherboard'],
    group: 'connectivity',
    unit: null,
    importance: 'medium',
    type: 'number'
  },
  ethernet_ports: {
    label: 'Ethernet Ports',
    categories: ['motherboard'],
    group: 'connectivity',
    unit: null,
    importance: 'low',
    type: 'number'
  },
  wifi: {
    label: 'Wi-Fi',
    categories: ['motherboard'],
    group: 'connectivity',
    unit: null,
    importance: 'medium',
    type: 'boolean',
    description: 'Built-in Wi-Fi support'
  },
  bluetooth: {
    label: 'Bluetooth',
    categories: ['motherboard'],
    group: 'connectivity',
    unit: null,
    importance: 'low',
    type: 'boolean'
  },

  // ==================== FEATURES SPECS ====================
  modular: {
    label: 'Modular',
    categories: ['psu'],
    group: 'features',
    unit: null,
    importance: 'medium',
    type: 'boolean',
    description: 'Modular cable design'
  },
  rgb: {
    label: 'RGB',
    categories: ['ram', 'gpu', 'case', 'cooler'],
    group: 'features',
    unit: null,
    importance: 'low',
    type: 'boolean',
    description: 'RGB lighting support'
  },
  type: {
    label: 'Type',
    categories: ['storage'],
    group: 'features',
    unit: null,
    importance: 'high',
    type: 'string',
    description: 'Storage type (SSD, HDD, NVMe, etc.)'
  },
  interface: {
    label: 'Interface',
    categories: ['storage'],
    group: 'features',
    unit: null,
    importance: 'high',
    type: 'string',
    description: 'Connection interface (SATA, PCIe, NVMe, etc.)'
  },
  read_speed_mbps: {
    label: 'Read Speed',
    categories: ['storage'],
    group: 'features',
    unit: 'MB/s',
    importance: 'medium',
    type: 'number',
    description: 'Sequential read speed'
  },
  write_speed_mbps: {
    label: 'Write Speed',
    categories: ['storage'],
    group: 'features',
    unit: 'MB/s',
    importance: 'medium',
    type: 'number',
    description: 'Sequential write speed'
  },
  fan_count: {
    label: 'Fan Count',
    categories: ['gpu', 'case', 'cooler'],
    group: 'features',
    unit: null,
    importance: 'low',
    type: 'number',
    description: 'Number of fans'
  },
  liquid_cooled: {
    label: 'Liquid Cooled',
    categories: ['cooler', 'gpu'],
    group: 'features',
    unit: null,
    importance: 'low',
    type: 'boolean',
    description: 'Liquid cooling support'
  },
};

/**
 * Helper functions to work with the spec dictionary
 */
export function getSpecDefinition(key: string): SpecDefinition | undefined {
  return SPEC_DICTIONARY[key];
}

export function getSpecsForCategory(category: PartCategory): Array<{ key: string; definition: SpecDefinition }> {
  return Object.entries(SPEC_DICTIONARY)
    .filter(([_, def]) => def.categories.includes(category))
    .map(([key, definition]) => ({ key, definition }));
}

export function getSpecsByGroup(group: SpecGroup): Array<{ key: string; definition: SpecDefinition }> {
  return Object.entries(SPEC_DICTIONARY)
    .filter(([_, def]) => def.group === group)
    .map(([key, definition]) => ({ key, definition }));
}

export function getSpecsByImportance(importance: SpecImportance): Array<{ key: string; definition: SpecDefinition }> {
  return Object.entries(SPEC_DICTIONARY)
    .filter(([_, def]) => def.importance === importance)
    .map(([key, definition]) => ({ key, definition }));
}

/**
 * Get all spec groups in order of importance
 */
export const SPEC_GROUP_ORDER: SpecGroup[] = [
  'compatibility',
  'performance',
  'power',
  'physical',
  'memory',
  'connectivity',
  'features'
];

/**
 * Get importance order for sorting
 */
export const IMPORTANCE_ORDER: SpecImportance[] = ['high', 'medium', 'low'];

/**
 * Extract spec value from a part's data structure
 * Supports both flat structure and nested data object
 */
export function getSpecValue(part: any, specKey: string): any {
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
  
  // Try flat structure on part itself (backward compatibility)
  if (part[specKey] !== undefined) {
    return part[specKey];
  }
  
  return undefined;
}
