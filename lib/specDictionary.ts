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

  // ==================== ENHANCED COMPATIBILITY SPECS ====================
  // CPU specs
  generation: {
    label: 'Generation',
    categories: ['cpu', 'gpu'],
    group: 'compatibility',
    unit: null,
    importance: 'high',
    type: 'string',
    description: 'Processor generation (e.g., Ryzen 5000, i9-13K)'
  },
  socket_revision: {
    label: 'Socket Revision',
    categories: ['motherboard'],
    group: 'compatibility',
    unit: null,
    importance: 'medium',
    type: 'string',
    description: 'Socket version (AM5, LGA1700, etc.)'
  },
  bios_version_required: {
    label: 'BIOS Version Required',
    categories: ['motherboard'],
    group: 'compatibility',
    unit: null,
    importance: 'low',
    type: 'string',
    description: 'Minimum BIOS version for CPU support'
  },

  // GPU specs
  gpu_memory_type: {
    label: 'GPU Memory Type',
    categories: ['gpu'],
    group: 'memory',
    unit: null,
    importance: 'medium',
    type: 'string',
    description: 'GDDR6, GDDR6X, HBM, etc.'
  },
  gpu_bus_width: {
    label: 'GPU Bus Width',
    categories: ['gpu'],
    group: 'connectivity',
    unit: 'bit',
    importance: 'low',
    type: 'number',
    description: 'Memory bus width'
  },
  pcie_generation: {
    label: 'PCIe Generation',
    categories: ['gpu', 'storage', 'motherboard'],
    group: 'connectivity',
    unit: null,
    importance: 'medium',
    type: 'string',
    description: 'PCIe version (3.0, 4.0, 5.0)'
  },
  pcie_lanes_required: {
    label: 'PCIe Lanes Required',
    categories: ['gpu'],
    group: 'connectivity',
    unit: 'lanes',
    importance: 'low',
    type: 'number',
    description: 'PCIe lanes needed (typically x16 or x8)'
  },

  // Cooler specs
  tdp_rating_watts: {
    label: 'TDP Rating',
    categories: ['cooler'],
    group: 'power',
    unit: 'W',
    importance: 'high',
    type: 'number',
    description: 'Maximum TDP the cooler can handle'
  },
  socket_compatibility: {
    label: 'Socket Compatibility',
    categories: ['cooler'],
    group: 'compatibility',
    unit: null,
    importance: 'high',
    type: 'string',
    description: 'Supported sockets (e.g., "AM4, AM5")'
  },
  thickness_mm: {
    label: 'Thickness',
    categories: ['gpu', 'cooler'],
    group: 'physical',
    unit: 'mm',
    importance: 'medium',
    type: 'number',
    description: 'Component thickness'
  },

  // Case specs
  psu_form_factor: {
    label: 'PSU Form Factor',
    categories: ['case'],
    group: 'compatibility',
    unit: null,
    importance: 'high',
    type: 'string',
    description: 'Supported PSU sizes (ATX, SFX, etc.)'
  },
  motherboard_form_factors: {
    label: 'Motherboard Form Factors',
    categories: ['case'],
    group: 'compatibility',
    unit: null,
    importance: 'high',
    type: 'string',
    description: 'Supported motherboard sizes (comma-separated: ATX,mATX,ITX)'
  },
  interior_length_mm: {
    label: 'Interior Length',
    categories: ['case'],
    group: 'physical',
    unit: 'mm',
    importance: 'medium',
    type: 'number',
    description: 'Interior length of case'
  },
  interior_width_mm: {
    label: 'Interior Width',
    categories: ['case'],
    group: 'physical',
    unit: 'mm',
    importance: 'medium',
    type: 'number',
    description: 'Interior width of case'
  },
  interior_height_mm: {
    label: 'Interior Height',
    categories: ['case'],
    group: 'physical',
    unit: 'mm',
    importance: 'medium',
    type: 'number',
    description: 'Interior height of case'
  },
  power_supply_cover: {
    label: 'Power Supply Cover',
    categories: ['case'],
    group: 'features',
    unit: null,
    importance: 'low',
    type: 'boolean',
    description: 'Has shroud/cover for PSU'
  },
  drive_bays_35: {
    label: '3.5" Drive Bays',
    categories: ['case'],
    group: 'connectivity',
    unit: null,
    importance: 'low',
    type: 'number',
    description: 'Number of 3.5" drive bays'
  },
  drive_bays_25: {
    label: '2.5" Drive Bays',
    categories: ['case'],
    group: 'connectivity',
    unit: null,
    importance: 'low',
    type: 'number',
    description: 'Number of 2.5" drive bays'
  },

  // RAM specs
  ecc_support: {
    label: 'ECC Support',
    categories: ['motherboard', 'ram'],
    group: 'features',
    unit: null,
    importance: 'low',
    type: 'boolean',
    description: 'Error Correcting Code support'
  },
  max_ram_gb: {
    label: 'Max RAM',
    categories: ['motherboard'],
    group: 'memory',
    unit: 'GB',
    importance: 'medium',
    type: 'number',
    description: 'Maximum RAM capacity'
  },
  max_ram_slots: {
    label: 'Max RAM Slots',
    categories: ['motherboard'],
    group: 'connectivity',
    unit: null,
    importance: 'low',
    type: 'number',
    description: 'Number of RAM slots'
  },

  // Storage specs
  form_factor_storage: {
    label: 'Storage Form Factor',
    categories: ['storage'],
    group: 'physical',
    unit: null,
    importance: 'high',
    type: 'string',
    description: '2.5", 3.5", M.2, etc.'
  },
  nvme_protocol: {
    label: 'NVMe Protocol',
    categories: ['storage'],
    group: 'connectivity',
    unit: null,
    importance: 'medium',
    type: 'string',
    description: 'NVMe version (1.3, 1.4, etc.)'
  },
  nvme_pcie_gen: {
    label: 'NVMe PCIe Gen',
    categories: ['storage', 'motherboard'],
    group: 'connectivity',
    unit: null,
    importance: 'medium',
    type: 'string',
    description: 'PCIe generation for NVMe (3.0, 4.0, 5.0)'
  },

  // PSU specs
  psu_form_factor_type: {
    label: 'PSU Form Factor',
    categories: ['psu'],
    group: 'physical',
    unit: null,
    importance: 'high',
    type: 'string',
    description: 'ATX, SFX, TFX, etc.'
  },
  modular_type: {
    label: 'Modular Type',
    categories: ['psu'],
    group: 'features',
    unit: null,
    importance: 'medium',
    type: 'string',
    description: 'Non-modular, Semi-modular, Fully-modular'
  },
  pcie_8pin_count: {
    label: 'PCIe 8-Pin Count',
    categories: ['psu'],
    group: 'power',
    unit: null,
    importance: 'high',
    type: 'number',
    description: 'Number of 8-pin PCIe power connectors'
  },
  pcie_6pin_count: {
    label: 'PCIe 6-Pin Count',
    categories: ['psu'],
    group: 'power',
    unit: null,
    importance: 'high',
    type: 'number',
    description: 'Number of 6-pin PCIe power connectors'
  },
  pcie_12vhpwr: {
    label: '12VHPWR Support',
    categories: ['psu'],
    group: 'power',
    unit: null,
    importance: 'medium',
    type: 'boolean',
    description: 'New 12VHPWR connector support'
  },
  motherboard_power_pins: {
    label: 'Motherboard Power (24-pin)',
    categories: ['psu'],
    group: 'power',
    unit: null,
    importance: 'high',
    type: 'boolean',
    description: 'Standard 24-pin ATX power'
  },
  cpu_power_4pin: {
    label: 'CPU Power (4-pin)',
    categories: ['psu'],
    group: 'power',
    unit: null,
    importance: 'high',
    type: 'number',
    description: 'Number of 4-pin CPU power connectors'
  },
  cpu_power_8pin: {
    label: 'CPU Power (8-pin)',
    categories: ['psu'],
    group: 'power',
    unit: null,
    importance: 'high',
    type: 'number',
    description: 'Number of 8-pin CPU power connectors'
  },

  // Motherboard specs
  storage_interfaces: {
    label: 'Storage Interfaces',
    categories: ['motherboard'],
    group: 'connectivity',
    unit: null,
    importance: 'medium',
    type: 'string',
    description: 'Supported interfaces (SATA, NVMe, M.2, etc.)'
  },
  pcie_slot_count: {
    label: 'PCIe Slots',
    categories: ['motherboard'],
    group: 'connectivity',
    unit: null,
    importance: 'low',
    type: 'number',
    description: 'Total number of PCIe slots'
  },
  pcie_gen_slots: {
    label: 'PCIe Gen by Slot',
    categories: ['motherboard'],
    group: 'connectivity',
    unit: null,
    importance: 'medium',
    type: 'string',
    description: 'PCIe generations available (e.g., "x16 Gen5, x1 Gen3")'
  },
  overclocking_support: {
    label: 'Overclocking',
    categories: ['motherboard'],
    group: 'features',
    unit: null,
    importance: 'low',
    type: 'boolean',
    description: 'Supports CPU/memory overclocking'
  },

  // Performance reference specs
  cpu_tier: {
    label: 'CPU Tier',
    categories: ['cpu'],
    group: 'performance',
    unit: null,
    importance: 'medium',
    type: 'string',
    description: 'Budget, Mid-range, High-end, Enthusiast (for heuristic matching)'
  },
  gpu_tier: {
    label: 'GPU Tier',
    categories: ['gpu'],
    group: 'performance',
    unit: null,
    importance: 'medium',
    type: 'string',
    description: 'Entry, Budget, Mid-range, High-end, Flagship'
  },
  gpu_memory_bandwidth_gbps: {
    label: 'Memory Bandwidth',
    categories: ['gpu'],
    group: 'performance',
    unit: 'GB/s',
    importance: 'low',
    type: 'number',
    description: 'GPU memory bandwidth'
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
