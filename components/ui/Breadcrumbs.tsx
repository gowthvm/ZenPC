'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    separator?: React.ReactNode;
    maxItems?: number;
    className?: string;
}

export const Breadcrumbs = ({
    items,
    separator,
    maxItems = 4,
    className = '',
}: BreadcrumbsProps) => {
    // Handle truncation for long breadcrumb paths
    const displayItems = items.length > maxItems
        ? [
            items[0],
            { label: '...', href: undefined },
            ...items.slice(-2),
        ]
        : items;

    const defaultSeparator = (
        <ChevronRight className="w-3.5 h-3.5 text-text-muted/50 flex-shrink-0" />
    );

    return (
        <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
            <ol className="flex items-center gap-1.5 text-sm">
                {displayItems.map((item, index) => {
                    const isLast = index === displayItems.length - 1;
                    const isClickable = item.href || item.onClick;
                    const isEllipsis = item.label === '...';

                    return (
                        <motion.li
                            key={index}
                            className="flex items-center gap-1.5"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                        >
                            {index > 0 && (separator || defaultSeparator)}

                            {isEllipsis ? (
                                <span className="text-text-muted px-1">...</span>
                            ) : isClickable && !isLast ? (
                                <button
                                    onClick={item.onClick}
                                    className={cn(
                                        'flex items-center gap-1.5 px-2 py-1 rounded-md',
                                        'text-text-muted hover:text-text-primary hover:bg-surface-1/50',
                                        'transition-all duration-200 ease-premium'
                                    )}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ) : (
                                <span
                                    className={cn(
                                        'flex items-center gap-1.5 px-2 py-1',
                                        isLast
                                            ? 'text-text-primary font-medium'
                                            : 'text-text-muted'
                                    )}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </span>
                            )}
                        </motion.li>
                    );
                })}
            </ol>
        </nav>
    );
};

// Simple breadcrumb for builder pages
export const BuilderBreadcrumbs = ({
    currentStep,
    onNavigate,
}: {
    currentStep: string;
    onNavigate?: (step: string) => void;
}) => {
    const items: BreadcrumbItem[] = [
        {
            label: 'Home',
            icon: <Home className="w-3.5 h-3.5" />,
            onClick: onNavigate ? () => onNavigate('home') : undefined,
        },
        {
            label: 'Builder',
            onClick: onNavigate ? () => onNavigate('builder') : undefined,
        },
        { label: currentStep },
    ];

    return <Breadcrumbs items={items} />;
};

export default Breadcrumbs;
