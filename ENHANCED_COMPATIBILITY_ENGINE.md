# Enhanced PC Compatibility Engine - Comprehensive Specification

**Version:** 3.0  
**Date:** January 17, 2026  
**Status:** Complete & Production-Ready

## Overview

The enhanced compatibility engine provides **comprehensive, spec-driven validation** of PC component compatibility across all major dimensions. It combines **declarative database rules** with **advanced heuristic checks**, ensuring no compatibility edge cases are missed while maintaining transparency and educating users.

### Key Achievements

✅ **Spec-Driven Architecture**: All validation references spec dictionary keys  
✅ **Hierarchical Severity**: Error (blocking), Warning (advisory), Info (educational)  
✅ **No External Data**: All checks are heuristic, advisory, or tier-based  
✅ **Backward Compatible**: Existing rules and builds unaffected  
✅ **Extensible**: New specs and rules can be added without frontend changes  
✅ **User-Centric UX**: Clear explanations, recommendations, and fix guidance  

---

## Architecture

### Two-Phase Evaluation

```
Phase 1: Database-Driven Rules
├─ Query compatibility_rules table
├─ Evaluate simple spec comparisons
└─ Filter by source/target categories

Phase 2: Advanced Heuristic Checks
├─ CPU ↔ Motherboard socket matching
├─ Physical clearance calculations
├─ Power connector validation
├─ PSU wattage headroom analysis
├─ Performance tier bottleneck detection
├─ Informational best-practice notes
└─ Educational upgrade guidance
```

### Integration with Existing System

```typescript
// Old flow: Database rules only
evaluateCompatibility() → fetchCompatibilityRules() → evaluateRule()

// New flow: Combined validation
evaluateCompatibility() 
├─ Phase 1: fetchCompatibilityRules() + evaluateRule()
└─ Phase 2: evaluateAdvancedCompatibility()
    ├─ HardCompatibility namespace (errors)
    ├─ PerformanceWarnings namespace (warnings)
    └─ InformationalChecks namespace (info)
```

---

## Severity Levels

### ❌ ERROR (Build-Breaking)

**When**: Physical or functional incompatibility prevents system assembly or operation

**UX**: 
- Shown prominently with red/error styling
- Blocks build approval unless acknowledged
- Prevents adding incompatible parts
- Clear "must fix" messaging

**Examples**:
- CPU socket mismatch → cannot install CPU
- GPU too long for case → physical obstruction
- Insufficient power connectors → GPU cannot operate
- Memory type mismatch → system cannot boot

---

### ⚠️ WARNING (Advisory)

**When**: Suboptimal configuration that works but has performance implications

**UX**:
- Shown in warning section with yellow/caution styling
- Allows user to proceed (advisory only)
- Provides alternatives and reasoning
- Non-blocking, but should be reviewed

**Examples**:
- RAM downclocked to motherboard speed → ~5% performance loss
- Low PSU headroom → reduced PSU efficiency and lifespan
- CPU bottleneck GPU → 15-30% FPS loss in games
- Cooler underpowered for CPU → thermal throttling under heavy load
- GPU on older PCIe gen → ~5-20% bandwidth reduction

---

### ℹ️ INFO (Educational)

**When**: Additional context, best practices, or future-planning information

**UX**:
- Collapsible or expandable sections
- Light blue/info styling
- Never blocks or interrupts
- Inline with related components
- Optional "Learn More" links

**Examples**:
- PCIe backward compatibility explained
- ECC RAM features on consumer boards
- NVMe speed limitations explained
- Modular PSU cable management benefits
- Socket longevity for future upgrades

---

## Implementation Details

### 1. Hard Compatibility Rules (Errors Only)

#### CPU ↔ Motherboard Socket
```typescript
HardCompatibility.checkCpuSocketCompatibility(cpu, motherboard)
- Compares: cpu.socket vs motherboard.socket
- Match required: Yes (exact string match, case-insensitive)
- Severity: ERROR (physical incompatibility)
- Fix: Match socket types or select compatible CPU/board
```

