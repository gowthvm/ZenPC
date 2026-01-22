'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import PCVisualizer3DEnhanced from '@/components/PCVisualizer3DEnhanced';
import { useBuilderStore } from '@/store/builder';
import { Eye, Maximize2 } from 'lucide-react';

export default function BuilderPreviewPanel() {
  const { selected } = useBuilderStore();

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
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-1/40 rounded-lg border border-border/20 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-accent" />
          <h3 className="font-semibold text-text-primary">3D Build Preview</h3>
        </div>
        <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full font-bold">
          {selectedCount} parts
        </span>
      </div>

      {/* 3D Visualizer */}
      <motion.div
        className="overflow-hidden rounded-lg"
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <PCVisualizer3DEnhanced
          selectedParts={selectedParts}
          autoRotate={true}
          height="400px"
          showControls={true}
          showLabels={true}
          cameraDistance={12}
        />
      </motion.div>

      {/* Part List */}
      <motion.div
        className="space-y-2 p-4 bg-surface-1/40 rounded-lg border border-border/20 backdrop-blur-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="text-sm font-semibold text-text-primary mb-3">Build Components</h4>

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
                className="flex items-center gap-3 p-2 rounded bg-surface-2/30 border border-border/10 hover:border-accent/30 transition-colors"
                whileHover={{ x: 4 }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-medium text-text-muted">{item.label}</p>
                  {part ? (
                    <p className="text-xs text-text-primary truncate font-semibold">
                      {part.name || part.title || 'Selected'}
                    </p>
                  ) : (
                    <p className="text-xs text-text-muted italic">Not selected</p>
                  )}
                </div>
                {part && (
                  <div className="text-xs text-accent font-bold">✓</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Info Box */}
      <motion.div
        className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-xs text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p>💡 <span className="font-semibold">Tip:</span> The 3D preview updates in real-time as you select components. Colors are automatically matched based on your choices.</p>
      </motion.div>
    </motion.div>
  );
}
