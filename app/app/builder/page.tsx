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

export default function BuilderPage() {
  const { selected, setPart, reset } = useBuilderStore();
  const [activeCategory, setActiveCategory] = useState<string>('cpu');
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [displayPosition, setDisplayPosition] = useState({ x: 0, y: 0 });

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
            (res.data || []).map((row: any) => ({
              ...row.data,
              id: row.id || row.data?.id,
              name: row.name || row.data?.name,
              price: row.data?.price,
            }))
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                        <div className="text-text-muted text-center py-8">Loading parts…</div>
                      ) : error ? (
                        <div className="text-red-400 text-center py-8">{error}</div>
                      ) : parts.length === 0 ? (
                        <div className="text-text-muted text-center py-8">No parts found for this category.</div>
                      ) : (
                        parts.map(part => (
                          <button
                            key={part.id}
                            className={`block w-full text-left p-3 rounded-lg border transition-all duration-200 ${selected[activeCategory]?.id === part.id ? 'bg-accent/20 border-accent text-accent' : 'hover:bg-surface-2/80 border-border/10 text-text-primary'}`}
                            onClick={() => setPart(activeCategory, part)}
                          >
                            <div className="font-semibold">{part.name}</div>
                            <div className="text-sm text-text-muted">${part.price ?? '?'} {getPartLabel(activeCategory, part)}</div>
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
