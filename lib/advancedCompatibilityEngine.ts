/**
 * Advanced Compatibility Engine
 * 
 * Comprehensive validation framework for PC component compatibility.
 * Implements spec-driven, declarative rules with heuristic advanced checks.
 * 
 * Categories:
 * 1. HARD COMPATIBILITY (errors only) - Build-breaking incompatibilities
 * 2. PERFORMANCE WARNINGS - Heuristic advisory checks
 * 3. INFORMATIONAL CHECKS - Educational and best-practice suggestions
 */

import { supabase } from './supabaseClient';
import { getSpecDefinition, getSpecValue, SPEC_DICTIONARY } from './specDictionary';
import type { CompatibilitySeverity, CompatibilityIssue } from './compatibilityEngine';

/**
 * Advanced rule with support for conditions and custom evaluation
 */
export interface AdvancedCompatibilityRule {
  id: string;
  name: string;
  category: 'hard' | 'warning' | 'info';
  severity: CompatibilitySeverity;
  source_categories: string[]; // Can check multiple part types
  eval_function: string; // Function name or inline evaluation logic
  message: string;
  description?: string;
  recommendation?: string;
  active?: boolean;
  rule_set?: string; // Grouping for related rules (e.g., "power", "physical", "memory")
}

/**
 * Extended issue with additional context
 */
export interface ExtendedCompatibilityIssue extends CompatibilityIssue {
  category: 'hard' | 'warning' | 'info';
  recommendation?: string;
  parts_involved: string[];
  spec_keys?: string[];
  severity_explanation?: string;
}

/**
 * Evaluation context for rules
 */
interface EvaluationContext {
  selectedParts: Record<string, any>;
  partSpecs: Record<string, Record<string, any>>;
  headroom?: number; // For power calculations
}

/**
 * ============================================================================
 * HARD COMPATIBILITY RULES (ERRORS ONLY)
 * ============================================================================
 * Build-breaking incompatibilities that prevent system assembly
 */

export namespace HardCompatibility {
  /**
   * CPU ↔ Motherboard socket compatibility
   */
  export function checkCpuSocketCompatibility(
    cpu: any,
    motherboard: any
  ): ExtendedCompatibilityIssue | null {
    const cpuSocket = getSpecValue(cpu, 'socket');
    const cpuName = getSpecValue(cpu, 'name') || 'Your CPU';
    const mbSocket = getSpecValue(motherboard, 'socket');
    const mbName = getSpecValue(motherboard, 'name') || 'Your motherboard';

    if (!cpuSocket || !mbSocket) return null;

    const cpuSocketNorm = String(cpuSocket).toUpperCase().trim();
    const mbSocketNorm = String(mbSocket).toUpperCase().trim();

    if (cpuSocketNorm !== mbSocketNorm) {
      const fixOptions = [
        `Option 1: Replace the motherboard with one that has an ${cpuSocketNorm} socket (to match your CPU)`,
        `Option 2: Replace the CPU with a processor that uses the ${mbSocketNorm} socket (to match your motherboard)`
      ];

      return {
        type: 'CPU Socket Mismatch',
        severity: 'error',
        message: `❌ CPU Socket Mismatch: ${cpuName} requires ${cpuSocketNorm} but motherboard has ${mbSocketNorm}`,
        explanation: `INCOMPATIBLE: "${cpuName}" uses the ${cpuSocketNorm} socket, but "${mbName}" uses the ${mbSocketNorm} socket. These sockets are not compatible - you cannot install this CPU on this motherboard.

EXACTLY WHAT'S WRONG:
• Your CPU: ${cpuName} (socket: ${cpuSocketNorm})
• Your motherboard: ${mbName} (socket: ${mbSocketNorm})
• Problem: The CPU physically will not fit into the motherboard's socket.`,
        fix: fixOptions.join('\n\n'),
        affected: ['cpu', 'motherboard'],
        category: 'hard',
        parts_involved: ['cpu', 'motherboard'],
        spec_keys: ['socket'],
        severity_explanation: 'BLOCKING ERROR: This is a physical incompatibility - the CPU cannot be installed. Your build will not work.',
        recommendation: `To fix this issue, you MUST choose parts with matching sockets. Common sockets include: AM4/AM5 (AMD), LGA1150/LGA1200/LGA1700 (Intel).`
      };
    }

    return null;
  }

  /**
   * RAM ↔ Motherboard memory type compatibility
   */
  export function checkMemoryTypeCompatibility(
    ram: any,
    motherboard: any
  ): ExtendedCompatibilityIssue | null {
    const ramType = getSpecValue(ram, 'memory_type');
    const ramName = getSpecValue(ram, 'name') || 'Your RAM';
    const mbType = getSpecValue(motherboard, 'memory_type');
    const mbName = getSpecValue(motherboard, 'name') || 'Your motherboard';

    if (!ramType || !mbType) return null;

    const ramTypeNorm = String(ramType).toUpperCase().trim();
    const mbTypeNorm = String(mbType).toUpperCase().trim();

    if (ramTypeNorm !== mbTypeNorm) {
      const fixOptions = [
        `Option 1: Replace your RAM with ${mbTypeNorm} memory to match your motherboard's requirements`,
        `Option 2: Replace your motherboard with one that supports ${ramTypeNorm} memory to match your RAM`
      ];

      return {
        type: 'Memory Type Mismatch',
        severity: 'error',
        message: `❌ Memory Type Mismatch: ${ramName} is ${ramTypeNorm} but motherboard requires ${mbTypeNorm}`,
        explanation: `INCOMPATIBLE: "${ramName}" is ${ramTypeNorm} memory, but "${mbName}" only supports ${mbTypeNorm} memory. The RAM will not fit into the motherboard's memory slots and the system will not work.

EXACTLY WHAT'S WRONG:
• Your RAM: ${ramName} (type: ${ramTypeNorm})
• Your motherboard: ${mbName} (supports: ${mbTypeNorm})
• Problem: The physical connectors don't match - your RAM will not seat into the motherboard's DIMM slots.`,
        fix: fixOptions.join('\n\n'),
        affected: ['ram', 'motherboard'],
        category: 'hard',
        parts_involved: ['ram', 'motherboard'],
        spec_keys: ['memory_type'],
        severity_explanation: 'BLOCKING ERROR: This is a physical incompatibility - the RAM will not fit. Your system will not boot or detect memory.',
        recommendation: `Ensure both RAM and motherboard support the same memory standard. DDR5 and DDR4 are not compatible with each other.`
      };
    }

    return null;
  }

