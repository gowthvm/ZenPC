'use client';

import React, { useMemo } from 'react';

interface InsightsPanelProps {
  selectedParts: Record<string, any>;
}

export default function InsightsPanel({ selectedParts }: InsightsPanelProps) {
  const insights = useMemo(() => {
    const totalPrice = Object.values(selectedParts).reduce(
      (sum, part: any) => sum + (part?.price || 0),
      0
    );

    const partsCount = Object.values(selectedParts).filter(p => p).length;
    const hasAllRequired = partsCount === 7;

    // Calculate estimated power draw (rough estimates)
    const cpuPower = selectedParts.cpu?.data?.power_draw || selectedParts.cpu?.power_draw || 65;
    const gpuPower = selectedParts.gpu?.data?.power_draw || selectedParts.gpu?.power_draw || 200;
    const otherPower = 100;
    const totalPowerDraw = cpuPower + gpuPower + otherPower;
    const recommendedPSU = Math.ceil(totalPowerDraw * 1.3 / 50) * 50;

    return {
      totalPrice,
      partsCount,
      hasAllRequired,
      totalPowerDraw,
      recommendedPSU,
    };
  }, [selectedParts]);

  const warnings = useMemo(() => {
    const warns: Array<{ type: 'warning' | 'info' | 'error'; message: string; icon: string }> = [];

    if (!selectedParts.cpu && selectedParts.gpu) {
      warns.push({
        type: 'error',
        message: 'CPU is required before finalizing your build',
        icon: '❌',
      });
    }

    if (!selectedParts.motherboard) {
      warns.push({
        type: 'warning',
        message: 'Motherboard not selected - required for CPU compatibility',
        icon: '⚠️',
      });
    }

    if (selectedParts.motherboard && selectedParts.cpu) {
      // Basic compatibility check - socket info is in data field
      const cpuSocket = selectedParts.cpu.data?.socket || selectedParts.cpu.socket;
      const motherboardSocket = selectedParts.motherboard.data?.socket || selectedParts.motherboard.socket;
      
      if (cpuSocket && motherboardSocket && cpuSocket !== motherboardSocket) {
        warns.push({
          type: 'error',
          message: `Socket mismatch: CPU requires ${cpuSocket} but motherboard has ${motherboardSocket}`,
          icon: '🔴',
        });
      }
    }

    const psuWattage = selectedParts.psu?.data?.wattage || selectedParts.psu?.wattage;
    if (psuWattage && psuWattage < insights.totalPowerDraw) {
      warns.push({
        type: 'error',
        message: `Insufficient PSU power: ${insights.totalPowerDraw}W needed, ${psuWattage}W available`,
        icon: '⚡',
      });
    }

    const ramCapacity = selectedParts.ram?.data?.capacity_gb || selectedParts.ram?.capacity || selectedParts.ram?.data?.capacity;
    if (ramCapacity && ramCapacity < 16) {
      warns.push({
        type: 'info',
        message: 'Consider upgrading to 16GB RAM for better performance in modern applications',
        icon: 'ℹ️',
      });
    }

    if (!selectedParts.case) {
      warns.push({
        type: 'info',
        message: 'Case will affect component clearance and cooling efficiency',
        icon: 'ℹ️',
      });
    }

    return warns;
  }, [selectedParts, insights]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-accent/20 hover:border-accent/40 hover:bg-surface-1/75 transition-all duration-200 ease-premium shadow-glass">
          <p className="text-sm text-text-muted mb-2">Build Completion</p>
          <p className="text-3xl font-semibold text-accent">
            {Math.round((insights.partsCount / 7) * 100)}%
          </p>
          <p className="text-xs text-text-muted mt-2">{insights.partsCount} of 7 parts</p>
        </div>

        <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-purple-600/40 hover:bg-surface-1/75 transition-all duration-200 ease-premium shadow-glass">
          <p className="text-sm text-text-muted mb-2">Total Estimated Cost</p>
          <p className="text-3xl font-semibold text-text-primary">
            ${insights.totalPrice.toFixed(2)}
          </p>
          <p className="text-xs text-text-muted mt-2">USD</p>
        </div>

        <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-blue-500/40 hover:bg-surface-1/75 transition-all duration-200 ease-premium shadow-glass">
          <p className="text-sm text-text-muted mb-2">Power Draw</p>
          <p className="text-3xl font-semibold text-blue-300">
            {insights.totalPowerDraw}W
          </p>
          <p className="text-xs text-text-muted mt-2">estimated</p>
        </div>

        <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-green-500/40 hover:bg-surface-1/75 transition-all duration-200 ease-premium shadow-glass">
          <p className="text-sm text-text-muted mb-2">Recommended PSU</p>
          <p className="text-3xl font-semibold text-green-300">
            {insights.recommendedPSU}W
          </p>
          <p className="text-xs text-text-muted mt-2">with headroom</p>
        </div>
      </div>

      {/* Warnings & Checks */}
      <div className="space-y-3">
        <h3 className="font-display text-lg font-semibold text-text-primary">Compatibility Checks</h3>
        {warnings.length === 0 ? (
          <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-green-500/30 flex gap-3 hover:bg-surface-1/75 transition-all duration-200 ease-premium shadow-glass">
            <span className="text-2xl flex-shrink-0">✅</span>
            <div>
              <p className="font-medium text-text-primary">All Checks Passed</p>
              <p className="text-sm text-text-muted mt-1">
                Your build configuration is compatible and ready to go!
              </p>
            </div>
          </div>
        ) : (
          warnings.map((warning, index) => (
            <div
              key={index}
              className={`
                p-4 rounded-lg border flex gap-3 transition-all duration-200 ease-premium hover:bg-opacity-75
                ${
                  warning.type === 'error'
                    ? 'bg-red-500/15 border-red-500/30 backdrop-blur-sm'
                    : warning.type === 'warning'
                      ? 'bg-yellow-500/15 border-yellow-500/30 backdrop-blur-sm'
                      : 'bg-blue-500/15 border-blue-500/30 backdrop-blur-sm'
                }
              `}
            >
              <span className="text-2xl flex-shrink-0">{warning.icon}</span>
              <div>
                <p className="font-medium text-text-primary text-sm">{warning.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Component Details */}
      <div className="space-y-3">
        <h3 className="font-display text-lg font-semibold text-text-primary">Selected Components</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedParts.cpu && (
            <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 hover:bg-surface-1/75 transition-all duration-200 ease-premium shadow-glass">
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">CPU</p>
              <p className="font-medium text-text-primary">{selectedParts.cpu.name}</p>
              <div className="text-xs text-text-muted mt-2 space-y-1">
                {selectedParts.cpu.data?.cores && <p>• {selectedParts.cpu.data.cores} cores</p>}
                {selectedParts.cpu.data?.boost_clock && <p>• {selectedParts.cpu.data.boost_clock} GHz boost</p>}
                {selectedParts.cpu.price && <p className="text-accent font-medium">${selectedParts.cpu.price}</p>}
              </div>
            </div>
          )}

          {selectedParts.gpu && (
            <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 hover:bg-surface-1/75 transition-all duration-200 ease-premium shadow-glass">
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">GPU</p>
              <p className="font-medium text-text-primary">{selectedParts.gpu.name}</p>
              <div className="text-xs text-text-muted mt-2 space-y-1">
                {selectedParts.gpu.data?.vram_gb && <p>• {selectedParts.gpu.data.vram_gb}GB VRAM</p>}
                {selectedParts.gpu.data?.memory_type && <p>• {selectedParts.gpu.data.memory_type}</p>}
                {selectedParts.gpu.price && <p className="text-accent font-medium">${selectedParts.gpu.price}</p>}
              </div>
            </div>
          )}

          {selectedParts.ram && (
            <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 hover:bg-surface-1/75 transition-all duration-200 ease-premium shadow-glass">
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">RAM</p>
              <p className="font-medium text-text-primary">{selectedParts.ram.name}</p>
              <div className="text-xs text-text-muted mt-2 space-y-1">
                {selectedParts.ram.data?.capacity_gb && <p>• {selectedParts.ram.data.capacity_gb}GB capacity</p>}
                {selectedParts.ram.data?.speed_mhz && <p>• {selectedParts.ram.data.speed_mhz}MHz speed</p>}
                {selectedParts.ram.price && <p className="text-accent font-medium">${selectedParts.ram.price}</p>}
              </div>
            </div>
          )}

          {selectedParts.storage && (
            <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 hover:bg-surface-1/75 transition-all duration-200 ease-premium shadow-glass">
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">Storage</p>
              <p className="font-medium text-text-primary">{selectedParts.storage.name}</p>
              <div className="text-xs text-text-muted mt-2 space-y-1">
                {selectedParts.storage.data?.capacity_gb && <p>• {selectedParts.storage.data.capacity_gb}GB capacity</p>}
                {selectedParts.storage.data?.type && <p>• {selectedParts.storage.data.type}</p>}
                {selectedParts.storage.price && <p className="text-accent font-medium">${selectedParts.storage.price}</p>}
              </div>
            </div>
          )}

          {selectedParts.psu && (
            <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 hover:bg-surface-1/75 transition-all duration-200 ease-premium shadow-glass">
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">Power Supply</p>
              <p className="font-medium text-text-primary">{selectedParts.psu.name}</p>
              <div className="text-xs text-text-muted mt-2 space-y-1">
                {selectedParts.psu.data?.wattage && <p>• {selectedParts.psu.data.wattage}W capacity</p>}
                {selectedParts.psu.data?.efficiency_rating && <p>• {selectedParts.psu.data.efficiency_rating} rated</p>}
                {selectedParts.psu.price && <p className="text-accent font-medium">${selectedParts.psu.price}</p>}
              </div>
            </div>
          )}

          {selectedParts.motherboard && (
            <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 hover:bg-surface-1/75 transition-all duration-200 ease-premium shadow-glass">
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">Motherboard</p>
              <p className="font-medium text-text-primary">{selectedParts.motherboard.name}</p>
              <div className="text-xs text-text-muted mt-2 space-y-1">
                {selectedParts.motherboard.data?.socket && <p>• {selectedParts.motherboard.data.socket} socket</p>}
                {selectedParts.motherboard.data?.form_factor && <p>• {selectedParts.motherboard.data.form_factor}</p>}
                {selectedParts.motherboard.price && <p className="text-accent font-medium">${selectedParts.motherboard.price}</p>}
              </div>
            </div>
          )}

          {selectedParts.case && (
            <div className="p-4 rounded-lg bg-surface-1/55 backdrop-blur-glass border border-border/10 hover:border-accent/20 hover:bg-surface-1/75 transition-all duration-200 ease-premium shadow-glass">
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">Case</p>
              <p className="font-medium text-text-primary">{selectedParts.case.name}</p>
              <div className="text-xs text-text-muted mt-2 space-y-1">
                {selectedParts.case.form_factor && <p>• {selectedParts.case.form_factor}</p>}
                {selectedParts.case.cooling_slots && <p>• {selectedParts.case.cooling_slots} fan slots</p>}
                {selectedParts.case.price && <p className="text-accent font-medium">${selectedParts.case.price}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
