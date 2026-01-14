import React from 'react';

export type ProgressProps = {
  value: number; // 0–100
  className?: string;
};

export function Progress({ value, className = '' }: ProgressProps) {
  return (
    <div className={`w-full h-2 rounded-lg bg-surface-2/70 overflow-hidden ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="h-full bg-accent transition-all duration-slow ease-premium"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