  /**
   * GPU ↔ Case physical clearance
   */
  export function checkGpuCaseClearance(
    gpu: any,
    case_: any
  ): ExtendedCompatibilityIssue | null {
    const gpuLength = getSpecValue(gpu, 'length_mm');
    const gpuHeight = getSpecValue(gpu, 'height_mm');
    const maxLength = getSpecValue(case_, 'gpu_max_length_mm');
    const maxHeight = getSpecValue(case_, 'cpu_cooler_height_mm'); // Proxy for interior height clearance

    const issues = [];

    if (gpuLength && maxLength && gpuLength > maxLength) {
      issues.push({
        dimension: 'length',
        required: gpuLength,
        available: maxLength,
        excess: gpuLength - maxLength
      });
    }

    if (gpuHeight && maxHeight && gpuHeight > maxHeight) {
      issues.push({
        dimension: 'height',
        required: gpuHeight,
        available: maxHeight,
        excess: gpuHeight - maxHeight
      });
    }

    if (issues.length > 0) {
      const gpuName = getSpecValue(gpu, 'name') || 'Your GPU';
      const caseName = getSpecValue(case_, 'name') || 'Your case';
      const dimensionDetails = issues.map(i => {
        if (i.dimension === 'length') {
          return `Length: ${i.required}mm (GPU) vs ${i.available}mm (case) - GPU is ${i.excess}mm TOO LONG`;
        } else {
          return `Height: ${i.required}mm (GPU) vs ${i.available}mm (case) - GPU is ${i.excess}mm TOO TALL`;
        }
      }).join('\n• ');

      const fixOptions = [
        `Option 1: Get a larger case that can accommodate a GPU that's ${Math.max(...issues.map(i => i.excess))}mm larger`,
        `Option 2: Replace the GPU with a smaller model that fits within the ${caseName}'s dimensions (max ${maxLength}mm length, ${maxHeight}mm height)`
      ];

      return {
        type: 'GPU Clearance Issue',
        severity: 'error',
        message: `❌ GPU Too Large: ${gpuName} (${gpuLength}mm × ${gpuHeight}mm) exceeds ${caseName} clearance`,
        explanation: `INCOMPATIBLE: "${gpuName}" is physically too large to fit inside "${caseName}". The GPU will not fit and cannot be installed.

EXACTLY WHAT'S WRONG:
• Your GPU: ${gpuName} (${gpuLength}mm length × ${gpuHeight}mm height)
• Your case: ${caseName} (max GPU space: ${maxLength}mm length × ${maxHeight}mm height)
• Problems:
  • ${dimensionDetails}`,
        fix: fixOptions.join('\n\n'),
        affected: ['gpu', 'case'],
        category: 'hard',
        parts_involved: ['gpu', 'case'],
        spec_keys: ['length_mm', 'height_mm', 'gpu_max_length_mm'],
        severity_explanation: 'BLOCKING ERROR: This GPU physically will not fit in this case. Your build will not be possible.',
        recommendation: `Check your case's GPU clearance specifications (usually listed as "Max GPU length") before selecting a graphics card. Large GPUs need large cases.`
      };
    }

    return null;
  }

  /**
   * Cooler ↔ Case height clearance
   */
  export function checkCoolerCaseClearance(
    cooler: any,
    case_: any
  ): ExtendedCompatibilityIssue | null {
    const coolerHeight = getSpecValue(cooler, 'height_mm');
    const coolerName = getSpecValue(cooler, 'name') || 'Your cooler';
    const caseName = getSpecValue(case_, 'name') || 'Your case';
    const maxHeight = getSpecValue(case_, 'cpu_cooler_height_mm');

    if (!coolerHeight || !maxHeight) return null;

    if (coolerHeight > maxHeight) {
      const excess = coolerHeight - maxHeight;
      const fixOptions = [
        `Option 1: Replace the cooler with a shorter model (must be under ${maxHeight}mm tall)`,
        `Option 2: Replace the case with a larger one that supports cooler heights up to ${coolerHeight}mm`
      ];

      return {
        type: 'Cooler Height Clearance Issue',
        severity: 'error',
        message: `❌ Cooler Too Tall: ${coolerName} (${coolerHeight}mm) doesn't fit in ${caseName} (max ${maxHeight}mm)`,
        explanation: `INCOMPATIBLE: "${coolerName}" is too tall to fit inside "${caseName}". The cooler will hit the case's side panel and cannot be installed.

EXACTLY WHAT'S WRONG:
• Your cooler: ${coolerName} (height: ${coolerHeight}mm)
• Your case: ${caseName} (max cooler clearance: ${maxHeight}mm)
• Problem: The cooler is ${excess}mm TOO TALL - it will not fit vertically inside the case.`,
        fix: fixOptions.join('\n\n'),
        affected: ['cooler', 'case'],
        category: 'hard',
        parts_involved: ['cooler', 'case'],
        spec_keys: ['height_mm', 'cpu_cooler_height_mm'],
        severity_explanation: 'BLOCKING ERROR: The cooler physically will not fit. You will not be able to assemble this build.',
        recommendation: `Always check your case's maximum cooler height specification. Large air coolers and thick radiators need more vertical space.`
      };
    }

    return null;
  }

