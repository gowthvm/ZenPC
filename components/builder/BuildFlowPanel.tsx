'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useBuilderStore } from '@/store/builder';
import { supabase } from '@/lib/supabaseClient';
import { evaluateCompatibility } from '@/lib/compatibilityEngine';
import CompatibilityIssueDisplay from './CompatibilityIssueDisplay';
import type { CompatibilityIssue } from '@/lib/compatibilityEngine';

const BUILD_ORDER = [
  { key: 'cpu', label: 'CPU', icon: '🔧' },
  { key: 'motherboard', label: 'Motherboard', icon: '🔌' },
  { key: 'ram', label: 'RAM', icon: '💾' },
  { key: 'gpu', label: 'GPU', icon: '🎮' },
  { key: 'storage', label: 'Storage', icon: '💿' },
  { key: 'psu', label: 'Power Supply', icon: '⚡' },
  { key: 'case', label: 'Case', icon: '📦' },
];

interface BuildFlowPanelProps {
  onSave: (buildName: string) => void;
  buildName?: string;
}

export default function BuildFlowPanel({ onSave, buildName }: BuildFlowPanelProps) {
  const builderStore = useBuilderStore();
  const [activeCategory, setActiveCategory] = useState('cpu');
  const [parts, setParts] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [saveName, setSaveName] = useState(buildName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [compatibilityIssues, setCompatibilityIssues] = useState<CompatibilityIssue[]>([]);
  const [evaluatingCompatibility, setEvaluatingCompatibility] = useState(false);

  // Load parts for active category
  useEffect(() => {
    const loadParts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('parts')
          .select('*')
          .eq('category', activeCategory)
          .order('name', { ascending: true });

        if (error) {
        console.error('Error loading parts:', error);
        console.log('Active category:', activeCategory);
      } else {
        console.log(`Loaded ${data?.length || 0} parts for category: ${activeCategory}`);
      }
        setParts(prev => ({
          ...prev,
          [activeCategory]: data || [],
        }));
      } catch (error) {
        console.error('Error loading parts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParts();
  }, [activeCategory]);

  // Evaluate compatibility whenever parts change
  useEffect(() => {
    const evaluateCompatibilityIssues = async () => {
      try {
        setEvaluatingCompatibility(true);
        const result = await evaluateCompatibility(builderStore.selected);
        setCompatibilityIssues(result.issues || []);
      } catch (error) {
        console.error('Error evaluating compatibility:', error);
        setCompatibilityIssues([]);
      } finally {
        setEvaluatingCompatibility(false);
      }
    };

    // Only evaluate if at least one part is selected
    if (Object.values(builderStore.selected).some(part => part)) {
      evaluateCompatibilityIssues();
    } else {
      setCompatibilityIssues([]);
    }
  }, [builderStore.selected]);

  const filteredParts = useMemo(() => {
    const categoryParts = parts[activeCategory] || [];
    if (!searchQuery) return categoryParts;
    
    return categoryParts.filter(part =>
      part.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [parts, activeCategory, searchQuery]);

  const handleSelectPart = (part: any) => {
    builderStore.setPart(activeCategory, part);
  };

  const handleRemovePart = () => {
    builderStore.setPart(activeCategory, undefined);
  };

  const handleSaveBuild = () => {
    if (saveName.trim()) {
      onSave(saveName);
      alert('Build saved successfully!');
    }
  };

  const selectedPart = builderStore.selected[activeCategory];
  const completedSteps = Object.entries(builderStore.selected).filter(([_, part]) => part).length;
  const totalSteps = BUILD_ORDER.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Part Categories */}
      <div className="lg:col-span-1">
        <div className="space-y-3">
          {/* Progress */}
          <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 transition-all duration-200 ease-premium shadow-glass">
            <p className="text-sm font-medium text-text-muted mb-3">Build Progress</p>
            <div className="bg-surface-2/50 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-accent to-purple-600 transition-all duration-300 ease-premium"
                style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
              />
            </div>
            <p className="text-xs text-text-muted">
              {completedSteps} of {totalSteps} components selected
            </p>
          </div>

          {/* Category List */}
          <div className="space-y-2">
            {BUILD_ORDER.map((category) => {
              const isSelected = activeCategory === category.key;
              const hasSelected = !!builderStore.selected[category.key];

              return (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`
                    w-full px-4 py-3 rounded-lg text-left transition-all duration-200 ease-premium
                    flex items-center justify-between gap-3
                    ${
                      isSelected
                        ? 'bg-accent/15 border border-accent/30 shadow-md'
                        : 'bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-border/30 hover:bg-surface-1/75 shadow-glass'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium text-sm text-text-primary">
                      {category.label}
                    </span>
                  </div>
                  {hasSelected && (
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center Column - Part Selection */}
      <div className="lg:col-span-1">
        <div className="space-y-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
              {BUILD_ORDER.find(c => c.key === activeCategory)?.label} Selection
            </h2>

            {/* Search */}
            <input
              type="text"
              placeholder="Search parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10
                text-text-primary placeholder-text-muted/50
                focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10
                transition-all duration-200 ease-premium mb-4 shadow-glass"
            />

            {/* Part List */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface-3/30">
              {loading ? (
                <div className="text-center py-8 text-text-muted">
                  <p>Loading parts...</p>
                </div>
              ) : filteredParts.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  <p>No parts found</p>
                </div>
              ) : (
                filteredParts.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => handleSelectPart(part)}
                    className={`
                      w-full p-3 rounded-lg border text-left transition-all duration-200 ease-premium
                      ${
                        selectedPart?.id === part.id
                          ? 'bg-accent/15 border-accent/30 shadow-md'
                          : 'bg-surface-1/55 backdrop-blur-glass border-border/10 hover:border-accent/30 hover:bg-surface-1/75 shadow-glass'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-text-primary truncate">
                          {part.name}
                        </p>
                        {part.brand && (
                          <p className="text-xs text-text-muted mt-1">{part.brand}</p>
                        )}
                      </div>
                      {part.price && (
                        <p className="font-medium text-sm text-accent flex-shrink-0">
                          ${part.price}
                        </p>
                      )}
                    </div>
                    {selectedPart?.id === part.id && (
                      <div className="text-xs text-green-300 mt-2">✓ Selected</div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Build Summary & Save */}
      <div className="lg:col-span-1">
        <div className="space-y-4 sticky top-0">
          {/* Compatibility Status - Full Details for Errors */}
          {compatibilityIssues.length > 0 && (
            <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-red-500/20 hover:border-red-500/40 transition-all duration-200 ease-premium shadow-glass">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🔍</span>
                <h3 className="font-medium text-text-primary">
                  Compatibility Check ({compatibilityIssues.length} issue{compatibilityIssues.length !== 1 ? 's' : ''})
                </h3>
              </div>
              <CompatibilityIssueDisplay 
                issues={compatibilityIssues}
                compact={false}
                expandedByDefault={true}
              />
            </div>
          )}

          {/* Current Selection */}
          <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 transition-all duration-200 ease-premium shadow-glass">
            <h3 className="font-medium text-sm text-text-muted mb-3">Current Selection</h3>
            {selectedPart ? (
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-surface-1/75 backdrop-blur-sm border border-accent/20 hover:border-accent/30 transition-all duration-200">
                  <p className="text-sm font-medium text-text-primary">{selectedPart.name}</p>
                  {selectedPart.brand && (
                    <p className="text-xs text-text-muted mt-1">{selectedPart.brand}</p>
                  )}
                  {selectedPart.price && (
                    <p className="text-sm font-medium text-accent mt-2">${selectedPart.price}</p>
                  )}
                </div>
                <button
                  onClick={handleRemovePart}
                  className="w-full px-3 py-2 text-xs font-medium text-red-300
                    hover:bg-red-500/20 rounded-lg border border-red-500/30 transition-all duration-200 ease-premium"
                >
                  Remove Selection
                </button>
              </div>
            ) : (
              <p className="text-xs text-text-muted">No part selected</p>
            )}
          </div>

          {/* Build Summary */}
          <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 transition-all duration-200 ease-premium shadow-glass">
            <h3 className="font-medium text-sm text-text-muted mb-3">Build Summary</h3>
            <div className="space-y-2">
              {BUILD_ORDER.map((category) => {
                const part = builderStore.selected[category.key];
                return (
                  <div
                    key={category.key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-text-muted">{category.label}</span>
                    {part ? (
                      <span className="text-text-primary font-medium truncate ml-2">
                        {part.name}
                      </span>
                    ) : (
                      <span className="text-text-muted/50">—</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total Price */}
            <div className="border-t border-border/10 mt-3 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-text-primary">Total Estimated</span>
                <span className="font-display text-lg font-semibold text-accent">
                  ${Object.values(builderStore.selected).reduce((sum, part) => sum + (part?.price || 0), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Save Build */}
          <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 transition-all duration-200 ease-premium shadow-glass space-y-3">
            <input
              type="text"
              placeholder="Build name..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-surface-1/75 backdrop-blur-sm border border-border/10
                text-text-primary placeholder-text-muted/50
                focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10
                transition-all duration-200 ease-premium text-sm"
            />
            {/* Show compatibility error status */}
            {compatibilityIssues.some(i => i.severity === 'error') && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
                <span className="text-red-400 flex-shrink-0 mt-0.5">🔴</span>
                <p className="text-xs text-red-300">
                  Fix compatibility issues before saving ({compatibilityIssues.filter(i => i.severity === 'error').length} error{compatibilityIssues.filter(i => i.severity === 'error').length !== 1 ? 's' : ''})
                </p>
              </div>
            )}
            <button
              onClick={handleSaveBuild}
              disabled={!saveName.trim() || compatibilityIssues.some(i => i.severity === 'error')}
              className={`
                w-full px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ease-premium
                ${
                  saveName.trim() && !compatibilityIssues.some(i => i.severity === 'error')
                    ? 'bg-gradient-to-r from-accent to-purple-600 text-white hover:shadow-lg hover:shadow-accent/20 active:scale-95'
                    : 'bg-surface-2/30 text-text-muted/50 cursor-not-allowed'
                }
              `}
            >
              {isSaving ? 'Saving...' : compatibilityIssues.some(i => i.severity === 'error') ? '🔴 Fix Issues to Save' : 'Save Build'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
