'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { getSpecValue, getSpecsForCategory, type PartCategory } from '@/lib/specDictionary';
import { evaluateCompatibility } from '@/lib/compatibilityEngine';
import { Badge } from '@/components/ui/Badge';
import { Zap, Gamepad2, Palette, DollarSign, Gauge, VolumeX, Check, X } from 'lucide-react';

interface BuildTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  useCase: 'gaming' | 'content-creation' | 'budget' | 'performance' | 'silent';
  budgetRange: { min: number; max: number };
  specPriorities: {
    category: PartCategory;
    prioritySpecs: string[];
    weight: number; // 1-10, how important this category is for the template
  }[];
}

interface QuickAddTemplatesProps {
  partsByCategory: Record<string, any[]>;
  selectedParts: Record<string, any>;
  onSelectParts: (parts: Record<string, any>) => void;
  className?: string;
}

// Template definitions based on use cases
const BUILD_TEMPLATES: BuildTemplate[] = [
  {
    id: 'gaming-focused',
    name: 'Gaming Focused',
    description: 'Optimized for high frame rates and smooth gaming experience',
    icon: Gamepad2,
    useCase: 'gaming',
    budgetRange: { min: 800, max: 2000 },
    specPriorities: [
      { category: 'gpu', prioritySpecs: ['vram_gb', 'core_clock_mhz', 'boost_clock_mhz'], weight: 10 },
      { category: 'cpu', prioritySpecs: ['cores', 'boost_clock_ghz'], weight: 7 },
      { category: 'ram', prioritySpecs: ['size_gb', 'ram_speed_mhz'], weight: 6 },
      { category: 'psu', prioritySpecs: ['wattage', 'efficiency_rating'], weight: 5 },
      { category: 'motherboard', prioritySpecs: ['pcie_slots'], weight: 4 },
      { category: 'storage', prioritySpecs: ['read_speed_mbps', 'type'], weight: 5 },
      { category: 'case', prioritySpecs: ['gpu_max_length_mm'], weight: 3 }
    ]
  },
  {
    id: 'content-creation',
    name: 'Content Creation',
    description: 'Balanced for rendering, video editing, and creative workflows',
    icon: Palette,
    useCase: 'content-creation',
    budgetRange: { min: 1200, max: 3000 },
    specPriorities: [
      { category: 'cpu', prioritySpecs: ['cores', 'threads', 'boost_clock_ghz'], weight: 10 },
      { category: 'ram', prioritySpecs: ['size_gb', 'ram_speed_mhz'], weight: 9 },
      { category: 'gpu', prioritySpecs: ['vram_gb', 'core_clock_mhz'], weight: 8 },
      { category: 'storage', prioritySpecs: ['read_speed_mbps', 'write_speed_mbps', 'size_gb'], weight: 7 },
      { category: 'motherboard', prioritySpecs: ['m2_slots', 'ram_speed_mhz'], weight: 5 },
      { category: 'psu', prioritySpecs: ['wattage', 'efficiency_rating'], weight: 6 },
      { category: 'case', prioritySpecs: ['gpu_max_length_mm'], weight: 3 }
    ]
  },
  {
    id: 'budget-build',
    name: 'Budget Build',
    description: 'Maximum value for money without compromising essentials',
    icon: DollarSign,
    useCase: 'budget',
    budgetRange: { min: 500, max: 1000 },
    specPriorities: [
      { category: 'cpu', prioritySpecs: ['cores'], weight: 6 },
      { category: 'gpu', prioritySpecs: ['vram_gb'], weight: 7 },
      { category: 'ram', prioritySpecs: ['size_gb'], weight: 5 },
      { category: 'storage', prioritySpecs: ['size_gb', 'type'], weight: 6 },
      { category: 'motherboard', prioritySpecs: ['memory_type'], weight: 4 },
      { category: 'psu', prioritySpecs: ['wattage'], weight: 5 },
      { category: 'case', prioritySpecs: ['form_factor'], weight: 3 }
    ]
  },
  {
    id: 'performance-first',
    name: 'Performance First',
    description: 'No compromises - maximum performance for demanding tasks',
    icon: Gauge,
    useCase: 'performance',
    budgetRange: { min: 2000, max: 5000 },
    specPriorities: [
      { category: 'cpu', prioritySpecs: ['cores', 'threads', 'boost_clock_ghz'], weight: 10 },
      { category: 'gpu', prioritySpecs: ['vram_gb', 'core_clock_mhz', 'boost_clock_mhz'], weight: 10 },
      { category: 'ram', prioritySpecs: ['size_gb', 'ram_speed_mhz'], weight: 8 },
      { category: 'storage', prioritySpecs: ['read_speed_mbps', 'write_speed_mbps'], weight: 7 },
      { category: 'psu', prioritySpecs: ['wattage', 'efficiency_rating'], weight: 6 },
      { category: 'motherboard', prioritySpecs: ['pcie_slots', 'm2_slots'], weight: 5 },
      { category: 'case', prioritySpecs: ['gpu_max_length_mm', 'fan_count'], weight: 4 }
    ]
  },
  {
    id: 'silent-build',
    name: 'Silent Build',
    description: 'Quiet operation with efficient cooling and low-noise components',
    icon: VolumeX,
    useCase: 'silent',
    budgetRange: { min: 1000, max: 2500 },
    specPriorities: [
      { category: 'cpu', prioritySpecs: ['tdp_watts'], weight: 8 }, // Lower TDP is better
      { category: 'gpu', prioritySpecs: ['tdp_watts'], weight: 8 }, // Lower TDP is better
      { category: 'case', prioritySpecs: ['fan_count'], weight: 7 },
      { category: 'psu', prioritySpecs: ['efficiency_rating'], weight: 9 },
      { category: 'motherboard', prioritySpecs: ['wifi', 'bluetooth'], weight: 5 },
      { category: 'storage', prioritySpecs: ['type'], weight: 6 }, // Prefer SSD for silence
      { category: 'ram', prioritySpecs: ['size_gb'], weight: 5 }
    ]
  }
];