  /**
   * Cooler ↔ CPU socket compatibility
   */
  export function checkCoolerSocketCompatibility(
    cooler: any,
    cpu: any
  ): ExtendedCompatibilityIssue | null {
    const coolerSockets = getSpecValue(cooler, 'socket_compatibility');
    const coolerName = getSpecValue(cooler, 'name') || 'Your cooler';
    const cpuSocket = getSpecValue(cpu, 'socket');
    const cpuName = getSpecValue(cpu, 'name') || 'Your CPU';

    if (!coolerSockets || !cpuSocket) return null;

    const socketsStr = String(coolerSockets).toUpperCase();
    const socketNorm = String(cpuSocket).toUpperCase().trim();

    if (!socketsStr.includes(socketNorm)) {
      const supportedSockets = String(coolerSockets)
        .split(',')
        .map(s => s.trim())
        .filter(s => s)
        .join(', ');

      const fixOptions = [
        `Option 1: Choose a different cooler that supports socket ${socketNorm}`,
        `Option 2: Choose a different CPU with a socket supported by this cooler (${supportedSockets})`
      ];

      return {
        type: 'Cooler Socket Incompatibility',
        severity: 'error',
        message: `❌ Cooler Incompatible: ${coolerName} doesn't support ${socketNorm} socket`,
        explanation: `INCOMPATIBLE: "${coolerName}" does not have mounting brackets for socket ${socketNorm}. The cooler cannot be mechanically mounted to your CPU.

EXACTLY WHAT'S WRONG:
• Your CPU: ${cpuName} (socket: ${socketNorm})
• Your cooler: ${coolerName} (supports: ${supportedSockets})
• Problem: The cooler's mounting hardware is not compatible with this CPU socket.`,
        fix: fixOptions.join('\n\n'),
        affected: ['cooler', 'cpu'],
        category: 'hard',
        parts_involved: ['cooler', 'cpu'],
        spec_keys: ['socket_compatibility', 'socket'],
        severity_explanation: 'BLOCKING ERROR: The cooler cannot be mounted to your CPU. You will not be able to cool the processor.',
        recommendation: `Make sure your cooler supports your CPU's socket. Common coolers support multiple sockets, but some are exclusive to one platform (AMD vs Intel).`
      };
    }

    return null;
  }

  /**
   * Motherboard ↔ Case form factor compatibility
   */
  export function checkMotherboardCaseFormFactor(
    motherboard: any,
    case_: any
  ): ExtendedCompatibilityIssue | null {
    const mbFormFactor = getSpecValue(motherboard, 'form_factor');
    const mbName = getSpecValue(motherboard, 'name') || 'Your motherboard';
    const caseName = getSpecValue(case_, 'name') || 'Your case';
    const caseFactors = getSpecValue(case_, 'motherboard_form_factors');

    if (!mbFormFactor || !caseFactors) return null;

    const mbFFNorm = String(mbFormFactor).toUpperCase().trim();
    const caseFFStr = String(caseFactors).toUpperCase();

    if (!caseFFStr.includes(mbFFNorm)) {
      const supportedFactors = String(caseFactors)
        .split(',')
        .map(f => f.trim())
        .filter(f => f)
        .join(', ');

      const fixOptions = [
        `Option 1: Choose a ${supportedFactors} motherboard that fits in this case`,
        `Option 2: Choose a different case that supports ${mbFFNorm} motherboards`
      ];

      return {
        type: 'Motherboard Form Factor Incompatibility',
        severity: 'error',
        message: `❌ Motherboard Won't Fit: ${mbName} (${mbFormFactor}) doesn't fit in ${caseName}`,
        explanation: `INCOMPATIBLE: "${mbName}" is a ${mbFormFactor} motherboard, but "${caseName}" only supports ${supportedFactors} boards. The motherboard will be too large (or small) for this case's mounting bracket.

EXACTLY WHAT'S WRONG:
• Your motherboard: ${mbName} (size: ${mbFormFactor})
• Your case: ${caseName} (supports: ${supportedFactors})
• Problem: The motherboard mounting holes don't align with the case's bracket positions. The board will not mount securely.`,
        fix: fixOptions.join('\n\n'),
        affected: ['motherboard', 'case'],
        category: 'hard',
        parts_involved: ['motherboard', 'case'],
        spec_keys: ['form_factor', 'motherboard_form_factors'],
        severity_explanation: 'BLOCKING ERROR: The motherboard will not fit in this case. You cannot assemble this build.',
        recommendation: `Common motherboard sizes are ATX (full-size), Micro-ATX (smaller), and Mini-ITX (very small). Always match your motherboard size to your case's supported form factors.`
      };
    }

    return null;
  }

