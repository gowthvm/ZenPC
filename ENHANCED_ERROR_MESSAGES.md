# Enhanced Compatibility Error Messages

## Overview

The compatibility engine has been enhanced to provide **exact incompatibility details** and **actionable fix suggestions** that users can follow to resolve issues.

## Key Improvements

### Message Structure

Each error message now follows this enhanced format:

```
❌ [Error Type]: [Part Name] has specific issue with [Other Part Name]

INCOMPATIBLE: Detailed explanation of what's wrong

EXACTLY WHAT'S WRONG:
• Your [Part Type]: [Name] (actual spec)
• Your [Other Part]: [Name] (conflicting spec)  
• Problem: Specific description of the incompatibility

Option 1: [Specific action]
Option 2: [Specific action]
```

## Enhanced Validation Functions

### 1. CPU Socket Compatibility
**Before:** "CPU socket is incompatible with motherboard socket"  
**After:** "❌ CPU Socket Mismatch: Intel Core i9 requires LGA1700 but motherboard has AM5 socket"

**Shows:**
- CPU name and required socket (e.g., LGA1700)
- Motherboard name and available socket (e.g., AM5)
- Exact problem: "The CPU physically will not fit"
- Option 1: Replace motherboard to match AM4 socket
- Option 2: Replace CPU to match LGA1700 socket
- Recommendation: Lists common socket types

### 2. Memory Type Compatibility
**Before:** "RAM type is incompatible with motherboard"  
**After:** "❌ Memory Type Mismatch: Corsair Vengeance 32GB is DDR5 but motherboard requires DDR4"

**Shows:**
- RAM name and type (DDR5 vs DDR4)
- Motherboard name and supported type
- Physical problem: "Connectors don't match - RAM won't seat"
- Option 1: Get DDR4 RAM instead
- Option 2: Get DDR4-supporting motherboard
- Recommendation: Explains modern standards and compatibility

### 3. GPU Case Clearance
**Before:** "GPU is too large for case"  
**After:** "❌ GPU Too Large: RTX 4090 (312mm × 111mm) exceeds case clearance (max 300mm × 100mm)"

**Shows:**
- GPU name and dimensions (312mm × 111mm)
- Case name and available space (300mm × 100mm)
- Exact measurement difference: "GPU is 12mm TOO LONG"
- Option 1: Get larger case
- Option 2: Get smaller GPU that fits specs
- Recommendation: Check GPU clearance before buying

### 4. Cooler Height Clearance
**Before:** "CPU cooler is too tall for case"  
**After:** "❌ Cooler Too Tall: Noctua NH-D15 (165mm) doesn't fit in Fractal Core 1000 (max 160mm)"

**Shows:**
- Cooler name and height (165mm)
- Case name and max clearance (160mm)
- Problem: "Cooler is 5mm TOO TALL"
- Option 1: Get shorter cooler under 160mm
- Option 2: Get larger case
- Recommendation: Check case spec before buying big air coolers

### 5. Cooler Socket Support
**Before:** "Cooler does not support socket"  
**After:** "❌ Cooler Incompatible: Corsair H150i doesn't support AM5 socket (supports: AM4, LGA1150, LGA1200)"

**Shows:**
- Cooler name and supported sockets (AM4, LGA1150, LGA1200)
- CPU name and socket (AM5)
- Problem: "Mounting hardware is incompatible"
- Option 1: Get cooler that supports AM5
- Option 2: Get AM4 CPU instead
- Recommendation: Multi-socket coolers vs platform-specific

### 6. Motherboard Form Factor
**Before:** "Case does not support motherboard type"  
**After:** "❌ Motherboard Won't Fit: ROG STRIX X870 (ATX) doesn't fit in Lian Li Lancool 205 (supports Micro-ATX, Mini-ITX)"

**Shows:**
- Motherboard name and size (ATX)
- Case name and supported sizes (Micro-ATX, Mini-ITX)
- Problem: "Mounting holes don't align"
- Option 1: Get Micro-ATX board
- Option 2: Get larger case
- Recommendation: Explains size standards

### 7. PSU Form Factor
**Before:** "Case does not support PSU type"  
**After:** "❌ PSU Won't Fit: EVGA SuperNOVA 1000W (ATX) doesn't fit in Corsair 5000T (supports ATX, SFX)"

**Shows:**
- PSU name and size (ATX)
- Case name and supported sizes (ATX, SFX)
- Problem: "PSU won't fit in power supply bay"
- Option 1: Get SFX PSU
- Option 2: Get larger case
- Recommendation: Common PSU sizes and considerations

