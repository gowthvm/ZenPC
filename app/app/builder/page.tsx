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
  const { selected, setPart, reset } = useBuilderStore();
  const [activeCategory, setActiveCategory] = useState<string>('cpu');
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [displayPosition, setDisplayPosition] = useState({ x: 0, y: 0 });

  // Preset selection step state
  const [budgetInput, setBudgetInput] = useState<string>('');
  const [showPresetStep, setShowPresetStep] = useState(true);
  const [presetWarning, setPresetWarning] = useState<string | null>(null);

  // Find matching presets for entered budget
  const recommendedPresets = PRESETS.filter(
    p => {
      const budget = parseInt(budgetInput, 10);
      return !isNaN(budget) && budget >= p.budget.min && budget <= p.budget.max;
    }
  ).slice(0, 3);

  // Helper: estimate preset cost (sum of matching loaded parts)
  function getPresetEstimatedCost(preset: typeof PRESETS[number]) {
    let total = 0;
    Object.entries(preset.parts).forEach(([cat, partId]) => {
      const match = parts.find((p: any) => p.id === partId);
      if (match && typeof match.price === 'number') total += match.price;
    });
    return total;
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setParts([]);
    fetchParts(activeCategory)
      .then((res) => {
        if (cancelled) return;
        if (res.error) {
          setError('Failed to load parts.');
          setParts([]);
        } else {
          // Flatten data: merge row.data into row, prefer top-level fields for id, name, price
          setParts(
            (res.data || [])
              .map((row: any) => {
                const merged = {
                  ...row.data,
                  id: row.id || row.data?.id,
                  name: row.name || row.data?.name,
                  category: row.category || row.data?.category,
                  price: row.data?.price,
                };
                // Required fields: name, category, at least one spec field
                if (!merged.name || !merged.category) return null;
                // Check for at least one spec (not id, name, category, price)
                const specKeys = Object.keys(merged).filter(
                  k => !['id', 'name', 'category', 'price'].includes(k)
                );
                if (specKeys.length === 0) return null;
                return merged;
              })
              .filter(Boolean)
          );
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Failed to load parts.');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [activeCategory]);

  const budget = Object.values(selected).reduce((sum, part) => sum + (part?.price || 0), 0);

  // Mouse-following gradient effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth movement using lerp
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      setDisplayPosition(prev => ({
        x: lerp(prev.x, mousePosition.x, 0.1),
        y: lerp(prev.y, mousePosition.y, 0.1)
      }));
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [mousePosition]);

  // Compatibility engine
  const issues: string[] = [];

  // CPU ↔ motherboard socket
  if (selected.cpu && selected.motherboard && selected.cpu.socket !== selected.motherboard.socket) {
    issues.push('CPU and motherboard sockets do not match');
  }

  // RAM generation (DDR5/DDR4)
  if (selected.ram && selected.motherboard) {
    const ramGen = selected.ram.speed?.includes('DDR5') ? 'DDR5' : selected.ram.speed?.includes('DDR4') ? 'DDR4' : undefined;
    const mbGen = selected.motherboard.chipset?.includes('B650') || selected.motherboard.chipset?.includes('Z690') ? 'DDR5' : 'DDR4';
    if (ramGen && ramGen !== mbGen) {
      issues.push('RAM generation does not match motherboard');
    }
  }

  // PSU wattage headroom (GPU + CPU + 100W < PSU)
  if (selected.psu && (selected.cpu || selected.gpu)) {
    const cpuWatt = selected.cpu ? 65 : 0; // mock typical CPU TDP
    const gpuWatt = selected.gpu ? 220 : 0; // mock typical GPU TDP
    if (selected.psu.wattage < cpuWatt + gpuWatt + 100) {
      issues.push('PSU wattage may be insufficient');
    }
  }

  // Case ↔ GPU length (mock: only allow one GPU per case for demo)
  if (selected.gpu && selected.case) {
    if (selected.gpu.id === 'gpu1' && selected.case.id === 'case1') {
      // e.g., RTX 4070 too long for NZXT H510 (mock)
      issues.push('GPU may not fit in selected case');
    }
  }

  const isCompatible = issues.length === 0;

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-text-primary relative overflow-hidden">
      {/* Mouse-following gradient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-1 via-transparent to-surface-2 opacity-50" />
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(800px circle at ${displayPosition.x}px ${displayPosition.y}px, rgba(99, 112, 241, 0.15), transparent 40%)`,
          }}
        />
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Glassmorphic Header */}
        <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 pt-6 pb-4 flex items-center justify-between gap-8 bg-surface-1/20 backdrop-blur-glass border-b border-border/10 shadow-glass transition-all duration-300">
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors duration-200 group"
              >
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
            </div>
            <h1 className="font-display text-xl font-bold text-text-primary">PC Builder</h1>
            <div className="flex items-center gap-3">
              <Link href="/app" className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200">Dashboard</Link>
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center font-display text-sm font-bold text-white select-none shadow-lg">Z</div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 w-full px-4 md:px-6 pt-24 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Preset Selection Step */}
            {showPresetStep && (
              <div className="mb-12">
                <div className="mb-6 flex flex-col items-center">
                  <label htmlFor="budget" className="mb-2 text-lg font-medium text-text-primary">Enter your budget</label>
                  <input
                    id="budget"
                    type="number"
                    min={100}
                    max={10000}
                    step={50}
                    placeholder="e.g. 1200"
                    className="px-4 py-2 rounded-lg border border-border bg-surface-2 text-text-primary text-center w-40 focus:outline-none focus:ring-2 focus:ring-accent"
                    value={budgetInput}
                    onChange={e => {
                      setBudgetInput(e.target.value);
                      setPresetWarning(null);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-4 items-center">
                  {budgetInput && recommendedPresets.length > 0 ? (
                    recommendedPresets.map((preset) => {
                      const estCost = getPresetEstimatedCost(preset);
                      const budget = parseInt(budgetInput, 10);
                      const overBudget = !isNaN(budget) && estCost > budget;
                      // Check for missing parts
                      const missingParts = Object.entries(preset.parts).filter(([cat, partId]) => !parts.find((p: any) => p.id === partId));
                      return (
                        <button
                          key={preset.name}
                          className="w-full max-w-md px-6 py-4 rounded-lg border border-border bg-surface-2 hover:bg-accent/10 flex flex-col items-start transition-all duration-200 focus:outline-none"
                          onClick={() => {
                            Object.entries(preset.parts).forEach(([cat, partId]) => {
                              const match = parts.find((p: any) => p.id === partId);
                              if (match) setPart(cat, match);
                            });
                            setShowPresetStep(false);
                            setPresetWarning(
                              overBudget
                                ? 'This preset slightly exceeds your budget.'
                                : missingParts.length > 0
                                  ? 'Some parts in this preset are missing from Supabase and were skipped.'
                                  : null
                            );
                          }}
                        >
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold text-lg text-text-primary">{preset.name}</span>
                            <span className="text-xs text-text-muted">{preset.budget.min}&ndash;{preset.budget.max}</span>
                          </div>
                          <div className="text-sm text-text-muted mb-1">{PRESET_USE_CASES[preset.name]}</div>
                          <div className="text-sm font-medium text-accent">Estimated cost: ${estCost}</div>
                          {overBudget && (
                            <div className="text-xs text-yellow-600 mt-1">Warning: Estimated cost exceeds budget</div>
                          )}
                          {missingParts.length > 0 && (
                            <div className="text-xs text-red-400 mt-1">{missingParts.length} part(s) missing from Supabase</div>
                          )}
                        </button>
                      );
                    })
                  ) : budgetInput ? (
                    <div className="text-text-muted text-center py-6">No preset fits your budget. Try adjusting your budget or build manually.</div>
                  ) : null}
                  {presetWarning && <div className="text-sm text-yellow-700 mt-4">{presetWarning}</div>}
                  {(!budgetInput || recommendedPresets.length === 0) && (
                    <button
                      className="mt-6 px-6 py-2 rounded-lg border border-border text-text-primary font-medium hover:border-text-primary transition-all duration-200 hover:bg-surface-2/30"
                      onClick={() => setShowPresetStep(false)}
                    >
                      Build Manually
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Preset Selection Panel */}
              <div className="mb-8">
                <h2 className="font-display text-xl font-bold mb-4 text-text-primary">Start with a Preset</h2>
                <div className="flex flex-wrap gap-4">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      className="px-4 py-2 rounded-lg border border-border bg-surface-2 hover:bg-accent/10 font-medium text-text-primary transition-all duration-200"
                      onClick={() => {
                        Object.entries(preset.parts).forEach(([cat, partId]) => {
                          // Find the part in the current parts list for this category
                          if (!Array.isArray(parts)) return;
                          const match = parts.find((p: any) => p.id === partId);
                          if (match) setPart(cat, match);
                        });
                      }}
                      type="button"
                    >
                      <div className="font-semibold">{preset.name}</div>
                      <div className="text-sm text-text-muted">${preset.budget.min}&ndash;${preset.budget.max}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Parts Selection Panel */}
              <div className="lg:col-span-1">
                <div className="card p-6">
                  <h2 className="font-display text-2xl font-bold mb-6 text-text-primary">Select Parts</h2>
                  
                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3 text-text-primary">Categories</h3>
                    <nav className="flex flex-col gap-2">
                      {PART_CATEGORIES.map((cat: { key: string; label: string }) => (
                        <button
                          key={cat.key}
                          className={`text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeCategory === cat.key ? 'bg-accent/20 text-accent border border-accent/30' : 'hover:bg-surface-2/60 text-text-primary border border-border/10'}`}
                          onClick={() => setActiveCategory(cat.key)}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                  
                  {/* Parts List */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-text-primary">Available Parts</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {loading ? (
                        <div className="space-y-2" aria-label="Loading parts">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="animate-pulse rounded-lg bg-surface-2/60 h-14 w-full border border-border/10 flex items-center px-4"
                            >
                              <div className="h-4 w-1/4 bg-surface-1/80 rounded mr-4" />
                              <div className="h-3 w-1/6 bg-surface-1/60 rounded" />
                            </div>
                          ))}
                        </div>
                      ) : error ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg className="w-10 h-10 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-red-400 font-semibold mb-1">We couldn’t load parts right now.</div>
                          <div className="text-text-muted text-sm mb-2">Please check your connection or try again in a moment.</div>
                          <button
                            className="px-4 py-2 rounded-lg border border-border text-text-primary font-medium hover:border-text-primary transition-all duration-200 hover:bg-surface-2/30"
                            onClick={() => {
                              setError(null); setLoading(true);
                              fetchParts(activeCategory)
                                .then((res) => {
                                  if (res.error) {
                                    setError('Failed to load parts.');
                                    setParts([]);
                                  } else {
                                    setParts(
                                      (res.data || []).map((row: any) => ({
                                        ...row.data,
                                        id: row.id || row.data?.id,
                                        name: row.name || row.data?.name,
                                        price: row.data?.price,
                                      }))
                                    );
                                    setError(null);
                                  }
                                  setLoading(false);
                                })
                                .catch(() => {
                                  setError('Failed to load parts.');
                                  setLoading(false);
                                });
                            }}
                          >
                            Retry
                          </button>
                        </div>
                      ) : parts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg className="w-10 h-10 text-accent mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <div className="text-text-muted font-semibold mb-1">No parts found for this category.</div>
                          <div className="text-text-muted text-sm">Try another category or check back later.</div>
                        </div>
                      ) : (
                        parts.map(part => (
                          <button
                            key={part.id}
                            className={`block w-full text-left p-3 rounded-lg border transition-all duration-200 ${selected[activeCategory]?.id === part.id ? 'bg-accent/20 border-accent text-accent' : 'hover:bg-surface-2/80 border-border/10 text-text-primary'}`}
                            onClick={() => setPart(activeCategory, part)}
                          >
                            <div className="font-semibold">{part.name || <span className="text-red-400">Unnamed Part</span>}</div>
                            <div className="text-sm text-text-muted">${typeof part.price === 'number' ? part.price : '?'} {getPartLabel(activeCategory, part) || <span className="italic text-text-muted">Specs unavailable</span>}</div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-8">
                {/* Selected Part Details */}
                <div className="card p-6">
                  <h2 className="font-display text-2xl font-bold mb-4 text-text-primary">Selected Part Details</h2>
                  {selected[activeCategory] ? (
                    <div className="space-y-4">
                      <div>
                        <div className="font-semibold text-xl mb-2 text-text-primary">{selected[activeCategory].name}</div>
                        <div className="text-2xl font-bold text-accent mb-4">${selected[activeCategory].price}</div>
                      </div>
                      <div className="bg-surface-2/50 rounded-lg p-4">
                        <pre className="text-sm text-text-muted overflow-x-auto">
                          {JSON.stringify(selected[activeCategory], null, 2)}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-text-muted text-center py-8">No part selected. Choose a category and select a part to view details.</div>
                  )}
                </div>
                
                {/* Budget and Compatibility Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <h3 className="font-display text-xl font-bold mb-4 text-text-primary">Budget</h3>
                    <div className="text-3xl font-bold text-accent">${budget}</div>
                    <div className="text-sm text-text-muted mt-2">Total build cost</div>
                  </div>
                  
                  <div className="card p-6">
                    <h3 className="font-display text-xl font-bold mb-4 text-text-primary">Compatibility</h3>
                    {isCompatible ? (
                      <div className="flex items-center gap-2">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-green-400 font-semibold">Compatible</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-red-400 font-semibold">Issues Found</span>
                        </div>
                        <ul className="text-red-400 text-sm space-y-1">
                          {issues.map((issue, i) => (
                            <li key={i}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={reset}
                    className="px-6 py-3 rounded-lg border border-border text-text-primary font-medium hover:border-text-primary transition-all duration-200 hover:bg-surface-2/30"
                  >
                    Reset Build
                  </button>
                  <button 
                    className="px-8 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    Save Build
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