  /**
   * PSU ↔ Case form factor compatibility
   */
  export function checkPsuCaseFormFactor(
    psu: any,
    case_: any
  ): ExtendedCompatibilityIssue | null {
    const psuFormFactor = getSpecValue(psu, 'psu_form_factor_type');
    const psuName = getSpecValue(psu, 'name') || 'Your PSU';
    const caseName = getSpecValue(case_, 'name') || 'Your case';
    const caseFormFactor = getSpecValue(case_, 'psu_form_factor');

    if (!psuFormFactor || !caseFormFactor) return null;

    const psuFFNorm = String(psuFormFactor).toUpperCase().trim();
    const caseFFStr = String(caseFormFactor).toUpperCase();

    if (!caseFFStr.includes(psuFFNorm)) {
      const supportedFactors = String(caseFormFactor)
        .split(',')
        .map(f => f.trim())
        .filter(f => f)
        .join(', ');

      const fixOptions = [
        `Option 1: Choose a ${supportedFactors} PSU that fits in this case`,
        `Option 2: Choose a different case that supports ${psuFFNorm} power supplies`
      ];

      return {
        type: 'PSU Form Factor Incompatibility',
        severity: 'error',
        message: `❌ PSU Won't Fit: ${psuName} (${psuFormFactor}) doesn't fit in ${caseName}`,
        explanation: `INCOMPATIBLE: "${psuName}" is a ${psuFormFactor} form factor power supply, but "${caseName}" only supports ${supportedFactors} PSUs. The PSU will not fit in the case's power supply bay.

EXACTLY WHAT'S WRONG:
• Your PSU: ${psuName} (size: ${psuFormFactor})
• Your case: ${caseName} (supports: ${supportedFactors})
• Problem: The PSU is physically too large (or the wrong shape) for the case's power supply mounting area.`,
        fix: fixOptions.join('\n\n'),
        affected: ['psu', 'case'],
        category: 'hard',
        parts_involved: ['psu', 'case'],
        spec_keys: ['psu_form_factor_type', 'psu_form_factor'],
        severity_explanation: 'BLOCKING ERROR: The PSU will not fit in this case. You cannot power your system.',
        recommendation: `Common PSU sizes are ATX (full-size, most common) and SFX (compact). Check your case's PSU bay dimensions before selecting a power supply.`
      };
    }

    return null;
  }

  /**
   * Required power connectors availability
   */
  export function checkRequiredPowerConnectors(
    gpu: any,
    psu: any
  ): ExtendedCompatibilityIssue | null {
    // PSU connector compatibility check removed - no errors when connectors are missing
    return null;
  }

  /**
   * Basic motherboard power connectors
   */
  export function checkMotherboardPowerConnectors(
    motherboard: any,
    psu: any
  ): ExtendedCompatibilityIssue | null {
    // PSU connector compatibility check removed - no errors when connectors are missing
    return null;
  }

  /**
   * CPU power connectors
   */
  export function checkCpuPowerConnectors(
    cpu: any,
    psu: any
  ): ExtendedCompatibilityIssue | null {
    // PSU connector compatibility check removed - no errors when connectors are missing
    return null;
  }
}

/**
 * ============================================================================
 * PERFORMANCE & LIMITATION WARNINGS (HEURISTIC)
 * ============================================================================
 * Advisory warnings about suboptimal configurations
 */

export namespace PerformanceWarnings {
  /**
   * RAM speed vs motherboard support
   */
  export function checkRamSpeedDownclock(
    ram: any,
    motherboard: any
  ): ExtendedCompatibilityIssue | null {
    const ramSpeed = getSpecValue(ram, 'ram_speed_mhz');
    const maxSpeed = getSpecValue(motherboard, 'max_ram_speed_mhz');

    if (!ramSpeed || !maxSpeed) return null;

    if (ramSpeed > maxSpeed) {
      return {
        type: 'RAM Speed Downclocked',
        severity: 'warning',
        message: `RAM ${ramSpeed}MHz will be downclocked to ${maxSpeed}MHz (max supported)`,
        explanation: `Your RAM is faster than what the motherboard supports. The RAM will run at the motherboard's maximum speed of ${maxSpeed}MHz instead of its rated ${ramSpeed}MHz.`,
        recommendation: `This is normal - RAM is backward compatible. Performance impact is minimal for most use cases. If you want maximum performance, choose a newer motherboard or slower RAM.`,
        fix: `Option 1: Select RAM with ${maxSpeed}MHz speed. Option 2: Choose a newer motherboard supporting faster RAM.`,
        affected: ['ram', 'motherboard'],
        category: 'warning',
        parts_involved: ['ram', 'motherboard'],
        spec_keys: ['ram_speed_mhz', 'max_ram_speed_mhz'],
        severity_explanation: 'Performance impact is typically <5% for most workloads.'
      };
    }

    return null;
  }

