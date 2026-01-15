# ZenPC Spec-Driven System Guide

## Overview

ZenPC now uses a fully spec-driven architecture for PC parts. This system allows adding new specs, parts, and compatibility logic without changing frontend code.

## Architecture

### 1. Spec Dictionary (`lib/specDictionary.ts`)

The **single source of truth** for all part specifications. Every spec that can exist in `parts.data` must be defined here.

**Key Properties:**
- `canonical_key`: snake_case identifier (e.g., `boost_clock_ghz`)
- `label`: Human-readable name (e.g., "Boost Clock")
- `categories`: Which part categories this spec applies to
- `group`: Logical grouping (performance, compatibility, power, etc.)
- `unit`: Display unit (GHz, W, GB, etc.) or null
- `importance`: high, medium, or low
- `type`: number, string, or boolean

**Example:**
```typescript
boost_clock_ghz: {
  label: 'Boost Clock',
  categories: ['cpu'],
  group: 'performance',
  unit: 'GHz',
  importance: 'high',
  type: 'number'
}
```

### 2. Supabase Parts Data Structure

Parts store specs in `parts.data` as structured JSON:

```json
{
  "performance": {
    "boost_clock_ghz": 5.2,
    "base_clock_ghz": 3.8,
    "cores": 8
  },
  "compatibility": {
    "socket": "AM5"
  },
  "power": {
    "tdp_w": 105
  },
  "physical": {
    "length_mm": 310
  }
}
```

**Rules:**
- Keys MUST exist in Spec Dictionary
- Values are raw (numbers, strings, booleans)
- No units in values
- Missing specs are allowed

### 3. Compatibility Rules Engine (`lib/compatibilityEngine.ts`)

Compatibility logic is stored in Supabase `compatibility_rules` table and evaluated dynamically.

**Rule Structure:**
- `source_category`: Part category that triggers the check
- `target_category`: Part category to check against
- `source_field`: Spec key from source part
- `target_field`: Spec key from target part
- `operator`: equals, not_equals, greater_than, less_than, etc.
- `severity`: error, warning, or info
- `message`: Human-readable message
- `description`: Detailed explanation

**Example Rule:**
```sql
INSERT INTO compatibility_rules (
  source_category, target_category,
  source_field, target_field,
  operator, severity, message, description
) VALUES (
  'cpu', 'motherboard',
  'socket', 'socket',
  'equals', 'error',
  'CPU socket must match motherboard socket',
  'The CPU and motherboard must use the same socket type.'
);
```

### 4. Dynamic Spec Rendering (`app/components/PartSpecs.tsx`)

The `<PartSpecs />` component automatically:
- Reads specs from part data
- Looks up metadata in Spec Dictionary
- Renders grouped, labeled, and formatted specs
- Hides missing specs gracefully
- Emphasizes high-importance specs

**Usage:**
```tsx
<PartSpecs 
  part={selectedPart} 
  category="cpu"
  showLowImportance={false}
/>
```

## Adding New Specs

### Step 1: Add to Spec Dictionary

Edit `lib/specDictionary.ts`:

```typescript
new_spec_key: {
  label: 'New Spec Name',
  categories: ['cpu', 'gpu'],
  group: 'performance',
  unit: 'MHz',
  importance: 'high',
  type: 'number',
  description: 'Optional description'
}
```

### Step 2: Store in Supabase

When creating/updating parts, include the spec in `parts.data`:

```json
{
  "performance": {
    "new_spec_key": 5000
  }
}
```

**That's it!** The UI will automatically render it.

## Adding New Compatibility Rules

### Option 1: Via SQL

```sql
INSERT INTO compatibility_rules (
  source_category, target_category,
  source_field, target_field,
  operator, severity, message, description
) VALUES (
  'gpu', 'psu',
  'power_connectors', 'pcie_connectors',
  'includes', 'error',
  'PSU must have required GPU power connectors',
  'The PSU must provide the power connectors required by the GPU.'
);
```

### Option 2: Via Helper Function

```typescript
import { addCompatibilityRule } from '@/lib/compatibilityRulesHelper';

await addCompatibilityRule(
  'gpu',
  'psu',
  'power_connectors',
  'pcie_connectors',
  'includes',
  'error',
  'PSU must have required GPU power connectors',
  'The PSU must provide the power connectors required by the GPU.'
);
```

**No frontend changes needed!** The rule will be evaluated automatically.

## Data Migration

### Migrating Existing Parts

If you have existing parts with flat structure:

```json
{
  "name": "AMD Ryzen 5 7600",
  "cores": 6,
  "socket": "AM5",
  "tdp": 105
}
```

Migrate to grouped structure:

```json
{
  "name": "AMD Ryzen 5 7600",
  "data": {
    "performance": {
      "cores": 6
    },
    "compatibility": {
      "socket": "AM5"
    },
    "power": {
      "tdp_w": 105
    }
  }
}
```

**Note:** The system supports both formats for backward compatibility, but grouped format is recommended.

## Best Practices

1. **Always use Spec Dictionary keys** - Never hardcode spec names
2. **Store raw values** - No units in database values
3. **Use appropriate importance** - High for critical specs, low for nice-to-have
4. **Group logically** - Use spec groups (performance, compatibility, etc.)
5. **Test compatibility rules** - Verify rules work with real data
6. **Document new specs** - Add descriptions to help users understand

## Extensibility Guarantees

✅ **Adding a new spec**: Only requires Spec Dictionary update + Supabase data  
✅ **Adding compatibility logic**: Only requires new rule in Supabase  
✅ **Changing labels/units**: Only requires Spec Dictionary update  
✅ **No frontend refactors needed** for new specs or rules

## Troubleshooting

### Specs not showing?

1. Check spec exists in Spec Dictionary
2. Verify spec key matches exactly (case-sensitive)
3. Ensure part category includes the spec
4. Check part data structure (nested vs flat)

### Compatibility rules not working?

1. Verify rule is active (`active = true`)
2. Check spec keys exist in Spec Dictionary
3. Ensure parts have the required spec values
4. Verify operator matches data types (number vs string)

### Performance issues?

- Compatibility checks are debounced (300ms)
- Spec rendering is memoized
- Consider pagination for large part lists

## Future Enhancements

- Spec validation on part creation
- Rule testing interface
- Spec versioning
- Automated migration tools
- Spec templates per category
