'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useBuilderStore } from '@/store/builder';
import { analyzeBottlenecks } from '@/lib/bottleneckAnalysis';
import { getSpecValue, getSpecsForCategory, getSpecsByImportance } from '@/lib/specDictionary';
import { evaluateCompatibility } from '@/lib/compatibilityEngine';
import { fetchParts } from '@/lib/supabaseParts';

interface UpgradeOption {
  part: any;
  category: string;
  improvements: string[];
  compatibilityScore: number;
  priceDifference: number;
  performanceGain: number;
}

interface BottleneckUpgrade {
  category: string;
  currentPart: any;
  bottleneckLevel: 'high' | 'medium' | 'low';
  reason: string;
  upgradeOptions: UpgradeOption[];
  futureProofing: {
    headroom: string;
    upgradeSafe: boolean;
    lifespan: string;
  };
}

interface UpgradePathProps {
  className?: string;
  useCaseMode: 'Balanced' | 'Gaming' | 'Productivity' | 'Creator';
}

const PART_CATEGORIES = [
  { key: 'cpu', label: 'CPU', icon: '🔧' },
  { key: 'gpu', label: 'GPU', icon: '🎮' },
  { key: 'motherboard', label: 'Motherboard', icon: '🔌' },
  { key: 'ram', label: 'RAM', icon: '💾' },
  { key: 'storage', label: 'Storage', icon: '💿' },
  { key: 'psu', label: 'PSU', icon: '⚡' },
  { key: 'case', label: 'Case', icon: '📦' },
];

