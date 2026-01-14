'use client';
import { useState } from 'react';

// Mock data
const PART_CATEGORIES = [
  { key: 'cpu', label: 'CPU' },
  { key: 'gpu', label: 'GPU' },
  { key: 'motherboard', label: 'Motherboard' },
  { key: 'ram', label: 'RAM' },
  { key: 'storage', label: 'Storage' },
  { key: 'psu', label: 'Power Supply' },
  { key: 'case', label: 'Case' },
];

const MOCK_PARTS: { [key: string]: any[] } = {
  cpu: [
    { id: 'cpu1', name: 'AMD Ryzen 5 7600', price: 200, cores: 6, socket: 'AM5' },
    { id: 'cpu2', name: 'Intel Core i5-13600K', price: 270, cores: 14, socket: 'LGA1700' },
  ],
  gpu: [
    { id: 'gpu1', name: 'NVIDIA RTX 4070', price: 600, vram: 12 },
    { id: 'gpu2', name: 'AMD Radeon RX 7800 XT', price: 500, vram: 16 },
  ],
  motherboard: [
    { id: 'mb1', name: 'ASUS B650-PLUS', price: 180, socket: 'AM5', chipset: 'B650' },
    { id: 'mb2', name: 'MSI Z690 PRO', price: 210, socket: 'LGA1700', chipset: 'Z690' },
  ],
  ram: [
    { id: 'ram1', name: 'Corsair Vengeance 32GB DDR5', price: 120, speed: '6000MHz' },
    { id: 'ram2', name: 'G.Skill Ripjaws 32GB DDR4', price: 90, speed: '3600MHz' },
  ],
  storage: [
    { id: 'storage1', name: 'Samsung 980 Pro 1TB NVMe', price: 90, type: 'SSD' },
    { id: 'storage2', name: 'WD Blue 2TB HDD', price: 50, type: 'HDD' },
  ],
  psu: [
    { id: 'psu1', name: 'Corsair RM750x', price: 110, wattage: 750 },
    { id: 'psu2', name: 'EVGA 600 BR', price: 60, wattage: 600 },
  ],
  case: [
    { id: 'case1', name: 'NZXT H510', price: 80 },
    { id: 'case2', name: 'Fractal Design Meshify C', price: 100 },
  ],
};

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

export default function BuilderPage() {
  const [selected, setSelected] = useState<Record<string, any>>({});
  const [activeCategory, setActiveCategory] = useState<string>('cpu');

  const budget = Object.values(selected).reduce((sum, part) => sum + (part?.price || 0), 0);

  // Simple compatibility: socket match for CPU/motherboard
  let compatibility = 'Compatible';
  if (selected.cpu && selected.motherboard && selected.cpu.socket !== selected.motherboard.socket) {
    compatibility = 'Incompatible: CPU and motherboard sockets do not match';
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-full">
      {/* Parts selection */}
      <aside className="w-full md:w-64 bg-surface-1/80 rounded-xl shadow-glass p-4 flex flex-col gap-4">
        <div className="font-display text-lg font-bold mb-2">Select Parts</div>
        <nav className="flex flex-col gap-1">
          {PART_CATEGORIES.map((cat: { key: string; label: string }) => (
            <button
              key={cat.key}
              className={`text-left px-3 py-2 rounded-md font-medium transition-colors ${activeCategory === cat.key ? 'bg-accent/10 text-accent' : 'hover:bg-surface-2/60'}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </nav>
        <div className="mt-4">
          {(MOCK_PARTS[activeCategory] || []).map(part => (
            <button
              key={part.id}
              className={`block w-full text-left px-3 py-2 rounded-lg border border-border/10 mb-2 transition-colors ${selected[activeCategory]?.id === part.id ? 'bg-accent/20 border-accent text-accent' : 'hover:bg-surface-2/80'}`}
              onClick={() => setSelected(s => ({ ...s, [activeCategory]: part }))}
            >
              <div className="font-semibold">{part.name}</div>
              <div className="text-xs text-text-muted">${part.price} {getPartLabel(activeCategory, part)}</div>
            </button>
          ))}
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 flex flex-col gap-6">
        {/* Selected part details */}
        <section className="bg-surface-1/80 rounded-xl shadow-glass p-6 min-h-[180px]">
          <div className="font-display text-lg font-bold mb-4">Selected Part Details</div>
          {selected[activeCategory] ? (
            <div>
              <div className="font-semibold text-base mb-1">{selected[activeCategory].name}</div>
              <div className="text-sm text-text-muted mb-1">${selected[activeCategory].price}</div>
              <pre className="text-xs bg-surface-2/80 rounded p-3 mt-2 overflow-x-auto">
                {JSON.stringify(selected[activeCategory], null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-text-muted">No part selected.</div>
          )}
        </section>
        {/* Budget + compatibility panel */}
        <section className="bg-surface-1/80 rounded-xl shadow-glass p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="font-display text-lg font-bold mb-2">Budget</div>
            <div className="text-2xl font-semibold">${budget}</div>
          </div>
          <div className="flex-1">
            <div className="font-display text-lg font-bold mb-2">Compatibility</div>
            <div className={compatibility === 'Compatible' ? 'text-green-400' : 'text-red-400'}>{compatibility}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
