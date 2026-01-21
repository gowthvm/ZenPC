'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, Package, AlertCircle, Plus, RefreshCw } from 'lucide-react';

export type EmptyStateVariant = 'default' | 'search' | 'no-builds' | 'no-parts' | 'error' | 'no-results';

export interface EmptyStateProps {
    variant?: EmptyStateVariant;
    title?: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const variantConfig: Record<EmptyStateVariant, { icon: React.ReactNode; title: string; description: string }> = {
    default: {
        icon: <Package className="w-8 h-8" />,
        title: 'Nothing here yet',
        description: 'Get started by adding some items',
    },
    search: {
        icon: <Search className="w-8 h-8" />,
        title: 'No results found',
        description: 'Try adjusting your search or filters',
    },
    'no-builds': {
        icon: <Package className="w-8 h-8" />,
        title: 'No saved builds',
        description: 'Create your first PC build to get started',
    },
    'no-parts': {
        icon: <Package className="w-8 h-8" />,
        title: 'No parts selected',
        description: 'Start selecting components to build your PC',
    },
    error: {
        icon: <AlertCircle className="w-8 h-8" />,
        title: 'Something went wrong',
        description: 'We couldn\'t load the content. Please try again.',
    },
    'no-results': {
        icon: <Search className="w-8 h-8" />,
        title: 'No matching parts',
        description: 'Try different filters or search terms',
    },
};

export const EmptyState = ({
    variant = 'default',
    title,
    description,
    action,
    secondaryAction,
    className = '',
}: EmptyStateProps) => {
    const config = variantConfig[variant];
    const displayTitle = title || config.title;
    const displayDescription = description || config.description;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}
        >
            {/* Animated icon container */}
            <motion.div
                className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 via-premium-purple/15 to-premium-cyan/10 flex items-center justify-center text-accent border border-accent/20"
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1
                }}
            >
                <motion.div
                    animate={{
                        y: [0, -5, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    {config.icon}
                </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h3
                className="font-display text-lg font-semibold text-text-primary mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {displayTitle}
            </motion.h3>

            {/* Description */}
            <motion.p
                className="text-sm text-text-muted mb-6 max-w-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {displayDescription}
            </motion.p>

            {/* Actions */}
            {(action || secondaryAction) && (
                <motion.div
                    className="flex flex-col sm:flex-row items-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {action && (
                        <button
                            onClick={action.onClick}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            {action.label}
                        </button>
                    )}
                    {secondaryAction && (
                        <button
                            onClick={secondaryAction.onClick}
                            className="btn-ghost flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            {secondaryAction.label}
                        </button>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
};

// Inline empty state for smaller containers
export const EmptyStateInline = ({
    message = 'No items',
    className = '',
}: {
    message?: string;
    className?: string;
}) => {
    return (
        <div className={cn(
            'flex items-center justify-center gap-2 py-6 text-text-muted text-sm',
            className
        )}>
            <Package className="w-4 h-4 opacity-50" />
            <span>{message}</span>
        </div>
    );
};

export default EmptyState;
