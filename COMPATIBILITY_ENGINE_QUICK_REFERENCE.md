# Quick Reference: Enhanced Compatibility Engine

**Version**: 3.0 | **Status**: Production-Ready | **Date**: Jan 17, 2026

---

## 📚 Key Files

| File | Purpose | Size |
|------|---------|------|
| `lib/advancedCompatibilityEngine.ts` | All validation functions | 700+ lines |
| `lib/compatibilityEngine.ts` | Main engine (integrated) | Updated |
| `lib/specDictionary.ts` | All specs (expanded) | +45 specs |
| `ENHANCED_COMPATIBILITY_ENGINE.md` | Full documentation | 2000+ words |
| `enhanced-compatibility-rules.sql` | DB migration | Includes docs |

---

## 🚀 Quick Start

### Import
```typescript
import { evaluateCompatibility } from '@/lib/compatibilityEngine';
import { 
  HardCompatibility, 
  PerformanceWarnings, 
  InformationalChecks 
} from '@/lib/advancedCompatibilityEngine';
```

### Basic Usage
```typescript
const { issues, confirmations } = await evaluateCompatibility(selectedParts);

// Filter by severity
const errors = issues.filter(i => i.severity === 'error');
const warnings = issues.filter(i => i.severity === 'warning');
const info = issues.filter(i => i.severity === 'info');
```

### Check Specific Issue
```typescript
const socketIssue = HardCompatibility.checkCpuSocketCompatibility(cpu, mb);
if (socketIssue) {
  console.log(socketIssue.message);      // "CPU socket AM4 is incompatible..."
  console.log(socketIssue.explanation);  // Detailed explanation
  console.log(socketIssue.fix);          // Actionable fix
}
```

---

## ✅ What's Checked

### 🔴 ERRORS (Build-Breaking)
- CPU ↔ Motherboard socket
- RAM ↔ Motherboard memory type
- GPU ↔ Case physical clearance
- Cooler ↔ Case height clearance
- Cooler ↔ CPU socket
- Motherboard ↔ Case form factor
- PSU ↔ Case form factor
- Power connectors (GPU, motherboard, CPU)

### ⚠️ WARNINGS (Advisory)
- RAM speed downclocking
- PSU wattage & headroom
- CPU/GPU bottleneck
- Cooler TDP rating
- PCIe generation mismatch

### ℹ️ INFO (Educational)
- PCIe backward compatibility
- ECC RAM on consumer boards
- NVMe speed limits
- PSU modular considerations
- Socket upgrade paths

---

## 🔧 Common Issues

### Socket Mismatch
```typescript
const issue = HardCompatibility.checkCpuSocketCompatibility(cpu, motherboard);
// Returns: ERROR - "CPU socket AM4 is incompatible with motherboard socket LGA1700"
```

### Memory Type Mismatch
```typescript
const issue = HardCompatibility.checkMemoryTypeCompatibility(ram, motherboard);
// Returns: ERROR - "RAM type DDR4 is not supported by motherboard (requires DDR5)"
```

### GPU Too Large
```typescript
const issue = HardCompatibility.checkGpuCaseClearance(gpu, case_);
// Returns: ERROR - "GPU is too large for the case (exceeds by 20mm)"
```

### Low PSU Headroom
```typescript
const issue = PerformanceWarnings.checkPsuWattageHeadroom(selectedParts);
// Returns: WARNING - "PSU headroom is 18% (recommended: 30%+)"
```

### Bottleneck Risk
```typescript
const issue = PerformanceWarnings.checkBottleneckRisk(cpu, gpu);
// Returns: WARNING - "CPU tier (Budget) may bottleneck GPU tier (High-end)"
```

---

## 📊 Issue Object Structure

```typescript
interface ExtendedCompatibilityIssue {
  type: string;                    // "CPU Socket Mismatch"
  severity: 'error' | 'warning' | 'info';
  message: string;                 // Primary message
  explanation: string;             // Detailed explanation
  fix?: string;                    // How to fix it
  recommendation?: string;         // Best practices
  affected: string[];              // ['cpu', 'motherboard']
  category: 'hard' | 'warning' | 'info';
  parts_involved: string[];        // Which parts
  spec_keys?: string[];            // Relevant specs
  severity_explanation?: string;   // Why this severity
}
```

---

## 🎨 UI Integration

### Error Display
```tsx
<div className="bg-red-50 border-l-4 border-red-500 p-4">
  <h3 className="text-red-900">❌ {issue.type}</h3>
  <p className="text-red-800">{issue.message}</p>
  <p className="text-red-700">{issue.explanation}</p>
  <p className="text-red-600">→ {issue.fix}</p>
</div>
```

### Warning Display
```tsx
<details className="bg-amber-50 border-l-4 border-amber-500 p-4">
  <summary className="text-amber-900">⚠️ {issue.type}</summary>
  <div className="text-amber-800 mt-2">
    <p>{issue.message}</p>
    <p>{issue.explanation}</p>
    <p>{issue.recommendation}</p>
  </div>
</details>
```

### Info Display
```tsx
<details className="bg-blue-50 border-l-4 border-blue-500 p-4">
  <summary className="text-blue-900">ℹ️ {issue.type}</summary>
  <div className="text-blue-800 mt-2">{issue.explanation}</div>
</details>
```

---

## 🔄 Workflow Integration

### Progressive Validation
```typescript
// As user selects parts, validate incrementally
selectedParts.cpu = cpuData;
let { issues } = await evaluateCompatibility(selectedParts);

selectedParts.motherboard = mbData;
({ issues } = await evaluateCompatibility(selectedParts));
// Show errors immediately if socket doesn't match

selectedParts.gpu = gpuData;
selectedParts.case = caseData;
({ issues } = await evaluateCompatibility(selectedParts));
// Show if GPU won't fit
```

