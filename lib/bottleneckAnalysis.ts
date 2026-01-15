/**
 * Bottleneck & Intelligence Layer
 * 
 * Spec-based bottleneck detection and educational insights
 * No fake percentages or fear-based warnings
 */

import { getSpecValue, type PartCategory } from './specDictionary';

export interface BottleneckInsight {
  type: 'bottleneck' | 'balance' | 'recommendation';
  component?: string;
  message: string;
  explanation: string;
  severity: 'info' | 'suggestion';
}

export interface BottleneckAnalysis {
  insights: BottleneckInsight[];
  summary: string;
}

/**
 * Derive GPU performance tier from specs
 */
function getGPUPerformanceTier(gpu: any): 'entry' | 'mid' | 'high' | 'enthusiast' | 'unknown' {
  if (!gpu) return 'unknown';
  
  const vram = getSpecValue(gpu, 'vram_gb') || 0;
  const tdp = getSpecValue(gpu, 'tdp_watts') || getSpecValue(gpu, 'tdp_w') || 0;
  
  if (vram >= 16 || tdp >= 300) return 'enthusiast';
  if (vram >= 12 || tdp >= 250) return 'high';
  if (vram >= 8 || tdp >= 150) return 'mid';
  if (vram >= 4) return 'entry';
  return 'unknown';
}

/**
 * Derive CPU performance tier from specs
 */
function getCPUPerformanceTier(cpu: any): 'entry' | 'mid' | 'high' | 'enthusiast' | 'unknown' {
  if (!cpu) return 'unknown';
  
  const cores = getSpecValue(cpu, 'cores') || 0;
  const threads = getSpecValue(cpu, 'threads') || cores;
  const boostClock = getSpecValue(cpu, 'boost_clock_ghz') || 0;
  
  if (cores >= 16 || (cores >= 12 && boostClock >= 5.0)) return 'enthusiast';
  if (cores >= 12 || (cores >= 8 && boostClock >= 4.5)) return 'high';
  if (cores >= 8 || (cores >= 6 && boostClock >= 4.0)) return 'mid';
  if (cores >= 4) return 'entry';
  return 'unknown';
}

/**
 * Analyze CPU-GPU balance
 */
function analyzeCPUGPUBalance(
  cpu: any,
  gpu: any,
  useCase: 'gaming' | 'productivity' | 'creator' | 'balanced'
): BottleneckInsight[] {
  const insights: BottleneckInsight[] = [];
  
  if (!cpu || !gpu) return insights;

  const cpuTier = getCPUPerformanceTier(cpu);
  const gpuTier = getGPUPerformanceTier(gpu);
  
  const tierOrder = { entry: 0, mid: 1, high: 2, enthusiast: 3 };
  const cpuTierNum = tierOrder[cpuTier] || 0;
  const gpuTierNum = tierOrder[gpuTier] || 0;
  const tierDiff = cpuTierNum - gpuTierNum;

  if (useCase === 'gaming') {
    // For gaming, GPU is more important
    if (tierDiff > 1) {
      insights.push({
        type: 'bottleneck',
        component: 'cpu',
        message: 'CPU may be more powerful than needed for gaming with this GPU.',
        explanation: 'For gaming workloads, the GPU typically does most of the work. Your CPU is significantly more powerful than your GPU, which means you might be able to save money by choosing a more balanced CPU, or get better gaming performance by upgrading the GPU.',
        severity: 'suggestion'
      });
    } else if (tierDiff < -1) {
      insights.push({
        type: 'bottleneck',
        component: 'cpu',
        message: 'CPU may limit gaming performance with this GPU.',
        explanation: 'Your GPU is more powerful than your CPU. In CPU-intensive games or at lower resolutions, the CPU may become the limiting factor. Consider a more powerful CPU to fully utilize your GPU.',
        severity: 'suggestion'
      });
    } else {
      insights.push({
        type: 'balance',
        message: 'CPU and GPU are well-balanced for gaming.',
        explanation: 'Your CPU and GPU are well-matched for gaming workloads. This balance helps ensure neither component is significantly underutilized.',
        severity: 'info'
      });
    }
  } else if (useCase === 'productivity' || useCase === 'creator') {
    // For productivity/creator, CPU is more important
    if (tierDiff < -1) {
      insights.push({
        type: 'bottleneck',
        component: 'cpu',
        message: 'CPU may limit productivity performance.',
        explanation: 'For productivity and creator workloads, CPU performance is often more critical than GPU. Your GPU is more powerful than your CPU, which may limit performance in CPU-intensive tasks like video rendering, code compilation, or data processing.',
        severity: 'suggestion'
      });
    } else if (tierDiff > 1) {
      insights.push({
        type: 'balance',
        message: 'CPU is well-suited for productivity workloads.',
        explanation: 'Your CPU is more powerful than your GPU, which is appropriate for productivity and creator workloads where CPU performance matters more.',
        severity: 'info'
      });
    } else {
      insights.push({
        type: 'balance',
        message: 'CPU and GPU are well-balanced for productivity.',
        explanation: 'Your components are well-matched for productivity and creator workloads.',
        severity: 'info'
      });
    }
  }

  return insights;
}

/**
 * Analyze RAM adequacy
 */
