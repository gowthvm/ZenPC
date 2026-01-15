// moved from app/app/builder/page.tsx
'use client';
import { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
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

// Virtual scrolling component for large part lists
const VirtualizedPartList = memo(({ 
  parts, 
  selectedPartId, 
  category, 
  onSelectPart 
}: { 
  parts: any[]; 
  selectedPartId: string | undefined; 
  category: string; 
  onSelectPart: (partId: string) => void; 
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const ITEM_HEIGHT = 80; // Height of each part card in pixels
  const CONTAINER_HEIGHT = 256; // max-h-64 = 16rem = 256px
  const VISIBLE_ITEMS = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT) + 2; // +2 for buffer
  
  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  const endIndex = Math.min(startIndex + VISIBLE_ITEMS, parts.length);
  const visibleItems = parts.slice(startIndex, endIndex);
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  if (parts.length <= VISIBLE_ITEMS) {
    // If list is small, render normally without virtualization
    return (
      <div className="space-y-2 pr-2">
        {parts.map((part: any) => (
          <PartCard
            key={part.id}
            part={part}
            isSelected={selectedPartId === part.id}
            category={category}
            onSelect={() => onSelectPart(part.id)}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className="max-h-64 overflow-y-auto pr-2"
      onScroll={handleScroll}
      style={{ height: CONTAINER_HEIGHT }}
    >
      <div style={{ height: parts.length * ITEM_HEIGHT, position: 'relative' }}>
        <div style={{ transform: `translateY(${startIndex * ITEM_HEIGHT}px)` }}>
          {visibleItems.map((part: any) => (
            <PartCard
              key={part.id}
              part={part}
              isSelected={selectedPartId === part.id}
              category={category}
              onSelect={() => onSelectPart(part.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

VirtualizedPartList.displayName = 'VirtualizedPartList';

// Memoized PartCard component to prevent unnecessary re-renders
const PartCard = memo(({ 
  part, 
  isSelected, 
  category, 
  onSelect 
}: { 
  part: any; 
  isSelected: boolean; 
  category: string; 
  onSelect: () => void; 
}) => {
  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-accent/40 hover:bg-surface-1/60 ${
        isSelected
          ? 'border-accent/50 bg-accent/5 shadow-glass'
          : 'border-border/20 bg-surface-1/30'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-text-primary truncate">
            {part.name}
          </div>
          <div className="text-xs text-text-muted mt-1">
            {part.brand && <span className="mr-2">{part.brand}</span>}
            {getPartLabel(category, part)}
          </div>
        </div>
        <div className="flex flex-col items-end ml-3">
          {part.data?.price && (
            <div className="font-medium text-sm text-accent">
              ${part.data.price}
            </div>
          )}
          {isSelected && (
            <div className="text-xs text-green-400 mt-1">
              ✓ Selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PartCard.displayName = 'PartCard';

// Dynamic part label using spec dictionary
function getPartLabel(category: string, part: any) {
  if (!part) return '';
  
  const specs = getSpecsForCategory(category as any);
  const labels: string[] = [];
  
  // Get high-importance specs for quick label
  for (const { key, definition } of specs) {
    if (definition.importance === 'high') {
      const value = getSpecValue(part, key);
      if (value !== undefined && value !== null) {
        const unit = definition.unit ? ` ${definition.unit}` : '';
        labels.push(`${definition.label}: ${value}${unit}`);
        if (labels.length >= 2) break; // Show max 2 specs
      }
    }
  }
  
  return labels.join(', ') || part.name || 'No details';
}

import { fetchParts } from '@/lib/supabaseParts';
import { getCurrentUser } from '@/lib/supabaseUser';
import { saveBuild, loadBuilds } from '@/lib/supabaseBuilds';
import { evaluateCompatibility, estimatePowerRequirements } from '@/lib/compatibilityEngine';
import { getSpecValue, getSpecsForCategory } from '@/lib/specDictionary';
import PartSpecs, { PartSpecsCompact } from '@/app/components/PartSpecs';
import { analyzeBuildHealth, type BuildHealthResult } from '@/lib/buildHealth';
import { analyzeBottlenecks, type BottleneckAnalysis } from '@/lib/bottleneckAnalysis';

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
  // Landing-style ambient cursor glow (purely visual)
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const [isClient, setIsClient] = useState(false);
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

  // New feature states
  const [comparingParts, setComparingParts] = useState<{ category: string; part1: any; part2: any } | null>(null);
  const [replacePreview, setReplacePreview] = useState<{ category: string; oldPart: any; newPart: any } | null>(null);
  const [buildVariants, setBuildVariants] = useState<Array<{ id: string; name: string; parts: Record<string, any> }>>([]);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [showCompatibilities, setShowCompatibilities] = useState(true);
  const [useCaseMode, setUseCaseMode] = useState<'Balanced' | 'Gaming' | 'Productivity' | 'Creator'>('Balanced');
  const [showAdvancedInsights, setShowAdvancedInsights] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [assemblyReadyMode, setAssemblyReadyMode] = useState(false);
  
  // Compatibility state (using new engine)
  const [compatibilityState, setCompatibilityState] = useState<{
    issues: any[];
    confirmations: any[];
    loading: boolean;
  }>({ issues: [], confirmations: [], loading: false });
  
  // Build Health state
  const [buildHealth, setBuildHealth] = useState<BuildHealthResult | null>(null);
  const [buildHealthLoading, setBuildHealthLoading] = useState(false);
  
  // Bottleneck analysis state
  const [bottleneckAnalysis, setBottleneckAnalysis] = useState<BottleneckAnalysis | null>(null);
  
  // Evaluate compatibility when parts change
  useEffect(() => {
    const checkCompat = async () => {
      setCompatibilityState(prev => ({ ...prev, loading: true }));
      try {
        const result = await evaluateCompatibility(selected);
        setCompatibilityState({ ...result, loading: false });
      } catch (error) {
        console.error('Error evaluating compatibility:', error);
        setCompatibilityState({ issues: [], confirmations: [], loading: false });
      }
    };
    
    // Debounce compatibility checks
    const timer = setTimeout(checkCompat, 300);
    return () => clearTimeout(timer);
  }, [selected]);
  
  // Evaluate Build Health when parts change
  useEffect(() => {
    const analyzeHealth = async () => {
      setBuildHealthLoading(true);
      try {
        const health = await analyzeBuildHealth(selected);
        setBuildHealth(health);
      } catch (error) {
        console.error('Error analyzing build health:', error);
        setBuildHealth(null);
      } finally {
        setBuildHealthLoading(false);
      }
    };
    
    const timer = setTimeout(analyzeHealth, 500);
    return () => clearTimeout(timer);
  }, [selected]);
  
  // Analyze bottlenecks when parts or use case changes
  useEffect(() => {
    const analyzeBottlenecks_ = () => {
      try {
        const analysis = analyzeBottlenecks(
          selected,
          useCaseMode.toLowerCase() as any,
          'unknown' // Could be made configurable
        );
        setBottleneckAnalysis(analysis);
      } catch (error) {
        console.error('Error analyzing bottlenecks:', error);
        setBottleneckAnalysis(null);
      }
    };
    
    const timer = setTimeout(analyzeBottlenecks_, 400);
    return () => clearTimeout(timer);
  }, [selected, useCaseMode]);

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

  // Smooth cursor effect with requestAnimationFrame (matches landing page motion style)
  useEffect(() => {
    setIsClient(true);

    let targetX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    let targetY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isClient) return;
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: prev.x + (targetX - prev.x) * 0.1,
        y: prev.y + (targetY - prev.y) * 0.1,
      }));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isClient]);

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

  // Compatibility check now uses the rules engine (via state)
  // The checkCompatibility function is replaced by compatibilityState from useEffect above

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
    // Compatibility check will be handled by the rules engine automatically
    // Alert will be shown via the compatibility panel in the UI
  }
  const [partsByCategory, setPartsByCategory] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Part-specific search states
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  // Collapsible state for each part category
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

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

  // Search helper function - optimized with early returns
  const matchesSearchQuery = useCallback((part: any, query: string): boolean => {
    if (!query.trim()) return true;
    const lowerQuery = query.toLowerCase().trim();
    
    // Search in name - most common case first
    if (part.name?.toLowerCase().includes(lowerQuery)) return true;
    
    // Search in brand
    if (part.brand?.toLowerCase().includes(lowerQuery)) return true;
    
    // Search in key specs - limit to most important fields for performance
    const keySpecs = [
      'socket', 'chipset', 'memory_type', 'ram_speed_mhz', 'size_gb', 
      'capacity_tb', 'vram_gb', 'tdp_watts', 'wattage',
      'form_factor', 'type', 'interface'
    ];
    
    for (const specKey of keySpecs) {
      const value = getSpecValue(part, specKey);
      if (value !== undefined && value !== null) {
        const valueStr = String(value).toLowerCase();
        if (valueStr.includes(lowerQuery)) return true;
      }
    }
    
    // Only search nested data if query is longer than 2 chars to avoid expensive searches
    if (lowerQuery.length > 2 && part.data) {
      const searchInData = (obj: any): boolean => {
        for (const [k, v] of Object.entries(obj)) {
          if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
            if (searchInData(v)) return true;
          } else if (v !== undefined && v !== null) {
            const valStr = String(v).toLowerCase();
            if (valStr.includes(lowerQuery)) return true;
          }
        }
        return false;
      };
      if (searchInData(part.data)) return true;
    }
    
    return false;
  }, []);

  // Handle search query change for a specific category - debounced
  const handleSearchChange = useCallback((category: string, query: string) => {
    setSearchQueries(prev => ({ ...prev, [category]: query }));
  }, []);

  // Toggle category expansion
  const toggleCategoryExpansion = useCallback((category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  }, []);

  const handleSelectPart = useCallback((category: string, partId: string) => {
    const categoryParts = partsByCategory[category] ?? [];
    const part = categoryParts.find((p: any) => p.id === partId);
    const oldPart = selected[category];
    
    // Show replace preview if replacing an existing part
    if (oldPart && part && oldPart.id !== part.id) {
      setReplacePreview({ category, oldPart, newPart: part });
      return; // Don't set yet, wait for confirmation
    }
    
    if (part) {
      setPart(category, part);
      setReplacePreview(null);
    } else {
      setPart(category, undefined);
    }
  }, [partsByCategory, selected, setPart]);

  // Memoized filtered parts for each category
  const filteredPartsByCategory = useMemo(() => {
    const filtered: Record<string, any[]> = {};
    Object.entries(partsByCategory).forEach(([category, parts]) => {
      const query = searchQueries[category] || '';
      filtered[category] = query.trim() 
        ? parts.filter((part: any) => matchesSearchQuery(part, query))
        : parts;
    });
    return filtered;
  }, [partsByCategory, searchQueries, matchesSearchQuery]);

  const confirmReplace = () => {
    if (replacePreview) {
      setPart(replacePreview.category, replacePreview.newPart);
      setReplacePreview(null);
    }
  };

  const cancelReplace = () => {
    setReplacePreview(null);
  };

  // Build completion check
  const getBuildCompletion = () => {
    const required = ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'case'];
    const completed = required.filter(cat => selected[cat]);
    return {
      completed: completed.length,
      total: required.length,
      percentage: Math.round((completed.length / required.length) * 100),
      missing: required.filter(cat => !selected[cat])
    };
  };

  // Build health status
  const getBuildHealth = () => {
    const { issues } = compatibilityState;
    const completion = getBuildCompletion();
    
    if (issues.length === 0 && completion.completed === completion.total) {
      return { status: 'ready', label: 'Build Ready', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' };
    }
    if (issues.length === 0) {
      return { status: 'clear', label: 'All Clear', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' };
    }
    if (issues.filter(i => i.severity === 'error').length > 0) {
      return { status: 'critical', label: 'Critical Issues', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' };
    }
    return { status: 'attention', label: 'Needs Attention', color: 'text-yellow-300', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' };
  };

  // Budget status
  const getBudgetStatus = () => {
    if (!budgetMax) return null;
    const percentage = (currentBudget / budgetMax) * 100;
    if (currentBudget >= budgetMax) {
      return { status: 'over', label: 'Over Budget', color: 'text-red-400', percentage };
    }
    if (percentage >= 95) {
      return { status: 'near', label: 'Near Budget', color: 'text-yellow-300', percentage };
    }
    return { status: 'under', label: 'Under Budget', color: 'text-green-400', percentage };
  };

  // Duplicate build for variants
  const duplicateBuild = () => {
    const variantName = `${buildName} (Copy ${buildVariants.length + 1})`;
    const newVariant = {
      id: `variant-${Date.now()}`,
      name: variantName,
      parts: { ...selected }
    };
    setBuildVariants([...buildVariants, newVariant]);
  };

  // Switch variant
  const switchVariant = (variantId: string) => {
    const variant = buildVariants.find(v => v.id === variantId);
    if (variant) {
      Object.entries(variant.parts).forEach(([cat, part]) => {
        setPart(cat, part);
      });
      setActiveVariantId(variantId);
    }
  };

  const getSelectedPrice = (part: any) => {
    const p = part?.data?.price;
    return typeof p === 'number' && !isNaN(p) ? p : 0;
  };

  const getUseCaseGuidance = () => {
    switch (useCaseMode) {
      case 'Gaming':
        return 'Prioritize GPU value and sufficient PSU headroom; CPU should be “good enough” to avoid leaving FPS on the table.';
      case 'Productivity':
        return 'Prioritize CPU cores, RAM capacity, and reliable storage; GPU matters less unless your workload uses it.';
      case 'Creator':
        return 'Aim for balanced CPU + GPU and plenty of RAM; stability and cooling matter more for long renders.';
      default:
        return 'A balanced build favors overall stability, sensible budget allocation, and upgrade headroom.';
    }
  };

  // Performance expectations (informational heuristics; no fake benchmarks)
  const getPerformanceExpectations = () => {
    const cpu = selected.cpu;
    const gpu = selected.gpu;
    const ram = selected.ram;
    const storage = selected.storage;

    const cpuCores = getSpecValue(cpu, 'cores');
    const gpuPerf = gpu?.data?.performance;
    const vram = getSpecValue(gpu, 'vram_gb');
    const ramSize = getSpecValue(ram, 'size_gb');
    const storageType = getSpecValue(storage, 'type');
    const hasSSD = storageType?.toString()?.toLowerCase()?.includes('ssd');

    const labels: string[] = [];

    if (gpu) {
      if (gpuPerf === 'high' || (typeof vram === 'number' && vram >= 12)) labels.push('Suitable for 1440p gaming in most titles');
      else if (gpuPerf === 'medium' || (typeof vram === 'number' && vram >= 8)) labels.push('Suitable for 1080p gaming');
      else labels.push('Best for esports / lighter 1080p workloads');
    } else {
      labels.push('No GPU selected yet — gaming expectations depend heavily on the GPU');
    }

    if (typeof cpuCores === 'number') {
      if (cpuCores >= 12) labels.push('Optimized for productivity and heavy multitasking');
      else if (cpuCores >= 8) labels.push('Good for productivity and everyday workloads');
      else labels.push('Solid for general use; heavy multitasking may feel constrained');
    }

    if (useCaseMode === 'Creator' || useCaseMode === 'Productivity') {
      if (gpu && (gpuPerf === 'high' || (typeof vram === 'number' && vram >= 12))) labels.push('Good for 3D rendering / GPU-accelerated creation');
      else labels.push('Creator workloads may benefit from a stronger GPU (depending on your apps)');
    }

    if (typeof ramSize === 'number') {
      if (ramSize >= 32) labels.push('32GB+ RAM is comfortable for creator workloads');
      else if (ramSize >= 16) labels.push('16GB RAM is a solid baseline');
      else labels.push('Consider 16GB+ RAM for smoother modern workloads');
    }

    if (storage) labels.push(hasSSD ? 'SSD selected — good for responsiveness and load times' : 'Non‑SSD storage may feel slower for OS/app load times');

    return labels;
  };

  const getUpgradeLongevityInsights = () => {
    const insights: string[] = [];
    const cpu = selected.cpu;
    const motherboard = selected.motherboard;
    const psu = selected.psu;
    const gpu = selected.gpu;
    const pcCase = selected.case;

    const socket = getSpecValue(cpu, 'socket');
    const mbSocket = getSpecValue(motherboard, 'socket');
    if (socket && mbSocket && socket === mbSocket) {
      insights.push(`Platform socket match (${socket}) helps future CPU upgrades within the same platform family.`);
    }

    if (psu && gpu) {
      const powerEst = estimatePowerRequirements(selected);
      const psuW = powerEst.psuWattage;
      const gpuTdp = getSpecValue(gpu, 'tdp_w') ?? 250;
      const cpuTdp = getSpecValue(selected.cpu, 'tdp_w') ?? 100;
      const est = gpuTdp + cpuTdp + 150;
      const headroom = psuW - est;
      if (psuW > 0) {
        if (headroom >= 200) insights.push(`PSU headroom looks healthy (+${headroom}W est.). This supports future GPU upgrades without replacing the PSU.`);
        else if (headroom >= 0) insights.push(`PSU headroom is modest (+${headroom}W est.). Future GPU upgrades may require a PSU upgrade.`);
      }
    }

    const caseMax = getSpecValue(pcCase, 'gpu_max_length_mm');
    if (typeof caseMax === 'number') {
      if (caseMax >= 360) insights.push('Case GPU clearance is generous — easier future GPU upgrades.');
      else if (caseMax >= 300) insights.push('Case GPU clearance is reasonable — check longer GPUs before upgrading.');
      else insights.push('Case GPU clearance is tight — future GPU upgrades may be constrained.');
    }

    return insights;
  };

  const getRealWorldWarnings = () => {
    const warnings: Array<{ title: string; message: string }> = [];
    const cpuTdp = getSpecValue(selected.cpu, 'tdp_w');
    const gpuTdp = getSpecValue(selected.gpu, 'tdp_w');
    const psuW = getSpecValue(selected.psu, 'wattage');

    if (typeof cpuTdp === 'number' && cpuTdp >= 125) {
      warnings.push({
        title: 'Cooling adequacy',
        message: 'This CPU is likely to benefit from a strong cooler and good case airflow, especially under sustained load.',
      });
    }

    if (typeof gpuTdp === 'number' && gpuTdp >= 300) {
      warnings.push({
        title: 'Noise considerations',
        message: 'High-power GPUs can get loud under load depending on case airflow and fan curves. Plan for airflow and acoustic expectations.',
      });
    }

    if (typeof psuW === 'number' && psuW > 0) {
      const cpu = typeof cpuTdp === 'number' ? cpuTdp : 100;
      const gpu = typeof gpuTdp === 'number' ? gpuTdp : 250;
      const est = cpu + gpu + 150;
      warnings.push({
        title: 'Power draw under load',
        message: `Estimated peak load is roughly ~${est}W (very approximate). Good PSU headroom improves stability.`,
      });
    }

    return warnings;
  };

  const getValueSignals = () => {
    const signals: Array<{ title: string; message: string }> = [];
    const cpuPrice = getSelectedPrice(selected.cpu);
    const gpuPrice = getSelectedPrice(selected.gpu);
    const ramSize = getSpecValue(selected.ram, 'size_gb');

    if (cpuPrice && gpuPrice) {
      if (useCaseMode === 'Gaming' && cpuPrice > gpuPrice * 0.9) {
        signals.push({
          title: 'Value balance',
          message: 'This CPU may be underutilized with the selected GPU for gaming. Consider reallocating budget toward the GPU if FPS is the goal.',
        });
      }
      if (useCaseMode !== 'Gaming' && gpuPrice > cpuPrice * 1.6) {
        signals.push({
          title: 'Value balance',
          message: 'GPU spend is high relative to CPU. If your workload is CPU-heavy, consider a stronger CPU or reallocating budget.',
        });
      }
    }

    if (useCaseMode === 'Creator' && typeof ramSize === 'number' && ramSize < 32) {
      signals.push({
        title: 'Creator comfort',
        message: 'Creator workloads often feel better with 32GB+ RAM, especially with large projects or multitasking.',
      });
    }

    return signals;
  };

  const getSummaryText = () => {
    const completion = getBuildCompletion();
    const health = getBuildHealth();
    const { issues } = compatibilityState;

    const lines: string[] = [];
    lines.push('ZenPC Build Summary');
    lines.push(`Name: ${buildName}`);
    lines.push(`Use case: ${useCaseMode}`);
    lines.push(`Status: ${health.label}`);
    lines.push(`Completion: ${completion.completed}/${completion.total} (${completion.percentage}%)`);
    lines.push(`Estimated total: $${currentBudget.toFixed(2)}`);
    if (budgetMax) lines.push(`Budget: $${budgetMin || 0} - $${budgetMax}`);
    lines.push('');
    lines.push('Parts:');
    for (const { key, label } of PART_CATEGORIES) {
      const part = selected[key];
      const price = getSelectedPrice(part);
      lines.push(`- ${label}: ${part?.name || '—'}${price ? ` ($${price.toFixed(2)})` : ''}`);
    }
    lines.push('');
    lines.push('Compatibility:');
    if (issues.length === 0) lines.push('- No issues detected by ZenPC checks (heuristic).');
    else issues.forEach((i) => lines.push(`- ${i.severity.toUpperCase()}: ${i.type} — ${i.message} | Fix: ${i.fix}`));
    lines.push('');
    lines.push('Performance expectations (informational):');
    getPerformanceExpectations().forEach((l) => lines.push(`- ${l}`));
    lines.push('');
    lines.push('Upgrade & longevity insights (informational):');
    const up = getUpgradeLongevityInsights();
    if (up.length === 0) lines.push('- Add core parts to unlock platform/upgrade insights.');
    else up.forEach((l) => lines.push(`- ${l}`));
    lines.push('');
    lines.push('Real-world advisories (informational):');
    const rw = getRealWorldWarnings();
    if (rw.length === 0) lines.push('- None');
    else rw.forEach((w) => lines.push(`- ${w.title}: ${w.message}`));
    lines.push('');
    lines.push('Cost-to-value signals (informational):');
    const vs = getValueSignals();
    if (vs.length === 0) lines.push('- None');
    else vs.forEach((s) => lines.push(`- ${s.title}: ${s.message}`));
    return lines.join('\n');
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(getSummaryText());
    } catch {
      // ignore; user can select text manually
    }
  };

  const downloadSummary = () => {
    const blob = new Blob([getSummaryText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${buildName.replace(/[^\w\- ]+/g, '').trim() || 'zenpc-build'}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
		<div className="relative w-full min-h-dvh overflow-hidden">
      {/* Ambient background layers (landing-consistent) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle at center, rgba(99, 102, 241, 0.30) 0%, rgba(99, 102, 241, 0.10) 50%, transparent 70%)',
            left: `${smoothPosition.x}px`,
            top: `${smoothPosition.y}px`,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(30px)',
            willChange: 'transform',
            transition: 'opacity 0.3s ease-out',
            opacity: 1,
          }}
        />
        <div className="absolute left-0 right-0 top-0 mx-auto h-64 bg-gradient-to-b from-accent/10 to-transparent" />
        <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute -right-24 top-80 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-8">
			{/* Guided Mode Toggle */}
			<div className="card p-5 md:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-6">
				<div className="flex items-center gap-4">
					<h1 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
            PC Builder
          </h1>
          <div className="hidden lg:flex items-center gap-2 ml-2">
            {(['Balanced', 'Gaming', 'Productivity', 'Creator'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setUseCaseMode(m)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-base ${
                  useCaseMode === m
                    ? 'bg-surface-1/60 border-accent/30 text-accent shadow-glass'
                    : 'bg-surface-1/30 border-border/20 text-text-muted hover:bg-surface-2/40 hover:text-text-primary'
                }`}
                aria-pressed={useCaseMode === m}
              >
                {m}
              </button>
            ))}
          </div>
					<label className="flex items-center gap-2 ml-4">
            <input
              type="checkbox"
              checked={guidedMode}
              onChange={e => setGuidedMode(e.target.checked)}
              className="accent-accent h-4 w-4 rounded border border-border/30 bg-surface-1/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-base"
            />
            						<span className="text-sm font-medium text-text-primary">Guided Mode</span>
					</label>
					{/* Quick Jump Dropdown */}
          <select
            aria-label="Quick jump to category"
            className="ml-4 px-3 py-2 rounded-md border border-border/20 text-sm bg-surface-1/50 backdrop-blur-glass shadow-glass/30 hover:border-border/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-base"
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
        <div className="text-xs text-text-muted">
          <span className="text-text-primary font-medium">Use-case:</span> {useCaseMode} — {getUseCaseGuidance()}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={duplicateBuild}
            className="px-4 py-2 rounded-lg border border-border/20 bg-surface-1/35 backdrop-blur-glass text-sm font-medium hover:bg-surface-2/50 hover:border-border/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] shadow-glass/30 transition-base"
          >
            Duplicate Build
          </button>
          <button
            type="button"
            onClick={() => setShowSummary(true)}
            className="px-4 py-2 rounded-lg border border-border/20 bg-surface-1/35 backdrop-blur-glass text-sm font-medium hover:bg-surface-2/50 hover:border-border/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] shadow-glass/30 transition-base"
          >
            Summary & Export
          </button>
          <button
            type="button"
            onClick={() => setAssemblyReadyMode((v) => !v)}
            className={`px-4 py-2 rounded-lg border bg-surface-1/35 backdrop-blur-glass text-sm font-medium shadow-glass/30 transition-base hover:bg-surface-2/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] ${
              assemblyReadyMode ? 'border-accent/30 text-accent' : 'border-border/20 text-text-primary'
            }`}
            aria-pressed={assemblyReadyMode}
          >
            {assemblyReadyMode ? 'Exit Assembly Ready' : 'Assembly Ready'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 rounded-lg border border-border/20 bg-surface-1/35 backdrop-blur-glass text-sm font-medium hover:bg-surface-2/50 hover:border-border/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] shadow-glass/30 transition-base"
          >
            Reset Build
          </button>
          <Link
            href="/app"
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] shadow-lg hover:shadow-xl transition-base"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

        <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {loading && (
            <div className="card p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-40 rounded bg-surface-2/60" />
                <div className="h-3 w-64 rounded bg-surface-2/50" />
              </div>
            </div>
          )}

          {error && (
            <div className="card p-4 border border-red-500/30 bg-surface-1/40 text-red-200 text-sm flex items-center gap-2">
              <span className="text-red-200/90">Failed to load parts. Please check your connection or try again.</span>
              <button
                type="button"
                className="ml-auto px-3 py-1.5 rounded-md bg-surface-2/50 border border-border/20 text-xs text-text-primary hover:bg-surface-2/70 hover:border-border/30 transition-base"
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
            const allParts = partsByCategory[key] ?? [];
            const currentSearchQuery = searchQueries[key] || '';
            const isExpanded = expandedCategories[key] || false;
            const parts = filteredPartsByCategory[key] || [];

            						return (
							<div
								key={key}
								id={`cat-${key}`}
								className={`card p-5 md:p-6 ${
                  isNext
                    ? 'ring-2 ring-accent/60 ring-offset-2 ring-offset-bg shadow-glass'
                    : ''
                } ${
                  selectedPart
                    ? 'border-accent/25 shadow-glass hover:border-accent/30'
                    : ''
                }`}
							>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h2 className="font-semibold text-text-primary">{label}</h2>
                      <p className="text-xs text-text-muted">
                        {selectedPart
                          ? getPartLabel(key, selectedPart)
                          : 'No part selected yet'}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleCategoryExpansion(key)}
                      className="p-2 rounded-md bg-surface-1/50 border border-border/20 hover:bg-surface-2/50 hover:border-border/30 transition-all duration-200"
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${label} options`}
                    >
                      <svg 
                        className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-right text-sm">
                    <div className="font-medium text-accent">
                      {selectedPart?.data?.price
                        ? `$${selectedPart.data.price.toFixed(2)}`
                        : '--'}
                    </div>
                      {selectedPart && (
                        <div className="flex items-center gap-2">
                          {parts.length >= 2 && (
                            <button
                              className="px-3 py-1.5 rounded-md bg-surface-1/50 border border-border/20 text-xs text-text-primary hover:bg-surface-2/50 hover:border-accent/30 transition-base"
                              onClick={() => {
                                // If already comparing this category, close it
                                if (comparingParts?.category === key) {
                                  setComparingParts(null);
                                } else {
                                  // Start comparison with selected part and first other part
                                  const otherPart = parts.find((p: any) => p.id !== selectedPart.id);
                                  if (otherPart) {
                                    setComparingParts({ category: key, part1: selectedPart, part2: otherPart });
                                  }
                                }
                              }}
                              tabIndex={0}
                              aria-label={`Compare ${label}`}
                            >
                              {comparingParts?.category === key ? 'Close Compare' : 'Compare'}
                            </button>
                          )}
                          <button
                            className="px-3 py-1.5 rounded-md bg-surface-2/50 border border-border/20 text-xs text-text-primary hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-200 transition-base"
                            onClick={() => setPart(key, undefined)}
                            tabIndex={0}
                            aria-label={`Clear ${label}`}
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Collapsible part selection area */}
                  {isExpanded && (
                    <div className="flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
                      {/* Part-specific search input */}
                      <div className="relative mb-3">
                        <svg 
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none transition-colors" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          value={currentSearchQuery}
                          onChange={(e) => handleSearchChange(key, e.target.value)}
                          placeholder={`Search ${label.toLowerCase()} by name, brand, or specs...`}
                          className="w-full pl-9 pr-8 py-2 rounded-md bg-surface-1/40 border border-border/15 text-xs text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-all backdrop-blur-glass hover:border-border/25"
                        />
                        {currentSearchQuery && (
                          <button
                            onClick={() => handleSearchChange(key, '')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-surface-2/50 transition-colors"
                            aria-label={`Clear ${label} search`}
                          >
                            <svg className="w-3 h-3 text-text-muted hover:text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        {loading ? (
                          <div className="animate-pulse text-text-muted text-xs">Loading parts...</div>
                        ) : error ? (
                          <div className="text-xs text-red-400">{error}</div>
                        ) : (
                          <>
                            {/* Part selection dropdown */}
                            <select
                              className="w-full px-3 py-2.5 rounded-md bg-surface-1/50 border border-border/20 text-sm shadow-glass/30 hover:border-border/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-base"
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

                            {/* Part cards list with virtual scrolling */}
                            <VirtualizedPartList
                              parts={parts}
                              selectedPartId={selectedPart?.id}
                              category={key}
                              onSelectPart={(partId: string) => handleSelectPart(key, partId)}
                            />

                            {assemblyReadyMode && selectedPart && (
                              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 text-xs text-text-muted">
                                ✓ Selected — {selectedPart.name}
                              </div>
                            )}
                            {parts.length === 0 && (
                              <p className="text-xs text-text-muted">
                                {currentSearchQuery.trim() 
                                  ? `No parts found matching "${currentSearchQuery}" in ${label}.`
                                  : `No parts available for this category yet.`}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                
                {/* Part Specs Display */}
                {selectedPart && (
                  <div className="mt-4">
                    <PartSpecs 
                      part={selectedPart} 
                      category={key as any}
                      showLowImportance={false}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="card p-5 md:p-6 space-y-3">
            <h2 className="font-semibold text-text-primary">Build Summary</h2>
            <div className="flex items-center justify-between mb-2">
              <input
                type="text"
                className="font-display text-lg font-bold bg-transparent outline-none border-none w-2/3 placeholder:text-text-muted/60"
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
            </div>

            {/* Budget Intelligence */}
            {(() => {
              const budgetStatus = getBudgetStatus();
              if (!budgetStatus && !budgetMax) {
                // Show category distribution if no budget set
                const categoryTotals: Record<string, number> = {};
                Object.entries(selected).forEach(([cat, part]) => {
                  if (part?.data?.price) {
                    categoryTotals[cat] = (categoryTotals[cat] || 0) + part.data.price;
                  }
                });
                const hasDistribution = Object.keys(categoryTotals).length > 0;
                
                if (hasDistribution) {
                  return (
                    <div className="mt-3 p-3 rounded-lg bg-surface-1/30 backdrop-blur-glass border border-border/10">
                      <div className="text-xs font-semibold text-text-primary mb-2">Budget Distribution:</div>
                      <div className="space-y-1.5">
                        {Object.entries(categoryTotals)
                          .sort(([, a], [, b]) => b - a)
                          .map(([cat, total]) => {
                            const category = PART_CATEGORIES.find(c => c.key === cat);
                            const percentage = (total / currentBudget) * 100;
                            return (
                              <div key={cat} className="flex items-center justify-between text-xs">
                                <span className="text-text-muted">{category?.label || cat}:</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 h-1.5 rounded-full bg-surface-2/50 overflow-hidden">
                                    <div 
                                      className="h-full bg-accent rounded-full transition-all duration-base"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-text-primary font-medium w-16 text-right">
                                    ${total.toFixed(0)} ({percentage.toFixed(0)}%)
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                }
                return null;
              }
              
              if (!budgetStatus) return null;
              
              return (
                <div className={`mt-3 p-3 rounded-lg border ${budgetStatus.status === 'over' ? 'border-red-500/30 bg-red-500/10' : budgetStatus.status === 'near' ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-green-500/30 bg-green-500/10'} backdrop-blur-glass`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold ${budgetStatus.color}`}>
                      {budgetStatus.label}
                    </span>
                    <span className="text-xs text-text-muted">
                      {budgetStatus.percentage.toFixed(1)}% of budget
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-2/50 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-base ${
                        budgetStatus.status === 'over' ? 'bg-red-400' : 
                        budgetStatus.status === 'near' ? 'bg-yellow-400' : 
                        'bg-green-400'
                      }`}
                      style={{ width: `${Math.min(budgetStatus.percentage, 100)}%` }}
                    />
                  </div>
                  {budgetStatus.status === 'near' && (
                    <div className="mt-1 text-xs text-yellow-200">
                      You&apos;re approaching your budget limit. Consider reviewing your selections.
                    </div>
                  )}
                  {budgetStatus.status === 'over' && (
                    <div className="mt-1 text-xs text-red-200">
                      Your build exceeds the budget. Consider selecting more affordable components.
                    </div>
                  )}
                </div>
              );
            })()}
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
                    <span key={i} className="px-2 py-1 rounded-full bg-surface-1/45 backdrop-blur-glass text-xs text-accent border border-accent/25 font-medium shadow-glass/20">
                      {tag}
                    </span>
                  ))}
                </div>
              );
            })()}
            {/* Build Health Indicator - Prominent */}
            {(() => {
              const health = getBuildHealth();
              const { issues, confirmations } = compatibilityState;
              const completion = getBuildCompletion();
              
              return (
                <div className={`mt-4 p-4 rounded-lg border ${health.borderColor} ${health.bgColor} backdrop-blur-glass`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${health.color.replace('text-', 'bg-')}`} />
                      <span className={`font-semibold text-sm ${health.color}`}>{health.label}</span>
                    </div>
                    {health.status === 'ready' && (
                      <div className="px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs text-green-400 font-medium">
                        ✓ Ready to Build
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-text-muted space-y-1">
                    <div>Completion: {completion.completed}/{completion.total} components ({completion.percentage}%)</div>
                    {issues.length > 0 && (
                      <div>{issues.length} compatibility issue{issues.length === 1 ? '' : 's'} found</div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Build Completion Checklist */}
            {(() => {
              const completion = getBuildCompletion();
              if (completion.missing.length === 0) return null;
              
              return (
                <div className="mt-3 p-3 rounded-lg bg-surface-1/30 backdrop-blur-glass border border-border/10">
                  <div className="text-xs font-semibold text-text-primary mb-2">Missing Components:</div>
                  <div className="flex flex-wrap gap-2">
                    {completion.missing.map(cat => {
                      const category = PART_CATEGORIES.find(c => c.key === cat);
                      return (
                        <span key={cat} className="px-2 py-1 rounded-md bg-surface-2/50 border border-border/20 text-xs text-text-muted">
                          {category?.label || cat}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Compatibility Issues */}
            {(() => {
              const { issues } = compatibilityState;
              if (issues.length === 0) return null;
              
              return (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-semibold text-text-primary mb-1">Compatibility Issues:</div>
                  {issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        issue.severity === 'error' 
                          ? 'border-red-500/30 bg-red-500/10' 
                          : 'border-yellow-500/30 bg-yellow-500/10'
                      } backdrop-blur-glass`}
                    >
                      <div className={`font-semibold text-xs mb-1 ${
                        issue.severity === 'error' ? 'text-red-300' : 'text-yellow-200'
                      }`}>
                        {issue.type}
                      </div>
                      <div className="text-xs text-text-primary/90 mb-1">{issue.message}</div>
                      <div className="text-xs text-text-muted mb-2">{issue.explanation}</div>
                      <div className="text-xs text-text-muted">
                        <span className="font-medium text-text-primary/90">Fix:</span> {issue.fix}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Compatibility Confirmations */}
            {showCompatibilities && (() => {
              const { confirmations } = compatibilityState;
              if (confirmations.length === 0) return null;
              
              return (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-semibold text-text-primary">Compatibility Confirmations:</div>
                    <button
                      onClick={() => setShowCompatibilities(false)}
                      className="text-xs text-text-muted hover:text-text-primary transition-colors"
                    >
                      Hide
                    </button>
                  </div>
                  {confirmations.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg border border-green-500/20 bg-green-500/5 backdrop-blur-glass"
                    >
                      <div className="text-xs font-medium text-green-300 mb-0.5">{comp.type}</div>
                      <div className="text-xs text-text-muted">{comp.explanation}</div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Build Health Panel */}
          <div className="card p-5 md:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">Build Health</h3>
              {buildHealthLoading && (
                <span className="text-xs text-text-muted animate-pulse">Analyzing...</span>
              )}
            </div>
            
            {buildHealth && (
              <div className="space-y-4">
                {/* Overall Rating */}
                <div className={`p-4 rounded-lg border backdrop-blur-glass ${
                  buildHealth.overall === 'excellent' 
                    ? 'border-green-500/30 bg-green-500/10'
                    : buildHealth.overall === 'good'
                    ? 'border-blue-500/30 bg-blue-500/10'
                    : buildHealth.overall === 'acceptable'
                    ? 'border-yellow-500/30 bg-yellow-500/10'
                    : 'border-red-500/30 bg-red-500/10'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      buildHealth.overall === 'excellent' ? 'bg-green-400'
                      : buildHealth.overall === 'good' ? 'bg-blue-400'
                      : buildHealth.overall === 'acceptable' ? 'bg-yellow-400'
                      : 'bg-red-400'
                    }`} />
                    <span className="font-semibold text-sm capitalize">{buildHealth.overall}</span>
                  </div>
                  <p className="text-xs text-text-muted">{buildHealth.summary}</p>
                </div>
                
                {/* Health Categories */}
                <div className="space-y-2">
                  {buildHealth.categories.map((category, idx) => (
                    <details key={idx} className="group">
                      <summary className="cursor-pointer p-3 rounded-lg bg-surface-1/30 border border-border/20 hover:bg-surface-1/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-text-primary">{category.name}</span>
                          <span className={`text-xs capitalize ${
                            category.rating === 'excellent' ? 'text-green-400'
                            : category.rating === 'good' ? 'text-blue-400'
                            : category.rating === 'acceptable' ? 'text-yellow-400'
                            : 'text-red-400'
                          }`}>
                            {category.rating}
                          </span>
                        </div>
                      </summary>
                      <div className="mt-2 p-3 rounded-lg bg-surface-1/20 border border-border/10 space-y-2">
                        <p className="text-xs text-text-muted">{category.explanation}</p>
                        {category.details.length > 0 && (
                          <div className="space-y-1">
                            {category.details.map((detail, i) => (
                              <div key={i} className="text-xs text-text-muted">• {detail}</div>
                            ))}
                          </div>
                        )}
                        {category.recommendations && category.recommendations.length > 0 && (
                          <div className="pt-2 border-t border-border/10">
                            <div className="text-xs font-medium text-text-primary mb-1">Recommendations:</div>
                            {category.recommendations.map((rec, i) => (
                              <div key={i} className="text-xs text-text-muted">• {rec}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
            
            {!buildHealth && !buildHealthLoading && (
              <p className="text-xs text-text-muted">Select parts to analyze build health.</p>
            )}
          </div>

          {/* Bottleneck Analysis Panel */}
          <div className="card p-5 md:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">Performance Insights</h3>
            </div>
            
            {bottleneckAnalysis && bottleneckAnalysis.insights.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs text-text-muted">{bottleneckAnalysis.summary}</p>
                
                <div className="space-y-2">
                  {bottleneckAnalysis.insights.map((insight, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border backdrop-blur-glass ${
                        insight.type === 'bottleneck'
                          ? 'border-orange-500/30 bg-orange-500/10'
                          : insight.type === 'recommendation'
                          ? 'border-blue-500/30 bg-blue-500/10'
                          : 'border-green-500/30 bg-green-500/10'
                      }`}
                    >
                      {insight.component && (
                        <div className="text-xs font-medium text-text-primary mb-1">
                          {insight.component.toUpperCase()}
                        </div>
                      )}
                      <div className={`text-xs font-medium mb-1 ${
                        insight.severity === 'suggestion' ? 'text-orange-300' : 'text-blue-300'
                      }`}>
                        {insight.message}
                      </div>
                      <div className="text-xs text-text-muted">{insight.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {(!bottleneckAnalysis || bottleneckAnalysis.insights.length === 0) && (
              <p className="text-xs text-text-muted">No performance insights available. Add more components to see analysis.</p>
            )}
          </div>

          <div className="card p-5 md:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-text-primary">Advanced Insights</h3>
              <button
                type="button"
                onClick={() => setShowAdvancedInsights((v) => !v)}
                className="px-3 py-1.5 rounded-md bg-surface-1/40 border border-border/20 text-xs text-text-primary hover:bg-surface-2/50 transition-base"
                aria-expanded={showAdvancedInsights}
              >
                {showAdvancedInsights ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {showAdvancedInsights && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-surface-1/30 backdrop-blur-glass border border-border/10">
                  <div className="text-xs font-semibold text-text-primary mb-2">Performance expectations</div>
                  <div className="space-y-2">
                    {getPerformanceExpectations().map((t, i) => (
                      <div key={i} className="text-xs text-text-muted">
                        - {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-surface-1/30 backdrop-blur-glass border border-border/10">
                  <div className="text-xs font-semibold text-text-primary mb-2">Use-case aware guidance</div>
                  <div className="text-xs text-text-muted">
                    {getUseCaseGuidance()}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-surface-1/30 backdrop-blur-glass border border-border/10">
                  <div className="text-xs font-semibold text-text-primary mb-2">Upgrade & longevity insights</div>
                  <div className="space-y-2">
                    {getUpgradeLongevityInsights().length === 0 ? (
                      <div className="text-xs text-text-muted">Add core parts to unlock platform/upgrade insights.</div>
                    ) : (
                      getUpgradeLongevityInsights().map((t, i) => (
                        <div key={i} className="text-xs text-text-muted">
                          - {t}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-surface-1/30 backdrop-blur-glass border border-border/10">
                  <div className="text-xs font-semibold text-text-primary mb-2">Real-world advisories</div>
                  <div className="space-y-2">
                    {getRealWorldWarnings().length === 0 ? (
                      <div className="text-xs text-text-muted">No advisories yet.</div>
                    ) : (
                      getRealWorldWarnings().map((w, i) => (
                        <div key={i} className="text-xs text-text-muted">
                          - <span className="text-text-primary/90 font-medium">{w.title}:</span> {w.message}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-surface-1/30 backdrop-blur-glass border border-border/10">
                  <div className="text-xs font-semibold text-text-primary mb-2">Cost-to-value signals</div>
                  <div className="space-y-2">
                    {getValueSignals().length === 0 ? (
                      <div className="text-xs text-text-muted">No value signals detected.</div>
                    ) : (
                      getValueSignals().map((s, i) => (
                        <div key={i} className="text-xs text-text-muted">
                          - <span className="text-text-primary/90 font-medium">{s.title}:</span> {s.message}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card p-5 md:p-6 space-y-3">
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
                className="w-24 px-3 py-2 rounded-md border border-border/20 bg-surface-1/45 backdrop-blur-glass text-xs shadow-glass/20 hover:border-border/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-base"
                placeholder="Min"
                value={budgetMin}
                onChange={e => setBudgetMin(Number(e.target.value))}
              />
              <span className="text-xs">-</span>
              <input
                type="number"
                min={0}
                className="w-24 px-3 py-2 rounded-md border border-border/20 bg-surface-1/45 backdrop-blur-glass text-xs shadow-glass/20 hover:border-border/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-base"
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
                    className={`w-full text-left px-4 py-3 rounded-lg bg-surface-1/35 backdrop-blur-glass text-sm border shadow-glass/20 hover:bg-surface-2/50 hover:-translate-y-0.5 active:translate-y-0 transition-base ${
                      overBudget
                        ? 'border-orange-400/30'
                        : missing
                          ? 'border-red-400/30'
                          : 'border-border/20 hover:border-border/30'
                    }`}
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

      {showSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-text-primary">Build Summary & Export</h3>
              <button
                onClick={() => setShowSummary(false)}
                className="p-2 rounded-lg hover:bg-surface-2/50 transition-colors"
                aria-label="Close summary"
              >
                <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 rounded-lg bg-surface-1/30 border border-border/10">
              <pre className="whitespace-pre-wrap text-xs text-text-primary/90 font-mono leading-relaxed">
                {getSummaryText()}
              </pre>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={copySummary}
                className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-base hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Copy
              </button>
              <button
                onClick={downloadSummary}
                className="px-4 py-2 rounded-lg border border-border/20 bg-surface-1/50 text-text-primary text-sm font-medium hover:bg-surface-2/50 transition-base"
              >
                Download (.txt)
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg border border-border/20 bg-surface-1/50 text-text-primary text-sm font-medium hover:bg-surface-2/50 transition-base"
              >
                Print / PDF
              </button>
            </div>
            <div className="mt-2 text-xs text-text-muted">
              Tip: “Print / PDF” uses your browser’s print dialog for a PDF-ready export.
            </div>
          </div>
        </div>
      )}

      {/* Replace Impact Preview Modal */}
      {replacePreview && (() => {
        // Note: For preview, we'd need to evaluate compatibility separately
        // For now, using the current state as approximation
        const { issues: oldIssues } = compatibilityState;
        const { issues: newIssues } = compatibilityState; // Would need separate evaluation
        const oldPrice = replacePreview.oldPart?.data?.price || 0;
        const newPrice = replacePreview.newPart?.data?.price || 0;
        const priceDiff = newPrice - oldPrice;
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h3 className="font-semibold text-lg text-text-primary mb-4">Replace Part Impact Preview</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-text-primary mb-2">Replacing:</div>
                  <div className="p-3 rounded-lg bg-surface-2/50 border border-border/20">
                    <div className="font-medium text-text-primary">{replacePreview.oldPart.name}</div>
                    <div className="text-xs text-text-muted mt-1">${oldPrice.toFixed(2)}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-text-primary mb-2">With:</div>
                  <div className="p-3 rounded-lg bg-surface-1/60 border border-accent/30">
                    <div className="font-medium text-accent">{replacePreview.newPart.name}</div>
                    <div className="text-xs text-text-muted mt-1">${newPrice.toFixed(2)}</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-1/40 border border-border/20">
                  <div className="text-sm font-medium text-text-primary mb-2">Budget Impact:</div>
                  <div className={`text-lg font-bold ${priceDiff > 0 ? 'text-red-400' : priceDiff < 0 ? 'text-green-400' : 'text-text-primary'}`}>
                    {priceDiff > 0 ? '+' : ''}${priceDiff.toFixed(2)} ({priceDiff > 0 ? 'increase' : priceDiff < 0 ? 'decrease' : 'no change'})
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    New total: ${(currentBudget + priceDiff).toFixed(2)}
                  </div>
                </div>

                {newIssues.length > oldIssues.length && (
                  <div className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                    <div className="text-sm font-medium text-yellow-200 mb-1">⚠️ New Compatibility Issues:</div>
                    <div className="text-xs text-text-muted">
                      This change will introduce {newIssues.length - oldIssues.length} new compatibility issue{newIssues.length - oldIssues.length === 1 ? '' : 's'}.
                    </div>
                  </div>
                )}

                {newIssues.length < oldIssues.length && (
                  <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
                    <div className="text-sm font-medium text-green-300 mb-1">✓ Compatibility Improved:</div>
                    <div className="text-xs text-text-muted">
                      This change will resolve {oldIssues.length - newIssues.length} compatibility issue{oldIssues.length - newIssues.length === 1 ? '' : 's'}.
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={confirmReplace}
                  className="flex-1 px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-base ease-premium hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Confirm Replace
                </button>
                <button
                  onClick={cancelReplace}
                  className="flex-1 px-4 py-2 rounded-lg border border-border/20 bg-surface-1/50 text-text-primary font-medium hover:bg-surface-2/50 transition-all duration-base ease-premium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Part Comparison Modal */}
      {comparingParts && (() => {
        const { part1, part2, category } = comparingParts;
        const categoryLabel = PART_CATEGORIES.find(c => c.key === category)?.label || category;
        const categoryParts = partsByCategory[category] || [];
        
        const getComparisonFields = () => {
          const fields: Array<{ label: string; getValue: (p: any) => string }> = [];
          
          // Use spec dictionary to get high-importance specs for this category
          const specs = getSpecsForCategory(category as any);
          const highImportanceSpecs = specs
            .filter(({ definition }) => definition.importance === 'high')
            .slice(0, 5); // Limit to top 5 specs
          
          highImportanceSpecs.forEach(({ key, definition }) => {
            fields.push({
              label: definition.label,
              getValue: (p: any) => {
                const value = getSpecValue(p, key);
                if (value === undefined || value === null) return 'N/A';
                const unit = definition.unit ? ` ${definition.unit}` : '';
                if (definition.type === 'boolean') {
                  return value ? 'Yes' : 'No';
                }
                return `${value}${unit}`;
              }
            });
          });
          
          // Always include price
          fields.push(
            { label: 'Price', getValue: (p) => `$${(p.data?.price || 0).toFixed(2)}` }
          );
          
          return fields;
        };
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="card p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-text-primary">Compare {categoryLabel}</h3>
                <button
                  onClick={() => setComparingParts(null)}
                  className="p-2 rounded-lg hover:bg-surface-2/50 transition-colors"
                >
                  <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-xs font-medium text-text-muted">Specification</div>
                <div className="text-xs font-medium text-text-primary text-center">{part1.name}</div>
                <div className="text-xs font-medium text-text-primary text-center">{part2.name}</div>
                
                {getComparisonFields().map((field, idx) => (
                  <>
                    <div key={`label-${idx}`} className="text-xs text-text-muted py-2">{field.label}</div>
                    <div key={`p1-${idx}`} className="text-xs text-text-primary text-center py-2 border-r border-border/10">
                      {field.getValue(part1)}
                    </div>
                    <div key={`p2-${idx}`} className="text-xs text-text-primary text-center py-2">
                      {field.getValue(part2)}
                    </div>
                  </>
                ))}
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-surface-1/30 border border-border/20">
                <div className="text-xs font-medium text-text-primary mb-2">Compare different parts:</div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="px-2 py-1.5 rounded-md bg-surface-1/50 border border-border/20 text-xs"
                    value={part1.id}
                    onChange={(e) => {
                      const newPart = categoryParts.find((p: any) => p.id === e.target.value);
                      if (newPart) setComparingParts({ category, part1: newPart, part2 });
                    }}
                  >
                    {categoryParts.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <select
                    className="px-2 py-1.5 rounded-md bg-surface-1/50 border border-border/20 text-xs"
                    value={part2.id}
                    onChange={(e) => {
                      const newPart = categoryParts.find((p: any) => p.id === e.target.value);
                      if (newPart) setComparingParts({ category, part1, part2: newPart });
                    }}
                  >
                    {categoryParts.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setPart(category, part1);
                    setComparingParts(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-accent/30 bg-surface-1/50 text-accent font-medium hover:bg-surface-2/50 transition-all duration-base ease-premium"
                >
                  Select {part1.name.split(' ')[0]}
                </button>
                <button
                  onClick={() => {
                    setPart(category, part2);
                    setComparingParts(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-base ease-premium hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Select {part2.name.split(' ')[0]}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Build Variants Panel */}
      {buildVariants.length > 0 && (
        <div className="card p-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-text-primary">Build Variants</h3>
            <button
              onClick={duplicateBuild}
              className="px-3 py-1.5 rounded-md bg-surface-1/50 border border-border/20 text-xs text-text-primary hover:bg-surface-2/50 transition-all duration-base ease-premium"
            >
              + Duplicate Current
            </button>
          </div>
          <div className="space-y-2">
            {buildVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => switchVariant(variant.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-base ease-premium ${
                  activeVariantId === variant.id
                    ? 'bg-surface-1/60 border border-accent/30 text-accent'
                    : 'bg-surface-1/30 border border-border/20 text-text-primary hover:bg-surface-1/50'
                }`}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
