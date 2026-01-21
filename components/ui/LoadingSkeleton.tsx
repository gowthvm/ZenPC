'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: SkeletonVariant;
    width?: number | string;
    height?: number | string;
    animation?: 'shimmer' | 'pulse' | 'none';
}

export const Skeleton = ({
    variant = 'rectangular',
    width,
    height,
    animation = 'shimmer',
    className = '',
    style,
    ...props
}: SkeletonProps) => {
    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full aspect-square',
        rectangular: 'rounded-md',
        rounded: 'rounded-xl',
    };

    const animationClasses = {
        shimmer: 'skeleton',
        pulse: 'animate-pulse bg-surface-2/50',
        none: 'bg-surface-2/50',
    };

    return (
        <div
            className={cn(
                variantClasses[variant],
                animationClasses[animation],
                className
            )}
            style={{
                width,
                height: height || (variant === 'text' ? undefined : width),
                ...style,
            }}
            {...props}
        />
    );
};

// Skeleton Text - multiple lines
export const SkeletonText = ({
    lines = 3,
    lastLineWidth = '60%',
    gap = 8,
    className = '',
}: {
    lines?: number;
    lastLineWidth?: string | number;
    gap?: number;
    className?: string;
}) => {
    return (
        <div className={cn('space-y-2', className)} style={{ gap }}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    width={i === lines - 1 ? lastLineWidth : '100%'}
                    className="h-4"
                />
            ))}
        </div>
    );
};

// Skeleton Avatar
export const SkeletonAvatar = ({
    size = 40,
    className = '',
}: {
    size?: number;
    className?: string;
}) => {
    return (
        <Skeleton
            variant="circular"
            width={size}
            height={size}
            className={className}
        />
    );
};

// Skeleton Card - complete card skeleton
export const SkeletonCard = ({
    hasImage = true,
    imageHeight = 160,
    className = '',
}: {
    hasImage?: boolean;
    imageHeight?: number;
    className?: string;
}) => {
    return (
        <div className={cn('card p-4 space-y-4', className)}>
            {hasImage && (
                <Skeleton variant="rounded" height={imageHeight} className="w-full" />
            )}
            <div className="space-y-3">
                <Skeleton variant="text" width="70%" className="h-5" />
                <SkeletonText lines={2} lastLineWidth="80%" />
            </div>
            <div className="flex items-center gap-3 pt-2">
                <SkeletonAvatar size={32} />
                <div className="flex-1">
                    <Skeleton variant="text" width="40%" className="h-3" />
                </div>
            </div>
        </div>
    );
};

// Skeleton Table Row
export const SkeletonTableRow = ({
    columns = 4,
    className = '',
}: {
    columns?: number;
    className?: string;
}) => {
    return (
        <div className={cn('flex items-center gap-4 py-3', className)}>
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    className="flex-1"
                    width={i === 0 ? '30%' : undefined}
                />
            ))}
        </div>
    );
};

// Skeleton List Item
export const SkeletonListItem = ({
    hasAvatar = true,
    hasAction = false,
    className = '',
}: {
    hasAvatar?: boolean;
    hasAction?: boolean;
    className?: string;
}) => {
    return (
        <div className={cn('flex items-center gap-3 p-3', className)}>
            {hasAvatar && <SkeletonAvatar size={40} />}
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="60%" className="h-4" />
                <Skeleton variant="text" width="40%" className="h-3" />
            </div>
            {hasAction && <Skeleton variant="rounded" width={80} height={32} />}
        </div>
    );
};

// Animated Skeleton Container - for staggered loading
export const SkeletonContainer = ({
    children,
    stagger = 0.05,
    className = '',
}: {
    children: React.ReactNode;
    stagger?: number;
    className?: string;
}) => {
    return (
        <motion.div
            className={className}
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: stagger,
                    },
                },
            }}
        >
            {React.Children.map(children, (child, i) => (
                <motion.div
                    key={i}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 },
                    }}
                >
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
};

// Component Parts Skeleton - for builder
export const SkeletonPartCard = ({ className = '' }: { className?: string }) => {
    return (
        <div className={cn('card p-4', className)}>
            <div className="flex items-start gap-4">
                <Skeleton variant="rounded" width={48} height={48} />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="70%" className="h-4" />
                    <Skeleton variant="text" width="50%" className="h-3" />
                    <div className="flex gap-2 pt-2">
                        <Skeleton variant="rounded" width={60} height={20} />
                        <Skeleton variant="rounded" width={50} height={20} />
                    </div>
                </div>
                <Skeleton variant="text" width={60} className="h-5" />
            </div>
        </div>
    );
};

export default Skeleton;
