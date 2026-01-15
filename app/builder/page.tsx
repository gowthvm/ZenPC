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
import { getCurrentUser } from '@/lib/supabaseUser';
import { saveBuild, loadBuilds } from '@/lib/supabaseBuilds';

// Example static presets (IDs/names should match real Supabase data for best experience)
const PRESETS: Array<{
  name: string;
  budget: { min: number; max: number };
  parts: Record<string, string>;
}> = [];

const PRESET_USE_CASES: Record<string, string> = {
  'Entry Level': 'Basic home/office use',
  'Mid Range': 'Gaming & creative work',
  'High End': 'Enthusiast/multitasking',
};

export default function BuilderPage() {
  const { selected, setPart, reset } = useBuilderStore();
  // Guided Mode state
  const [guidedMode, setGuidedMode] = useState(false);
  // Recommended build order
  const buildOrder = ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'case'];
  // Find the next recommended component (first missing in order)
  const nextComponent = buildOrder.find(cat => !selected[cat]);

  // Build management state
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [buildName, setBuildName] = useState('My Build');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [saveQueued, setSaveQueued] = useState(false);

  // On mount: get user and restore build if logged in
  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setUser(u);
      if (u) {
        const { data, error } = await loadBuilds(u.id);
        if (data && data.length > 0 && data[0].parts) {
          // Restore most recent build
          Object.entries(data[0].parts).forEach(([cat, part]) => {
            if (part && typeof part === 'object') setPart(cat, part as import('@/store/builder').Part);
          });
          setBuildName(data[0].name || 'My Build');
          setLastSaved(new Date(data[0].updated_at || data[0].created_at));
        }
      }
      setInitialLoad(false);
    })();
  }, [setPart]);

  // Auto-save build on meaningful changes (parts or name, skip initial load)
  useEffect(() => {
    if (!user || initialLoad) return;
    setSaving(true);
    setSaveQueued(false);
    saveBuild(user.id, buildName, selected).then(() => {
      setLastSaved(new Date());
    }).finally(() => setSaving(false));
  }, [selected, buildName, user, initialLoad]);

  // Queue save if user types build name quickly
  function handleBuildNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBuildName(e.target.value);
    setSaveQueued(true);
  }

  // Debounce build name auto-save (300ms after stop typing)
  useEffect(() => {
    if (!saveQueued || !user || initialLoad) return;
    const timer = setTimeout(() => {
      setSaving(true);
      saveBuild(user.id, buildName, selected).then(() => {
        setLastSaved(new Date());
      }).finally(() => {
        setSaving(false);
        setSaveQueued(false);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [saveQueued, buildName, user, selected, initialLoad]);

  // Budget input state
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(0);
  const [presets, setPresets] = useState<Array<{
    name: string;
    budget: { min: number; max: number };
    parts: Record<string, string>;
  }>>([]);

  // Filter presets by budget
  const filteredPresets = presets.filter(preset => {
    if (budgetMin === 0 && budgetMax === 0) return true;
    // Overlap logic: preset budget overlaps input range
    return (
      (budgetMin === 0 || preset.budget.max >= budgetMin) &&
      (budgetMax === 0 || preset.budget.min <= budgetMax)
    );
  });

  // Compatibility check: returns array of incompatibilities or empty
  function checkCompatibility(parts: Record<string, any>) {
    const issues = [];
    // BIOS update requirement (placeholder)
    if (parts.cpu && parts.motherboard && parts.cpu.socket !== parts.motherboard.socket) {
      issues.push({
        type: 'BIOS',
        message: 'Motherboard may require BIOS update for selected CPU.',
        fix: 'Check motherboard support list or request pre-flashed BIOS.'
      });
    }
    // Power headroom (placeholder)
    if (parts.psu && parts.gpu && parts.psu.wattage < (parts.gpu.tdp || 250) + 150) {
      issues.push({
        type: 'Power',
        message: 'PSU wattage may be insufficient for selected GPU.',
        fix: 'Choose a PSU with higher wattage.'
      });
    }
    // Physical clearance (placeholder)
    if (parts.case && parts.gpu && parts.case.gpu_max_length && parts.gpu.length && parts.gpu.length > parts.case.gpu_max_length) {
      issues.push({
        type: 'Clearance',
        message: 'GPU may not fit in selected case.',
        fix: 'Check case GPU clearance or select a shorter GPU.'
      });
    }
    return issues;
  }

  // Show warning for missing parts or incompatibilities
  function handleApplyPresetWithChecks(preset: any) {
    let missing = false;
    const parts: Record<string, any> = {};
    Object.entries(preset.parts).forEach(([cat, partId]) => {
      const found = partsByCategory[cat]?.find((p: any) => p.id === partId);
      if (found) parts[cat] = { ...found };
      else missing = true;
    });
    if (missing) {
      alert('Some parts in this preset are missing from the database. Please review and edit after applying.');
    }
    // Pre-fill builder, clear ghost state
    Object.keys(selected).forEach(cat => {
      if (!(cat in parts)) setPart(cat, undefined);
    });
    Object.entries(parts).forEach(([cat, part]) => setPart(cat, part));
    // Compatibility check
    const incompat = checkCompatibility(parts);
    if (incompat.length > 0) {
      window.alert('Compatibility issues detected: ' + incompat.join(', '));
    }
  }
  const [partsByCategory, setPartsByCategory] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPartsAndPresets = async () => {
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

        // Build presets from real Supabase parts
        const buildPresetsFromParts = () => {
          const allParts = Object.values(map).flat();
          const byCategory = (cat: string) => map[cat] || [];
          const pickFirst = (cat: string) => byCategory(cat)[0]?.id;
          const pickCheapest = (cat: string) => {
            const parts = byCategory(cat).filter(p => typeof p.data?.price === 'number');
            return parts.length ? parts.reduce((min, p) => p.data.price < min.data.price ? p : min).id : undefined;
          };
          const pickMostExpensive = (cat: string) => {
            const parts = byCategory(cat).filter(p => typeof p.data?.price === 'number');
            return parts.length ? parts.reduce((max, p) => p.data.price > max.data.price ? p : max).id : undefined;
          };

          const presets = [
            {
              name: 'Entry Level',
              budget: { min: 500, max: 700 },
              parts: {
                cpu: pickCheapest('cpu'),
                motherboard: pickCheapest('motherboard'),
                ram: pickCheapest('ram'),
                gpu: pickCheapest('gpu'),
                storage: pickCheapest('storage'),
                psu: pickCheapest('psu'),
                case: pickCheapest('case'),
              },
            },
            {
              name: 'Mid Range',
              budget: { min: 1000, max: 1300 },
              parts: {
                cpu: pickFirst('cpu'),
                motherboard: pickFirst('motherboard'),
                ram: pickFirst('ram'),
                gpu: pickFirst('gpu'),
                storage: pickFirst('storage'),
                psu: pickFirst('psu'),
                case: pickFirst('case'),
              },
            },
            {
              name: 'High End',
              budget: { min: 1800, max: 2200 },
              parts: {
                cpu: pickMostExpensive('cpu'),
                motherboard: pickMostExpensive('motherboard'),
                ram: pickMostExpensive('ram'),
                gpu: pickMostExpensive('gpu'),
                storage: pickMostExpensive('storage'),
                psu: pickMostExpensive('psu'),
                case: pickMostExpensive('case'),
              },
            },
          ].filter(p => Object.values(p.parts).every(Boolean)); // Only keep presets with all parts present
          setPresets(presets);
        };

        buildPresetsFromParts();
      } catch (e) {
        console.error('Error loading parts:', e);
        setError('Failed to load parts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPartsAndPresets();
  }, []);

  const handleSelectPart = (category: string, partId: string) => {
    const categoryParts = partsByCategory[category] ?? [];
    const part = categoryParts.find((p: any) => p.id === partId);
    if (part) {
      setPart(category, part);
    } else {
      setPart(category, undefined);
    }
  };

  const handleApplyPreset = (presetName: string) => {
    const preset = presets.find((preset) => preset.name === presetName);
    if (!preset) return;

    Object.entries(preset.parts).forEach(([category, partId]) => {
      const categoryParts = partsByCategory[category] ?? [];
      const part = categoryParts.find((p: any) => p.id === partId);
      if (part) {
        setPart(category, part);
      }
    });
  };

  const currentBudget = Object.values(selected).reduce((sum, part) => {
	if (!part || typeof part !== 'object' || Array.isArray(part) || Object.keys(part).length === 0) return sum;
	// Supabase parts store price inside data
	const price = part.data?.price;
	if (typeof price === 'number' && !isNaN(price)) {
	  return sum + price;
	}
	return sum;
	}, 0);

	return (
		<div className="w-full py-10 space-y-8">
			{/* Guided Mode Toggle */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<h1 className="font-display text-3xl font-bold text-text-primary">PC Builder</h1>
					<label className="flex items-center gap-2 ml-4">
            <input
              type="checkbox"
              checked={guidedMode}
              onChange={e => setGuidedMode(e.target.checked)}
              className="accent-accent h-4 w-4 rounded focus:ring-accent/40 border border-border/40 transition"
            />
            						<span className="text-sm font-medium text-text-primary">Guided Mode</span>
					</label>
					{/* Quick Jump Dropdown */}
          <select
            aria-label="Quick jump to category"
            className="ml-4 px-2 py-1 rounded border border-border/40 text-sm bg-surface-1/60"
            onChange={e => {
              const el = document.getElementById(`cat-${e.target.value}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            defaultValue=""
          >
            <option value="">Jump to…</option>
            {PART_CATEGORIES.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          					</select>
				</div>
				<div className="hidden md:block">
					<p className="text-text-muted text-sm">
						Choose parts for each category. We&apos;ll track your build as you go.
					</p>
				</div>
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

        <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {loading && (
            <div className="card p-6">
              <div className="animate-pulse text-text-muted">Loading parts...</div>
            </div>
          )}

          {error && (
            <div className="card p-4 border border-red-500/40 text-red-300 text-sm flex items-center gap-2">
              <span>Failed to load parts. Please check your connection or try again.</span>
              <button
                type="button"
                className="underline text-accent text-xs ml-auto"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {PART_CATEGORIES.map(({ key, label }) => {
            // Highlight if guided mode is on and this is the next recommended component
            const isNext = guidedMode && nextComponent === key;
            const selectedPart = selected[key];
            const parts = partsByCategory[key] ?? [];

            						return (
							<div
								key={key}
								className={`card p-4${isNext ? ' ring-2 ring-accent/60 ring-offset-2' : ''}`}
							>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="font-semibold text-text-primary">{label}</h2>
                    <p className="text-xs text-text-muted">
                      {selectedPart
                        ? getPartLabel(key, selectedPart)
                        : 'No part selected yet'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-right text-sm">
                    <div className="font-medium text-accent">
                      {selectedPart?.data?.price
                        ? `$${selectedPart.data.price.toFixed(2)}`
                        : '--'}
                    </div>
                    {selectedPart && (
                      <button
                        className="ml-1 px-2 py-1 rounded bg-surface-2/60 border border-border/40 text-xs hover:bg-red-100/30 text-red-500 transition-colors"
                        onClick={() => setPart(key, undefined)}
                        tabIndex={0}
                        aria-label={`Replace ${label}`}
                      >
                        Replace
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {loading ? (
                    <div className="animate-pulse text-text-muted text-xs">Loading parts...</div>
                  ) : error ? (
                    <div className="text-xs text-red-400">{error}</div>
                  ) : (
                    <>
                      <select
                        className="w-full px-3 py-2 rounded-md bg-surface-1/60 border border-border/40 text-sm"
                        value={selectedPart?.id ?? ''}
                        onChange={(e) => handleSelectPart(key, e.target.value)}
                      >
                        <option value="">Select a {label}</option>
                        {parts.map((part: any) => (
                          <option key={part.id} value={part.id}>
                            {part.name} {part.data?.price ? `($${part.data.price})` : ''}
                          </option>
                        ))}
                      </select>
                      {parts.length === 0 && (
                        <p className="text-xs text-text-muted">
                          No parts available for this category yet.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="card p-4 space-y-3">
            <h2 className="font-semibold text-text-primary">Build Summary</h2>
            <div className="flex items-center justify-between mb-2">
              <input
                type="text"
                className="font-display text-lg font-bold bg-transparent outline-none border-none w-2/3"
                value={buildName}
                onChange={handleBuildNameChange}
                disabled={!user}
                maxLength={40}
                aria-label="Build name"
                style={{ opacity: user ? 1 : 0.7, cursor: user ? 'text' : 'not-allowed' }}
              />
              <div className="flex items-center gap-2">
                {saving && user && (
                  <span className="text-xs text-accent animate-pulse">Saving...</span>
                )}
                {!saving && lastSaved && user && (
                  <span className="text-xs text-text-muted">Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                )}
                {!user && (
                  <span className="text-xs text-text-muted">Sign in to save</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Estimated total</span>
              <span className="font-display text-2xl font-bold text-accent">
                ${currentBudget.toFixed(2)}
              </span>
              {(() => {
                if (!budgetMin && !budgetMax) return null;
                let status = 'Under Budget';
                let color = 'text-green-500';
                if (budgetMax && currentBudget >= budgetMax) {
                  status = 'Over Budget';
                  color = 'text-red-500';
                } else if (budgetMax && currentBudget >= budgetMax * 0.95) {
                  status = 'Near Budget';
                  color = 'text-yellow-500';
                }
                return (
                  <span className={`ml-2 text-xs font-semibold ${color}`}>{status}</span>
                );
              })()}

            </div>
            <p className="text-xs text-text-muted">
              This estimate uses prices from your selected parts.
            </p>
            {/* Performance & Use-Case Tags */}
            {(() => {
              // Example logic for tags
              const tags: string[] = [];
              if (selected.gpu && selected.gpu.data?.performance === 'high') tags.push('1440p Gaming Ready');
              else if (selected.gpu && selected.gpu.data?.performance === 'medium') tags.push('1080p Gaming Ready');
              if (selected.cpu && selected.cpu.cores >= 12) tags.push('Great for Productivity');
              if (selected.ram && selected.ram.data?.size >= 32) tags.push('Heavy Multitasking');
              if (tags.length === 0) return null;
              return (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 rounded-full bg-surface-1/60 text-xs text-accent border border-accent/40 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              );
            })()}
            {/* Build Health & Confidence Indicator */}
            {(() => {
              const issues = checkCompatibility(selected);
              let status = 'All Clear';
              let statusColor = 'text-green-500';
              if (issues && issues.length > 0) {
                status = issues.length > 2 ? 'Critical Issues' : 'Needs Attention';
                statusColor = issues.length > 2 ? 'text-red-500' : 'text-yellow-500';
              }
              return (
                <div className="mt-2 flex items-center gap-2">
                  <span className={`font-semibold text-xs ${statusColor}`}>{status}</span>
                  <span className="text-xs text-text-muted">({issues.length} issue{issues.length === 1 ? '' : 's'})</span>
                </div>
              );
            })()}
            {/* Compatibility Insights */}
            {(() => {
              const issues = checkCompatibility(selected);
              if (!issues || issues.length === 0) return null;
              return (
                <div className="mt-3 space-y-2">
                  {issues.map((issue, idx) => (
                    <div key={idx} className="p-2 rounded bg-yellow-100/30 border-l-4 border-yellow-400">
                      <div className="font-semibold text-yellow-700 text-xs mb-1">{issue.type} Issue</div>
                      <div className="text-xs text-yellow-900">{issue.message}</div>
                      <div className="text-xs text-yellow-800 mt-1">Suggested fix: <span className="font-medium">{issue.fix}</span></div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="font-semibold text-sm text-text-primary">Presets</h3>
            {/* Budget input fields */}
            <form
              className="flex items-center gap-2 mb-3"
              onSubmit={e => e.preventDefault()}
            >
              <label className="text-xs text-text-muted">Budget:</label>
              <input
                type="number"
                min={0}
                className="w-20 px-2 py-1 rounded border border-border/40 text-xs"
                placeholder="Min"
                value={budgetMin}
                onChange={e => setBudgetMin(Number(e.target.value))}
              />
              <span className="text-xs">-</span>
              <input
                type="number"
                min={0}
                className="w-20 px-2 py-1 rounded border border-border/40 text-xs"
                placeholder="Max"
                value={budgetMax}
                onChange={e => setBudgetMax(Number(e.target.value))}
              />
            </form>
            <div className="space-y-2">
              {filteredPresets.length === 0 && (
                <div className="text-xs text-text-muted">No presets found for this budget.</div>
              )}
              {filteredPresets.map((preset) => {
                // Compute estimated price for preset
                let estimated = 0;
                let missing = false;
                Object.entries(preset.parts).forEach(([cat, partId]) => {
                  const found = partsByCategory[cat]?.find((p: any) => p.id === partId);
                  if (found && found.data?.price) estimated += found.data.price;
                  else missing = true;
                });
                const overBudget = budgetMax > 0 && estimated > budgetMax;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPresetWithChecks(preset)}
                    className="w-full text-left px-3 py-2 rounded-md bg-surface-2/60 hover:bg-surface-2/90 transition-colors text-sm border"
                    style={{ borderColor: overBudget ? '#f59e42' : missing ? '#f43f5e' : 'transparent' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{preset.name}</span>
                      <span className="text-xs text-text-muted">${preset.budget.min}-{preset.budget.max}</span>
                    </div>
                    <p className="text-xs text-text-muted">{PRESET_USE_CASES[preset.name]}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs">Est. Price:</span>
                      <span className="font-medium text-accent text-xs">${estimated.toFixed(2)}</span>
                      {missing && <span className="text-xs text-red-400">Missing parts</span>}
                      {overBudget && !missing && (
                        <span className="text-xs text-orange-400">Over budget</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
