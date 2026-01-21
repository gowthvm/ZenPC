'use client';

import React, { forwardRef } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'success' | 'warning' | 'error' | 'default' | 'accent'
  | 'critical' | 'danger' | 'outline' | 'blue' | 'green'
  | 'yellow' | 'red' | 'gray' | 'indigo' | 'emerald';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends Omit<HTMLMotionProps<'span'>, 'ref'> {
  variant: BadgeVariant;
  size?: BadgeSize;
  glow?: boolean;
  pulse?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-500/15 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  error: 'bg-red-500/15 text-red-400 border-red-500/30',
  default: 'bg-surface-1/60 text-text-primary border-border/20',
  accent: 'bg-accent/15 text-accent border-accent/30',
  critical: 'bg-red-600/30 text-red-200 border-red-700/50',
  danger: 'bg-red-700/30 text-red-200 border-red-800/50',
  outline: 'border border-border/30 text-text-primary bg-transparent',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  green: 'bg-green-500/15 text-green-400 border-green-500/30',
  yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
  gray: 'bg-surface-1/60 text-text-muted border-border/20',
  indigo: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

const glowStyles: Partial<Record<BadgeVariant, string>> = {
  success: 'shadow-glow-success',
  warning: 'shadow-glow-warning',
  error: 'shadow-glow-error',
  accent: 'shadow-glow-sm',
  blue: 'shadow-[0_0_15px_rgb(59_130_246_/_0.3)]',
  indigo: 'shadow-[0_0_15px_rgb(99_102_241_/_0.3)]',
  emerald: 'shadow-[0_0_15px_rgb(52_211_153_/_0.3)]',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant, size = 'md', glow = false, pulse = false, icon, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-base';
    const variantClass = variantStyles[variant];
    const sizeClass = sizeStyles[size];
    const glowClass = glow && glowStyles[variant] ? glowStyles[variant] : '';
    const pulseClass = pulse ? 'animate-pulse' : '';

    return (
      <motion.span
        ref={ref}
        className={cn(baseClasses, variantClass, sizeClass, glowClass, pulseClass, className)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </motion.span>
    );
  }
);

Badge.displayName = 'Badge';

// Animated Badge Group - shows badges with staggered animation
export const BadgeGroup = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      className={cn('flex flex-wrap gap-2', className)}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </motion.div>
  );
};

// Status Dot component for inline status indicators
export const StatusDot = ({
  status,
  pulse = false,
  size = 'md',
  className = ''
}: {
  status: 'success' | 'warning' | 'error' | 'info' | 'offline';
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const colors = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    offline: 'bg-gray-500',
  };

  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <span className={cn('relative inline-flex', className)}>
      <span className={cn('rounded-full', colors[status], sizes[size])} />
      {pulse && (
        <span
          className={cn(
            'absolute inset-0 rounded-full animate-ping opacity-75',
            colors[status]
          )}
        />
      )}
    </span>
  );
};

export default Badge;
