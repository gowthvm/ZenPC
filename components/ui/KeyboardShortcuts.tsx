'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Command } from 'lucide-react';

export interface KeyboardShortcut {
    key: string;
    description: string;
    action: () => void;
    modifier?: 'ctrl' | 'alt' | 'shift' | 'meta' | 'ctrl+shift';
    global?: boolean;
}

export interface UseKeyboardShortcutsOptions {
    shortcuts: KeyboardShortcut[];
    enabled?: boolean;
}

// Hook for keyboard shortcuts
export const useKeyboardShortcuts = ({
    shortcuts,
    enabled = true,
}: UseKeyboardShortcutsOptions) => {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            for (const shortcut of shortcuts) {
                const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

                let modifierMatch = true;
                if (shortcut.modifier === 'ctrl') {
                    modifierMatch = e.ctrlKey && !e.shiftKey;
                } else if (shortcut.modifier === 'alt') {
                    modifierMatch = e.altKey;
                } else if (shortcut.modifier === 'shift') {
                    modifierMatch = e.shiftKey && !e.ctrlKey;
                } else if (shortcut.modifier === 'meta') {
                    modifierMatch = e.metaKey;
                } else if (shortcut.modifier === 'ctrl+shift') {
                    modifierMatch = e.ctrlKey && e.shiftKey;
                } else {
                    modifierMatch = !e.ctrlKey && !e.altKey && !e.metaKey;
                }

                if (keyMatch && modifierMatch) {
                    e.preventDefault();
                    shortcut.action();
                    break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, enabled]);
};

// Keyboard shortcuts help modal
export interface KeyboardShortcutsHelpProps {
    shortcuts: KeyboardShortcut[];
    isOpen: boolean;
    onClose: () => void;
}

export const KeyboardShortcutsHelp = ({
    shortcuts,
    isOpen,
    onClose,
}: KeyboardShortcutsHelpProps) => {
    const formatKey = (shortcut: KeyboardShortcut) => {
        const parts: string[] = [];

        if (shortcut.modifier === 'ctrl' || shortcut.modifier === 'ctrl+shift') {
            parts.push('Ctrl');
        }
        if (shortcut.modifier === 'shift' || shortcut.modifier === 'ctrl+shift') {
            parts.push('Shift');
        }
        if (shortcut.modifier === 'alt') {
            parts.push('Alt');
        }
        if (shortcut.modifier === 'meta') {
            parts.push('⌘');
        }

        parts.push(shortcut.key.toUpperCase());

        return parts;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        className="relative max-w-md w-full mx-4 p-6 rounded-2xl bg-surface-1/95 backdrop-blur-xl border border-border/20 shadow-2xl"
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                                <Command className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h2 className="font-display font-semibold text-text-primary">
                                    Keyboard Shortcuts
                                </h2>
                                <p className="text-xs text-text-muted">
                                    Quick actions for power users
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {shortcuts.map((shortcut, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface-2/50 transition-colors"
                                >
                                    <span className="text-sm text-text-muted">
                                        {shortcut.description}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {formatKey(shortcut).map((key, i) => (
                                            <React.Fragment key={i}>
                                                {i > 0 && <span className="text-text-muted/50 text-xs">+</span>}
                                                <kbd className="px-2 py-1 text-xs font-mono bg-surface-2 rounded border border-border/20 text-text-primary">
                                                    {key}
                                                </kbd>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-border/10">
                            <p className="text-xs text-text-muted text-center">
                                Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-surface-2 rounded">?</kbd> to toggle this help
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Builder-specific shortcuts preset
export const useBuilderShortcuts = ({
    onSave,
    onNewBuild,
    onSearch,
    onHelp,
}: {
    onSave?: () => void;
    onNewBuild?: () => void;
    onSearch?: () => void;
    onHelp?: () => void;
}) => {
    const [showHelp, setShowHelp] = useState(false);

    const shortcuts: KeyboardShortcut[] = [
        ...(onSave ? [{ key: 's', modifier: 'ctrl' as const, description: 'Save build', action: onSave }] : []),
        ...(onNewBuild ? [{ key: 'n', modifier: 'ctrl' as const, description: 'New build', action: onNewBuild }] : []),
        ...(onSearch ? [{ key: 'k', modifier: 'ctrl' as const, description: 'Search parts', action: onSearch }] : []),
        { key: '?', description: 'Show keyboard shortcuts', action: () => setShowHelp(true) },
        { key: 'Escape', description: 'Close modal/panel', action: () => setShowHelp(false) },
    ];

    useKeyboardShortcuts({ shortcuts });

    return {
        shortcuts,
        showHelp,
        setShowHelp,
    };
};

export default KeyboardShortcutsHelp;
