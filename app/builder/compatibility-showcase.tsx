'use client';

import React, { useState } from 'react';
import CompatibilityIssueDisplay from '@/components/builder/CompatibilityIssueDisplay';
import type { ExtendedCompatibilityIssue } from '@/lib/advancedCompatibilityEngine';

export default function CompatibilityUIShowcase() {
  const [selectedScenario, setSelectedScenario] = useState<string>('socket');

  // Mock compatibility issues showcasing all enhanced error messages
  const scenarios: Record<string, { title: string; issues: ExtendedCompatibilityIssue[] }> = {
    socket: {
      title: 'CPU Socket Mismatch',
      issues: [
        {
          type: 'CPU Socket Mismatch',
          severity: 'error',
          message: `❌ CPU Socket Mismatch: Intel Core i9-13900K requires LGA1700 but motherboard has AM5`,
          explanation: `INCOMPATIBLE: "Intel Core i9-13900K" uses the LGA1700 socket, but "ASUS ROG STRIX X870-E" uses the AM5 socket. These sockets are not compatible - you cannot install this CPU on this motherboard.

EXACTLY WHAT'S WRONG:
• Your CPU: Intel Core i9-13900K (socket: LGA1700)
• Your motherboard: ASUS ROG STRIX X870-E (socket: AM5)
• Problem: The CPU physically will not fit into the motherboard's socket.`,
          fix: `Option 1: Replace the motherboard with one that has an LGA1700 socket (to match your CPU)

Option 2: Replace the CPU with a processor that uses the AM5 socket (to match your motherboard)`,
          affected: ['cpu', 'motherboard'],
          category: 'hard' as const,
          parts_involved: ['cpu', 'motherboard'],
          spec_keys: ['socket'],
          severity_explanation: 'BLOCKING ERROR: This is a physical incompatibility - the CPU cannot be installed. Your build will not work.',
          recommendation: `To fix this issue, you MUST choose parts with matching sockets. Common sockets include: AM4/AM5 (AMD), LGA1150/LGA1200/LGA1700 (Intel).`
        }
      ]
    },
    memory: {
      title: 'Memory Type Mismatch',
      issues: [
        {
          type: 'Memory Type Mismatch',
          severity: 'error',
          message: `❌ Memory Type Mismatch: G.SKILL Trident Z5 64GB is DDR5 but motherboard requires DDR4`,
          explanation: `INCOMPATIBLE: "G.SKILL Trident Z5 64GB" is DDR5 memory, but "MSI MPG B650E" only supports DDR4 memory. The RAM will not fit into the motherboard's memory slots and the system will not work.

EXACTLY WHAT'S WRONG:
• Your RAM: G.SKILL Trident Z5 64GB (type: DDR5)
• Your motherboard: MSI MPG B650E (supports: DDR4)
• Problem: The physical connectors don't match - your RAM will not seat into the motherboard's DIMM slots.`,
          fix: `Option 1: Replace your RAM with DDR4 memory (like G.SKILL Ripjaws 64GB DDR4) to match your motherboard

Option 2: Replace your motherboard with one that supports DDR5 memory to match your RAM`,
          affected: ['ram', 'motherboard'],
          category: 'hard' as const,
          parts_involved: ['ram', 'motherboard'],
          spec_keys: ['memory_type'],
          severity_explanation: 'BLOCKING ERROR: This is a physical incompatibility - the RAM will not fit. Your system will not boot or detect memory.',
          recommendation: `Ensure both RAM and motherboard support the same memory standard. DDR5 and DDR4 are not compatible with each other.`
        }
      ]
    },
    gpu_size: {
      title: 'GPU Clearance Issue',
      issues: [
        {
          type: 'GPU Clearance Issue',
          severity: 'error',
          message: `❌ GPU Too Large: RTX 4090 Founders Edition (312mm × 111mm) exceeds Fractal Define 7 Compact clearance`,
          explanation: `INCOMPATIBLE: "RTX 4090 Founders Edition" is physically too large to fit inside "Fractal Define 7 Compact". The GPU will not fit and cannot be installed.

EXACTLY WHAT'S WRONG:
• Your GPU: RTX 4090 Founders Edition (312mm length × 111mm height)
• Your case: Fractal Define 7 Compact (max GPU space: 300mm length × 100mm height)
• Problems:
  • Length: 312mm (GPU) vs 300mm (case) - GPU is 12mm TOO LONG
  • Height: 111mm (GPU) vs 100mm (case) - GPU is 11mm TOO TALL`,
          fix: `Option 1: Get a larger case that can accommodate a GPU that's 12mm larger (need 320mm+ GPU space)

Option 2: Replace the GPU with a smaller model that fits within the Fractal Define 7 Compact's dimensions (max 300mm length, 100mm height) - try RTX 4080`,
          affected: ['gpu', 'case'],
          category: 'hard' as const,
          parts_involved: ['gpu', 'case'],
          spec_keys: ['length_mm', 'height_mm'],
          severity_explanation: 'BLOCKING ERROR: This GPU physically will not fit in this case. Your build will not be possible.',
          recommendation: `Check your case's GPU clearance specifications (usually listed as "Max GPU length") before selecting a graphics card. Large GPUs need large cases.`
        }
      ]
    },
    cooler_height: {
      title: 'Cooler Height Clearance',
      issues: [
        {
          type: 'Cooler Height Clearance Issue',
          severity: 'error',
          message: `❌ Cooler Too Tall: Noctua NH-D15 (165mm) doesn't fit in Lian Li Lancool 205 Mesh (max 160mm)`,
          explanation: `INCOMPATIBLE: "Noctua NH-D15" is too tall to fit inside "Lian Li Lancool 205 Mesh". The cooler will hit the case's side panel and cannot be installed.

EXACTLY WHAT'S WRONG:
• Your cooler: Noctua NH-D15 (height: 165mm)
• Your case: Lian Li Lancool 205 Mesh (max cooler clearance: 160mm)
• Problem: The cooler is 5mm TOO TALL - it will not fit vertically inside the case.`,
          fix: `Option 1: Replace the cooler with a shorter model (must be under 160mm tall) - try Noctua NH-U12S

Option 2: Replace the case with a larger one that supports cooler heights up to 165mm - try Fractal Define 7`,
          affected: ['cooler', 'case'],
          category: 'hard' as const,
          parts_involved: ['cooler', 'case'],
          spec_keys: ['height_mm'],
          severity_explanation: 'BLOCKING ERROR: The cooler physically will not fit. You will not be able to assemble this build.',
          recommendation: `Always check your case's maximum cooler height specification. Large air coolers and thick radiators need more vertical space.`
        }
      ]
    },
    power: {
      title: 'Missing Power Connectors',
      issues: [
        {
          type: 'Insufficient Power Connectors',
          severity: 'error',
          message: `❌ Missing Power Connectors: RTX 4080 Super needs 2×8-pin that CORSAIR RM1000x (has 1×8-pin) doesn't provide`,
          explanation: `INCOMPATIBLE: "RTX 4080 Super" requires 2×8-pin and 1×6-pin connectors, but "CORSAIR RM1000x" does not have enough power connectors. Using adapters on high-end GPUs can cause power delivery issues, system crashes, or even fire hazards.

EXACTLY WHAT'S WRONG:
• Your GPU: RTX 4080 Super (requires: 2×8-pin and 1×6-pin connectors)
• Your PSU: CORSAIR RM1000x (provides: 1×8-pin and 0×6-pin)
• Missing: 1×8-pin and 1×6-pin`,
          fix: `Option 1: Choose a more powerful PSU (850W+) with at least 2×8-pin connectors and 1×6-pin connector - try CORSAIR HX850

Option 2: Replace the GPU with a lower-power model that fits within the CORSAIR RM1000x's connector capacity - try RTX 4070`,
          affected: ['gpu', 'psu'],
          category: 'hard' as const,
          parts_involved: ['gpu', 'psu'],
          spec_keys: ['power_connectors'],
          severity_explanation: 'BLOCKING ERROR: The GPU cannot receive adequate power. Using adapters is dangerous and not recommended.',
          recommendation: `High-end RTX 40-series GPUs need 850W+ PSUs with dedicated connectors. Never use adapters for power delivery—it's unsafe.`
        }
      ]
    },
    warning: {
      title: 'Performance Warning',
      issues: [
        {
          type: 'PSU Headroom Warning',
          severity: 'warning',
          message: `⚠️ Low PSU Headroom: RTX 4080 (320W) + i9-14900K (250W) = 570W but PSU is only 650W`,
          explanation: `The total power consumption of your components is using 88% of your PSU's capacity. While technically functional, this leaves minimal headroom for power spikes and efficiency losses.`,
          fix: `Option 1: Upgrade to a larger PSU (850W+) for better stability and efficiency

Option 2: Choose lower-power components (RTX 4070 or i9-14900 non-K)`,
          affected: ['gpu', 'cpu', 'psu'],
          category: 'warning' as const,
          parts_involved: ['gpu', 'cpu', 'psu'],
          spec_keys: ['tdp', 'power_consumption'],
          severity_explanation: 'Performance degradation risk - PSU may throttle under heavy load.',
          recommendation: `Ideally, your total system power consumption should be 50-70% of PSU capacity for optimal stability and longevity.`
        }
      ]
    },
    info: {
      title: 'Informational Tip',
      issues: [
        {
          type: 'NVMe Speed Advisory',
          severity: 'info',
          message: `💡 NVMe Speed Note: Your NVMe drive supports PCIe 4.0 but motherboard only has PCIe 3.0`,
          explanation: `Your storage drive is capable of faster speeds than your motherboard can provide. The drive will work, but at reduced performance.`,
          fix: `Option 1: Upgrade to a motherboard with PCIe 4.0 support (X870-E models) to get full drive speed

Option 2: Use a PCIe 3.0 NVMe drive for this system`,
          affected: ['storage', 'motherboard'],
          category: 'info' as const,
          parts_involved: ['storage', 'motherboard'],
          spec_keys: ['pcie_generation'],
          recommendation: `Modern PCIe 4.0 drives offer 2-3x faster speeds than PCIe 3.0. Consider upgrading your motherboard if you need fast storage.`
        }
      ]
    }
  };

  const currentScenario = scenarios[selectedScenario];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Enhanced Compatibility Error Messages
          </h1>
          <p className="text-slate-300">
            Real-world examples of exact incompatibilities with actionable fix suggestions
          </p>
        </div>

        {/* Scenario Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <button
              key={key}
              onClick={() => setSelectedScenario(key)}
              className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                selectedScenario === key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {scenario.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Main Display */}
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            {currentScenario.title}
          </h2>

          {/* Compatibility Issues Display */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
            <CompatibilityIssueDisplay
              issues={currentScenario.issues}
              compact={false}
              expandedByDefault={true}
            />
          </div>

          {/* Detailed Breakdown */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What Changed */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">📊 What Changed</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Before:</p>
                  <p className="text-white font-mono bg-slate-800 p-2 rounded text-sm">
                    ❌ Error: Incompatible
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">After:</p>
                  <p className="text-white font-mono bg-slate-800 p-2 rounded text-sm">
                    ❌ {currentScenario.issues[0].message}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">✨ Key Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Exact part names & specs</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Specific measurements shown</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Multiple fix options</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Safety warnings included</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Actionable guidance</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Raw Data View */}
          <div className="mt-8">
            <details className="bg-slate-700 rounded-lg p-6">
              <summary className="text-lg font-bold text-white cursor-pointer hover:text-blue-400">
                📋 View Raw Issue Data
              </summary>
              <pre className="mt-4 bg-slate-900 p-4 rounded text-xs text-slate-300 overflow-x-auto">
                {JSON.stringify(currentScenario.issues[0], null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>8 Enhanced Validation Checks • Real-time Error Detection • Actionable Fixes</p>
          <p className="mt-2">Try different scenarios to see how errors are now displayed exactly</p>
        </div>
      </div>
    </div>
  );
}