#### RAM ↔ Motherboard Memory Type
```typescript
HardCompatibility.checkMemoryTypeCompatibility(ram, motherboard)
- Compares: ram.memory_type vs motherboard.memory_type
- Match required: Yes (DDR4, DDR5, etc.)
- Severity: ERROR (system cannot boot)
- Fix: Select matching DDR generation
```

#### GPU ↔ Case Physical Clearance
```typescript
HardCompatibility.checkGpuCaseClearance(gpu, case)
- Compares: gpu.length_mm vs case.gpu_max_length_mm
- Compares: gpu.height_mm vs case.interior_height_mm (heuristic)
- Requirements: GPU ≤ case maximum
- Severity: ERROR (physical obstruction)
- Fix: Smaller GPU or larger case
```

#### Cooler ↔ CPU Socket Compatibility
```typescript
HardCompatibility.checkCoolerSocketCompatibility(cooler, cpu)
- Compares: cooler.socket_compatibility (list) includes cpu.socket
- Match required: Yes (socket must be in supported list)
- Severity: ERROR (cannot mount cooler)
- Fix: Cooler must support socket or choose different socket
```

#### Cooler ↔ Case Height Clearance
```typescript
HardCompatibility.checkCoolerCaseClearance(cooler, case)
- Compares: cooler.height_mm vs case.cpu_cooler_height_mm
- Requirements: cooler ≤ case maximum
- Severity: ERROR (physical obstruction)
- Fix: Shorter cooler or larger case
```

#### Motherboard ↔ Case Form Factor
```typescript
HardCompatibility.checkMotherboardCaseFormFactor(motherboard, case)
- Compares: motherboard.form_factor vs case.motherboard_form_factors
- Match required: Yes (ATX, mATX, ITX, etc.)
- Severity: ERROR (cannot mount motherboard)
- Fix: Matching form factor required
```

#### PSU ↔ Case Form Factor
```typescript
HardCompatibility.checkPsuCaseFormFactor(psu, case)
- Compares: psu.psu_form_factor_type vs case.psu_form_factor
- Match required: Yes (ATX, SFX, TFX, etc.)
- Severity: ERROR (PSU won't fit)
- Fix: Matching PSU form factor required
```

#### Required Power Connectors Availability
```typescript
HardCompatibility.checkRequiredPowerConnectors(gpu, psu)
- GPU power: Parses "8-pin + 8-pin" or "12VHPWR"
- Checks: psu has required connector count
- Severity: ERROR (GPU cannot receive power)
- Fix: PSU must have required connectors

HardCompatibility.checkMotherboardPowerConnectors(motherboard, psu)
- Motherboard: Requires 24-pin connector
- Checks: psu.motherboard_power_pins = true
- Severity: ERROR (motherboard cannot power on)
- Fix: Standard 24-pin PSU required

HardCompatibility.checkCpuPowerConnectors(cpu, psu)
- CPU Power: Based on TDP heuristic
  * TDP ≤ 65W → 4-pin sufficient
  * TDP > 125W → 8-pin required
  * 65-125W → 8-pin recommended
- Checks: psu has required connector
- Severity: ERROR (CPU cannot be powered)
- Fix: PSU must have required CPU power connector
```

---

### 2. Performance Warnings (Heuristic)

#### RAM Speed Downclocking
```typescript
PerformanceWarnings.checkRamSpeedDownclock(ram, motherboard)
- Compares: ram.ram_speed_mhz vs motherboard.max_ram_speed_mhz
- Condition: ram_speed > max_ram_speed
- Impact: ~5% performance loss (varies by workload)
- Severity: WARNING (advisory)
- Info: RAM is backward compatible, will run at motherboard max
- Fix: Select slower RAM or newer motherboard
```

