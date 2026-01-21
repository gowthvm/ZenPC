'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, Plus, Minus, Save, Share2, Settings, HelpCircle } from 'lucide-react';

export interface FloatingAction {
    id: string;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    color?: 'accent' | 'success' | 'warning' | 'error';
    disabled?: boolean;
}

export interface FloatingActionBarProps {
    actions: FloatingAction[];
    position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right';
    direction?: 'vertical' | 'horizontal';
    showOnScroll?: boolean;
    scrollThreshold?: number;
    collapsible?: boolean;
    mainIcon?: React.ReactNode;
    className?: string;
}

const colorStyles = {
    accent: 'bg-accent hover:bg-accent/90 text-white shadow-glow-sm',
    success: 'bg-emerald-500 hover:bg-emerald-500/90 text-white shadow-glow-success',
    warning: 'bg-amber-500 hover:bg-amber-500/90 text-white shadow-glow-warning',
    error: 'bg-red-500 hover:bg-red-500/90 text-white shadow-glow-error',
};

const positionStyles = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
    'top-right': 'top-6 right-6',
};

export const FloatingActionBar = ({
    actions,
    position = 'bottom-right',
    direction = 'vertical',
    showOnScroll = false,
    scrollThreshold = 200,
    collapsible = true,
    mainIcon,
    className = '',
}: FloatingActionBarProps) => {
    const [isExpanded, setIsExpanded] = useState(!collapsible);
    const [isVisible, setIsVisible] = useState(!showOnScroll);

    useEffect(() => {
        if (!showOnScroll) return;

        const handleScroll = () => {
            setIsVisible(window.scrollY > scrollThreshold);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [showOnScroll, scrollThreshold]);

    const toggleExpand = () => {
        if (collapsible) {
            setIsExpanded(!isExpanded);
        }
    };

    const isHorizontal = direction === 'horizontal';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={cn(
                        'fixed z-50 flex gap-3',
                        isHorizontal ? 'flex-row items-center' : 'flex-col items-end',
                        positionStyles[position],
                        className
                    )}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    {/* Action buttons */}
                    <AnimatePresence>
                        {isExpanded && actions.map((action, index) => (
                            <motion.button
                                key={action.id}
                                onClick={action.onClick}
                                disabled={action.disabled}
                                className={cn(
                                    'group relative flex items-center justify-center',
                                    'w-12 h-12 rounded-full transition-all duration-base',
                                    colorStyles[action.color || 'accent'],
                                    action.disabled && 'opacity-50 cursor-not-allowed'
                                )}
                                initial={{
                                    opacity: 0,
                                    scale: 0,
                                    [isHorizontal ? 'x' : 'y']: isHorizontal ? 20 : -20
                                }}
                                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                                exit={{
                                    opacity: 0,
                                    scale: 0,
                                    [isHorizontal ? 'x' : 'y']: isHorizontal ? 20 : -20
                                }}
                                transition={{
                                    duration: 0.2,
                                    delay: index * 0.05,
                                    ease: [0.2, 0.8, 0.2, 1]
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {action.icon}

                                {/* Tooltip */}
                                <span
                                    className={cn(
                                        'absolute whitespace-nowrap px-2 py-1 text-xs font-medium',
                                        'bg-surface-2 text-text-primary border border-border/20 rounded-md',
                                        'opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none',
                                        isHorizontal ? 'bottom-full mb-2' : 'right-full mr-3'
                                    )}
                                >
                                    {action.label}
                                </span>
                            </motion.button>
                        ))}
                    </AnimatePresence>

                    {/* Main toggle button */}
                    {collapsible && (
                        <motion.button
                            onClick={toggleExpand}
                            className={cn(
                                'flex items-center justify-center',
                                'w-14 h-14 rounded-full bg-accent text-white',
                                'shadow-lg hover:shadow-xl transition-all duration-base',
                                'hover:bg-accent/90'
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{ rotate: isExpanded ? 45 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {mainIcon || <Plus className="w-6 h-6" />}
                        </motion.button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Quick Actions Toolbar - horizontal bar for common actions
export interface QuickActionsToolbarProps {
    onSave?: () => void;
    onShare?: () => void;
    onSettings?: () => void;
    onHelp?: () => void;
    customActions?: FloatingAction[];
    className?: string;
}

export const QuickActionsToolbar = ({
    onSave,
    onShare,
    onSettings,
    onHelp,
    customActions = [],
    className = '',
}: QuickActionsToolbarProps) => {
    const defaultActions: FloatingAction[] = [
        ...(onSave ? [{
            id: 'save',
            icon: <Save className="w-5 h-5" />,
            label: 'Save Build',
            onClick: onSave,
            color: 'success' as const,
        }] : []),
        ...(onShare ? [{
            id: 'share',
            icon: <Share2 className="w-5 h-5" />,
            label: 'Share',
            onClick: onShare,
        }] : []),
        ...(onSettings ? [{
            id: 'settings',
            icon: <Settings className="w-5 h-5" />,
            label: 'Settings',
            onClick: onSettings,
        }] : []),
        ...(onHelp ? [{
            id: 'help',
            icon: <HelpCircle className="w-5 h-5" />,
            label: 'Help',
            onClick: onHelp,
        }] : []),
        ...customActions,
    ];

    return (
        <FloatingActionBar
            actions={defaultActions}
            position="bottom-right"
            direction="vertical"
            collapsible={true}
            showOnScroll={true}
            scrollThreshold={100}
            className={className}
        />
    );
};

export default FloatingActionBar;
