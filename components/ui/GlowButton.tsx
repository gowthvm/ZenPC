'use client';

import React, { forwardRef, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export type GlowColor = 'accent' | 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose';

export interface GlowButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
    children: React.ReactNode;
    color?: GlowColor;
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    glowIntensity?: 'low' | 'medium' | 'high';
    pulseGlow?: boolean;
}

const colorStyles: Record<GlowColor, { bg: string; glow: string; border: string }> = {
    accent: {
        bg: 'from-accent to-indigo-600',
        glow: '0 0 20px rgb(99 112 241 / 0.5), 0 0 40px rgb(99 112 241 / 0.25)',
        border: 'border-accent/30',
    },
    purple: {
        bg: 'from-purple-500 to-violet-600',
        glow: '0 0 20px rgb(168 85 247 / 0.5), 0 0 40px rgb(168 85 247 / 0.25)',
        border: 'border-purple-500/30',
    },
    cyan: {
        bg: 'from-cyan-400 to-blue-500',
        glow: '0 0 20px rgb(34 211 238 / 0.5), 0 0 40px rgb(34 211 238 / 0.25)',
        border: 'border-cyan-400/30',
    },
    emerald: {
        bg: 'from-emerald-400 to-green-500',
        glow: '0 0 20px rgb(52 211 153 / 0.5), 0 0 40px rgb(52 211 153 / 0.25)',
        border: 'border-emerald-400/30',
    },
    amber: {
        bg: 'from-amber-400 to-orange-500',
        glow: '0 0 20px rgb(251 191 36 / 0.5), 0 0 40px rgb(251 191 36 / 0.25)',
        border: 'border-amber-400/30',
    },
    rose: {
        bg: 'from-rose-400 to-pink-500',
        glow: '0 0 20px rgb(251 113 133 / 0.5), 0 0 40px rgb(251 113 133 / 0.25)',
        border: 'border-rose-400/30',
    },
};

const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
};

const glowIntensities = {
    low: 0.3,
    medium: 0.5,
    high: 0.8,
};

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
    ({
        children,
        color = 'accent',
        size = 'md',
        loading = false,
        glowIntensity = 'medium',
        pulseGlow = false,
        disabled,
        className = '',
        ...props
    }, ref) => {
        const [isHovered, setIsHovered] = useState(false);
        const styles = colorStyles[color];
        const intensity = glowIntensities[glowIntensity];

        return (
            <motion.button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    'relative inline-flex items-center justify-center gap-2 rounded-lg font-medium text-white',
                    'transition-all duration-base ease-premium',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:opacity-50 disabled:pointer-events-none',
                    'overflow-hidden',
                    sizeStyles[size],
                    className
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileTap={{ scale: 0.95 }}
                animate={{
                    boxShadow: isHovered
                        ? styles.glow.replace(/0\.5/g, String(intensity)).replace(/0\.25/g, String(intensity / 2))
                        : 'none',
                }}
                style={{
                    animation: pulseGlow ? 'glow-pulse 2s ease-in-out infinite' : undefined,
                }}
                {...props}
            >
                {/* Gradient background */}
                <span
                    className={cn(
                        'absolute inset-0 bg-gradient-to-r',
                        styles.bg
                    )}
                />

                {/* Animated border */}
                <span
                    className={cn(
                        'absolute inset-0 rounded-lg border',
                        styles.border
                    )}
                />

                {/* Shimmer effect on hover */}
                <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: isHovered ? '100%' : '-100%' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />

                {/* Content */}
                <span className="relative flex items-center gap-2 z-10">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {children}
                </span>
            </motion.button>
        );
    }
);

GlowButton.displayName = 'GlowButton';

// Outline Glow Button variant
export const GlowButtonOutline = forwardRef<HTMLButtonElement, GlowButtonProps>(
    ({
        children,
        color = 'accent',
        size = 'md',
        loading = false,
        glowIntensity = 'medium',
        pulseGlow = false,
        disabled,
        className = '',
        ...props
    }, ref) => {
        const [isHovered, setIsHovered] = useState(false);
        const styles = colorStyles[color];
        const intensity = glowIntensities[glowIntensity];

        const textColors: Record<GlowColor, string> = {
            accent: 'text-accent',
            purple: 'text-purple-400',
            cyan: 'text-cyan-400',
            emerald: 'text-emerald-400',
            amber: 'text-amber-400',
            rose: 'text-rose-400',
        };

        return (
            <motion.button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    'relative inline-flex items-center justify-center gap-2 rounded-lg font-medium',
                    'transition-all duration-base ease-premium',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:opacity-50 disabled:pointer-events-none',
                    'bg-transparent border-2',
                    styles.border,
                    textColors[color],
                    sizeStyles[size],
                    className
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileTap={{ scale: 0.95 }}
                animate={{
                    boxShadow: isHovered
                        ? styles.glow.replace(/0\.5/g, String(intensity * 0.5)).replace(/0\.25/g, String(intensity * 0.25))
                        : 'none',
                }}
                style={{
                    animation: pulseGlow ? 'glow-pulse 2s ease-in-out infinite' : undefined,
                }}
                {...props}
            >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {children}
            </motion.button>
        );
    }
);

GlowButtonOutline.displayName = 'GlowButtonOutline';

export default GlowButton;
