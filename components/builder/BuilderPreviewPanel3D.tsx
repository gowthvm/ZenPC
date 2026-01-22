'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PCVisualizer3DAdvanced from '@/components/PCVisualizer3DAdvanced';
import { useBuilderStore } from '@/store/builder';
import { Eye, Settings, Info } from 'lucide-react';

export default function BuilderPreviewPanel() {
  const { selected } = useBuilderStore();
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light' | 'ambient'>('dark');
  const [showExploded, setShowExploded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // Memoize the selected parts to avoid unnecessary re-renders
  const selectedParts = useMemo(() => selected, [selected]);

  const selectedCount = useMemo(() => {
    return Object.values(selectedParts).filter(Boolean).length;
  }, [selectedParts]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-4"
    >
      {/* Header with controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-1/40 rounded-lg border border-border/20 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-accent" />
          <h3 className="font-semibold text-text-primary">3D Build Preview</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(!showSettings)}
          className="p-1 hover:bg-surface-2/50 rounded transition-colors"
        >
          <Settings size={16} className="text-text-muted" />
        </motion.button>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 bg-surface-1/40 rounded-lg border border-border/20 space-y-3"
          >
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-primary block">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {(['dark', 'light', 'ambient'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      theme === t
                        ? 'bg-accent text-white'
                        : 'bg-surface-2/50 text-text-muted hover:bg-surface-2'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-text-primary">Auto Rotate</label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  autoRotate ? 'bg-accent/30 text-accent' : 'bg-surface-2/50 text-text-muted'
                }`}
              >
                {autoRotate ? '✓ ON' : 'OFF'}
              </motion.button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-text-primary">Exploded View</label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowExploded(!showExploded)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  showExploded ? 'bg-accent/30 text-accent' : 'bg-surface-2/50 text-text-muted'
                }`}
              >
                {showExploded ? '✓ ON' : 'OFF'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Part count badge */}
      <div className="px-3 py-2 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-lg border border-accent/30 flex items-center justify-between">
        <span className="text-xs font-semibold text-accent">Components</span>
        <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full font-bold">
          {selectedCount} parts
        </span>
      </div>

      {/* 3D Visualizer */}
      <motion.div
        className="overflow-hidden rounded-lg ring-2 ring-accent/20"
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <PCVisualizer3DAdvanced
          selectedParts={selectedParts}
          autoRotate={autoRotate}
          height="450px"
          showControls={true}
          showLabels={true}
          cameraDistance={12}
          theme={theme}
          exploded={showExploded}
          mouseControls={true}
          quality="high"
        />
      </motion.div>

      {/* Part List */}
      <motion.div
        className="space-y-2 p-4 bg-surface-1/40 rounded-lg border border-border/20 backdrop-blur-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="text-sm font-semibold text-text-primary mb-3">Selected Components</h4>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {[
            { key: 'case', label: 'Case', color: '#1a1f2e' },
            { key: 'motherboard', label: 'Motherboard', color: '#2d5f2e' },
            { key: 'cpu', label: 'CPU', color: '#0084d1' },
            { key: 'gpu', label: 'GPU', color: '#e0700f' },
            { key: 'ram', label: 'RAM', color: '#f0ad4e' },
            { key: 'storage', label: 'Storage', color: '#5cb85c' },
            { key: 'psu', label: 'Power Supply', color: '#3a3a3a' },
          ].map((item) => {
            const part = selectedParts[item.key];
            return (
              <motion.div
                key={item.key}
                className="flex items-center gap-3 p-2 rounded bg-surface-2/30 border border-border/10 hover:border-accent/30 transition-colors group"
                whileHover={{ x: 4 }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 shadow-lg"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-medium text-text-muted">{item.label}</p>
                  {part ? (
                    <p className="text-xs text-text-primary truncate font-semibold">{part.name || part.title || 'Selected'}</p>
                  ) : (
                    <p className="text-xs text-text-muted italic">Not selected</p>
                  )}
                </div>
                {part && <div className="text-xs text-accent font-bold">✓</div>}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Info Box */}
      <motion.div
        className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-xs text-text-muted space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex gap-2">
          <Info size={14} className="flex-shrink-0 text-accent mt-0.5" />
          <div>
            <p className="font-semibold text-accent mb-1">💡 Pro Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Use exploded view to see component separation</li>
              <li>• Hover over components to highlight them</li>
              <li>• Download snapshots of your build</li>
              <li>• Theme changes lighting for different perspectives</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