#### PSU Wattage vs System Draw
```typescript
PerformanceWarnings.checkPsuWattageHeadroom(selectedParts, headroom=30%)
- Calculates: cpu.tdp + gpu.tdp + 150W (base overhead)
- Checks: (psu.wattage - estimated) / estimated ≥ headroom%
- Headroom Goals:
  * < 0W: ERROR (system won't run)
  * 0-20%: WARNING (low efficiency, high stress)
  * 20-30%: WARNING (suboptimal)
  * 30-80%: GOOD (recommended range)
  * > 150%: INFO (over-specified)
- Severity: WARNING if < 30%, ERROR if < 0%
- Impact: PSU efficiency at 50-80% load; insufficient headroom causes thermal stress
- Fix: Larger PSU recommended
```

#### CPU ↔ GPU Performance Tier Mismatch
```typescript
PerformanceWarnings.checkBottleneckRisk(cpu, gpu)
- Tier Scale: Entry < Budget < Mid-range < High-end < Flagship
- Calculates: |cpu_tier_index - gpu_tier_index|
- Condition: tier_difference ≥ 2
  * GPU > CPU by 2+: GPU bottleneck (GPU can't reach full potential)
    - Impact: 15-30% FPS loss in graphics-heavy games
  * CPU > GPU by 2+: CPU has unused capacity (okay for productivity)
- Severity: WARNING if GPU stronger, INFO if CPU stronger
- Fix: Balance tier closer or accept trade-off
```

#### Cooler TDP Rating vs CPU TDP
```typescript
PerformanceWarnings.checkCoolerTdpRating(cpu, cooler)
- Compares: cpu.tdp_watts vs cooler.tdp_rating_watts
- Conditions:
  * cooler < cpu: WARNING (inadequate cooling)
    - Risk: Thermal throttling under heavy load
    - Impact: 5-20% CPU performance loss during sustained compute
  * cooler > cpu × 1.5: INFO (over-specified)
    - Note: More than necessary, wasted cost
    - Suggestion: Fine if planning upgrades or prefer low noise
- Severity: WARNING if underpowered, INFO if over-specified
- Recommendation: Select cooler 5-20W above CPU TDP for thermal headroom
```

#### PCIe Generation Mismatch
```typescript
PerformanceWarnings.checkPcieGenerationMismatch(gpu, motherboard)
- Compares: gpu.pcie_generation vs motherboard.pcie_generation
- Condition: gpu_gen > motherboard_gen
- Bandwidth Reduction: ((gpu_gen - mb_gen) / gpu_gen) × 100%
  * Gen 3 → Gen 4: ~50% bandwidth (practical impact <5%)
  * Gen 4 → Gen 5: ~50% bandwidth (practical impact <2%)
- Severity: INFO (backward compatible)
- Note: Real-world gaming impact typically <5%
- Recommendation: Not urgent, but nice-to-have for future-proofing
```

---

### 3. Informational & Educational Checks

#### PCIe Backward Compatibility
```typescript
InformationalChecks.checkPcieBackwardCompatibility(gpu, motherboard)
- When: gpu.pcie_generation > motherboard.pcie_generation
- Message: "GPU (PCIe X) is compatible with PCIe Y slot"
- Explanation: PCIe is backward compatible; GPU runs at slot speed
- Education: PCIe 3.0, 4.0, 5.0 devices all backward compatible
- Severity: INFO (educational)
```

#### ECC RAM on Consumer Boards
```typescript
InformationalChecks.checkEccRamOnConsumerBoard(ram, motherboard)
- When: ram.ecc_support = true AND motherboard.ecc_support = false
- Message: "ECC RAM will operate without error correction on this board"
- Explanation: RAM functions normally, ECC features disabled
- Education: ECC useful for servers/workstations, not critical for consumer
- Suggestion: Consider non-ECC RAM for better value
- Severity: INFO (educational)
```

#### NVMe Speed Limitations
```typescript
InformationalChecks.checkNvmeSpeedLimitation(storage, motherboard)
- When: storage.type = "NVMe" AND storage.nvme_pcie_gen > motherboard.nvme_pcie_gen
- Message: "NVMe will run at motherboard's PCIe generation"
- Speeds:
  * PCIe 3.0: ~3,500 MB/s
  * PCIe 4.0: ~7,000 MB/s
  * PCIe 5.0: ~14,000 MB/s
- Impact: Backward compatible; real-world speed difference minimal for most workloads
- Severity: INFO (educational)
```