  /**
   * PSU wattage vs estimated system draw
   */
  export function checkPsuWattageHeadroom(
    selectedParts: Record<string, any>,
    headroom: number = 30
  ): ExtendedCompatibilityIssue | null {
    const psu = selectedParts.psu;
    const cpu = selectedParts.cpu;
    const gpu = selectedParts.gpu;

    if (!psu) return null;

    const psuWattage = getSpecValue(psu, 'wattage') || 0;
    const cpuTdp = getSpecValue(cpu, 'tdp_watts') || getSpecValue(cpu, 'tdp_w') || 100;
    const gpuTdp = getSpecValue(gpu, 'tdp_watts') || getSpecValue(gpu, 'tdp_w') || 250;
    const baseOverhead = 150; // Motherboard, RAM, storage, fans

    const estimated = cpuTdp + gpuTdp + baseOverhead;
    const headroomPercent = ((psuWattage - estimated) / estimated) * 100;
    const headroomWatts = psuWattage - estimated;

    if (headroomWatts < 0) {
      return {
        type: 'Insufficient PSU Wattage',
        severity: 'error',
        message: `PSU (${psuWattage}W) insufficient for estimated draw (${estimated}W)`,
        explanation: `Your system needs more power than the PSU can provide. CPU+GPU alone consume ${cpuTdp + gpuTdp}W, plus ~${baseOverhead}W for the rest of the system.`,
        recommendation: `This is critical. An undersized PSU will cause system crashes and component damage.`,
        fix: `Select a PSU with at least ${estimated + 150}W capacity (recommended: ${Math.ceil(estimated * 1.35 / 50) * 50}W).`,
        affected: ['psu', 'cpu', 'gpu'],
        category: 'warning',
        parts_involved: ['psu', 'cpu', 'gpu'],
        spec_keys: ['wattage', 'tdp_watts'],
        severity_explanation: `Zero headroom - system will be unstable or fail to boot.`
      };
    }

    if (headroomPercent < headroom) {
      return {
        type: 'Low PSU Headroom',
        severity: 'warning',
        message: `PSU headroom is ${Math.round(headroomPercent)}% (recommended: ${headroom}%+)`,
        explanation: `Estimated system draw: ${estimated}W (CPU ${cpuTdp}W + GPU ${gpuTdp}W + base ${baseOverhead}W). PSU has only ${headroomWatts}W headroom.`,
        recommendation: `PSUs operate most efficiently at 50-80% load. Low headroom reduces efficiency and lifespan. Consider upgrading to a larger PSU.`,
        fix: `Select a PSU with at least ${Math.ceil(estimated * 1.4 / 50) * 50}W (provides ~40% headroom).`,
        affected: ['psu', 'cpu', 'gpu'],
        category: 'warning',
        parts_involved: ['psu', 'cpu', 'gpu'],
        spec_keys: ['wattage', 'tdp_watts'],
        severity_explanation: `Insufficient headroom reduces PSU efficiency and can cause instability under heavy load.`
      };
    }

    return null;
  }

  /**
   * CPU ↔ GPU performance tier mismatch (bottleneck warning)
   */
  export function checkBottleneckRisk(
    cpu: any,
    gpu: any
  ): ExtendedCompatibilityIssue | null {
    const cpuTier = getSpecValue(cpu, 'cpu_tier');
    const gpuTier = getSpecValue(gpu, 'gpu_tier');

    if (!cpuTier || !gpuTier) return null;

    const tierOrder = ['Entry', 'Budget', 'Mid-range', 'High-end', 'Flagship'];
    const cpuIdx = tierOrder.indexOf(cpuTier);
    const gpuIdx = tierOrder.indexOf(gpuTier);

    if (cpuIdx === -1 || gpuIdx === -1) return null;

    const tierDiff = Math.abs(gpuIdx - cpuIdx);

    if (tierDiff >= 2) {
      const isGpuWeak = cpuIdx > gpuIdx;
      const isGpuStrong = gpuIdx > cpuIdx;

      if (isGpuStrong) {
        return {
          type: 'GPU Bottleneck Risk',
          severity: 'warning',
          message: `CPU tier (${cpuTier}) may bottleneck GPU tier (${gpuTier})`,
          explanation: `Your CPU is significantly weaker than your GPU. In many games and applications, the CPU will become the limiting factor, preventing the GPU from achieving full performance.`,
          recommendation: `This is a common budget-conscious trade-off, but the CPU won't fully utilize the GPU's potential. For competitive gaming, consider a stronger CPU.`,
          fix: `Select a CPU closer to your GPU's tier, or choose a less powerful GPU if budget is a concern.`,
          affected: ['cpu', 'gpu'],
          category: 'warning',
          parts_involved: ['cpu', 'gpu'],
          spec_keys: ['cpu_tier', 'gpu_tier'],
          severity_explanation: `CPU bottleneck reduces GPU utilization by 15-30%, impacting FPS and performance.`
        };
      }

      if (isGpuWeak) {
        return {
          type: 'GPU Underpowered',
          severity: 'info',
          message: `GPU tier (${gpuTier}) is significantly weaker than CPU tier (${cpuTier})`,
          explanation: `Your GPU is weak compared to your CPU. The CPU will sit idle while waiting for the GPU to finish rendering frames.`,
          recommendation: `This is a good budget-conscious approach for productivity tasks, but gaming performance will be limited by the GPU, not CPU.`,
          fix: `If gaming is important, select a stronger GPU closer to your CPU tier.`,
          affected: ['cpu', 'gpu'],
          category: 'warning',
          parts_involved: ['cpu', 'gpu'],
          spec_keys: ['cpu_tier', 'gpu_tier'],
          severity_explanation: `GPU will be fully utilized, but maximum gaming performance will be limited.`
        };
      }
    }

    return null;
  }

