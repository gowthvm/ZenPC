'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BudgetGaugeProps {
    spent: number;
    budget: number;
    currency?: string;
    showLabels?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const BudgetGauge = ({
    spent,
    budget,
    currency = '$',
    showLabels = true,
    size = 'md',
    className = '',
}: BudgetGaugeProps) => {
    const percentage = Math.min((spent / budget) * 100, 100);
    const isOverBudget = spent > budget;
    const overAmount = isOverBudget ? spent - budget : 0;
    const remaining = Math.max(budget - spent, 0);

    const sizes = {
        sm: { outer: 100, stroke: 8, text: 'text-lg' },
        md: { outer: 140, stroke: 10, text: 'text-2xl' },
        lg: { outer: 180, stroke: 12, text: 'text-3xl' },
    };

    const { outer, stroke, text } = sizes[size];
    const radius = (outer - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Color based on budget status
    const getGaugeColor = () => {
        if (isOverBudget) return 'rgb(248, 113, 113)'; // red
        if (percentage > 90) return 'rgb(251, 191, 36)'; // amber
        if (percentage > 75) return 'rgb(251, 191, 36)'; // amber
        return 'rgb(99, 112, 241)'; // accent
    };

    const gaugeColor = getGaugeColor();

    return (
        <div className={cn('flex flex-col items-center', className)}>
            <div className="relative" style={{ width: outer, height: outer }}>
                <svg
                    width={outer}
                    height={outer}
                    className="transform -rotate-90"
                >
                    {/* Background circle */}
                    <circle
                        cx={outer / 2}
                        cy={outer / 2}
                        r={radius}
                        fill="none"
                        stroke="rgb(var(--surface-2))"
                        strokeWidth={stroke}
                    />

                    {/* Progress arc */}
                    <motion.circle
                        cx={outer / 2}
                        cy={outer / 2}
                        r={radius}
                        fill="none"
                        stroke={gaugeColor}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
                    />

                    {/* Glow effect */}
                    <motion.circle
                        cx={outer / 2}
                        cy={outer / 2}
                        r={radius}
                        fill="none"
                        stroke={gaugeColor}
                        strokeWidth={stroke / 2}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
                        style={{ filter: 'blur(4px)', opacity: 0.5 }}
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        className={cn('font-display font-bold', text)}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                        style={{ color: gaugeColor }}
                    >
                        {Math.round(percentage)}%
                    </motion.div>
                    <span className="text-xs text-text-muted">of budget</span>
                </div>
            </div>

            {showLabels && (
                <div className="mt-4 w-full max-w-[200px] space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Spent</span>
                        <span className="font-medium text-text-primary">
                            {currency}{spent.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Budget</span>
                        <span className="font-medium text-text-primary">
                            {currency}{budget.toLocaleString()}
                        </span>
                    </div>
                    <div className="border-t border-border/10 pt-2 flex justify-between text-sm">
                        <span className="text-text-muted">
                            {isOverBudget ? 'Over Budget' : 'Remaining'}
                        </span>
                        <span className={cn(
                            'font-medium',
                            isOverBudget ? 'text-red-400' : 'text-green-400'
                        )}>
                            {isOverBudget ? '+' : ''}{currency}{(isOverBudget ? overAmount : remaining).toLocaleString()}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

// Mini Budget Bar - compact inline version
export const BudgetBar = ({
    spent,
    budget,
    className = '',
}: {
    spent: number;
    budget: number;
    className?: string;
}) => {
    const percentage = Math.min((spent / budget) * 100, 100);
    const isOverBudget = spent > budget;

    return (
        <div className={cn('space-y-1', className)}>
            <div className="flex justify-between text-xs">
                <span className="text-text-muted">
                    ${spent.toLocaleString()} / ${budget.toLocaleString()}
                </span>
                <span className={cn(
                    'font-medium',
                    isOverBudget ? 'text-red-400' : percentage > 90 ? 'text-amber-400' : 'text-text-primary'
                )}>
                    {Math.round(percentage)}%
                </span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-2/50 overflow-hidden">
                <motion.div
                    className={cn(
                        'h-full rounded-full',
                        isOverBudget
                            ? 'bg-red-500'
                            : percentage > 90
                                ? 'bg-amber-500'
                                : 'bg-gradient-to-r from-accent to-premium-purple'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                />
            </div>
        </div>
    );
};

export default BudgetGauge;