#### Modular PSU Cable Consideration
```typescript
InformationalChecks.checkModularPsuNote(psu, case)
- When: psu.modular_type IN ('Non-modular', 'Semi-modular')
- Message: "Non-modular PSU has fixed cables"
- Explanation: Cable management more challenging; excess cables in case
- Trade-off: Fully-modular PSUs cost more but cleaner aesthetic
- Severity: INFO (cable management note)
```

#### Socket Longevity & Upgrade Path
```typescript
InformationalChecks.checkSocketUpgradePath(cpu, motherboard)
- Socket Longevity Reference:
  * AM4: Support ended ~2024 (5+ generations of CPUs)
  * AM5: Planned support through ~2028 (long upgrade window)
  * LGA1700: Support through ~2026 (12-13 gen Intel)
  * LGA1851: Newer Intel (future planning)
- Message: "Socket typically supported through ~YEAR"
- Explanation: Useful context for future CPU upgrade planning
- Note: Check compatibility before upgrading; BIOS updates may be needed
- Severity: INFO (planning information)
```

---

## Spec Dictionary Expansions

### New Specs Added for Enhanced Compatibility

**CPU Specs**:
- `generation`: CPU generation (Ryzen 5000, i9-13K, etc.)
- `cpu_tier`: Performance tier (Budget, Mid-range, High-end, etc.) - for heuristic matching

**GPU Specs**:
- `gpu_tier`: Performance tier (Budget, Mid-range, High-end, Flagship) - for heuristic matching
- `gpu_memory_type`: GDDR6, GDDR6X, HBM, etc.
- `gpu_bus_width`: Memory bus width (bits)
- `pcie_generation`: PCIe version (3.0, 4.0, 5.0)
- `pcie_lanes_required`: PCIe lanes needed (typically x16)
- `gpu_memory_bandwidth_gbps`: Memory bandwidth

**Cooler Specs**:
- `tdp_rating_watts`: Maximum TDP the cooler supports
- `socket_compatibility`: Supported sockets (e.g., "AM4, AM5, LGA1700")
- `thickness_mm`: Cooler thickness

**Motherboard Specs**:
- `socket_revision`: Socket version (AM5, LGA1700, etc.)
- `bios_version_required`: Minimum BIOS for CPU support
- `psu_form_factor`: Supported PSU sizes (ATX, SFX, etc.)
- `motherboard_form_factors`: Supported motherboard sizes (comma-separated)
- `interior_length_mm`, `interior_width_mm`, `interior_height_mm`: Case interior dimensions
- `storage_interfaces`: Supported storage types (SATA, NVMe, M.2, etc.)
- `pcie_gen_slots`: PCIe generations by slot
- `overclocking_support`: Overclocking capability
- `ecc_support`: ECC RAM support
- `max_ram_gb`: Maximum RAM capacity
- `max_ram_slots`: Number of RAM slots
- `nvme_pcie_gen`: PCIe generation for M.2 slots

**RAM Specs**:
- `ecc_support`: ECC support

**Storage Specs**:
- `form_factor_storage`: 2.5", 3.5", M.2, etc.
- `nvme_protocol`: NVMe version (1.3, 1.4, etc.)
- `nvme_pcie_gen`: PCIe generation (3.0, 4.0, 5.0)

**PSU Specs**:
- `psu_form_factor_type`: ATX, SFX, TFX, etc.
- `modular_type`: Non-modular, Semi-modular, Fully-modular
- `pcie_8pin_count`: Number of 8-pin PCIe connectors
- `pcie_6pin_count`: Number of 6-pin PCIe connectors
- `pcie_12vhpwr`: 12VHPWR connector support
- `motherboard_power_pins`: 24-pin ATX power support
- `cpu_power_4pin`: 4-pin CPU power connector count
- `cpu_power_8pin`: 8-pin CPU power connector count

