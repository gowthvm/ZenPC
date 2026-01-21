import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge for optimal Tailwind class handling
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency value
 */
export function formatCurrency(value: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Format number with abbreviation (1K, 1M, etc.)
 */
export function formatNumber(value: number): string {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}

/**
 * Map a value from one range to another
 */
export function mapRange(
    value: number,
    inputMin: number,
    inputMax: number,
    outputMin: number,
    outputMax: number
): number {
    return outputMin + ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin);
}

/**
 * Generate a random ID
 */
export function generateId(prefix = ''): string {
    const id = Math.random().toString(36).substr(2, 9);
    return prefix ? `${prefix}-${id}` : id;
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => func(...args), wait);
    };
}

/**
 * Throttle a function
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let lastFunc: ReturnType<typeof setTimeout>;
    let lastRan: number;

    return (...args: Parameters<T>) => {
        if (!lastRan) {
            func(...args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= limit) {
                    func(...args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

/**
 * Check if we're on the client side
 */
export const isClient = typeof window !== 'undefined';

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
    if (!isClient) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