export const QuickAddTemplates: React.FC<QuickAddTemplatesProps> = ({
  partsByCategory,
  selectedParts,
  onSelectParts,
  className = ''
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationResult, setApplicationResult] = useState<{
    success: boolean;
    message: string;
    appliedParts: Record<string, any>;
  } | null>(null);

  // Calculate part score based on template priorities
  const calculatePartScore = (part: any, category: PartCategory, template: BuildTemplate): number => {
    const categoryPriority = template.specPriorities.find(p => p.category === category);
    if (!categoryPriority) return 0;

    let score = 0;
    let totalWeight = 0;

    categoryPriority.prioritySpecs.forEach(specKey => {
      const specDef = getSpecsForCategory(category).find(s => s.key === specKey)?.definition;
      if (!specDef) return;

      const value = getSpecValue(part, specKey);
      if (value === undefined || value === null) return;

      let normalizedScore = 0;

      if (specDef.type === 'number') {
        const numValue = Number(value);
        if (isNaN(numValue)) return;

        // For some specs, lower is better (TDP, power consumption)
        const lowerIsBetter = ['tdp_watts', 'tdp_w'].includes(specKey);
        
        // Normalize to 0-100 scale based on typical ranges
        if (specKey === 'cores' || specKey === 'threads') {
          normalizedScore = Math.min((numValue / 16) * 100, 100); // 16 cores = 100%
        } else if (specKey.includes('ghz')) {
          normalizedScore = Math.min((numValue / 5.0) * 100, 100); // 5GHz = 100%
        } else if (specKey.includes('mhz')) {
          normalizedScore = Math.min((numValue / 6000) * 100, 100); // 6000MHz = 100%
        } else if (specKey.includes('gb') || specKey.includes('tb')) {
          normalizedScore = Math.min((numValue / 32) * 100, 100); // 32GB/TB = 100%
        } else if (specKey.includes('watts') || specKey.includes('wattage')) {
          normalizedScore = lowerIsBetter 
            ? Math.max(100 - (numValue / 300) * 100, 0) // 300W = 0%
            : Math.min((numValue / 1000) * 100, 100); // 1000W = 100%
        } else {
          normalizedScore = Math.min((numValue / 10) * 100, 100); // Generic scaling
        }

        if (lowerIsBetter) {
          normalizedScore = 100 - normalizedScore;
        }
      } else if (specDef.type === 'boolean') {
        normalizedScore = value ? 100 : 0;
      } else if (specDef.type === 'string') {
        // For string specs, check if it's a desirable value
        const desirableValues = {
          'type': ['NVMe', 'SSD'],
          'memory_type': ['DDR5', 'DDR4'],
          'efficiency_rating': ['Titanium', 'Platinum', 'Gold', 'Silver', 'Bronze'],
          'modular': ['Full', 'Semi', 'Yes']
        };

        const values = desirableValues[specKey as keyof typeof desirableValues] || [];
        const index = values.findIndex(v => String(value).toLowerCase().includes(v.toLowerCase()));
        normalizedScore = index >= 0 ? ((values.length - index) / values.length) * 100 : 50;
      }

      score += normalizedScore * categoryPriority.weight;
      totalWeight += categoryPriority.weight;
    });

    return totalWeight > 0 ? score / totalWeight : 0;
  };

  // Find best parts for a template
  const findBestPartsForTemplate = async (template: BuildTemplate): Promise<Record<string, any>> => {
    const selectedParts: Record<string, any> = {};
    const budgetTarget = (template.budgetRange.min + template.budgetRange.max) / 2;
    
    // Sort categories by priority (highest weight first)
    const sortedCategories = template.specPriorities
      .sort((a, b) => b.weight - a.weight)
      .map(p => p.category);

    for (const category of sortedCategories) {
      const parts = partsByCategory[category] || [];
      if (parts.length === 0) continue;

      // Score and sort parts
      const scoredParts = parts
        .map(part => ({
          part,
          score: calculatePartScore(part, category, template),
          price: typeof part.price === 'number' ? part.price : 0
        }))
        .filter(item => item.score > 0)
        .sort((a, b) => {
          // Balance score with price (prefer better value)
          const scoreDiff = b.score - a.score;
          const priceDiff = a.price - b.price;
          return scoreDiff * 0.7 + priceDiff * 0.3; // Weight score higher than price
        });

      if (scoredParts.length > 0) {
        // Try top 3 parts for compatibility
        for (let i = 0; i < Math.min(3, scoredParts.length); i++) {
          const testParts = { ...selectedParts, [category]: scoredParts[i].part };
          
          try {
            const compatibility = await evaluateCompatibility(testParts);
            const hasErrors = compatibility.issues.some(issue => issue.severity === 'error');
            
            if (!hasErrors) {
              selectedParts[category] = scoredParts[i].part;
              break;
            } else if (i === 2) {
              // If all top 3 have errors, pick the one with least issues
              const errorCounts = await Promise.all(
                scoredParts.slice(0, 3).map(async (item) => {
                  const testParts = { ...selectedParts, [category]: item.part };
                  const compatibility = await evaluateCompatibility(testParts);
                  return {
                    item,
                    errorCount: compatibility.issues.filter(issue => issue.severity === 'error').length
                  };
                })
              );
              
              const bestFit = errorCounts.reduce((min, curr) => 
                curr.errorCount < min.errorCount ? curr : min
              );
              
              selectedParts[category] = bestFit.item.part;
            }
          } catch (error) {
            console.error('Error checking compatibility:', error);
            // Fallback to first part if compatibility check fails
            selectedParts[category] = scoredParts[i].part;
            break;
          }
        }
      }
    }

    return selectedParts;
  };

  // Apply template
  const applyTemplate = async (template: BuildTemplate) => {
    setIsApplying(true);
    setApplicationResult(null);

    try {
      const parts = await findBestPartsForTemplate(template);
      
      if (Object.keys(parts).length === 0) {
        setApplicationResult({
          success: false,
          message: 'No compatible parts found for this template.',
          appliedParts: {}
        });
        return;
      }

      // Calculate total cost
      const totalCost = Object.values(parts).reduce((sum, part) => {
        const price = typeof part.price === 'number' ? part.price : 0;
        return sum + price;
      }, 0);

      const success = totalCost <= template.budgetRange.max;
      
      setApplicationResult({
        success,
        message: success 
          ? `Template applied successfully! Total cost: $${totalCost.toFixed(2)}`
          : `Template applied but exceeds budget ($${totalCost.toFixed(2)} > $${template.budgetRange.max}). Consider adjusting components.`,
        appliedParts: parts
      });

      if (success) {
        onSelectParts(parts);
      }
    } catch (error) {
      console.error('Error applying template:', error);
      setApplicationResult({
        success: false,
        message: 'Failed to apply template. Please try again.',
        appliedParts: {}
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="w-5 h-5 text-accent" />
        <h3 className="font-medium text-text-primary">Quick Add Templates</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {BUILD_TEMPLATES.map(template => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;
          
          return (
            <Card 
              key={template.id}
              variant="glass"
              className={`
                cursor-pointer transition-all hover:border-accent/40 hover:shadow-glass
                ${isSelected ? 'border-accent/50 bg-accent/5 shadow-glass' : 'border-border/20'}
              `}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 text-accent mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">{template.name}</h4>
                    <p className="text-xs text-text-muted mt-1">{template.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    ${template.budgetRange.min} - ${template.budgetRange.max}
                  </span>
                  {isSelected && (
                    <Badge variant="success" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>

                {isSelected && (
                  <div className="pt-3 border-t border-border/10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        applyTemplate(template);
                      }}
                      disabled={isApplying}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm rounded border border-accent/50 bg-accent/10 text-accent hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isApplying ? (
                        <>
                          <div className="w-3 h-3 border border-accent border-t-transparent rounded-full animate-spin" />
                          <span>Applying...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Apply Template</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Application Result */}
      {applicationResult && (
        <Card variant="glass" className={`p-4 shadow-glass ${
          applicationResult.success ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              applicationResult.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {applicationResult.success ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </div>
            <div className="flex-1">
              <p className={`text-sm ${
                applicationResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {applicationResult.message}
              </p>
              {!applicationResult.success && Object.keys(applicationResult.appliedParts).length > 0 && (
                <button
                  onClick={() => onSelectParts(applicationResult.appliedParts)}
                  className="mt-2 text-xs text-accent hover:text-accent/80"
                >
                  Apply anyway (with warnings)
                </button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