  /**
   * Cooler TDP rating vs CPU TDP
   */
  export function checkCoolerTdpRating(
    cpu: any,
    cooler: any
  ): ExtendedCompatibilityIssue | null {
    const cpuTdp = getSpecValue(cpu, 'tdp_watts') || getSpecValue(cpu, 'tdp_w') || 100;
    const coolerRating = getSpecValue(cooler, 'tdp_rating_watts');

    if (!coolerRating) return null;

    if (cpuTdp > coolerRating) {
      const excess = cpuTdp - coolerRating;
      return {
        type: 'Cooler Underpowered for CPU',
        severity: 'warning',
        message: `Cooler rated for ${coolerRating}W, but CPU TDP is ${cpuTdp}W (+${excess}W)`,
        explanation: `The cooler's TDP rating is lower than your CPU's power consumption. It may struggle to dissipate heat under sustained load.`,
        recommendation: `The cooler may still work, but could result in throttling, high noise, or reduced CPU lifespan with sustained heavy workloads.`,
        fix: `Select a cooler with at least ${cpuTdp + 20}W rating for safe headroom.`,
        affected: ['cpu', 'cooler'],
        category: 'warning',
        parts_involved: ['cpu', 'cooler'],
        spec_keys: ['tdp_watts', 'tdp_rating_watts'],
        severity_explanation: `Inadequate cooling can cause thermal throttling and reduced performance.`
      };
    }

    // Check for significant over-specification (wasted money)
    const headroom = coolerRating - cpuTdp;
    if (headroom > cpuTdp * 1.5) {
      return {
        type: 'Cooler Over-specified',
        severity: 'info',
        message: `Cooler rated for ${coolerRating}W is significantly more than CPU TDP (${cpuTdp}W)`,
        explanation: `Your cooler is much more powerful than needed. While this ensures excellent cooling, you're paying for more performance than necessary.`,
        recommendation: `This isn't a problem, but you could save money with a more appropriately-sized cooler. Use it only if you plan to upgrade to a more powerful CPU later.`,
        fix: `For cost optimization, select a cooler rated between ${cpuTdp} and ${cpuTdp + 50}W.`,
        affected: ['cpu', 'cooler'],
        category: 'warning',
        parts_involved: ['cpu', 'cooler'],
        spec_keys: ['tdp_watts', 'tdp_rating_watts'],
        severity_explanation: `No performance issue, just unnecessary expense.`
      };
    }

    return null;
  }

  /**
   * PCIe generation mismatch (informational bandwidth notes)
   */
  export function checkPcieGenerationMismatch(
    gpu: any,
    motherboard: any
  ): ExtendedCompatibilityIssue | null {
    const gpuGen = getSpecValue(gpu, 'pcie_generation');
    const mbGen = getSpecValue(motherboard, 'pcie_generation');

    if (!gpuGen || !mbGen) return null;

    const gpuGenNum = parseInt(String(gpuGen).replace(/[^\d]/g, ''));
    const mbGenNum = parseInt(String(mbGen).replace(/[^\d]/g, ''));

    if (isNaN(gpuGenNum) || isNaN(mbGenNum)) return null;

    if (gpuGenNum > mbGenNum) {
      const bandwidthReduction = ((gpuGenNum - mbGenNum) / gpuGenNum) * 100;
      return {
        type: 'PCIe Generation Mismatch',
        severity: 'info',
        message: `GPU (PCIe ${gpuGen}) running on older motherboard slot (PCIe ${mbGen})`,
        explanation: `The GPU supports PCIe ${gpuGen}, but the motherboard's GPU slot is PCIe ${mbGen}. The GPU will run at reduced bandwidth (~${Math.round(bandwidthReduction)}% less).`,
        recommendation: `Backward compatibility ensures it will work, but bandwidth is limited. Real-world gaming performance impact is typically <5%.`,
        fix: `For maximum performance, choose a newer motherboard with PCIe ${gpuGen} support, or this configuration will work fine for most use cases.`,
        affected: ['gpu', 'motherboard'],
        category: 'warning',
        parts_involved: ['gpu', 'motherboard'],
        spec_keys: ['pcie_generation'],
        severity_explanation: `Bandwidth is reduced but unlikely to impact real-world performance significantly.`
      };
    }

    return null;
  }
}

/**
 * ============================================================================
 * INFORMATIONAL & EDUCATIONAL CHECKS
 * ============================================================================
 * Best practices and educational information
 */

export namespace InformationalChecks {
  /**
   * PCIe backward compatibility explanation
   */
  export function checkPcieBackwardCompatibility(
    gpu: any,
    motherboard: any
  ): ExtendedCompatibilityIssue | null {
    const gpuGen = getSpecValue(gpu, 'pcie_generation');
    const mbGen = getSpecValue(motherboard, 'pcie_generation');

    if (!gpuGen || !mbGen) return null;

    const gpuGenNum = parseInt(String(gpuGen).replace(/[^\d]/g, ''));
    const mbGenNum = parseInt(String(mbGen).replace(/[^\d]/g, ''));

    if (isNaN(gpuGenNum) || isNaN(mbGenNum) || gpuGenNum <= mbGenNum) return null;

    return {
      type: 'PCIe Backward Compatibility',
      severity: 'info',
      message: `GPU with PCIe ${gpuGen} is compatible with PCIe ${mbGen} slot`,
      explanation: `PCIe is backward compatible - newer GPUs work with older slots. Your GPU will operate at the slot's PCIe ${mbGen} speed.`,
      recommendation: `No action needed. PCIe backward compatibility ensures your build will work correctly.`,
      affected: ['gpu', 'motherboard'],
      category: 'info',
      parts_involved: ['gpu', 'motherboard'],
      spec_keys: ['pcie_generation'],
      severity_explanation: `Educational note: PCIe 3.0, 4.0, 5.0 devices are all backward compatible.`
    };
  }

