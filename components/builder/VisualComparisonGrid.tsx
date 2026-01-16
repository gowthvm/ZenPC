'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { getSpecValue, getSpecsForCategory, type PartCategory } from '@/lib/specDictionary';
import { Badge } from '@/components/ui/Badge';
import { X, Plus, GitCompare } from 'lucide-react';

interface PartComparison {
  part: any;
  category: PartCategory;
}

interface VisualComparisonGridProps {
  category: PartCategory;
  parts: any[];
  selectedParts: Record<string, any>;
  onSelectPart: (category: string, partId: string) => void;
  className?: string;
}

export const VisualComparisonGrid: React.FC<VisualComparisonGridProps> = ({
  category,
  parts,
  selectedParts,
  onSelectPart,
  className = ''
}) => {
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<PartComparison[]>([]);

  // Get high-importance specs for this category
  const highImportanceSpecs = useMemo(() => {
    return getSpecsForCategory(category)
      .filter(({ definition }) => definition.importance === 'high')
      .sort((a, b) => (a.definition.order || 999) - (b.definition.order || 999))
      .slice(0, 8); // Limit to top 8 specs for readability
  }, [category]);

  // Toggle comparison mode
  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    setSelectedForComparison([]);
  };

  // Add/remove part from comparison
  const togglePartComparison = (part: any) => {
    const existingIndex = selectedForComparison.findIndex(p => p.part.id === part.id);
    
    if (existingIndex >= 0) {
      // Remove from comparison
      setSelectedForComparison(prev => prev.filter((_, index) => index !== existingIndex));
    } else if (selectedForComparison.length < 4) {
      // Add to comparison (max 4 parts)
      setSelectedForComparison(prev => [...prev, { part, category }]);
    }
  };

  // Get comparison value with formatting
  const getComparisonValue = (part: any, specKey: string, definition: any) => {
    const value = getSpecValue(part, specKey);
    
    if (value === undefined || value === null) {
      return { display: '-', numeric: null };
    }

    let display = String(value);
    let numeric: number | null = null;

    if (definition.type === 'number') {
      numeric = Number(value);
      if (definition.unit) {
        display = `${numeric}${definition.unit}`;
      }
    } else if (definition.type === 'boolean') {
      display = value ? 'Yes' : 'No';
    }

    return { display, numeric };
  };

  // Determine best/worst values for numeric specs
  const getSpecExtremes = (specKey: string, definition: any) => {
    if (definition.type !== 'number') return null;

    const values = selectedForComparison
      .map(({ part }) => getSpecValue(part, specKey))
      .filter(val => typeof val === 'number' && !isNaN(val));

    if (values.length === 0) return null;

    // For some specs, higher is better (cores, clock speed, etc.)
    // For others, lower is better (TDP, price, etc.)
    const higherIsBetter = ['cores', 'threads', 'boost_clock_ghz', 'base_clock_ghz', 
                           'memory_clock_mhz', 'core_clock_mhz', 'boost_clock_mhz',
                           'vram_gb', 'size_gb', 'capacity_tb', 'usb_ports', 'usb_c_ports',
                           'display_ports', 'hdmi_ports', 'ethernet_ports', 'pcie_slots',
                           'sata_ports', 'm2_slots', 'fan_count'].includes(specKey);

    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      best: higherIsBetter ? max : min,
      worst: higherIsBetter ? min : max,
      higherIsBetter
    };
  };

  // Get cell styling based on value comparison
  const getCellStyle = (value: any, extremes: any, definition: any) => {
    if (!extremes || value.numeric === null) {
      return 'text-text-muted';
    }

    if (value.numeric === extremes.best) {
      return 'text-green-400 font-medium';
    } else if (value.numeric === extremes.worst) {
      return 'text-text-muted opacity-60';
    }

    return 'text-text-primary';
  };

  if (!compareMode) {
    // Show compare mode toggle
    return (
      <div className={`flex justify-center ${className}`}>
        <button
          onClick={toggleCompareMode}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-border/20 bg-surface-1/30 hover:border-accent/40 hover:bg-surface-1/60 transition-all"
        >
          <GitCompare className="w-4 h-4 text-accent" />
          <span className="text-sm text-text-primary">Compare Parts</span>
        </button>
      </div>
    );
  }

  if (selectedForComparison.length === 0) {
    // Show empty comparison state
    return (
      <Card variant="glass" className={`p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-text-primary flex items-center space-x-2">
            <GitCompare className="w-4 h-4 text-accent" />
            <span>Compare Parts</span>
          </h3>
          <button
            onClick={toggleCompareMode}
            className="text-text-muted hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-text-muted text-sm mb-4">
            Select 2-4 parts to compare their specifications side by side
          </p>
          <p className="text-text-muted text-xs">
            Click on parts below to add them to comparison
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Comparison Grid */}
      <Card variant="glass" className={`overflow-hidden shadow-glass ${className}`}>
        <div className="flex items-center justify-between p-4 border-b border-border/10 bg-surface-1/10">
          <h3 className="font-medium text-text-primary flex items-center space-x-2">
            <GitCompare className="w-4 h-4 text-accent" />
            <span>Comparing {selectedForComparison.length} Parts</span>
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedForComparison([])}
              className="text-xs text-text-muted hover:text-text-primary"
            >
              Clear All
            </button>
            <button
              onClick={toggleCompareMode}
              className="text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/10">
                <th className="text-left p-4 text-sm font-medium text-text-primary w-48">
                  Specification
                </th>
                {selectedForComparison.map(({ part }, index) => (
                  <th key={part.id} className="text-left p-4">
                    <div className="space-y-2">
                      <button
                        onClick={() => togglePartComparison(part)}
                        className="ml-auto block text-text-muted hover:text-text-primary"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="text-sm font-medium text-text-primary truncate max-w-32">
                        {part.name}
                      </div>
                      <div className="text-xs text-text-muted">
                        {part.brand}
                      </div>
                      {part.price && (
                        <div className="text-sm font-medium text-accent">
                          ${part.price}
                        </div>
                      )}
                      <button
                        onClick={() => onSelectPart(category, part.id)}
                        className="flex items-center space-x-1 px-2 py-1 text-xs rounded border border-accent/50 bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add to Build</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Basic Info Row */}
              <tr className="border-b border-border/5">
                <td className="p-4 text-sm font-medium text-text-primary">
                  Basic Info
                </td>
                {selectedForComparison.map(({ part }) => (
                  <td key={part.id} className="p-4">
                    <div className="space-y-1 text-xs">
                      <div className="text-text-primary">
                        {part.brand} {part.name}
                      </div>
                      {selectedParts[category]?.id === part.id && (
                        <Badge variant="success" className="text-xs">
                          Currently Selected
                        </Badge>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Spec Rows */}
              {highImportanceSpecs.map(({ key, definition }) => {
                const extremes = getSpecExtremes(key, definition);
                
                return (
                  <tr key={key} className="border-b border-border/5">
                    <td className="p-4 text-sm font-medium text-text-primary">
                      {definition.label}
                      {definition.unit && (
                        <span className="text-text-muted ml-1">({definition.unit})</span>
                      )}
                    </td>
                    {selectedForComparison.map(({ part }) => {
                      const value = getComparisonValue(part, key, definition);
                      const cellStyle = getCellStyle(value, extremes, definition);
                      
                      return (
                        <td key={part.id} className={`p-4 text-sm ${cellStyle}`}>
                          {value.display}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Part Selection Helper */}
      <Card variant="glass" className="mt-4 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-text-primary">
            {selectedForComparison.length < 4 ? (
              <span>Click on parts below to add them to comparison ({4 - selectedForComparison.length} slots remaining)</span>
            ) : (
              <span className="text-accent">Maximum 4 parts selected</span>
            )}
          </div>
          <button
            onClick={toggleCompareMode}
            className="text-sm text-text-muted hover:text-text-primary"
          >
            Exit Compare Mode
          </button>
        </div>
      </Card>
    </>
  );
};
