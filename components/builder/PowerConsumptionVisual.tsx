'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useBuilderStore } from '@/store/builder';
import { getSpecValue } from '@/lib/specDictionary';

interface PowerBreakdown {
  component: string;
  label: string;
  tdp: number;
  percentage: number;
  color: string;
}

interface PowerConsumptionVisualProps {
  className?: string;
}

const COMPONENT_COLORS = {
  cpu: '#3b82f6', // blue
  gpu: '#22c55e', // green
  motherboard: '#f59e0b', // amber
  ram: '#8b5cf6', // violet
  storage: '#ef4444', // red
  case: '#6b7280', // gray
  psu: '#06b6d4', // cyan
  other: '#a855f7', // purple
};

export const PowerConsumptionVisual: React.FC<PowerConsumptionVisualProps> = ({ className = '' }) => {
  const { selected } = useBuilderStore();
  const [showDetails, setShowDetails] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  // Calculate power consumption
  const powerData = useMemo(() => {
    const breakdown: PowerBreakdown[] = [];
    let totalTdp = 0;

    // CPU power
    const cpu = selected.cpu;
    const cpuTdp = getSpecValue(cpu, 'tdp_watts') || getSpecValue(cpu, 'tdp_w') || 0;
    if (cpuTdp > 0) {
      breakdown.push({
        component: 'cpu',
        label: 'CPU',
        tdp: cpuTdp,
        percentage: 0, // Will calculate below
        color: COMPONENT_COLORS.cpu,
      });
      totalTdp += cpuTdp;
    }

    // GPU power
    const gpu = selected.gpu;
    const gpuTdp = getSpecValue(gpu, 'tdp_watts') || getSpecValue(gpu, 'tdp_w') || 0;
    if (gpuTdp > 0) {
      breakdown.push({
        component: 'gpu',
        label: 'GPU',
        tdp: gpuTdp,
        percentage: 0,
        color: COMPONENT_COLORS.gpu,
      });
      totalTdp += gpuTdp;
    }

    // Motherboard power (estimated)
    if (selected.motherboard) {
      const motherboardTdp = 50; // Typical motherboard power
      breakdown.push({
        component: 'motherboard',
        label: 'Motherboard',
        tdp: motherboardTdp,
        percentage: 0,
        color: COMPONENT_COLORS.motherboard,
      });
      totalTdp += motherboardTdp;
    }

    // RAM power (estimated)
    if (selected.ram) {
      const ramTdp = 5 * (getSpecValue(selected.ram, 'size_gb') || 16); // ~5W per 16GB
      breakdown.push({
        component: 'ram',
        label: 'RAM',
        tdp: ramTdp,
        percentage: 0,
        color: COMPONENT_COLORS.ram,
      });
      totalTdp += ramTdp;
    }

    // Storage power (estimated)
    if (selected.storage) {
      const storageType = getSpecValue(selected.storage, 'type');
      const storageTdp = storageType?.toString().toLowerCase().includes('ssd') ? 8 : 12;
      breakdown.push({
        component: 'storage',
        label: 'Storage',
        tdp: storageTdp,
        percentage: 0,
        color: COMPONENT_COLORS.storage,
      });
      totalTdp += storageTdp;
    }

    // Case fans (estimated)
    if (selected.case) {
      const fanCount = getSpecValue(selected.case, 'fan_count') || 3;
      const caseTdp = fanCount * 3; // ~3W per fan
      breakdown.push({
        component: 'case',
        label: 'Case Fans',
        tdp: caseTdp,
        percentage: 0,
        color: COMPONENT_COLORS.case,
      });
      totalTdp += caseTdp;
    }

    // Calculate percentages
    breakdown.forEach(item => {
      item.percentage = totalTdp > 0 ? (item.tdp / totalTdp) * 100 : 0;
    });

    // Base system overhead and safety margins
    const baseOverhead = 30; // USB controllers, audio, etc.
    const safetyMargin = 0.25; // 25% safety margin
    const spikeAllowance = Math.max(cpuTdp, gpuTdp) * 0.5; // 50% of max component TDP for spikes

    const estimatedLoad = totalTdp + baseOverhead;
    const recommendedPSU = Math.ceil((estimatedLoad + spikeAllowance) * (1 + safetyMargin) / 50) * 50; // Round up to nearest 50W

    const psu = selected.psu;
    const psuWattage = getSpecValue(psu, 'wattage') || 0;
    const headroom = psuWattage - estimatedLoad;
    const efficiencyRating = getSpecValue(psu, 'efficiency_rating') || 'Unknown';

    return {
      breakdown,
      totalTdp,
      baseOverhead,
      estimatedLoad,
      spikeAllowance,
      recommendedPSU,
      psuWattage,
      headroom,
      efficiencyRating,
    };
  }, [selected]);

  // Animate values on mount and when data changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const newAnimatedValues: Record<string, number> = {};
      powerData.breakdown.forEach(item => {
        newAnimatedValues[item.component] = item.percentage;
      });
      setAnimatedValues(newAnimatedValues);
    }, 100);
    return () => clearTimeout(timer);
  }, [powerData.breakdown]);

  // Determine PSU status
  const getPSUStatus = useCallback(() => {
    if (!powerData.psuWattage) {
      return {
        status: 'none',
        label: 'No PSU Selected',
        color: 'text-text-muted',
        bgColor: 'bg-surface-2/30',
        borderColor: 'border-border/20',
        message: 'Select a power supply to see compatibility.',
      };
    }

    const utilizationPercent = (powerData.estimatedLoad / powerData.psuWattage) * 100;
    
    if (utilizationPercent > 90) {
      return {
        status: 'insufficient',
        label: 'Insufficient',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        message: `PSU is at ${utilizationPercent.toFixed(0)}% capacity. Consider a higher wattage PSU.`,
      };
    } else if (utilizationPercent > 75) {
      return {
        status: 'borderline',
        label: 'Borderline',
        color: 'text-yellow-300',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        message: `PSU is at ${utilizationPercent.toFixed(0)}% capacity. Limited headroom for upgrades.`,
      };
    } else {
      return {
        status: 'sufficient',
        label: 'Sufficient',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        message: `PSU is at ${utilizationPercent.toFixed(0)}% capacity. Good headroom available.`,
      };
    }
  }, [powerData]);

  const psuStatus = getPSUStatus();

  // Create donut chart segments
  const createDonutPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = 150 + innerRadius * Math.cos(startAngleRad);
    const y1 = 150 + innerRadius * Math.sin(startAngleRad);
    const x2 = 150 + outerRadius * Math.cos(startAngleRad);
    const y2 = 150 + outerRadius * Math.sin(startAngleRad);
    const x3 = 150 + outerRadius * Math.cos(endAngleRad);
    const y3 = 150 + outerRadius * Math.sin(endAngleRad);
    const x4 = 150 + innerRadius * Math.cos(endAngleRad);
    const y4 = 150 + innerRadius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`;
  };

  let currentAngle = -90; // Start from top

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Power Consumption Analysis</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-accent hover:text-accent/80 transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {powerData.breakdown.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <div className="text-4xl mb-4">⚡</div>
          <p>Select components to see power consumption</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Donut Chart */}
          <div className="flex justify-center">
            <div className="relative">
              <svg width="300" height="300" viewBox="0 0 300 300" className="w-full h-auto max-w-xs">
                {powerData.breakdown.map((item, index) => {
                  const percentage = animatedValues[item.component] || 0;
                  const angle = (percentage / 100) * 360;
                  const endAngle = currentAngle + angle;
                  
                  const path = createDonutPath(currentAngle, endAngle, 60, 120);
                  currentAngle = endAngle;
                  
                  return (
                    <g key={item.component}>
                      <path
                        d={path}
                        fill={item.color}
                        stroke="rgb(var(--surface-1))"
                        strokeWidth="2"
                        className="transition-all duration-1000 ease-out"
                        style={{ opacity: percentage > 0 ? 1 : 0 }}
                      />
                      {percentage > 5 && (
                        <text
                          x={150 + 90 * Math.cos(((currentAngle - angle/2) * Math.PI) / 180)}
                          y={150 + 90 * Math.sin(((currentAngle - angle/2) * Math.PI) / 180)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-white text-xs font-medium pointer-events-none"
                        >
                          {`${percentage.toFixed(0)}%`}
                        </text>
                      )}
                    </g>
                  );
                })}
                
                {/* Center text */}
                <text x="150" y="140" textAnchor="middle" className="fill-text-primary text-2xl font-bold">
                  {powerData.estimatedLoad}W
                </text>
                <text x="150" y="160" textAnchor="middle" className="fill-text-muted text-xs">
                  Estimated Load
                </text>
              </svg>
            </div>
          </div>

          {/* PSU Status */}
          <div className={`p-4 rounded-lg border ${psuStatus.bgColor} ${psuStatus.borderColor}`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-text-primary">Power Supply Status</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${psuStatus.color} ${psuStatus.bgColor} border ${psuStatus.borderColor}`}>
                {psuStatus.label}
              </span>
            </div>
            
            {powerData.psuWattage > 0 && (
              <div className="space-y-3">
                {/* Progress bar */}
                <div className="relative">
                  <div className="w-full bg-surface-3 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                        psuStatus.status === 'insufficient' ? 'bg-red-500' :
                        psuStatus.status === 'borderline' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((powerData.estimatedLoad / powerData.psuWattage) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>{powerData.estimatedLoad}W used</span>
                    <span>{powerData.psuWattage}W total</span>
                  </div>
                </div>
                
                <p className="text-sm text-text-muted">{psuStatus.message}</p>
                
                {powerData.headroom > 0 && (
                  <div className="text-sm">
                    <span className="text-text-muted">Headroom: </span>
                    <span className={powerData.headroom < 100 ? 'text-yellow-300' : 'text-green-400'}>
                      {powerData.headroom}W available
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Detailed Breakdown */}
          {showDetails && (
            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">Power Breakdown</h4>
              
              <div className="space-y-2">
                {powerData.breakdown.map((item) => (
                  <div key={item.component} className="flex items-center justify-between p-3 rounded-lg bg-surface-2/30">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-text-primary">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-text-primary">{item.tdp}W</div>
                      <div className="text-xs text-text-muted">{item.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-border/20 pt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Base Overhead</span>
                    <span className="text-text-primary">{powerData.baseOverhead}W</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Spike Allowance</span>
                    <span className="text-text-primary">{powerData.spikeAllowance.toFixed(0)}W</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-text-primary">Recommended PSU</span>
                    <span className="text-accent">{powerData.recommendedPSU}W</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
