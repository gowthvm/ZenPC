'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, X, Minus } from 'lucide-react';

export interface ComparisonFeature {
    name: string;
    description?: string;
    values: (boolean | string | number | null)[];
}

export interface ComparisonItem {
    id: string;
    name: string;
    image?: string;
    price?: number;
    badge?: string;
    isRecommended?: boolean;
}

export interface ComparisonTableProps {
    items: ComparisonItem[];
    features: ComparisonFeature[];
    highlightDifferences?: boolean;
    onSelect?: (id: string) => void;
    selectedId?: string;
    className?: string;
}

export const ComparisonTable = ({
    items,
    features,
    highlightDifferences = true,
    onSelect,
    selectedId,
    className = '',
}: ComparisonTableProps) => {
    const renderValue = (value: boolean | string | number | null) => {
        if (value === true) {
            return (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400">
                    <Check className="w-4 h-4" />
                </span>
            );
        }
        if (value === false) {
            return (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-400">
                    <X className="w-4 h-4" />
                </span>
            );
        }
        if (value === null || value === undefined) {
            return (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface-2/50 text-text-muted">
                    <Minus className="w-4 h-4" />
                </span>
            );
        }
        return <span className="text-text-primary font-medium">{value}</span>;
    };

    // Check if all values in a row are the same (for highlighting)
    const areAllSame = (values: (boolean | string | number | null)[]) => {
        const first = JSON.stringify(values[0]);
        return values.every((v) => JSON.stringify(v) === first);
    };

    return (
        <div className={cn('overflow-x-auto', className)}>
            <table className="w-full min-w-[600px]">
                {/* Header - Item names */}
                <thead>
                    <tr>
                        <th className="text-left py-3 px-4 text-text-muted text-sm font-medium">
                            Features
                        </th>
                        {items.map((item, index) => (
                            <motion.th
                                key={item.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                    'text-center py-3 px-4 min-w-[150px]',
                                    selectedId === item.id && 'bg-accent/5'
                                )}
                            >
                                <button
                                    onClick={() => onSelect?.(item.id)}
                                    className={cn(
                                        'w-full p-3 rounded-lg transition-all duration-200',
                                        'hover:bg-surface-1/50',
                                        selectedId === item.id && 'ring-2 ring-accent/50 bg-surface-1/50'
                                    )}
                                >
                                    {item.isRecommended && (
                                        <span className="text-xs px-2 py-0.5 mb-2 inline-block rounded-full bg-accent/20 text-accent font-medium">
                                            Recommended
                                        </span>
                                    )}
                                    <p className="font-semibold text-text-primary text-sm mt-1">
                                        {item.name}
                                    </p>
                                    {item.price && (
                                        <p className="text-accent font-medium mt-1">
                                            ${item.price.toLocaleString()}
                                        </p>
                                    )}
                                </button>
                            </motion.th>
                        ))}
                    </tr>
                </thead>

                {/* Body - Feature rows */}
                <tbody>
                    {features.map((feature, featureIndex) => {
                        const allSame = areAllSame(feature.values);
                        const shouldHighlight = highlightDifferences && !allSame;

                        return (
                            <motion.tr
                                key={feature.name}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 + featureIndex * 0.03 }}
                                className={cn(
                                    'border-t border-border/10',
                                    shouldHighlight && 'bg-accent/5'
                                )}
                            >
                                <td className="py-3 px-4">
                                    <span className="text-sm font-medium text-text-primary">
                                        {feature.name}
                                    </span>
                                    {feature.description && (
                                        <p className="text-xs text-text-muted mt-0.5">
                                            {feature.description}
                                        </p>
                                    )}
                                </td>
                                {feature.values.map((value, valueIndex) => (
                                    <td
                                        key={valueIndex}
                                        className={cn(
                                            'text-center py-3 px-4',
                                            selectedId === items[valueIndex]?.id && 'bg-accent/5'
                                        )}
                                    >
                                        {renderValue(value)}
                                    </td>
                                ))}
                            </motion.tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

// Simple side-by-side comparison cards
export interface CompareCardsProps {
    items: Array<{
        id: string;
        title: string;
        subtitle?: string;
        price?: number;
        features: string[];
        isRecommended?: boolean;
    }>;
    onSelect?: (id: string) => void;
    selectedId?: string;
    className?: string;
}

export const CompareCards = ({
    items,
    onSelect,
    selectedId,
    className = '',
}: CompareCardsProps) => {
    return (
        <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
            {items.map((item, index) => (
                <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onSelect?.(item.id)}
                    className={cn(
                        'relative p-5 rounded-xl text-left transition-all duration-200',
                        'bg-surface-1/55 backdrop-blur-glass border',
                        selectedId === item.id
                            ? 'border-accent/50 shadow-lg shadow-accent/10'
                            : 'border-border/10 hover:border-accent/30'
                    )}
                >
                    {item.isRecommended && (
                        <div className="absolute -top-2 left-4 px-2 py-0.5 text-xs font-medium rounded-full bg-accent text-white">
                            Best Value
                        </div>
                    )}

                    <h3 className="font-semibold text-text-primary">{item.title}</h3>
                    {item.subtitle && (
                        <p className="text-xs text-text-muted mt-0.5">{item.subtitle}</p>
                    )}

                    {item.price && (
                        <p className="text-2xl font-bold text-accent mt-3">
                            ${item.price.toLocaleString()}
                        </p>
                    )}

                    <ul className="mt-4 space-y-2">
                        {item.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <span className="text-text-muted">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </motion.button>
            ))}
        </div>
    );
};

export default ComparisonTable;
