'use client';
import { useState } from 'react';
import exampleBuild from '@/data/exampleBuild.json';

const STEPS = [
  { key: 'cpu', label: 'CPU' },
  { key: 'motherboard', label: 'Motherboard' },
  { key: 'ram', label: 'RAM' },
  { key: 'gpu', label: 'GPU' },
  { key: 'storage', label: 'Storage' },
  { key: 'psu', label: 'Power Supply' },
  { key: 'case', label: 'Case' }
];

function getWarnings(step: string, build: any) {
  const warnings: string[] = [];
  if (step === 'motherboard' && build.cpu && build.motherboard && build.cpu.socket !== build.motherboard.socket) {
    warnings.push('CPU and motherboard sockets do not match.');
  }
  if (step === 'ram' && build.ram && build.motherboard) {
    const ramGen = build.ram.speed?.includes('DDR5') ? 'DDR5' : build.ram.speed?.includes('DDR4') ? 'DDR4' : undefined;
    const mbGen = build.motherboard.chipset?.includes('B650') || build.motherboard.chipset?.includes('Z690') ? 'DDR5' : 'DDR4';
    if (ramGen && ramGen !== mbGen) warnings.push('RAM generation does not match motherboard.');
  }
  if (step === 'psu' && build.psu && (build.cpu || build.gpu)) {
    const cpuWatt = build.cpu ? 65 : 0;
    const gpuWatt = build.gpu ? 220 : 0;
    if (build.psu.wattage < cpuWatt + gpuWatt + 100) warnings.push('PSU wattage may be insufficient.');
  }
  if (step === 'case' && build.gpu && build.case) {
    if (build.gpu.id === 'gpu1' && build.case.id === 'case1') warnings.push('GPU may not fit in selected case.');
  }
  return warnings;
}

export default function GuidePage() {
  const [step, setStep] = useState(0);
  const partKey = STEPS[step].key;
  const part = exampleBuild.parts[partKey];
  const warnings = getWarnings(partKey, exampleBuild.parts);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto py-12 px-4">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8 w-full">
        {STEPS.map((s, i) => (
          <div key={s.key} className={`flex-1 h-2 rounded-full ${i <= step ? 'bg-accent' : 'bg-surface-2/60'} transition-all`}></div>
        ))}
      </div>
      {/* Step Card */}
      <div className="card w-full p-8 mb-6">
        <h2 className="font-display text-2xl font-bold mb-2">Step {step + 1}: {STEPS[step].label}</h2>
        <div className="mb-2 font-semibold text-lg">{part?.name}</div>
        <div className="text-text-muted text-sm mb-4">{Object.entries(part || {}).filter(([k]) => k !== 'id' && k !== 'name').map(([k, v]) => (
          <div key={k}><span className="font-medium capitalize">{k}:</span> {v}</div>
        ))}</div>
        {warnings.length > 0 && (
          <div className="bg-red-900/30 border border-red-700/40 rounded p-3 text-red-300 text-sm mb-2">
            <ul className="list-disc list-inside">
              {warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}
        <div className="flex gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-md bg-surface-2 text-text-primary font-medium disabled:opacity-50"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </button>
          <button
            className="px-4 py-2 rounded-md bg-accent text-accent-fg font-semibold disabled:opacity-50"
            onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
            disabled={step === STEPS.length - 1}
          >
            {step === STEPS.length - 1 ? 'Done' : 'Next'}
          </button>
        </div>
      </div>
      <div className="text-text-muted text-sm text-center max-w-md">
        {exampleBuild.notes}
      </div>
    </div>
  );
}
