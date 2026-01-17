/**
 * Enhanced Builder Page with Real-Time Compatibility Validation
 * 
 * Displays the build flow with real-time compatibility checking
 * Shows errors, warnings, and tips as users build their PC
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useBuilderStore } from '@/store/builder';
import { evaluateCompatibility } from '@/lib/compatibilityEngine';
import CompatibilityIssueDisplay from '@/components/builder/CompatibilityIssueDisplay';
import BuildFlowPanel from '@/components/builder/BuildFlowPanel';
import type { CompatibilityIssue } from '@/lib/compatibilityEngine';

export default function BuilderPage() {
  const builderStore = useBuilderStore();
  const [compatibilityIssues, setCompatibilityIssues] = useState<CompatibilityIssue[]>([]);
  const [evaluatingCompatibility, setEvaluatingCompatibility] = useState(false);
  const [showDetailedIssues, setShowDetailedIssues] = useState(true);

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

  const hasErrors = compatibilityIssues.some(i => i.severity === 'error');
  const hasWarnings = compatibilityIssues.some(i => i.severity === 'warning');
  const hasInfos = compatibilityIssues.some(i => i.severity === 'info');

  const handleSaveBuild = async (buildName: string) => {
    // Check for errors before saving
    if (hasErrors) {
      alert('⚠️ Cannot save build with compatibility errors. Please fix the issues first.');
      return;
    }

    try {
      // Save build logic here
      console.log('Saving build:', buildName);
      alert('✅ Build saved successfully!');
    } catch (error) {
      console.error('Error saving build:', error);
      alert('❌ Failed to save build');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-2/20 to-background">
      {/* Header with Compatibility Status */}
      <div className="sticky top-0 z-40 border-b border-border/10 bg-background/80 backdrop-blur-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-text-primary">PC Builder</h1>
              <p className="text-sm text-text-muted mt-1">
                Build your perfect PC with real-time compatibility checking
              </p>
            </div>

            {/* Compatibility Status Badge */}
            {Object.values(builderStore.selected).some(part => part) && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/20 bg-surface-1/50 backdrop-blur-sm">
                {evaluatingCompatibility ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full" />
                    <span className="text-sm text-text-muted">Checking...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {hasErrors && (
                      <div className="flex items-center gap-1 text-red-500">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-sm font-medium">{compatibilityIssues.filter(i => i.severity === 'error').length} Issue{compatibilityIssues.filter(i => i.severity === 'error').length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {hasWarnings && !hasErrors && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-sm font-medium">{compatibilityIssues.filter(i => i.severity === 'warning').length} Warning{compatibilityIssues.filter(i => i.severity === 'warning').length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {!hasErrors && !hasWarnings && compatibilityIssues.length > 0 && (
                      <div className="flex items-center gap-1 text-blue-500">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium">{compatibilityIssues.length} Tip{compatibilityIssues.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {compatibilityIssues.length === 0 && (
                      <div className="flex items-center gap-1 text-green-500">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm font-medium">All compatible</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Full Compatibility Details Panel */}
        {showDetailedIssues && compatibilityIssues.length > 0 && (
          <div className="mb-8 p-6 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-border/20 transition-all duration-200 ease-premium shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-text-primary">
                Compatibility Details
              </h2>
              <button
                onClick={() => setShowDetailedIssues(false)}
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                Collapse
              </button>
            </div>
            <CompatibilityIssueDisplay 
              issues={compatibilityIssues}
              expandedByDefault={hasErrors}
            />
          </div>
        )}

        {/* Build Flow Panel */}
        <div className="p-6 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-border/20 transition-all duration-200 ease-premium shadow-glass">
          <BuildFlowPanel onSave={handleSaveBuild} />
        </div>
      </div>
    </div>
  );
}
