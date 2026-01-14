// moved from app/app/builder/page.tsx
'use client';
import { useState } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { useBuilderStore } from '@/store/builder';

const PART_CATEGORIES = [
  { key: 'cpu', label: 'CPU' },
  { key: 'gpu', label: 'GPU' },
  { key: 'motherboard', label: 'Motherboard' },
  { key: 'ram', label: 'RAM' },
  { key: 'storage', label: 'Storage' },
  { key: 'psu', label: 'Power Supply' },
  { key: 'case', label: 'Case' },
];

function getPartLabel(category: string, part: any) {
  if (!part) return '';
  switch (category) {
    case 'cpu': return `${part.cores} cores, ${part.socket}`;
    case 'gpu': return `${part.vram}GB VRAM`;
    case 'motherboard': return `${part.chipset}, ${part.socket}`;
    case 'ram': return `${part.speed}`;
    case 'storage': return `${part.type}`;
    case 'psu': return `${part.wattage}W`;
    default: return '';
  }
}

import { fetchParts } from '@/lib/supabaseParts';

// Example static presets (IDs/names should match real Supabase data for best experience)
const PRESETS = [
  {
    name: 'Entry Level',
    budget: { min: 500, max: 700 },
    parts: {
      cpu: 'cpu1',
      motherboard: 'mb1',
      ram: 'ram2',
      gpu: 'gpu2',
      storage: 'storage2',
      psu: 'psu2',
      case: 'case2',
    },
  },
  {
    name: 'Mid Range',
    budget: { min: 1000, max: 1300 },
    parts: {
      cpu: 'cpu1',
      motherboard: 'mb1',
      ram: 'ram1',
      gpu: 'gpu2',
      storage: 'storage1',
      psu: 'psu1',
      case: 'case2',
    },
  },
  {
    name: 'High End',
    budget: { min: 1800, max: 2200 },
    parts: {
      cpu: 'cpu2',
      motherboard: 'mb2',
      ram: 'ram1',
      gpu: 'gpu1',
      storage: 'storage1',
      psu: 'psu1',
      case: 'case1',
    },
  },
];

const PRESET_USE_CASES: Record<string, string> = {
  'Entry Level': 'Basic home/office use',
  'Mid Range': 'Gaming & creative work',
  'High End': 'Enthusiast/multitasking',
};

export default function BuilderPage() {
  // ... rest of code unchanged ...

  const { selected, setPart, reset } = useBuilderStore();
  const [partsByCategory, setPartsByCategory] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParts = async () => {
      try {
        const results = await Promise.all(
          PART_CATEGORIES.map(async ({ key }) => {
            const { data, error } = await fetchParts(key);
            if (error) {
              console.error(`Error loading parts for ${key}:`, error);
              return [key, [] as any[]] as const;
            }
            return [key, (data as any[]) ?? []] as const;
          })
        );

        const map: Record<string, any[]> = {};
        for (const [key, list] of results) {
          map[key] = list;
        }
        setPartsByCategory(map);
      } catch (e) {
        console.error('Error loading parts:', e);
        setError('Failed to load parts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadParts();
  }, []);

  const handleSelectPart = (category: string, partId: string) => {
    const categoryParts = partsByCategory[category] ?? [];
    const part = categoryParts.find((p: any) => p.id === partId);
    if (part) {
      setPart(category, part);
    }
  };

  const handleApplyPreset = (presetName: string) => {
    const preset = PRESETS.find((preset) => preset.name === presetName);
    if (!preset) return;

    Object.entries(preset.parts).forEach(([category, partId]) => {
      const categoryParts = partsByCategory[category] ?? [];
      const part = categoryParts.find((p: any) => p.id === partId);
      if (part) {
        setPart(category, part);
      }
    });
  };

  const currentBudget = Object.values(selected).reduce(
    (sum, part) => sum + (part?.price || 0),
    0
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">PC Builder</h1>
          <p className="text-text-muted text-sm">
            Choose parts for each category. We&apos;ll track your build as you go.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-surface-2/40 transition-colors"
          >
            Reset Build
          </button>
          <Link
            href="/app"
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {loading && (
            <div className="card p-6">
              <div className="animate-pulse text-text-muted">Loading parts...</div>
            </div>
          )}

          {error && (
            <div className="card p-4 border border-red-500/40 text-red-300 text-sm">
              {error}
            </div>
          )}

          {!loading &&
            PART_CATEGORIES.map(({ key, label }) => {
              const selectedPart = selected[key];
              const parts = partsByCategory[key] ?? [];

              return (
                <div key={key} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="font-semibold text-text-primary">{label}</h2>
                      <p className="text-xs text-text-muted">
                        {selectedPart
                          ? getPartLabel(key, selectedPart)
                          : 'No part selected yet'}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium text-accent">
                        {selectedPart?.price
                          ? `$${selectedPart.price.toFixed(2)}`
                          : '--'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <select
                      className="w-full px-3 py-2 rounded-md bg-surface-1/60 border border-border/40 text-sm"
                      value={selectedPart?.id ?? ''}
                      onChange={(e) => handleSelectPart(key, e.target.value)}
                    >
                      <option value="">Select a {label}</option>
                      {parts.map((part: any) => (
                        <option key={part.id} value={part.id}>
                          {part.name} {part.price ? `($${part.price})` : ''}
                        </option>
                      ))}
                    </select>

                    {!loading && parts.length === 0 && (
                      <p className="text-xs text-text-muted">
                        No parts available for this category yet.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        <div className="space-y-4">
          <div className="card p-4 space-y-3">
            <h2 className="font-semibold text-text-primary">Build Summary</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Estimated total</span>
              <span className="font-display text-2xl font-bold text-accent">
                ${currentBudget.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-text-muted">
              This estimate uses prices from your selected parts.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="font-semibold text-sm text-text-primary">Presets</h3>
            <div className="space-y-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset.name)}
                  className="w-full text-left px-3 py-2 rounded-md bg-surface-2/60 hover:bg-surface-2/90 transition-colors text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{preset.name}</span>
                    <span className="text-xs text-text-muted">
                      ${preset.budget.min}-${preset.budget.max}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">
                    {PRESET_USE_CASES[preset.name]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
