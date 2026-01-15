/**
 * Build Health Analysis System
 * 
 * Evaluates builds using only spec keys - no hardcoded logic
 * Provides qualitative ratings and educational explanations
 */

import { getSpecValue, getSpecDefinition, type PartCategory } from './specDictionary';
import { evaluateCompatibility, estimatePowerRequirements } from './compatibilityEngine';

export type HealthRating = 'excellent' | 'good' | 'acceptable' | 'needs_attention';

export interface HealthCategory {
  name: string;
  rating: HealthRating;
  explanation: string;
  details: string[];
  recommendations?: string[];
}

export interface BuildHealthResult {
  overall: HealthRating;
  categories: HealthCategory[];
  summary: string;
}

/**
 * Analyze compatibility health
 */
function analyzeCompatibility(selectedParts: Record<string, any>): HealthCategory {
  // This will use the compatibility engine
  // For now, we'll create a placeholder that will be enhanced
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check CPU-Motherboard socket
  const cpuSocket = getSpecValue(selectedParts.cpu, 'socket');
  const mbSocket = getSpecValue(selectedParts.motherboard, 'socket');
  if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
    issues.push(`CPU socket (${cpuSocket}) doesn't match motherboard socket (${mbSocket})`);
  }

  // Check RAM-Motherboard compatibility
  const ramSpeed = getSpecValue(selectedParts.ram, 'ram_speed_mhz');
  const mbMaxSpeed = getSpecValue(selectedParts.motherboard, 'max_ram_speed_mhz');
  if (ramSpeed && mbMaxSpeed && ramSpeed > mbMaxSpeed) {
    warnings.push(`RAM speed (${ramSpeed}MHz) exceeds motherboard maximum (${mbMaxSpeed}MHz)`);
  }

  // Check GPU-Case clearance
  const gpuLength = getSpecValue(selectedParts.gpu, 'length_mm');
  const caseMaxLength = getSpecValue(selectedParts.case, 'gpu_max_length_mm');
  if (gpuLength && caseMaxLength && gpuLength > caseMaxLength) {
    issues.push(`GPU length (${gpuLength}mm) exceeds case maximum (${caseMaxLength}mm)`);
  }

  let rating: HealthRating = 'excellent';
  if (issues.length > 0) {
    rating = 'needs_attention';
  } else if (warnings.length > 0) {
    rating = 'acceptable';
  }

  return {
    name: 'Compatibility',
    rating,
    explanation: issues.length === 0 && warnings.length === 0
      ? 'All selected components are compatible with each other.'
      : issues.length > 0
      ? 'There are compatibility issues that will prevent this build from working.'
      : 'Some components may not work optimally together.',
    details: [...issues, ...warnings],
    recommendations: issues.length > 0
      ? ['Review compatibility issues and select matching components.']
      : warnings.length > 0
      ? ['Consider adjusting components for better compatibility.']
      : undefined
  };
}

/**
 * Analyze power health
 */
function analyzePower(selectedParts: Record<string, any>): HealthCategory {
  const powerEst = estimatePowerRequirements(selectedParts);
  
  if (powerEst.psuWattage === 0) {
    return {
      name: 'Power Supply',
      rating: 'needs_attention',
      explanation: 'No power supply selected.',
      details: ['A power supply is required for the build.'],
      recommendations: ['Select a power supply with adequate wattage for your components.']
    };
  }

  const headroomPercent = (powerEst.headroom / powerEst.psuWattage) * 100;
  
  let rating: HealthRating;
  let explanation: string;
  let recommendations: string[] | undefined;

  if (powerEst.headroom < 0) {
    rating = 'needs_attention';
    explanation = `The power supply (${powerEst.psuWattage}W) is insufficient for the estimated load (${powerEst.estimated}W).`;
    recommendations = [`Select a PSU with at least ${Math.ceil(powerEst.estimated / 50) * 50}W.`];
  } else if (headroomPercent < 10) {
    rating = 'acceptable';
    explanation = `Power supply provides minimal headroom (${Math.round(headroomPercent)}%).`;
    recommendations = ['Consider a higher wattage PSU for better stability and future upgrades.'];
  } else if (headroomPercent < 20) {
    rating = 'good';
    explanation = `Power supply provides adequate headroom (${Math.round(headroomPercent)}%).`;
  } else {
    rating = 'excellent';
    explanation = `Power supply provides excellent headroom (${Math.round(headroomPercent)}%).`;
  }

  return {
    name: 'Power Supply',
    rating,
    explanation,
    details: [
      `Estimated load: ${powerEst.estimated}W`,
      `PSU capacity: ${powerEst.psuWattage}W`,
      `Headroom: ${powerEst.headroom}W (${Math.round(headroomPercent)}%)`
    ],
    recommendations
  };
}

/**
 * Analyze performance balance
 */
