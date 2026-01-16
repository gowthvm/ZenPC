'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { getSpecValue, getSpecsForCategory, type PartCategory } from '@/lib/specDictionary';
import { evaluateCompatibility } from '@/lib/compatibilityEngine';
import { Badge } from '@/components/ui/Badge';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  specFilters: Record<string, {
    type: 'range' | 'equals' | 'boolean';
    value: any;
    min?: number;
    max?: number;
  }>;
  compatibilityOnly: boolean;
}

interface SmartFiltersProps {
  category: PartCategory;
  parts: any[];
  selectedParts: Record<string, any>;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

const DEFAULT_FILTERS: FilterState = {
  priceRange: [0, 5000],
  brands: [],
  specFilters: {},
  compatibilityOnly: false
};

export const SmartFilters: React.FC<SmartFiltersProps> = ({
  category,
  parts,
  selectedParts,
  onFiltersChange,
  className = ''
}) => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isExpanded, setIsExpanded] = useState(false);
  const [compatibilityIssues, setCompatibilityIssues] = useState<Set<string>>(new Set());

  // Get unique brands for this category
  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    parts.forEach(part => {
      if (part.brand) brandSet.add(part.brand);
    });
    return Array.from(brandSet).sort();
  }, [parts]);

  // Get spec definitions for this category
  const specDefinitions = useMemo(() => {
    return getSpecsForCategory(category)
      .filter(({ definition }) => definition.importance === 'high' || definition.importance === 'medium')
      .sort((a, b) => {
        const importanceOrder = { high: 0, medium: 1, low: 2 };
        const aImportance = importanceOrder[a.definition.importance as keyof typeof importanceOrder];
        const bImportance = importanceOrder[b.definition.importance as keyof typeof importanceOrder];
        if (aImportance !== bImportance) return aImportance - bImportance;
        return (a.definition.order || 999) - (b.definition.order || 999);
      });
  }, [category]);

  // Calculate price range from available parts
  const priceRange = useMemo(() => {
    const prices = parts
      .filter(part => typeof part.price === 'number')
      .map(part => part.price);
    
    if (prices.length === 0) return [0, 1000];
    return [Math.min(...prices), Math.max(...prices)];
  }, [parts]);

  // Check compatibility for parts
  const checkCompatibility = useCallback(async (part: any) => {
    const testBuild = { ...selectedParts, [category]: part };
    try {
      const result = await evaluateCompatibility(testBuild);
      return result.issues.filter(issue => issue.severity === 'error').length === 0;
    } catch {
      return true; // Assume compatible if check fails
    }
  }, [selectedParts, category]);

  // Update filters and notify parent
  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  }, [onFiltersChange]);

  // Handle price range change
  const handlePriceRangeChange = useCallback((index: number, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    updateFilters({ ...filters, priceRange: newRange });
  }, [filters, updateFilters]);

  // Handle brand selection
  const handleBrandToggle = useCallback((brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    updateFilters({ ...filters, brands: newBrands });
  }, [filters, updateFilters]);

  // Handle spec filter change
  const handleSpecFilterChange = useCallback((specKey: string, filterValue: any) => {
    const newSpecFilters = { ...filters.specFilters };
    if (filterValue === null || filterValue === undefined || filterValue === '') {
      delete newSpecFilters[specKey];
    } else {
      const specDef = specDefinitions.find(s => s.key === specKey)?.definition;
      if (specDef) {
        newSpecFilters[specKey] = {
          type: specDef.type === 'number' ? 'range' : specDef.type === 'boolean' ? 'boolean' : 'equals',
          value: filterValue
        };
      }
    }
    updateFilters({ ...filters, specFilters: newSpecFilters });
  }, [filters, specDefinitions, updateFilters]);

  // Handle range spec filter change
  const handleRangeSpecFilterChange = useCallback((specKey: string, min: number, max: number) => {
    const newSpecFilters = { ...filters.specFilters };
    newSpecFilters[specKey] = { type: 'range', value: null, min, max };
    updateFilters({ ...filters, specFilters: newSpecFilters });
  }, [filters, updateFilters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    updateFilters(DEFAULT_FILTERS);
  }, [updateFilters]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] > priceRange[0] || filters.priceRange[1] < priceRange[1]) count++;
    if (filters.brands.length > 0) count++;
    if (filters.compatibilityOnly) count++;
    count += Object.keys(filters.specFilters).length;
    return count;
  }, [filters, priceRange]);

  // Render range slider
  const renderRangeSlider = (specKey: string, definition: any) => {
    const values = parts
      .map(part => getSpecValue(part, specKey))
      .filter(val => typeof val === 'number' && !isNaN(val));
    
    if (values.length === 0) return null;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const currentFilter = filters.specFilters[specKey];

    return (
      <div key={specKey} className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-primary">
            {definition.label}
            {definition.unit && <span className="text-text-muted ml-1">({definition.unit})</span>}
          </label>
          {currentFilter && (
            <button
              onClick={() => handleSpecFilterChange(specKey, null)}
              className="text-xs text-text-muted hover:text-text-primary"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min={min}
            max={max}
            value={currentFilter?.min ?? min}
            onChange={(e) => {
              const newMin = Number(e.target.value);
              const currentMax = currentFilter?.max ?? max;
              handleRangeSpecFilterChange(specKey, newMin, currentMax);
            }}
            className="w-20 px-2 py-1 text-xs rounded border border-border/20 bg-surface-1/50 text-text-primary"
            placeholder="Min"
          />
          <span className="text-text-muted">-</span>
          <input
            type="number"
            min={min}
            max={max}
            value={currentFilter?.max ?? max}
            onChange={(e) => {
              const newMax = Number(e.target.value);
              const currentMin = currentFilter?.min ?? min;
              handleRangeSpecFilterChange(specKey, currentMin, newMax);
            }}
            className="w-20 px-2 py-1 text-xs rounded border border-border/20 bg-surface-1/50 text-text-primary"
            placeholder="Max"
          />
        </div>
      </div>
    );
  };

  // Render boolean toggle
  const renderBooleanToggle = (specKey: string, definition: any) => {
    const currentFilter = filters.specFilters[specKey];
    
    return (
      <div key={specKey} className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-primary">
          {definition.label}
        </label>
        <button
          onClick={() => {
            const currentValue = currentFilter?.value;
            handleSpecFilterChange(specKey, currentValue === true ? false : currentValue === false ? null : true);
          }}
          className={`
            relative inline-flex h-5 w-9 items-center rounded-full transition-colors
            ${currentFilter?.value === true ? 'bg-accent' : 'bg-surface-2'}
          `}
        >
          <span
            className={`
              inline-block h-3 w-3 transform rounded-full bg-white transition-transform
              ${currentFilter?.value === true ? 'translate-x-5' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
    );
  };

  // Render dropdown/multi-select
  const renderDropdown = (specKey: string, definition: any) => {
    const values = parts
      .map(part => getSpecValue(part, specKey))
      .filter(val => val !== undefined && val !== null && val !== '');
    
    const uniqueValues = Array.from(new Set(values.map(String))).sort();
    const currentFilter = filters.specFilters[specKey];

    if (uniqueValues.length === 0) return null;
    if (uniqueValues.length <= 6) {
      // Render as radio buttons for small sets
      return (
        <div key={specKey} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">
              {definition.label}
            </label>
            {currentFilter && (
              <button
                onClick={() => handleSpecFilterChange(specKey, null)}
                className="text-xs text-text-muted hover:text-text-primary"
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {uniqueValues.map(value => (
              <label key={value} className="flex items-center space-x-2 text-xs">
                <input
                  type="radio"
                  name={specKey}
                  checked={currentFilter?.value === value}
                  onChange={() => handleSpecFilterChange(specKey, value)}
                  className="rounded border-border/20 bg-surface-1/50"
                />
                <span className="text-text-primary">{value}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    // Render as dropdown for larger sets
    return (
      <div key={specKey} className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-primary">
            {definition.label}
          </label>
          {currentFilter && (
            <button
              onClick={() => handleSpecFilterChange(specKey, null)}
              className="text-xs text-text-muted hover:text-text-primary"
            >
              Clear
            </button>
          )}
        </div>
        <select
          value={currentFilter?.value ?? ''}
          onChange={(e) => handleSpecFilterChange(specKey, e.target.value || null)}
          className="w-full px-2 py-1 text-xs rounded border border-border/20 bg-surface-1/50 text-text-primary"
        >
          <option value="">All {definition.label}s</option>
          {uniqueValues.map(value => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <Card variant="glass" className={`overflow-hidden shadow-glass ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-1/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-accent" />
          <h3 className="font-medium text-text-primary">Smart Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="success" className="text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              className="text-xs text-text-muted hover:text-text-primary"
            >
              Clear All
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-muted" />
          )}
        </div>
      </div>

      {/* Filters Content */}
      {isExpanded && (
        <div className="border-t border-border/10 p-4 space-y-6">
          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-primary">
                Price Range
              </label>
              {(filters.priceRange[0] > priceRange[0] || filters.priceRange[1] < priceRange[1]) && (
                <button
                  onClick={() => handlePriceRangeChange(0, priceRange[0])}
                  className="text-xs text-text-muted hover:text-text-primary"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={priceRange[0]}
                max={priceRange[1]}
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                className="w-24 px-2 py-1 text-xs rounded border border-border/20 bg-surface-1/50 text-text-primary"
                placeholder="Min"
              />
              <span className="text-text-muted">-</span>
              <input
                type="number"
                min={priceRange[0]}
                max={priceRange[1]}
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                className="w-24 px-2 py-1 text-xs rounded border border-border/20 bg-surface-1/50 text-text-primary"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Brands */}
          {brands.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-primary">
                  Brands
                </label>
                {filters.brands.length > 0 && (
                  <button
                    onClick={() => updateFilters({ ...filters, brands: [] })}
                    className="text-xs text-text-muted hover:text-text-primary"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => handleBrandToggle(brand)}
                    className={`
                      px-2 py-1 text-xs rounded border transition-colors
                      ${filters.brands.includes(brand)
                        ? 'border-accent/50 bg-accent/10 text-accent'
                        : 'border-border/20 bg-surface-1/30 text-text-primary hover:border-border/40'
                      }
                    `}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Compatibility Filter */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">
              Hide Incompatible Parts
            </label>
            <button
              onClick={() => updateFilters({ ...filters, compatibilityOnly: !filters.compatibilityOnly })}
              className={`
                relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                ${filters.compatibilityOnly ? 'bg-accent' : 'bg-surface-2'}
              `}
            >
              <span
                className={`
                  inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                  ${filters.compatibilityOnly ? 'translate-x-5' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          {/* Spec Filters */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-text-primary">Specifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specDefinitions.map(({ key, definition }) => {
                if (definition.type === 'number') {
                  return renderRangeSlider(key, definition);
                } else if (definition.type === 'boolean') {
                  return renderBooleanToggle(key, definition);
                } else {
                  return renderDropdown(key, definition);
                }
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
