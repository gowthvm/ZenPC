'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle, Sparkles, PartyPopper } from 'lucide-react';

export interface SuccessAnimationProps {
    show: boolean;
    title?: string;
    description?: string;
    onComplete?: () => void;
    autoHide?: boolean;
    autoHideDelay?: number;
    variant?: 'default' | 'confetti' | 'minimal';
    actions?: {
        primary?: {
            label: string;
            onClick: () => void;
        };
        secondary?: {
            label: string;
            onClick: () => void;
        };
    };
    className?: string;
}

// Confetti particle component
const ConfettiParticle = ({
    delay,
    color
}: {
    delay: number;
    color: string;
}) => {
    const randomX = Math.random() * 200 - 100;
    const randomRotation = Math.random() * 360;

    return (
        <motion.div
            className="absolute w-2 h-2 rounded-sm"
            style={{ backgroundColor: color }}
            initial={{
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                rotate: 0,
            }}
            animate={{
                opacity: 0,
                y: 150,
                x: randomX,
                scale: 0,
                rotate: randomRotation,
            }}
            transition={{
                duration: 1.5,
                delay,
                ease: [0.2, 0.8, 0.2, 1],
            }}
        />
    );
};

export const SuccessAnimation = ({
    show,
    title = 'Success!',
    description = 'Your action was completed successfully.',
    onComplete,
    autoHide = true,
    autoHideDelay = 3000,
    variant = 'default',
    actions,
    className = '',
}: SuccessAnimationProps) => {
    const [confettiColors] = useState([
        'rgb(99, 112, 241)',   // accent
        'rgb(139, 92, 246)',   // purple
        'rgb(34, 211, 238)',   // cyan
        'rgb(52, 211, 153)',   // emerald
        'rgb(251, 191, 36)',   // amber
    ]);

    useEffect(() => {
        if (show && autoHide && onComplete) {
            const timer = setTimeout(onComplete, autoHideDelay);
            return () => clearTimeout(timer);
        }
    }, [show, autoHide, autoHideDelay, onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className={cn(
                        'fixed inset-0 z-50 flex items-center justify-center',
                        'bg-bg/80 backdrop-blur-sm',
                        className
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Confetti effect */}
                    {variant === 'confetti' && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                {Array.from({ length: 30 }).map((_, i) => (
                                    <ConfettiParticle
                                        key={i}
                                        delay={i * 0.03}
                                        color={confettiColors[i % confettiColors.length]}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Content card */}
                    <motion.div
                        className={cn(
                            'relative p-8 rounded-2xl text-center max-w-sm mx-4',
                            'bg-surface-1/90 backdrop-blur-xl border border-border/20',
                            'shadow-2xl'
                        )}
                        initial={{ scale: 0.8, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 20 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 20,
                        }}
                    >
                        {/* Success icon */}
                        <motion.div
                            className="mx-auto mb-6 relative"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 15,
                                delay: 0.1,
                            }}
                        >
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30">
                                {variant === 'confetti' ? (
                                    <PartyPopper className="w-10 h-10 text-green-400" />
                                ) : (
                                    <CheckCircle className="w-10 h-10 text-green-400" />
                                )}
                            </div>

                            {/* Sparkle decorations */}
                            <motion.div
                                className="absolute -top-1 -right-1"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 15, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            >
                                <Sparkles className="w-5 h-5 text-amber-400" />
                            </motion.div>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            className="font-display text-xl font-bold text-text-primary mb-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {title}
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            className="text-text-muted text-sm mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {description}
                        </motion.p>

                        {/* Actions */}
                        {actions && (
                            <motion.div
                                className="flex flex-col sm:flex-row gap-3 justify-center"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {actions.primary && (
                                    <button
                                        onClick={actions.primary.onClick}
                                        className="btn-primary"
                                    >
                                        {actions.primary.label}
                                    </button>
                                )}
                                {actions.secondary && (
                                    <button
                                        onClick={actions.secondary.onClick}
                                        className="btn-ghost"
                                    >
                                        {actions.secondary.label}
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Inline success indicator
export const SuccessBadge = ({
    message = 'Saved',
    show,
    className = '',
}: {
    message?: string;
    show: boolean;
    className?: string;
}) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 10 }}
                    className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1',
                        'bg-green-500/15 text-green-400 text-xs font-medium rounded-full',
                        'border border-green-500/30',
                        className
                    )}
                >
                    <CheckCircle className="w-3 h-3" />
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SuccessAnimation;