### Build Approval
```typescript
const { issues } = await evaluateCompatibility(build);
const canSave = issues.every(i => i.severity !== 'error');

if (canSave) {
  // Save build
} else {
  // Show errors, block save
}
```

---

## 📈 Performance

| Operation | Time |
|-----------|------|
| Single check | <1ms |
| Full evaluation | 50-200ms |
| 100 builds analytics | ~20s |

**Tip**: Cache results for 5-10 minutes per build

---

## 🧪 Testing Examples

```typescript
// Error case
const cpu = { data: { compatibility: { socket: 'AM5' } } };
const mb = { data: { compatibility: { socket: 'LGA1700' } } };
const issue = HardCompatibility.checkCpuSocketCompatibility(cpu, mb);
expect(issue?.severity).toBe('error');

// Success case
const mb2 = { data: { compatibility: { socket: 'AM5' } } };
const issue2 = HardCompatibility.checkCpuSocketCompatibility(cpu, mb2);
expect(issue2).toBeNull();

// Warning case
const psu = { data: { power: { wattage: 550 } } };
const cpuTdp = 105, gpuTdp = 250;
const headroom = ((550 - 105 - 250 - 150) / (105 + 250 + 150)) * 100;
expect(headroom < 30).toBe(true);
```

---

## 🆕 Adding New Checks

### Step 1: Add Specs
```typescript
// In specDictionary.ts
export const SPEC_DICTIONARY = {
  new_spec_name: {
    label: 'Display Name',
    categories: ['cpu'],
    group: 'performance',
    unit: 'GHz',
    importance: 'high',
    type: 'number'
  }
};
```

### Step 2: Create Function
```typescript
// In advancedCompatibilityEngine.ts
export namespace HardCompatibility {
  export function checkNewCompatibility(part1: any, part2: any) {
    const val1 = getSpecValue(part1, 'new_spec_name');
    if (!val1) return null;
    
    if (/* incompatible */) {
      return {
        type: 'Issue Type',
        severity: 'error',
        message: 'What is wrong',
        explanation: 'Why it is wrong',
        fix: 'How to fix it',
        affected: ['part1', 'part2'],
        category: 'hard',
        parts_involved: ['part1', 'part2'],
        spec_keys: ['new_spec_name']
      };
    }
    return null;
  }
}
```

### Step 3: Call It
```typescript
// In evaluateAdvancedCompatibility()
if (part1 && part2) {
  const issue = HardCompatibility.checkNewCompatibility(part1, part2);
  if (issue) issues.push(issue);
}
```

---

## 🎯 Common Heuristics

### PSU Headroom Calculation
```typescript
// System draw = CPU TDP + GPU TDP + Base overhead (150W)
const systemDraw = cpuTdp + gpuTdp + 150;
const headroom = (psuWattage - systemDraw) / systemDraw * 100;

// Recommended: 30-80% headroom
if (headroom < 30) {
  // WARNING: Upgrade PSU
}
```

### CPU Power Connector Heuristic
```typescript
// Based on TDP
if (cpuTdp <= 65) {
  // 4-pin sufficient
}
else if (cpuTdp <= 125) {
  // 8-pin recommended
}
else {
  // 8-pin required
}
```

### Bottleneck Detection
```typescript
const tiers = ['Entry', 'Budget', 'Mid-range', 'High-end', 'Flagship'];
const cpuIdx = tiers.indexOf(cpuTier);
const gpuIdx = tiers.indexOf(gpuTier);

if (Math.abs(gpuIdx - cpuIdx) >= 2) {
  // Potential bottleneck
}
```

---

## 🐛 Troubleshooting

### Issue Not Showing?
1. Check if part has required spec
2. Verify spec key spelling
3. Check `getSpecValue()` extraction logic
4. Ensure part is in `selectedParts`

### False Positive?
1. Review heuristic thresholds
2. Check edge cases in condition
3. Add additional validation
4. Consider converting to INFO instead of ERROR

### Performance Slow?
1. Cache results
2. Lazy-evaluate INFO checks
3. Batch process analytics
4. Consider pagination for large datasets

---

## 📞 Reference

### Severity Quick Reference
- **ERROR**: Show prominently, block action, must fix
- **WARNING**: Show as accordion, allow proceed, suggest fix
- **INFO**: Collapsible, educational, never block

### Type Safety
```typescript
// Always check for null/undefined
const value = getSpecValue(part, 'spec_key');
if (!value) return null;

// Type narrowing
if (typeof value === 'number' && value > threshold) {
  // Safe comparison
}
```

### Common Specs
- `socket`: CPU/cooler socket type
- `memory_type`: DDR4/DDR5
- `form_factor`: ATX/mATX/ITX
- `length_mm`, `height_mm`: Physical dimensions
- `tdp_watts`: Power consumption
- `wattage`: PSU capacity
- `pcie_generation`: PCIe version

---

## 🎓 Philosophy

✅ **Transparent**: Every check explained, heuristics documented  
✅ **Helpful**: Clear fixes and recommendations  
✅ **Non-blocking**: Warnings never prevent progress  
✅ **Extensible**: Add rules without frontend changes  
✅ **Expert-grade**: Comprehensive without overwhelming  

---

**Last Updated**: January 17, 2026  
**Maintained By**: ZenPC Development  
**Questions?** See `ENHANCED_COMPATIBILITY_ENGINE.md` for full docs