**Case Specs**:
- `interior_length_mm`, `interior_width_mm`, `interior_height_mm`: Interior dimensions
- `power_supply_cover`: PSU shroud support
- `drive_bays_35`: 3.5" drive bays
- `drive_bays_25`: 2.5" drive bays

---

## Database Schema

### Existing Table
```sql
CREATE TABLE compatibility_rules (
  id UUID PRIMARY KEY,
  source_category TEXT,              -- 'cpu', 'gpu', 'motherboard', etc.
  target_category TEXT,              -- Same categories
  source_field TEXT,                 -- Must match spec dictionary key
  target_field TEXT,                 -- Must match spec dictionary key
  operator TEXT,                     -- 'equals', 'greater_than', 'includes', etc.
  severity TEXT,                     -- 'error', 'warning', 'info'
  message TEXT,                      -- Display message
  description TEXT,                  -- Explanation
  active BOOLEAN,                    -- Enable/disable rule
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Seeded Rules
The migration file `enhanced-compatibility-rules.sql` seeds foundational rules:
- CPU socket matching (error)
- Memory type matching (error)
- Form factor compatibility (error)
- RAM speed compatibility (warning)
- PCIe generation matching (info)
- Storage interface support (info)

---

## API Usage Examples

### Basic Usage
```typescript
import { evaluateCompatibility } from './lib/compatibilityEngine';

const selectedParts = {
  cpu: { data: { compatibility: { socket: 'AM5' }, ... } },
  motherboard: { data: { compatibility: { socket: 'AM5' }, ... } },
  gpu: { ... },
  // ... other parts
};

const { issues, confirmations } = await evaluateCompatibility(selectedParts);

// Separate by severity
const errors = issues.filter(i => i.severity === 'error');
const warnings = issues.filter(i => i.severity === 'warning');
const info = issues.filter(i => i.severity === 'info');
```

### Advanced Engine Usage
```typescript
import { 
  evaluateAdvancedCompatibility, 
  filterIssuesBySeverity, 
  getCompatibilitySummary 
} from './lib/advancedCompatibilityEngine';

const allIssues = await evaluateAdvancedCompatibility(selectedParts);

const errorIssues = filterIssuesBySeverity(allIssues, 'error');
const summary = getCompatibilitySummary(allIssues);

console.log(`Total: ${summary.totalIssues}, Errors: ${summary.errors}, Can Build: ${summary.canBuild}`);
```

### Component-Level Checks
```typescript
import { HardCompatibility, PerformanceWarnings } from './lib/advancedCompatibilityEngine';

// Check specific compatibility
const cpuSocketIssue = HardCompatibility.checkCpuSocketCompatibility(cpu, motherboard);
const bottleneckWarning = PerformanceWarnings.checkBottleneckRisk(cpu, gpu);
```

---

## UI Integration Strategy

### Error Display
```
🔴 CRITICAL INCOMPATIBILITY
CPU Socket Mismatch
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Selected CPU (Socket AM4) cannot be installed on your 
motherboard (Socket LGA1700). These socket types are 
completely different and not compatible.