function analyzePerformanceBalance(selectedParts: Record<string, any>): HealthCategory {
  const cpu = selectedParts.cpu;
  const gpu = selectedParts.gpu;
  const ram = selectedParts.ram;

  if (!cpu || !gpu) {
    return {
      name: 'Performance Balance',
      rating: 'needs_attention',
      explanation: 'Missing core components for performance analysis.',
      details: ['CPU and GPU are required for performance evaluation.'],
      recommendations: ['Select both CPU and GPU to evaluate performance balance.']
    };
  }

  const cpuCores = getSpecValue(cpu, 'cores') || 0;
  const cpuBoost = getSpecValue(cpu, 'boost_clock_ghz') || 0;
  const gpuVram = getSpecValue(gpu, 'vram_gb') || 0;
  const ramSize = getSpecValue(ram, 'size_gb') || 0;

  const details: string[] = [];
  const recommendations: string[] = [];
  let rating: HealthRating = 'good';

  // CPU-GPU balance heuristic
  if (cpuCores >= 8 && gpuVram < 8) {
    details.push('CPU may be underutilized with lower-end GPU.');
    recommendations.push('Consider a more powerful GPU or a more budget-friendly CPU.');
    rating = 'acceptable';
  } else if (cpuCores < 6 && gpuVram >= 12) {
    details.push('GPU may be bottlenecked by CPU in CPU-intensive tasks.');
    recommendations.push('Consider a CPU with more cores for better GPU utilization.');
    rating = 'acceptable';
  }

  // RAM adequacy
  if (ramSize < 16) {
    details.push('16GB+ RAM recommended for modern workloads.');
    recommendations.push('Consider upgrading to 16GB or more RAM.');
    if (rating === 'good') rating = 'acceptable';
  } else if (ramSize >= 32) {
    details.push('32GB+ RAM provides excellent headroom for multitasking.');
  }

  return {
    name: 'Performance Balance',
    rating,
    explanation: rating === 'good'
      ? 'Components are well-balanced for their performance tiers.'
      : 'Some components may not be optimally matched.',
    details,
    recommendations: recommendations.length > 0 ? recommendations : undefined
  };
}

/**
 * Analyze upgrade flexibility
 */
function analyzeUpgradeFlexibility(selectedParts: Record<string, any>): HealthCategory {
  const cpu = selectedParts.cpu;
  const motherboard = selectedParts.motherboard;
  const psu = selectedParts.psu;
  const case_ = selectedParts.case;

  const details: string[] = [];
  const recommendations: string[] = [];
  let rating: HealthRating = 'good';

  // Socket match for CPU upgrades
  const socket = getSpecValue(cpu, 'socket');
  const mbSocket = getSpecValue(motherboard, 'socket');
  if (socket && mbSocket && socket === mbSocket) {
    details.push(`Socket match (${socket}) allows future CPU upgrades within the same platform.`);
  }

  // PSU headroom
  const powerEst = estimatePowerRequirements(selectedParts);
  if (powerEst.headroom >= 200) {
    details.push('Generous PSU headroom supports future GPU upgrades.');
  } else if (powerEst.headroom < 100 && powerEst.headroom >= 0) {
    details.push('Limited PSU headroom may require PSU upgrade for future GPU upgrades.');
    rating = 'acceptable';
  }

  // Case clearance
  const caseMaxLength = getSpecValue(case_, 'gpu_max_length_mm');
  if (caseMaxLength && caseMaxLength >= 360) {
    details.push('Generous case clearance supports most GPU upgrades.');
  } else if (caseMaxLength && caseMaxLength < 300) {
    details.push('Tight case clearance may limit future GPU upgrade options.');
    rating = 'acceptable';
  }

  return {
    name: 'Upgrade Flexibility',
    rating,
    explanation: rating === 'good'
      ? 'Build has good flexibility for future upgrades.'
      : 'Some components may limit future upgrade options.',
    details,
    recommendations: recommendations.length > 0 ? recommendations : undefined
  };
}

/**
 * Calculate overall health rating
 */
function calculateOverallRating(categories: HealthCategory[]): HealthRating {
  if (categories.length === 0) return 'needs_attention';
  
  const ratings = categories.map(c => c.rating);
  if (ratings.some(r => r === 'needs_attention')) return 'needs_attention';
  if (ratings.some(r => r === 'acceptable')) return 'acceptable';
  if (ratings.every(r => r === 'excellent')) return 'excellent';
  return 'good';
}

/**
 * Analyze build health
 */
export async function analyzeBuildHealth(
  selectedParts: Record<string, any>
): Promise<BuildHealthResult> {
  const categories: HealthCategory[] = [];

  // Compatibility analysis
  categories.push(analyzeCompatibility(selectedParts));

  // Power analysis
  categories.push(analyzePower(selectedParts));

  // Performance balance
  categories.push(analyzePerformanceBalance(selectedParts));

  // Upgrade flexibility
  categories.push(analyzeUpgradeFlexibility(selectedParts));

  const overall = calculateOverallRating(categories);

  // Generate summary
  const summary = overall === 'excellent'
    ? 'Your build looks excellent! All components are well-matched and compatible.'
    : overall === 'good'
    ? 'Your build is in good shape. Minor optimizations could improve it further.'
    : overall === 'acceptable'
    ? 'Your build will work, but there are some areas that could be improved.'
    : 'Your build needs attention. Please review the issues below.';

  return {
    overall,
    categories,
    summary
  };
}