export const UpgradePath: React.FC<UpgradePathProps> = ({ className = '', useCaseMode }) => {
  const { selected, setPart } = useBuilderStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [loadingUpgrades, setLoadingUpgrades] = useState<Record<string, boolean>>({});
  const [upgradeOptions, setUpgradeOptions] = useState<Record<string, UpgradeOption[]>>({});

  // Analyze bottlenecks
  const bottleneckAnalysis = useMemo(() => {
    if (Object.keys(selected).length === 0) return null;
    try {
      return analyzeBottlenecks(selected, useCaseMode.toLowerCase() as any, 'unknown');
    } catch (error) {
      console.error('Error analyzing bottlenecks:', error);
      return null;
    }
  }, [selected, useCaseMode]);

  // Generate upgrade recommendations
  const generateUpgradeOptions = useCallback(async (category: string) => {
    setLoadingUpgrades(prev => ({ ...prev, [category]: true }));
    
    try {
      const { data: parts, error } = await fetchParts(category);
      if (error || !parts) {
        console.error('Error fetching parts for upgrade analysis:', error);
        setLoadingUpgrades(prev => ({ ...prev, [category]: false }));
        return;
      }

      const currentPart = selected[category];
      if (!currentPart) {
        setLoadingUpgrades(prev => ({ ...prev, [category]: false }));
        return;
      }

      const options: UpgradeOption[] = [];
      
      // Filter for better parts (higher performance specs)
      const betterParts = parts.filter((part: any) => {
        if (part.id === currentPart.id) return false;
        
        // Check if it's actually better based on key specs
        const currentSpecs = getSpecsForCategory(category as any);
        let isBetter = false;
        
        for (const { key, definition } of currentSpecs) {
          if (definition.importance === 'high') {
            const currentValue = getSpecValue(currentPart, key);
            const newValue = getSpecValue(part, key);
            
            if (currentValue !== undefined && newValue !== undefined) {
              if (definition.type === 'number' && Number(newValue) > Number(currentValue)) {
                isBetter = true;
                break;
              }
            }
          }
        }
        
        return isBetter;
      });

      // Sort by performance and price
      const sortedParts = betterParts.sort((a: any, b: any) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return priceA - priceB; // Start with cheaper upgrades
      });

      // Take top 5 upgrade options
      for (const part of sortedParts.slice(0, 5)) {
        const improvements: string[] = [];
        const currentSpecs = getSpecsForCategory(category as any);
        
        for (const { key, definition } of currentSpecs) {
          if (definition.importance === 'high') {
            const currentValue = getSpecValue(currentPart, key);
            const newValue = getSpecValue(part, key);
            
            if (currentValue !== undefined && newValue !== undefined) {
              if (definition.type === 'number' && Number(newValue) > Number(currentValue)) {
                const unit = definition.unit || '';
                const improvement = `+${Number(newValue) - Number(currentValue)}${unit} ${definition.label}`;
                improvements.push(improvement);
              }
            }
          }
        }

        // Check compatibility with current build
        const testBuild = { ...selected, [category]: part };
        const compatibilityResult = await evaluateCompatibility(testBuild);
        const compatibilityScore = compatibilityResult.issues.length === 0 ? 100 : 
          Math.max(0, 100 - (compatibilityResult.issues.filter(i => i.severity === 'error').length * 50));

        const priceDifference = (part.price || 0) - (currentPart.price || 0);
        const performanceGain = improvements.length;

        options.push({
          part,
          category,
          improvements,
          compatibilityScore,
          priceDifference,
          performanceGain,
        });
      }

      setUpgradeOptions(prev => ({ ...prev, [category]: options }));
    } catch (error) {
      console.error('Error generating upgrade options:', error);
    } finally {
      setLoadingUpgrades(prev => ({ ...prev, [category]: false }));
    }
  }, [selected]);

  // Calculate future-proofing metrics
  const calculateFutureProofing = useCallback((category: string, part: any) => {
    const metrics = {
      headroom: '',
      upgradeSafe: true,
      lifespan: '',
    };

    switch (category) {
      case 'psu':
        const wattage = getSpecValue(part, 'wattage');
        if (wattage && typeof wattage === 'number') {
          const currentLoad = estimateCurrentPowerUsage();
          const headroom = wattage - currentLoad;
          metrics.headroom = `${headroom}W available`;
          metrics.upgradeSafe = headroom >= 200;
          metrics.lifespan = headroom >= 300 ? 'Excellent' : headroom >= 150 ? 'Good' : 'Limited';
        }
        break;
        
      case 'motherboard':
        const socket = getSpecValue(part, 'socket');
        metrics.headroom = socket ? `Socket ${socket} platform` : 'Unknown platform';
        metrics.upgradeSafe = true;
        metrics.lifespan = '2-3 years typical';
        break;
        
      case 'case':
        const gpuMaxLength = getSpecValue(part, 'gpu_max_length_mm');
        metrics.headroom = gpuMaxLength ? `Supports up to ${gpuMaxLength}mm GPU` : 'Standard support';
        metrics.upgradeSafe = true;
        metrics.lifespan = '5+ years typical';
        break;
        
      default:
        metrics.headroom = 'Standard capacity';
        metrics.upgradeSafe = true;
        metrics.lifespan = '2-4 years typical';
    }

    return metrics;
  }, [selected]);

  // Estimate current power usage
  const estimateCurrentPowerUsage = useCallback(() => {
    const cpu = selected.cpu;
    const gpu = selected.gpu;
    
    const cpuTdp = getSpecValue(cpu, 'tdp_watts') || getSpecValue(cpu, 'tdp_w') || 100;
    const gpuTdp = getSpecValue(gpu, 'tdp_watts') || getSpecValue(gpu, 'tdp_w') || 250;
    
    return cpuTdp + gpuTdp + 150; // Base system overhead
  }, [selected]);

  // Generate bottleneck upgrades
  const bottleneckUpgrades = useMemo(() => {
    if (!bottleneckAnalysis) return [];
    
    const upgrades: BottleneckUpgrade[] = [];
    
    // Process insights to create bottleneck entries
    bottleneckAnalysis.insights.forEach((insight) => {
      if (!insight.component) return;
      
      const part = selected[insight.component];
      if (!part) return;
      
      const futureProofing = calculateFutureProofing(insight.component, part);
      
      // Determine bottleneck level from insight type and severity
      let bottleneckLevel: 'high' | 'medium' | 'low' = 'low';
      if (insight.type === 'bottleneck') {
        bottleneckLevel = 'high';
      } else if (insight.type === 'recommendation') {
        bottleneckLevel = 'medium';
      }
      
      upgrades.push({
        category: insight.component,
        currentPart: part,
        bottleneckLevel,
        reason: insight.message,
        upgradeOptions: upgradeOptions[insight.component] || [],
        futureProofing,
      });
    });
    
    // Add entries for components that don't have insights but are selected
    Object.keys(selected).forEach((category) => {
      if (!upgrades.find(u => u.category === category)) {
        const part = selected[category];
        if (part) {
          const futureProofing = calculateFutureProofing(category, part);
          upgrades.push({
            category,
            currentPart: part,
            bottleneckLevel: 'low',
            reason: 'Component is performing adequately.',
            upgradeOptions: upgradeOptions[category] || [],
            futureProofing,
          });
        }
      }
    });
    
    return upgrades.sort((a: BottleneckUpgrade, b: BottleneckUpgrade) => {
      const severityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.bottleneckLevel] - severityOrder[b.bottleneckLevel];
    });
  }, [bottleneckAnalysis, selected, upgradeOptions, calculateFutureProofing]);

  const handleUpgradePart = useCallback((category: string, part: any) => {
    setPart(category, part);
  }, [setPart]);

  const getBottleneckColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-text-muted bg-surface-2/30 border-border/20';
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-300';
    return 'text-red-400';
  };

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Upgrade Path Planning</h3>
        <div className="text-sm text-text-muted">
          Use Case: <span className="text-accent font-medium">{useCaseMode}</span>
        </div>
      </div>

      {Object.keys(selected).length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <div className="text-4xl mb-4">🚀</div>
          <p>Select parts to see upgrade recommendations</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bottleneckUpgrades.map((upgrade) => {
            const categoryInfo = PART_CATEGORIES.find(c => c.key === upgrade.category);
            const isExpanded = expandedCategory === upgrade.category;
            
            return (
              <div
                key={upgrade.category}
                className="border border-border/20 rounded-lg bg-surface-1/30 backdrop-blur-glass overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-surface-1/50 transition-colors"
                  onClick={() => setExpandedCategory(isExpanded ? null : upgrade.category)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{categoryInfo?.icon}</span>
                      <div>
                        <div className="font-medium text-text-primary">
                          {categoryInfo?.label}
                        </div>
                        <div className="text-sm text-text-muted">
                          {upgrade.currentPart.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBottleneckColor(upgrade.bottleneckLevel)}`}>
                        {upgrade.bottleneckLevel.toUpperCase()} BOTTLENECK
                      </span>
                      <svg
                        className={`w-5 h-5 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-text-muted">
                    {upgrade.reason}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border/20 p-4 space-y-4">
                    {/* Future Proofing */}
                    <div className="p-3 rounded-lg bg-surface-2/30">
                      <h4 className="font-medium text-text-primary mb-2">Future-Proofing Analysis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-text-muted">Headroom:</span>
                          <span className="ml-2 text-text-primary">{upgrade.futureProofing.headroom}</span>
                        </div>
                        <div>
                          <span className="text-text-muted">Upgrade Safe:</span>
                          <span className={`ml-2 ${upgrade.futureProofing.upgradeSafe ? 'text-green-400' : 'text-yellow-300'}`}>
                            {upgrade.futureProofing.upgradeSafe ? 'Yes' : 'Limited'}
                          </span>
                        </div>
                        <div>
                          <span className="text-text-muted">Lifespan:</span>
                          <span className="ml-2 text-text-primary">{upgrade.futureProofing.lifespan}</span>
                        </div>
                      </div>
                    </div>

                    {/* Upgrade Options */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-text-primary">Upgrade Options</h4>
                        <button
                          onClick={() => generateUpgradeOptions(upgrade.category)}
                          disabled={loadingUpgrades[upgrade.category]}
                          className="px-3 py-1 text-xs bg-accent text-accent-fg rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50"
                        >
                          {loadingUpgrades[upgrade.category] ? 'Loading...' : 'Find Upgrades'}
                        </button>
                      </div>

                      {upgrade.upgradeOptions.length > 0 ? (
                        <div className="space-y-3">
                          {upgrade.upgradeOptions.map((option, index) => (
                            <div
                              key={option.part.id}
                              className="p-3 rounded-lg border border-border/20 bg-surface-1/30 hover:bg-surface-1/50 transition-colors cursor-pointer"
                              onClick={() => handleUpgradePart(upgrade.category, option.part)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium text-text-primary">
                                  {option.part.name}
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <span className={getCompatibilityColor(option.compatibilityScore)}>
                                    {option.compatibilityScore}% Compatible
                                  </span>
                                  <span className="text-accent">
                                    {option.priceDifference > 0 ? '+' : ''}${option.priceDifference}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="text-sm text-text-muted">
                                <div className="font-medium mb-1">Improvements:</div>
                                <div className="flex flex-wrap gap-2">
                                  {option.improvements.map((improvement, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs"
                                    >
                                      {improvement}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-text-muted text-sm">
                          {loadingUpgrades[upgrade.category] 
                            ? 'Analyzing upgrade options...' 
                            : 'Click "Find Upgrades" to see available options'
                          }
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