function analyzeRAMAdequacy(ram: any, useCase: 'gaming' | 'productivity' | 'creator' | 'balanced'): BottleneckInsight[] {
  const insights: BottleneckInsight[] = [];
  
  if (!ram) return insights;

  const ramSize = getSpecValue(ram, 'size_gb') || 0;

  if (useCase === 'gaming') {
    if (ramSize < 16) {
      insights.push({
        type: 'recommendation',
        component: 'ram',
        message: '16GB+ RAM recommended for modern gaming.',
        explanation: 'While 8GB can work for some games, 16GB provides better performance and eliminates potential stuttering in modern titles. 32GB is future-proof but not necessary for most gaming.',
        severity: 'suggestion'
      });
    } else if (ramSize >= 32) {
      insights.push({
        type: 'balance',
        component: 'ram',
        message: '32GB+ RAM provides excellent headroom.',
        explanation: 'You have plenty of RAM for gaming. This allows for multitasking while gaming without performance impact.',
        severity: 'info'
      });
    }
  } else if (useCase === 'productivity' || useCase === 'creator') {
    if (ramSize < 32) {
      insights.push({
        type: 'recommendation',
        component: 'ram',
        message: '32GB+ RAM recommended for productivity and creator workloads.',
        explanation: 'Productivity and creator applications (video editing, 3D rendering, large datasets) benefit significantly from more RAM. 32GB is a good baseline, with 64GB+ for heavy workloads.',
        severity: 'suggestion'
      });
    } else {
      insights.push({
        type: 'balance',
        component: 'ram',
        message: 'RAM capacity is well-suited for productivity workloads.',
        explanation: 'Your RAM capacity supports productivity and creator workloads effectively.',
        severity: 'info'
      });
    }
  }

  return insights;
}

/**
 * Analyze storage performance
 */
function analyzeStorage(storage: any): BottleneckInsight[] {
  const insights: BottleneckInsight[] = [];
  
  if (!storage) return insights;

  const type = getSpecValue(storage, 'type');
  const interface_ = getSpecValue(storage, 'interface');
  const isSSD = type?.toString().toLowerCase().includes('ssd') || 
                 interface_?.toString().toLowerCase().includes('nvme') ||
                 interface_?.toString().toLowerCase().includes('ssd');

  if (!isSSD) {
    insights.push({
      type: 'recommendation',
      component: 'storage',
      message: 'SSD recommended for better system responsiveness.',
      explanation: 'Solid-state drives (SSD) provide significantly faster boot times, application loading, and overall system responsiveness compared to traditional hard drives. Consider an SSD for your primary storage.',
      severity: 'suggestion'
    });
  } else {
    insights.push({
      type: 'balance',
      component: 'storage',
      message: 'SSD storage provides excellent performance.',
      explanation: 'Your SSD will provide fast boot times and quick application loading.',
      severity: 'info'
    });
  }

  return insights;
}

/**
 * Analyze target resolution impact
 */
function analyzeResolutionImpact(
  gpu: any,
  targetResolution: '1080p' | '1440p' | '4k' | 'unknown'
): BottleneckInsight[] {
  const insights: BottleneckInsight[] = [];
  
  if (!gpu || targetResolution === 'unknown') return insights;

  const gpuTier = getGPUPerformanceTier(gpu);

  if (targetResolution === '4k') {
    if (gpuTier !== 'enthusiast' && gpuTier !== 'high') {
      insights.push({
        type: 'recommendation',
        component: 'gpu',
        message: 'High-end GPU recommended for 4K gaming.',
        explanation: '4K gaming requires significant GPU power. Your current GPU may struggle to maintain smooth frame rates at 4K resolution. Consider a high-end or enthusiast-tier GPU for the best 4K experience.',
        severity: 'suggestion'
      });
    }
  } else if (targetResolution === '1440p') {
    if (gpuTier === 'entry') {
      insights.push({
        type: 'recommendation',
        component: 'gpu',
        message: 'Mid-range or better GPU recommended for 1440p gaming.',
        explanation: '1440p gaming benefits from mid-range to high-end GPUs. Your current GPU may need to reduce settings or may struggle in demanding titles at 1440p.',
        severity: 'suggestion'
      });
    }
  }

  return insights;
}

/**
 * Perform comprehensive bottleneck analysis
 */
export function analyzeBottlenecks(
  selectedParts: Record<string, any>,
  useCase: 'gaming' | 'productivity' | 'creator' | 'balanced' = 'balanced',
  targetResolution: '1080p' | '1440p' | '4k' | 'unknown' = 'unknown'
): BottleneckAnalysis {
  const insights: BottleneckInsight[] = [];

  const cpu = selectedParts.cpu;
  const gpu = selectedParts.gpu;
  const ram = selectedParts.ram;
  const storage = selectedParts.storage;

  // CPU-GPU balance
  insights.push(...analyzeCPUGPUBalance(cpu, gpu, useCase));

  // RAM adequacy
  insights.push(...analyzeRAMAdequacy(ram, useCase));

  // Storage performance
  insights.push(...analyzeStorage(storage));

  // Resolution impact (for gaming)
  if (useCase === 'gaming') {
    insights.push(...analyzeResolutionImpact(gpu, targetResolution));
  }

  // Generate summary
  const bottleneckCount = insights.filter(i => i.type === 'bottleneck').length;
  const recommendationCount = insights.filter(i => i.type === 'recommendation').length;

  let summary: string;
  if (bottleneckCount === 0 && recommendationCount === 0) {
    summary = 'Your build is well-balanced. No significant bottlenecks or recommendations at this time.';
  } else if (bottleneckCount > 0) {
    summary = `Found ${bottleneckCount} potential bottleneck${bottleneckCount > 1 ? 's' : ''}. Review the insights below for optimization opportunities.`;
  } else {
    summary = `Found ${recommendationCount} optimization suggestion${recommendationCount > 1 ? 's' : ''} to improve your build.`;
  }

  return {
    insights,
    summary
  };
}
