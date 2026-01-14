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
}
