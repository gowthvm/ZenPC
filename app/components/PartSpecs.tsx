/**
 * PartSpecs Component
 * 
 * Dynamically renders part specifications from Supabase data using the Spec Dictionary.
 * No hardcoded specs - everything is driven by data + dictionary.
 */

'use client';

import { useMemo } from 'react';
import { 
  SPEC_DICTIONARY, 
  SPEC_GROUP_ORDER, 
  IMPORTANCE_ORDER,
  getSpecDefinition,
  type SpecGroup,
  type PartCategory 
} from '@/lib/specDictionary';

interface PartSpecsProps {
  part: any;
  category: PartCategory;
  className?: string;
  showLowImportance?: boolean;
  collapsedGroups?: SpecGroup[];
}

/**
 * Extract spec value from part data structure
 */
function getSpecValue(part: any, specKey: string): any {
  if (!part) return undefined;
  
  // Try nested data structure first (Supabase format)
  if (part.data && typeof part.data === 'object') {
    // Check if it's grouped (e.g., data.performance.boost_clock_ghz)
    const groups = ['performance', 'compatibility', 'power', 'physical', 'memory', 'connectivity', 'features'];
    for (const group of groups) {
      if (part.data[group] && part.data[group][specKey] !== undefined) {
        return part.data[group][specKey];
      }
    }
    // Check flat structure in data
    if (part.data[specKey] !== undefined) {
      return part.data[specKey];
    }
  }
  
  // Try flat structure on part itself (backward compatibility)
  if (part[specKey] !== undefined) {
    return part[specKey];
  }
  
  return undefined;
}

/**
 * Format spec value for display
 */
function formatSpecValue(value: any, unit: string | null, type: string): string {
  if (value === undefined || value === null) return '';
  
  if (type === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (type === 'number') {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    // Format with appropriate decimal places
    if (num % 1 === 0) {
      return `${num}${unit ? ` ${unit}` : ''}`;
    }
    return `${num.toFixed(2)}${unit ? ` ${unit}` : ''}`;
  }
  
  return `${value}${unit ? ` ${unit}` : ''}`;
}

export default function PartSpecs({ 
  part, 
  category, 
  className = '',
  showLowImportance = false,
  collapsedGroups = []
}: PartSpecsProps) {
  const groupedSpecs = useMemo(() => {
    if (!part) return {} as Record<SpecGroup, Array<{ key: string; value: any; definition: any }>>;
    
    const groups: Record<SpecGroup, Array<{ key: string; value: any; definition: any }>> = {
      performance: [],
      compatibility: [],
      power: [],
      physical: [],
      memory: [],
      connectivity: [],
      features: []
    };
    
    // Iterate through all specs in the dictionary
    Object.entries(SPEC_DICTIONARY).forEach(([key, definition]) => {
      // Only include specs applicable to this category
      if (!definition.categories.includes(category)) return;
      
      // Check importance filter
      if (!showLowImportance && definition.importance === 'low') return;
      
      // Get value from part
      const value = getSpecValue(part, key);
      
      // Only include if value exists
      if (value !== undefined && value !== null) {
        groups[definition.group].push({ key, value, definition });
      }
    });
    
    // Sort each group by importance
    Object.keys(groups).forEach((group) => {
      groups[group as SpecGroup].sort((a, b) => {
        const aImportance = IMPORTANCE_ORDER.indexOf(a.definition.importance);
        const bImportance = IMPORTANCE_ORDER.indexOf(b.definition.importance);
        return aImportance - bImportance;
      });
    });
    
    return groups as Record<SpecGroup, Array<{ key: string; value: any; definition: any }>>;
  }, [part, category, showLowImportance]);
  
  if (!part) {
    return (
      <div className={`text-sm text-text-muted ${className}`}>
        No part selected
      </div>
    );
  }
  
  const hasAnySpecs = Object.values(groupedSpecs).some((group: unknown) => (group as Array<{ key: string; value: any; definition: any }>).length > 0);
  
  if (!hasAnySpecs) {
    return (
      <div className={`text-sm text-text-muted ${className}`}>
        No specifications available
      </div>
    );
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      {SPEC_GROUP_ORDER.map((group) => {
        const specs = groupedSpecs[group as SpecGroup];
        if (specs.length === 0) return null;
        
        const isCollapsed = collapsedGroups.includes(group);
        const highImportanceSpecs = specs.filter((s: { key: string; value: any; definition: any }) => s.definition.importance === 'high');
        const otherSpecs = specs.filter((s: { key: string; value: any; definition: any }) => s.definition.importance !== 'high');
        
        return (
          <div
            key={group}
            className="rounded-lg border border-border/20 bg-surface-1/30 backdrop-blur-glass p-4 shadow-glass/20"
          >
            <h4 className="text-sm font-semibold text-text-primary mb-3 capitalize">
              {group}
            </h4>
            
            <div className="space-y-2">
              {/* High importance specs - always visible */}
              {highImportanceSpecs.map(({ key, value, definition }: { key: string; value: any; definition: any }) => (
                <div
                  key={key}
                  className="flex items-start justify-between py-1.5 border-b border-border/10 last:border-0"
                >
                  <div className="flex-1">
                    <div className="text-xs font-medium text-text-primary">
                      {definition.label}
                    </div>
                    {definition.description && (
                      <div className="text-xs text-text-muted mt-0.5">
                        {definition.description}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-accent ml-4">
                    {formatSpecValue(value, definition.unit, definition.type)}
                  </div>
                </div>
              ))}
              
              {/* Other specs - collapsible if group is collapsed */}
              {!isCollapsed && otherSpecs.length > 0 && (
                <div className="space-y-2 mt-2 pt-2 border-t border-border/10">
                  {otherSpecs.map(({ key, value, definition }: { key: string; value: any; definition: any }) => (
                    <div
                      key={key}
                      className="flex items-start justify-between py-1"
                    >
                      <div className="flex-1">
                        <div className="text-xs text-text-muted">
                          {definition.label}
                        </div>
                      </div>
                      <div className="text-xs text-text-primary ml-4">
                        {formatSpecValue(value, definition.unit, definition.type)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Compact version for inline display
 */
export function PartSpecsCompact({ 
  part, 
  category,
  maxSpecs = 3
}: { 
  part: any; 
  category: PartCategory;
  maxSpecs?: number;
}) {
  const topSpecs = useMemo(() => {
    if (!part) return [];
    
    const specs: Array<{ key: string; value: any; definition: any }> = [];
    
    Object.entries(SPEC_DICTIONARY).forEach(([key, definition]) => {
      if (!definition.categories.includes(category)) return;
      if (definition.importance !== 'high') return;
      
      const value = getSpecValue(part, key);
      if (value !== undefined && value !== null) {
        specs.push({ key, value, definition });
      }
    });
    
    // Sort by importance and take top N
    specs.sort((a, b) => {
      const aImportance = IMPORTANCE_ORDER.indexOf(a.definition.importance);
      const bImportance = IMPORTANCE_ORDER.indexOf(b.definition.importance);
      return aImportance - bImportance;
    });
    
    return specs.slice(0, maxSpecs);
  }, [part, category, maxSpecs]);
  
  if (topSpecs.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {topSpecs.map(({ key, value, definition }) => (
        <span
          key={key}
          className="px-2 py-1 rounded-md bg-surface-1/40 border border-border/20 text-text-muted"
        >
          <span className="font-medium text-text-primary">{definition.label}:</span>{' '}
          {formatSpecValue(value, definition.unit, definition.type)}
        </span>
      ))}
    </div>
  );
}
