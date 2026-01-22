'use client';

import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface MagneticElementProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
    children: React.ReactNode;
    strength?: number;
    radius?: number;
    disabled?: boolean;
    as?: 'div' | 'button' | 'a';
}

export const MagneticElement = forwardRef<HTMLDivElement, MagneticElementProps>(
    ({
        children,
        strength = 0.35,
        radius = 200,
        disabled = false,
        as = 'div',
        className = '',
        ...props
    }, ref) => {
        const elementRef = useRef<HTMLDivElement>(null);
        const [position, setPosition] = useState({ x: 0, y: 0 });
        const [isHovered, setIsHovered] = useState(false);

        useEffect(() => {
            const element = elementRef.current;
            if (!element || disabled) return;

            const handleMouseMove = (e: MouseEvent) => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const distanceX = e.clientX - centerX;
                const distanceY = e.clientY - centerY;
                const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

                if (distance < radius) {
                    const factor = (radius - distance) / radius;
                    setPosition({
                        x: distanceX * strength * factor,
                        y: distanceY * strength * factor,
                    });
                    setIsHovered(true);
                } else if (isHovered) {
                    setPosition({ x: 0, y: 0 });
                    setIsHovered(false);
                }
            };

            const handleMouseLeave = () => {
                setPosition({ x: 0, y: 0 });
                setIsHovered(false);
            };

            window.addEventListener('mousemove', handleMouseMove);
            element.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                element.removeEventListener('mouseleave', handleMouseLeave);
            };
        }, [disabled, isHovered, radius, strength]);

        const Component = motion[as] as typeof motion.div;

        return (
            <Component
                ref={ref || elementRef}
                className={cn('inline-block', className)}
                animate={{
                    x: position.x,
                    y: position.y,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1,
                }}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

MagneticElement.displayName = 'MagneticElement';

// Tilt Effect - 3D tilt on mouse move
export interface TiltEffectProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    maxTilt?: number;
    perspective?: number;
    scale?: number;
    disabled?: boolean;
    glare?: boolean;
    glareOpacity?: number;
}

export const TiltEffect = ({
    children,
    maxTilt = 15,
    perspective = 1000,
    scale = 1.02,
    disabled = false,
    glare = false,
    glareOpacity = 0.2,
    className = '',
    ...props
}: TiltEffectProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const tiltX = (mouseY / (rect.height / 2)) * maxTilt;
        const tiltY = -(mouseX / (rect.width / 2)) * maxTilt;

        setTilt({ x: tiltX, y: tiltY });
        setGlarePosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <div
            ref={ref}
            className={cn('relative overflow-hidden', className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={{
                perspective: `${perspective}px`,
                transformStyle: 'preserve-3d',
            }}
            {...props}
        >
            <motion.div
                animate={{
                    rotateX: tilt.x,
                    rotateY: tilt.y,
                    scale: isHovered ? scale : 1,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {children}

                {/* Glare effect */}
                {glare && isHovered && (
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 60%)`,
                        }}
                    />
                )}
            </motion.div>
        </div>
    );
};

// Cursor Glow - glowing effect following cursor
export interface CursorGlowProps {
    color?: string;
    size?: number;
    blur?: number;
    opacity?: number;
    className?: string;
}

export const CursorGlow = ({
    color = 'rgb(99, 112, 241)',
    size = 400,
    blur = 80,
    opacity = 0.15,
    className = '',
}: CursorGlowProps) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const rafId = useRef<number>();
    const lastUpdateTime = useRef<number>(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Reduced throttling for faster response (~120fps)
            const now = performance.now();
            if (now - lastUpdateTime.current < 8) return; // ~120fps
            lastUpdateTime.current = now;

            // Cancel any pending animation frame
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }

            rafId.current = requestAnimationFrame(() => {
                setPosition({ x: e.clientX, y: e.clientY });
                setIsVisible(true);
            });
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, []);

    return (
        <motion.div
            className={cn('fixed pointer-events-none z-10', className)}
            animate={{
                x: position.x - size / 2,
                y: position.y - size / 2,
                opacity: isVisible ? opacity : 0,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,  // Increased for faster response
                damping: 25,     // Adjusted for quick but smooth movement
                mass: 0.5,       // Reduced for lighter, faster feel
            }}
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
                filter: `blur(${blur}px)`,
                willChange: 'transform, opacity', // Performance optimization
            }}
        />
    );
};

export default MagneticElement;
