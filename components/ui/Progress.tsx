'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

// Linear Progress Bar
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'striped';
  showValue?: boolean;
  animated?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showValue = false,
    animated = true,
    className = '',
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    const variantClasses = {
      default: 'bg-accent',
      gradient: 'bg-gradient-to-r from-accent via-premium-purple to-premium-cyan',
      striped: 'bg-accent',
    };

    return (
      <div
        ref={ref}
        className={cn('progress-bar w-full', sizeClasses[size], className)}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <motion.div
          className={cn(
            'h-full rounded-full relative overflow-hidden',
            variantClasses[variant],
            variant === 'striped' && 'bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]',
            animated && variant === 'striped' && 'animate-[progress-stripe_1s_linear_infinite]'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Shimmer effect */}
          {animated && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ animation: 'progress-shimmer 2s ease-in-out infinite' }}
            />
          )}
        </motion.div>
        {showValue && (
          <span className="ml-2 text-xs text-text-muted">{Math.round(percentage)}%</span>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';

// Circular Progress Ring
export interface ProgressRingProps extends React.SVGAttributes<SVGSVGElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  animated?: boolean;
  variant?: 'default' | 'gradient';
  label?: string;
}

export const ProgressRing = forwardRef<SVGSVGElement, ProgressRingProps>(
  ({
    value,
    max = 100,
    size = 80,
    strokeWidth = 6,
    showValue = true,
    animated = true,
    variant = 'default',
    label,
    className = '',
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    // Animate the stroke offset
    const springValue = useSpring(animated ? 0 : percentage, {
      stiffness: 100,
      damping: 30,
    });

    useEffect(() => {
      springValue.set(percentage);
    }, [percentage, springValue]);

    const strokeDashoffset = useTransform(
      springValue,
      [0, 100],
      [circumference, 0]
    );

    // Generate gradient ID
    const gradientId = `progress-gradient-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('relative inline-flex items-center justify-center', className)}>
        <svg
          ref={ref}
          width={size}
          height={size}
          className="progress-ring"
          {...props}
        >
          {/* Gradient definition */}
          {variant === 'gradient' && (
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(var(--accent))" />
                <stop offset="50%" stopColor="rgb(var(--premium-purple))" />
                <stop offset="100%" stopColor="rgb(var(--premium-cyan))" />
              </linearGradient>
            </defs>
          )}

          {/* Background circle */}
          <circle
            className="progress-ring-circle"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <motion.circle
            className="progress-ring-progress"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            stroke={variant === 'gradient' ? `url(#${gradientId})` : undefined}
          />
        </svg>

        {/* Center content */}
        {(showValue || label) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {showValue && (
              <motion.span
                className="text-lg font-semibold text-text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {Math.round(percentage)}%
              </motion.span>
            )}
            {label && (
              <span className="text-xs text-text-muted">{label}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

ProgressRing.displayName = 'ProgressRing';

// Progress Steps - for multi-step progress
export interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const ProgressSteps = ({ steps, currentStep, className = '' }: ProgressStepsProps) => {
  return (
    <div className={cn('flex items-center w-full', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={index}>
            {/* Step circle */}
            <motion.div
              className={cn(
                'relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-base',
                isCompleted && 'bg-accent border-accent',
                isCurrent && 'border-accent bg-surface-1',
                !isCompleted && !isCurrent && 'border-border/30 bg-surface-1'
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {isCompleted ? (
                <motion.svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                  />
                </motion.svg>
              ) : (
                <span className={cn(
                  'text-xs font-medium',
                  isCurrent ? 'text-accent' : 'text-text-muted'
                )}>
                  {index + 1}
                </span>
              )}

              {/* Current step glow */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ boxShadow: '0 0 20px rgb(var(--accent) / 0.5)' }}
                />
              )}
            </motion.div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 h-0.5 bg-border/20 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Progress;
