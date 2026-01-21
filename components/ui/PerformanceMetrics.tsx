'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Cpu, Gauge, Zap, Thermometer, TrendingUp } from 'lucide-react';

export interface PerformanceMetric {
    label: string;
    value: number;
    maxValue: number;
    unit?: string;
    icon?: React.ReactNode;
    color?: 'accent' | 'green' | 'amber' | 'red' | 'blue' | 'purple';
}

export interface PerformanceMetricsProps {
    metrics: PerformanceMetric[];
    title?: string;
    layout?: 'horizontal' | 'vertical' | 'grid';
    showLabels?: boolean;
    animated?: boolean;
    className?: string;
}

const colorClasses = {
    accent: { bar: 'from-accent to-indigo-600', text: 'text-accent', glow: 'shadow-glow-sm' },
    green: { bar: 'from-green-500 to-emerald-600', text: 'text-green-400', glow: 'shadow-glow-success' },
    amber: { bar: 'from-amber-500 to-orange-600', text: 'text-amber-400', glow: 'shadow-glow-warning' },
    red: { bar: 'from-red-500 to-rose-600', text: 'text-red-400', glow: 'shadow-glow-error' },
    blue: { bar: 'from-blue-500 to-cyan-600', text: 'text-blue-400', glow: '' },
    purple: { bar: 'from-purple-500 to-violet-600', text: 'text-purple-400', glow: '' },
};

export const PerformanceMetrics = ({
    metrics,
    title = 'Performance',
    layout = 'vertical',
    showLabels = true,
    animated = true,
    className = '',
}: PerformanceMetricsProps) => {
    return (
        <div className={cn('space-y-4', className)}>
            {title && (
                <h3 className="font-display font-semibold text-text-primary flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    {title}
                </h3>
            )}

            <div
                className={cn(
                    layout === 'grid' && 'grid grid-cols-2 gap-4',
                    layout === 'horizontal' && 'flex gap-6 overflow-x-auto pb-2',
                    layout === 'vertical' && 'space-y-3'
                )}
            >
                {metrics.map((metric, index) => {
                    const percentage = Math.min((metric.value / metric.maxValue) * 100, 100);
                    const colors = colorClasses[metric.color || 'accent'];

                    return (
                        <motion.div
                            key={metric.label}
                            initial={animated ? { opacity: 0, y: 10 } : undefined}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className={cn(
                                layout === 'horizontal' && 'min-w-[120px] flex-shrink-0'
                            )}
                        >
                            {/* Label row */}
                            {showLabels && (
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-1.5">
                                        {metric.icon && (
                                            <span className={cn('opacity-70', colors.text)}>
                                                {metric.icon}
                                            </span>
                                        )}
                                        <span className="text-sm text-text-muted">{metric.label}</span>
                                    </div>
                                    <span className={cn('text-sm font-semibold', colors.text)}>
                                        {metric.value}
                                        {metric.unit && (
                                            <span className="text-xs text-text-muted ml-0.5">
                                                {metric.unit}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            )}

                            {/* Progress bar */}
                            <div className="h-2 rounded-full bg-surface-2/50 overflow-hidden">
                                <motion.div
                                    className={cn(
                                        'h-full rounded-full bg-gradient-to-r',
                                        colors.bar
                                    )}
                                    initial={animated ? { width: 0 } : undefined}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{
                                        delay: index * 0.1 + 0.2,
                                        duration: 0.5,
                                        ease: [0.2, 0.8, 0.2, 1]
                                    }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// Quick stats display
export interface QuickStatsProps {
    stats: Array<{
        label: string;
        value: string | number;
        icon?: React.ReactNode;
        change?: { value: number; positive: boolean };
    }>;
    className?: string;
}

export const QuickStats = ({ stats, className = '' }: QuickStatsProps) => {
    return (
        <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl bg-surface-1/55 backdrop-blur-glass border border-border/10"
                >
                    <div className="flex items-center gap-2 mb-2">
                        {stat.icon && (
                            <span className="text-accent">{stat.icon}</span>
                        )}
                        <span className="text-xs text-text-muted">{stat.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-text-primary">
                            {stat.value}
                        </span>
                        {stat.change && (
                            <span
                                className={cn(
                                    'text-xs font-medium',
                                    stat.change.positive ? 'text-green-400' : 'text-red-400'
                                )}
                            >
                                {stat.change.positive ? '+' : ''}{stat.change.value}%
                            </span>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// Preset performance bars for common metrics
export const CPUPerformanceBar = ({ score, maxScore = 100 }: { score: number; maxScore?: number }) => (
    <PerformanceMetrics
        metrics={[{ label: 'CPU Performance', value: score, maxValue: maxScore, icon: <Cpu className="w-3.5 h-3.5" />, color: 'accent' }]}
        title=""
        showLabels={true}
    />
);

export const GPUPerformanceBar = ({ score, maxScore = 100 }: { score: number; maxScore?: number }) => (
    <PerformanceMetrics
        metrics={[{ label: 'GPU Performance', value: score, maxValue: maxScore, icon: <Gauge className="w-3.5 h-3.5" />, color: 'green' }]}
        title=""
        showLabels={true}
    />
);

export const PowerDrawBar = ({ watts, maxWatts = 1000 }: { watts: number; maxWatts?: number }) => (
    <PerformanceMetrics
        metrics={[{ label: 'Power Draw', value: watts, maxValue: maxWatts, unit: 'W', icon: <Zap className="w-3.5 h-3.5" />, color: 'amber' }]}
        title=""
        showLabels={true}
    />
);

export const ThermalBar = ({ temp, maxTemp = 100 }: { temp: number; maxTemp?: number }) => (
    <PerformanceMetrics
        metrics={[{ label: 'Thermal', value: temp, maxValue: maxTemp, unit: '°C', icon: <Thermometer className="w-3.5 h-3.5" />, color: temp > 80 ? 'red' : temp > 60 ? 'amber' : 'green' }]}
        title=""
        showLabels={true}
    />
);

export default PerformanceMetrics;