FIX: Select a CPU or motherboard with matching socket types.
Both must use AM4 or LGA1700.
```

### Warning Display
```
⚠️  ADVISORY WARNING
Low PSU Headroom (18%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Estimated system draw: 450W
PSU capacity: 550W
Headroom: 100W (18%)

RECOMMENDATION: PSUs operate efficiently at 50-80% load. 
Consider upgrading to a 650W or larger PSU.

→ You can proceed, but efficiency will be reduced.
```

### Info Display
```
ℹ️  EDUCATIONAL NOTE
PCIe Backward Compatibility
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your GPU (PCIe 5.0) is compatible with the motherboard's 
PCIe 4.0 slot. The GPU will operate at PCIe 4.0 speeds.

PCIe is fully backward compatible - newer devices work with 
older slots, just at reduced bandwidth.
```

---

## Extensibility & Future Enhancements

### Adding New Specs
1. Add spec definition to `SPEC_DICTIONARY` in `specDictionary.ts`
2. Update relevant part categories
3. Create seed data in Supabase
4. Rules automatically reference via spec keys

### Adding New Rules
**Database Rules** (simple comparisons):
```typescript
await addCompatibilityRule(
  'cpu', 'motherboard',
  'socket', 'socket',
  'equals',
  'error',
  'CPU Socket Mismatch',
  'CPU socket must match motherboard socket'
);
```

**Advanced Rules** (heuristic):
```typescript
// Add function to HardCompatibility, PerformanceWarnings, or 
// InformationalChecks namespace in advancedCompatibilityEngine.ts
export function checkNewCompatibility(part1: any, part2: any) {
  // Implementation
  return issue || null;
}

// Call in evaluateAdvancedCompatibility()
```

### Future Architecture: Advanced Rule Engine
```sql
CREATE TABLE advanced_compatibility_rules (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE,
  category TEXT, -- 'hard', 'warning', 'info'
  eval_logic JSONB, -- Complex evaluation logic
  message TEXT,
  description TEXT,
  recommendation TEXT,
  active BOOLEAN
);
```

This would enable:
- Declarative complex rules without code changes
- Multi-part conditional checks
- Heuristic scoring and weighting
- Dynamic message generation from templates
- A/B testing different rule configurations
- Version control and rollback

---

## Testing & Validation

### Manual Test Cases

#### Hard Compatibility
- ✅ CPU socket mismatch (AM4 ↔ LGA1700)
- ✅ Memory type mismatch (DDR4 ↔ DDR5)
- ✅ GPU too large for case
- ✅ Cooler too tall for case
- ✅ Cooler unsupported socket
- ✅ Motherboard won't fit in case
- ✅ PSU wrong form factor
- ✅ Missing power connectors

#### Performance Warnings
- ✅ RAM downclocked to motherboard max
- ✅ PSU with insufficient headroom
- ✅ CPU/GPU tier mismatch
- ✅ Cooler underpowered for CPU
- ✅ GPU on older PCIe generation

#### Informational
- ✅ ECC RAM on consumer board
- ✅ NVMe speed limitation
- ✅ PCIe backward compatibility
- ✅ Non-modular PSU cable management
- ✅ Socket upgrade path

### Regression Testing
- Existing database rules still work
- No false positives for compatible builds
- All spec dictionary keys resolve correctly
- Performance under load (100+ parts selected)

---

## Backward Compatibility

✅ **Existing Rules**: All database rules continue to work  
✅ **Existing Specs**: All SPEC_DICTIONARY entries unchanged  
✅ **Existing Builds**: No impact; validation improved  
✅ **Existing APIs**: `evaluateCompatibility()` still works as before  
✅ **Data Format**: No schema changes to parts or builds tables  

---

## Performance Considerations

### Evaluation Time
- Database rules: O(n) where n = rules count (~20-50 rules)
- Advanced checks: O(1) per check (30+ checks)
- **Total**: Typically 50-200ms for full build
- **Optimization**: Cache results, lazy-evaluate if needed

### Scalability
- Spec dictionary: Static, loaded once (~200 entries)
- Compatibility rules: ~50-100 entries, cached
- Advanced checks: No external API calls
- **Recommendation**: Cache results for 5-10 minutes per build

---

## Summary

The enhanced compatibility engine provides **comprehensive, trustworthy, expert-grade validation** while remaining **transparent, educational, and non-intimidating**. 

Key features:
- ✅ All major compatibility dimensions covered
- ✅ Clear severity levels (error/warning/info)
- ✅ Spec-driven, declarative rules
- ✅ Heuristic, advisory, or tier-based advanced checks
- ✅ Actionable explanations and fix guidance
- ✅ Backward compatible with existing system
- ✅ Easily extensible for new specs/rules
- ✅ Production-ready architecture

The system ensures users can build with confidence, knowing compatibility has been thoroughly validated across physical, functional, and performance dimensions.