### 8. Missing 12VHPWR Connector
**Before:** "GPU requires 12VHPWR, PSU does not support it"  
**After:** "❌ Missing Connector: RTX 4090 requires 12VHPWR but Corsair RM850x doesn't have it"

**Shows:**
- GPU name (RTX 4090)
- PSU name and connector type (traditional PCIe only)
- Problem: "No physical connector on PSU"
- Option 1: Get RTX 40-series compatible PSU with 12VHPWR
- Option 2: Get GPU with traditional connectors
- Recommendation: Explains 12VHPWR is new RTX 40-series standard

### 9. Insufficient Power Connectors
**Before:** "GPU requires connectors PSU doesn't provide"  
**After:** "❌ Missing Power Connectors: RTX 4080 needs 2× 8-pin that RM1000x (provides 1× 8-pin) doesn't have"

**Shows:**
- GPU name and requirements (2× 8-pin)
- PSU name and available (1× 8-pin)
- Missing: "1× 8-pin"
- Problem: "Using adapters is dangerous"
- Option 1: Get PSU with 2× 8-pin
- Option 2: Get lower-power GPU
- Recommendation: High-end GPUs need robust power delivery

## UI Display Enhancement

The CompatibilityIssueDisplay component now shows:

1. **Error Headline** - Main incompatibility at a glance
2. **Involved Components** - Bullet list of affected parts
3. **What's Incompatible** - Extracted specific mismatches from explanation
4. **What You Must Do** - Actionable fix options
5. **Recommendation** - Additional context/guidance

### Example Display:

```
🔴 ERROR: GPU Socket Mismatch

🔴 Involved Components:
• RTX 4090 (GPU)
• ASUS ProArt 550W (PSU)

⚠️ What's Incompatible:
• RTX 4090 requires 2× 8-pin + 1× 6-pin connectors
• ASUS ProArt 550W only provides 1× 8-pin
• Missing: 1× 8-pin and 1× 6-pin

✓ What You Must Do:
Option 1: Choose a more powerful PSU (850W+) with dual 8-pin connectors
Option 2: Choose a lower-power GPU (RTX 4070)

💡 Recommendation:
High-end RTX 40-series GPUs need 850W+ PSUs with dedicated connectors. 
Never use adapters for power delivery—it's unsafe.
```

## Benefits for Users

✅ **Clarity** - Know exactly what's wrong, not just "incompatible"  
✅ **Actionability** - Get specific steps to fix (e.g., "Choose PSU with 2× 8-pin")  
✅ **Context** - See part names and specs involved  
✅ **Guidance** - Recommendations help future decisions  
✅ **Safety** - Warnings about dangerous practices (e.g., power adapter dangers)  

## Testing Scenarios

To test these enhanced messages:

1. **Socket Mismatch:** Pair Intel CPU (LGA1700) with AMD motherboard (AM5)
2. **Memory Type:** Pair DDR5 RAM with DDR4 motherboard
3. **GPU Size:** Pair RTX 4090 (320mm) with compact case (max 300mm)
4. **Cooler Height:** Pair 180mm cooler with case supporting only 160mm
5. **Socket Incompatibility:** Pair AM5 cooler with LGA1700 CPU
6. **Form Factors:** Pair ATX motherboard with Micro-ATX only case
7. **PSU Size:** Pair ATX PSU with SFX-only case
8. **Missing Connectors:** Pair RTX 4090 with 650W PSU

## Implementation Details

**File:** [lib/advancedCompatibilityEngine.ts](lib/advancedCompatibilityEngine.ts)

**Enhanced Functions:**
- `checkCpuSocketCompatibility()` - CPU ↔ Motherboard
- `checkMemoryTypeCompatibility()` - RAM ↔ Motherboard
- `checkGpuCaseClearance()` - GPU ↔ Case
- `checkCoolerCaseClearance()` - Cooler ↔ Case
- `checkCoolerSocketCompatibility()` - Cooler ↔ CPU
- `checkMotherboardCaseFormFactor()` - Motherboard ↔ Case
- `checkPsuCaseFormFactor()` - PSU ↔ Case
- `checkRequiredPowerConnectors()` - GPU power connectors ↔ PSU

**Display Component:** [components/builder/CompatibilityIssueDisplay.tsx](components/builder/CompatibilityIssueDisplay.tsx)

**Key Feature:** `parseIncompatibilityDetails()` function extracts specific details from explanations for organized display

---

**Result:** Users now see EXACTLY what's incompatible and EXACTLY what they must do to fix it, making the builder more user-friendly and preventing frustration from vague error messages.
