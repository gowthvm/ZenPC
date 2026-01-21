'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselItem {
    id: string;
    content: React.ReactNode;
}

export interface ComponentCarouselProps {
    items: CarouselItem[];
    itemWidth?: number;
    gap?: number;
    showControls?: boolean;
    showIndicators?: boolean;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    className?: string;
}

export const ComponentCarousel = ({
    items,
    itemWidth = 280,
    gap = 16,
    showControls = true,
    showIndicators = true,
    autoPlay = false,
    autoPlayInterval = 4000,
    className = '',
}: ComponentCarouselProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const x = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 300, damping: 30 });

    // Calculate visible items
    const visibleItems = Math.floor(containerWidth / (itemWidth + gap)) || 1;
    const maxIndex = Math.max(0, items.length - visibleItems);

    // Update container width on resize
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Auto play
    useEffect(() => {
        if (!autoPlay || isDragging) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, maxIndex, isDragging]);

    // Update position when activeIndex changes
    useEffect(() => {
        const newX = -activeIndex * (itemWidth + gap);
        x.set(newX);
    }, [activeIndex, itemWidth, gap, x]);

    const handlePrev = () => {
        setActiveIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    const handleDragEnd = (_: any, info: any) => {
        setIsDragging(false);
        const threshold = itemWidth / 3;

        if (info.offset.x > threshold) {
            handlePrev();
        } else if (info.offset.x < -threshold) {
            handleNext();
        }
    };

    return (
        <div className={cn('relative', className)}>
            {/* Carousel container */}
            <div
                ref={containerRef}
                className="overflow-hidden"
            >
                <motion.div
                    className="flex cursor-grab active:cursor-grabbing"
                    style={{
                        x: springX,
                        gap,
                    }}
                    drag="x"
                    dragConstraints={{
                        left: -(items.length - visibleItems) * (itemWidth + gap),
                        right: 0,
                    }}
                    dragElastic={0.1}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                >
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className="flex-shrink-0"
                            style={{ width: itemWidth }}
                            animate={{
                                scale: index === activeIndex ? 1 : 0.95,
                                opacity: index === activeIndex ? 1 : 0.7,
                            }}
                            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                        >
                            {item.content}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Navigation controls */}
            {showControls && items.length > visibleItems && (
                <>
                    <button
                        onClick={handlePrev}
                        disabled={activeIndex === 0}
                        className={cn(
                            'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4',
                            'w-10 h-10 rounded-full bg-surface-2/90 backdrop-blur-sm',
                            'flex items-center justify-center shadow-lg border border-border/20',
                            'transition-all duration-200 ease-premium',
                            activeIndex === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-accent/20 hover:border-accent/30'
                        )}
                    >
                        <ChevronLeft className="w-5 h-5 text-text-primary" />
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={activeIndex >= maxIndex}
                        className={cn(
                            'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4',
                            'w-10 h-10 rounded-full bg-surface-2/90 backdrop-blur-sm',
                            'flex items-center justify-center shadow-lg border border-border/20',
                            'transition-all duration-200 ease-premium',
                            activeIndex >= maxIndex
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-accent/20 hover:border-accent/30'
                        )}
                    >
                        <ChevronRight className="w-5 h-5 text-text-primary" />
                    </button>
                </>
            )}

            {/* Indicators */}
            {showIndicators && items.length > visibleItems && (
                <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                                'h-1.5 rounded-full transition-all duration-200',
                                index === activeIndex
                                    ? 'w-6 bg-accent'
                                    : 'w-1.5 bg-surface-3 hover:bg-surface-3/80'
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Simple horizontal scroll container with snap
export const HorizontalScroll = ({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                'flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory',
                'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface-3/30',
                '-mx-4 px-4',
                className
            )}
        >
            {React.Children.map(children, (child) => (
                <div className="flex-shrink-0 snap-start">
                    {child}
                </div>
            ))}
        </div>
    );
};

export default ComponentCarousel;
