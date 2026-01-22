'use client';

import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AnimatedCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
    front: React.ReactNode;
    back: React.ReactNode;
    flipOnHover?: boolean;
    flipOnClick?: boolean;
    direction?: 'horizontal' | 'vertical';
    duration?: number;
    className?: string;
    frontClassName?: string;
    backClassName?: string;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
    ({
        front,
        back,
        flipOnHover = false,
        flipOnClick = true,
        direction = 'horizontal',
        duration = 0.6,
        className = '',
        frontClassName = '',
        backClassName = '',
        ...props
    }, ref) => {
        const [isFlipped, setIsFlipped] = useState(false);

        const handleClick = () => {
            if (flipOnClick) {
                setIsFlipped(!isFlipped);
            }
        };

        const handleHover = (hovering: boolean) => {
            if (flipOnHover) {
                setIsFlipped(hovering);
            }
        };

        const rotateAxis = direction === 'horizontal' ? 'rotateY' : 'rotateX';
        const frontRotation = isFlipped ? (direction === 'horizontal' ? 180 : -180) : 0;
        const backRotation = isFlipped ? 0 : (direction === 'horizontal' ? -180 : 180);

        return (
            <motion.div
                ref={ref}
                className={cn('relative', className)}
                onClick={handleClick}
                onMouseEnter={() => handleHover(true)}
                onMouseLeave={() => handleHover(false)}
                {...props}
            >
                {/* Front */}
                <motion.div
                    className={cn(
                        'card p-6 w-full h-full backface-hidden',
                        frontClassName
                    )}
                    animate={{ [rotateAxis]: frontRotation }}
                    transition={{ duration, ease: [0.2, 0.8, 0.2, 1] }}
                    style={{
                        backfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {front}
                </motion.div>

                {/* Back */}
                <motion.div
                    className={cn(
                        'card p-6 absolute inset-0 w-full h-full backface-hidden',
                        backClassName
                    )}
                    initial={{ [rotateAxis]: direction === 'horizontal' ? -180 : 180 }}
                    animate={{ [rotateAxis]: backRotation }}
                    transition={{ duration, ease: [0.2, 0.8, 0.2, 1] }}
                    style={{
                        backfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {back}
                </motion.div>
            </motion.div>
        );
    }
);

AnimatedCard.displayName = 'AnimatedCard';

// Expandable Card
export interface ExpandableCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
    header: React.ReactNode;
    content: React.ReactNode;
    defaultExpanded?: boolean;
    onExpandChange?: (expanded: boolean) => void;
}

export const ExpandableCard = ({
    header,
    content,
    defaultExpanded = false,
    onExpandChange,
    className = '',
    ...props
}: ExpandableCardProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const toggleExpand = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        onExpandChange?.(newState);
    };

    return (
        <div className={cn('card overflow-hidden', className)} {...props}>
            <button
                onClick={toggleExpand}
                className="w-full p-4 flex items-center justify-between hover:bg-surface-1/30 transition-colors"
            >
                {header}
                <motion.svg
                    className="w-5 h-5 text-text-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        <div className="p-4 pt-0 border-t border-border/10">
                            {content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Stacked Cards
export interface StackedCardsProps {
    items: React.ReactNode[];
    maxVisible?: number;
    offset?: number;
    className?: string;
}

export const StackedCards = ({
    items,
    maxVisible = 3,
    offset = 8,
    className = '',
}: StackedCardsProps) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const visibleItems = items.slice(activeIndex, activeIndex + maxVisible);

    return (
        <div className={cn('relative', className)} style={{ height: '300px' }}>
            {visibleItems.map((item, index) => (
                <motion.div
                    key={activeIndex + index}
                    className="card p-6 absolute inset-x-0 cursor-pointer"
                    initial={{
                        y: index * offset,
                        scale: 1 - index * 0.05,
                        opacity: 1 - index * 0.2,
                    }}
                    animate={{
                        y: index * offset,
                        scale: 1 - index * 0.05,
                        opacity: 1 - index * 0.2,
                        zIndex: maxVisible - index,
                    }}
                    whileHover={index === 0 ? { scale: 1.02, y: -5 } : {}}
                    transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                    onClick={() => {
                        if (index === 0 && activeIndex < items.length - 1) {
                            setActiveIndex(activeIndex + 1);
                        }
                    }}
                    style={{ transformOrigin: 'top center' }}
                >
                    {item}
                </motion.div>
            ))}

            {/* Navigation */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-4">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={cn(
                            'w-2 h-2 rounded-full transition-all',
                            index === activeIndex ? 'bg-accent w-4' : 'bg-surface-3'
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

// Reveal Card - reveals content on scroll/viewport
export interface RevealCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
}

export const RevealCard = ({
    children,
    delay = 0,
    direction = 'up',
    className = '',
    ...props
}: RevealCardProps) => {
    const directionVariants = {
        up: { y: 30, opacity: 0 },
        down: { y: -30, opacity: 0 },
        left: { x: 30, opacity: 0 },
        right: { x: -30, opacity: 0 },
    };

    return (
        <motion.div
            className={cn('card p-6', className)}
            initial={directionVariants[direction]}
            whileInView={{ x: 0, y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedCard;
