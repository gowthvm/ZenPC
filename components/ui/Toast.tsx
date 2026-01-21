'use client';

import React, { createContext, useContext, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
    dismissible?: boolean;
}

interface ToastContextValue {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
    clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Toast Provider
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = {
            id,
            duration: 5000,
            dismissible: true,
            ...toast,
        };

        setToasts((prev) => [...prev, newToast]);

        // Auto dismiss
        if (newToast.duration && newToast.duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, newToast.duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const clearToasts = useCallback(() => {
        setToasts([]);
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};

// Hook to use toasts
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Toast Container
const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};

// Individual Toast Item
const ToastItem = ({
    toast,
    onDismiss
}: {
    toast: Toast;
    onDismiss: () => void;
}) => {
    const icons: Record<ToastType, React.ReactNode> = {
        success: <CheckCircle className="w-5 h-5 text-green-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />,
        default: null,
    };

    const borderColors: Record<ToastType, string> = {
        success: 'border-l-green-500',
        error: 'border-l-red-500',
        warning: 'border-l-yellow-500',
        info: 'border-l-blue-500',
        default: 'border-l-border/30',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-lg',
                'bg-surface-2/95 backdrop-blur-xl border border-border/20',
                'border-l-4 shadow-lg',
                borderColors[toast.type]
            )}
        >
            {icons[toast.type] && (
                <span className="flex-shrink-0 mt-0.5">{icons[toast.type]}</span>
            )}

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{toast.title}</p>
                {toast.description && (
                    <p className="text-sm text-text-muted mt-1">{toast.description}</p>
                )}
                {toast.action && (
                    <button
                        onClick={() => {
                            toast.action?.onClick();
                            onDismiss();
                        }}
                        className="mt-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                    >
                        {toast.action.label}
                    </button>
                )}
            </div>

            {toast.dismissible && (
                <button
                    onClick={onDismiss}
                    className="flex-shrink-0 p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-3/50 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    );
};

// Convenience functions for quick toasts
export const toast = {
    success: (title: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'title'>>) => {
        // This is a placeholder - in actual usage, users will call useToast().addToast()
        console.log('Toast:', { type: 'success', title, ...options });
    },
    error: (title: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'title'>>) => {
        console.log('Toast:', { type: 'error', title, ...options });
    },
    warning: (title: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'title'>>) => {
        console.log('Toast:', { type: 'warning', title, ...options });
    },
    info: (title: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'title'>>) => {
        console.log('Toast:', { type: 'info', title, ...options });
    },
};

export default ToastProvider;
