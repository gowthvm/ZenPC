'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CursorGlow } from '@/components/effects/MagneticElement';
import { ArrowLeft, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    showBackButton?: boolean;
    backHref?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl';
    className?: string;
}

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
};

export default function PageLayout({
    children,
    title,
    description,
    showBackButton = true,
    backHref = '/',
    maxWidth = '4xl',
    className = '',
}: PageLayoutProps) {
    return (
        <div className="min-h-dvh flex flex-col bg-bg text-text-primary relative overflow-hidden">
            {/* Background effects */}
            <CursorGlow color="rgb(99, 112, 241)" size={500} blur={60} opacity={0.12} />

            {/* Decorative blobs */}
            <div className="fixed -top-40 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
            <div className="fixed -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-600/5 blur-3xl pointer-events-none" />

            {/* Header */}
            <motion.header
                className="sticky top-0 z-50 border-b border-border/10 bg-surface-1/40 backdrop-blur-xl"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={cn('mx-auto px-6 py-4 flex items-center justify-between', maxWidthClasses[maxWidth])}>
                    {showBackButton && (
                        <Link
                            href={backHref}
                            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Back
                        </Link>
                    )}

                    <Link href="/" className="flex items-center gap-3 mx-auto">
                        <motion.div
                            className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center shadow-lg"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            <span className="font-display text-sm font-bold text-white">Z</span>
                        </motion.div>
                        <span className="font-display text-xl font-semibold text-text-primary">ZenPC</span>
                    </Link>

                    <div className="w-16" /> {/* Spacer for centering */}
                </div>
            </motion.header>

            {/* Main content */}
            <main className={cn('flex-1 mx-auto w-full px-6 py-12', maxWidthClasses[maxWidth], className)}>
                {(title || description) && (
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {title && (
                            <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="text-text-muted text-lg max-w-2xl mx-auto">
                                {description}
                            </p>
                        )}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {children}
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/10 bg-surface-1/30 backdrop-blur-xl">
                <div className={cn('mx-auto px-6 py-8', maxWidthClasses[maxWidth])}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                        <div className="flex items-center gap-2 text-text-muted/80">
                            <span>© {new Date().getFullYear()} ZenPC</span>
                            <span className="text-border">•</span>
                            <span>All rights reserved</span>
                        </div>
                        <div className="flex items-center gap-6">
                            {['Privacy', 'Terms', 'Contact'].map((item) => (
                                <Link
                                    key={item}
                                    href={`/${item.toLowerCase()}`}
                                    className="text-text-muted/80 hover:text-accent transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