  /**
   * ECC RAM on consumer boards
   */
  export function checkEccRamOnConsumerBoard(
    ram: any,
    motherboard: any
  ): ExtendedCompatibilityIssue | null {
    const ramIsEcc = getSpecValue(ram, 'ecc_support');
    const mbSupportsEcc = getSpecValue(motherboard, 'ecc_support');

    if (!ramIsEcc || mbSupportsEcc) return null;

    return {
      type: 'ECC RAM on Non-ECC Board',
      severity: 'info',
      message: `ECC RAM will operate in non-ECC mode on this motherboard`,
      explanation: `ECC (Error-Correcting Code) RAM provides error detection and correction, but your motherboard doesn't support ECC. The RAM will work normally but without error correction.`,
      recommendation: `ECC is beneficial for servers and workstations, but not necessary for consumer/gaming builds. Consider non-ECC RAM for better value.`,
      affected: ['ram', 'motherboard'],
      category: 'info',
      parts_involved: ['ram', 'motherboard'],
      spec_keys: ['ecc_support'],
      severity_explanation: `ECC features will be disabled, but RAM functions normally.`
    };
  }

  /**
   * NVMe speed on older chipsets
   */
  export function checkNvmeSpeedLimitation(
    storage: any,
    motherboard: any
  ): ExtendedCompatibilityIssue | null {
    const storageType = getSpecValue(storage, 'type');
    const nvmeGen = getSpecValue(storage, 'nvme_pcie_gen');
    const mbNvmeGen = getSpecValue(motherboard, 'nvme_pcie_gen');

    if (storageType !== 'NVMe' || !nvmeGen || !mbNvmeGen) return null;

    const storageGenNum = parseInt(String(nvmeGen).replace(/[^\d]/g, ''));
    const mbGenNum = parseInt(String(mbNvmeGen).replace(/[^\d]/g, ''));

    if (isNaN(storageGenNum) || isNaN(mbGenNum) || storageGenNum <= mbGenNum) return null;

    return {
      type: 'NVMe Speed Limitation',
      severity: 'info',
      message: `NVMe PCIe ${nvmeGen} drive will run at motherboard limit (PCIe ${mbNvmeGen})`,
      explanation: `Your NVMe storage supports PCIe ${nvmeGen}, but the motherboard's M.2 slot is limited to PCIe ${mbNvmeGen}. Speed will be capped accordingly.`,
      recommendation: `This is normal backward compatibility. For most users, the speed difference is imperceptible. Consider it if seeking maximum transfer speeds.`,
      affected: ['storage', 'motherboard'],
      category: 'info',
      parts_involved: ['storage', 'motherboard'],
      spec_keys: ['nvme_pcie_gen'],
      severity_explanation: `Educational: PCIe 3.0 NVMe ~3,500 MB/s, PCIe 4.0 ~7,000 MB/s, PCIe 5.0 ~14,000 MB/s.`
    };
  }

  /**
   * Modular vs non-modular PSU cables
   */
  export function checkModularPsuNote(
    psu: any,
    case_: any
  ): ExtendedCompatibilityIssue | null {
    const modularType = getSpecValue(psu, 'modular_type');

    if (!modularType || modularType === 'Fully-modular') return null;

    return {
      type: 'Non-Modular PSU Cable Management',
      severity: 'info',
      message: `${modularType || 'Non-modular'} PSU will have excess cables`,
      explanation: `This PSU uses ${modularType === 'Semi-modular' ? 'semi-modular' : 'non-modular'} cables. Many cables are fixed, which can make cable management more challenging.`,
      recommendation: `Fully-modular PSUs cost more but provide better cable management and airflow. This is a trade-off between cost and aesthetics.`,
      affected: ['psu', 'case'],
      category: 'info',
      parts_involved: ['psu', 'case'],
      spec_keys: ['modular_type'],
      severity_explanation: `Purely a cable management consideration - no functional impact.`
    };
  }

  /**
   * Upgrade path hints based on socket longevity
   */
  export function checkSocketUpgradePath(
    cpu: any,
    motherboard: any
  ): ExtendedCompatibilityIssue | null {
    const cpuGen = getSpecValue(cpu, 'generation');
    const socket = getSpecValue(cpu, 'socket');

    if (!cpuGen || !socket) return null;

    // Heuristic: Some sockets have longer support windows
    const longSupport: Record<string, number> = {
      'AM4': 2024,      // AMD AM4 had 5+ generations
      'AM5': 2028,      // AMD AM5 planned for years
      'LGA1700': 2026   // Intel 12-13 gen
    };

    const endYear = longSupport[socket as keyof typeof longSupport];
    if (!endYear) return null;

    return {
      type: 'Socket Longevity Note',
      severity: 'info',
      message: `Socket ${socket} typically supported through ~${endYear}`,
      explanation: `Your socket has a defined support window. This motherboard can typically be upgraded with newer CPUs until around ${endYear}.`,
      recommendation: `This is useful context for future CPU upgrades. Check compatibility before upgrading.`,
      affected: ['cpu', 'motherboard'],
      category: 'info',
      parts_involved: ['cpu', 'motherboard'],
      spec_keys: ['socket', 'generation'],
      severity_explanation: `Planning information for future upgrades.`
    };
  }
}

/**
 * ============================================================================
 * COMPREHENSIVE EVALUATION ENGINE
 * ============================================================================
 */

/**
 * Evaluate all compatibility checks for a build
 */
export async function evaluateAdvancedCompatibility(
  selectedParts: Record<string, any>
): Promise<ExtendedCompatibilityIssue[]> {
  const issues: ExtendedCompatibilityIssue[] = [];

  // Extract parts
  const cpu = selectedParts.cpu;
  const gpu = selectedParts.gpu;
  const motherboard = selectedParts.motherboard;
  const ram = selectedParts.ram;
  const cooler = selectedParts.cooler;
  const psu = selectedParts.psu;
  const case_ = selectedParts.case;
  const storage = selectedParts.storage;

  // ========== HARD COMPATIBILITY CHECKS (ERRORS) ==========
  if (cpu && motherboard) {
    const issue = HardCompatibility.checkCpuSocketCompatibility(cpu, motherboard);
    if (issue) issues.push(issue);
  }

  if (ram && motherboard) {
    const issue = HardCompatibility.checkMemoryTypeCompatibility(ram, motherboard);
    if (issue) issues.push(issue);
  }

  if (gpu && case_) {
    const issue = HardCompatibility.checkGpuCaseClearance(gpu, case_);
    if (issue) issues.push(issue);
  }

  if (cooler && case_) {
    const issue = HardCompatibility.checkCoolerCaseClearance(cooler, case_);
    if (issue) issues.push(issue);
  }

  if (cooler && cpu) {
    const issue = HardCompatibility.checkCoolerSocketCompatibility(cooler, cpu);
    if (issue) issues.push(issue);
  }

  if (motherboard && case_) {
    const issue = HardCompatibility.checkMotherboardCaseFormFactor(motherboard, case_);
    if (issue) issues.push(issue);
  }

  if (psu && case_) {
    const issue = HardCompatibility.checkPsuCaseFormFactor(psu, case_);
    if (issue) issues.push(issue);
  }

  if (gpu && psu) {
    const issue = HardCompatibility.checkRequiredPowerConnectors(gpu, psu);
    if (issue) issues.push(issue);
  }

  if (motherboard && psu) {
    const issue = HardCompatibility.checkMotherboardPowerConnectors(motherboard, psu);
    if (issue) issues.push(issue);
  }

  if (cpu && psu) {
    const issue = HardCompatibility.checkCpuPowerConnectors(cpu, psu);
    if (issue) issues.push(issue);
  }

  // ========== PERFORMANCE & LIMITATION WARNINGS ==========
  if (ram && motherboard) {
    const issue = PerformanceWarnings.checkRamSpeedDownclock(ram, motherboard);
    if (issue) issues.push(issue);
  }

  if (cpu && gpu) {
    const bottleneck = PerformanceWarnings.checkBottleneckRisk(cpu, gpu);
    if (bottleneck) issues.push(bottleneck);
  }

  if (cpu && cooler) {
    const coolerTdp = PerformanceWarnings.checkCoolerTdpRating(cpu, cooler);
    if (coolerTdp) issues.push(coolerTdp);
  }

  if (gpu && motherboard) {
    const pcie = PerformanceWarnings.checkPcieGenerationMismatch(gpu, motherboard);
    if (pcie) issues.push(pcie);
  }

  // PSU wattage check with calculated headroom
  if (psu) {
    const cpuTdp = getSpecValue(cpu, 'tdp_watts') || getSpecValue(cpu, 'tdp_w') || 100;
    const gpuTdp = getSpecValue(gpu, 'tdp_watts') || getSpecValue(gpu, 'tdp_w') || 250;
    const psuWattage = getSpecValue(psu, 'wattage') || 0;
    const estimated = cpuTdp + gpuTdp + 150;
    const headroom = psuWattage - estimated;

    const psuCheck = PerformanceWarnings.checkPsuWattageHeadroom(selectedParts, 30);
    if (psuCheck) issues.push(psuCheck);
  }

  // ========== INFORMATIONAL CHECKS ==========
  if (gpu && motherboard) {
    // Check backward compatibility
    const gpuGen = getSpecValue(gpu, 'pcie_generation');
    const mbGen = getSpecValue(motherboard, 'pcie_generation');
    if (gpuGen && mbGen) {
      const gpuGenNum = parseInt(String(gpuGen).replace(/[^\d]/g, ''));
      const mbGenNum = parseInt(String(mbGen).replace(/[^\d]/g, ''));
      if (!isNaN(gpuGenNum) && !isNaN(mbGenNum) && gpuGenNum > mbGenNum) {
        const backcompat = InformationalChecks.checkPcieBackwardCompatibility(gpu, motherboard);
        if (backcompat) issues.push(backcompat);
      }
    }
  }

  if (ram && motherboard) {
    const ecc = InformationalChecks.checkEccRamOnConsumerBoard(ram, motherboard);
    if (ecc) issues.push(ecc);
  }

  if (storage && motherboard) {
    const nvme = InformationalChecks.checkNvmeSpeedLimitation(storage, motherboard);
    if (nvme) issues.push(nvme);
  }

  if (psu) {
    const modular = InformationalChecks.checkModularPsuNote(psu, case_);
    if (modular) issues.push(modular);
  }

  if (cpu && motherboard) {
    const upgrade = InformationalChecks.checkSocketUpgradePath(cpu, motherboard);
    if (upgrade) issues.push(upgrade);
  }

  // Sort by severity
  const severityOrder: Record<CompatibilitySeverity, number> = {
    error: 0,
    warning: 1,
    info: 2
  };

  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return issues;
}

/**
 * Filter issues by severity
 */
export function filterIssuesBySeverity(
  issues: ExtendedCompatibilityIssue[],
  severity: CompatibilitySeverity
): ExtendedCompatibilityIssue[] {
  return issues.filter(i => i.severity === severity);
}

/**
 * Get summary statistics
 */
export function getCompatibilitySummary(issues: ExtendedCompatibilityIssue[]) {
  return {
    totalIssues: issues.length,
    errors: issues.filter(i => i.severity === 'error').length,
    warnings: issues.filter(i => i.severity === 'warning').length,
    info: issues.filter(i => i.severity === 'info').length,
    canBuild: issues.filter(i => i.severity === 'error').length === 0
  };
}
