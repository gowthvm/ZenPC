'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
}

export interface ParticlesProps {
    className?: string;
    quantity?: number;
    color?: string;
    minSize?: number;
    maxSize?: number;
    speed?: number;
    connectDistance?: number;
    showConnections?: boolean;
    mouseInteract?: boolean;
    mouseRadius?: number;
    refresh?: boolean;
}

export const Particles = ({
    className = '',
    quantity = 50,
    color = 'rgb(99, 112, 241)',
    minSize = 1,
    maxSize = 3,
    speed = 0.5,
    connectDistance = 120,
    showConnections = true,
    mouseInteract = true,
    mouseRadius = 150,
    refresh = false,
}: ParticlesProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0, isActive: false });
    const animationRef = useRef<number>();

    const createParticle = useCallback((width: number, height: number): Particle => {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * speed,
            vy: (Math.random() - 0.5) * speed,
            size: Math.random() * (maxSize - minSize) + minSize,
            opacity: Math.random() * 0.5 + 0.3,
            color,
        };
    }, [color, maxSize, minSize, speed]);

    const initParticles = useCallback((width: number, height: number) => {
        particlesRef.current = Array.from({ length: quantity }, () =>
            createParticle(width, height)
        );
    }, [quantity, createParticle]);

    const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba');
        ctx.fill();
    }, []);

    const drawConnection = useCallback((
        ctx: CanvasRenderingContext2D,
        p1: Particle,
        p2: Particle,
        distance: number
    ) => {
        const opacity = 1 - (distance / connectDistance);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = color.replace(')', `, ${opacity * 0.2})`).replace('rgb', 'rgba');
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }, [color, connectDistance]);

    const updateParticle = useCallback((particle: Particle, width: number, height: number) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        // Keep in bounds
        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));

        // Mouse interaction
        if (mouseInteract && mouseRef.current.isActive) {
            const dx = mouseRef.current.x - particle.x;
            const dy = mouseRef.current.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseRadius) {
                const force = (mouseRadius - distance) / mouseRadius;
                particle.vx -= (dx / distance) * force * 0.05;
                particle.vy -= (dy / distance) * force * 0.05;
            }
        }

        // Limit velocity
        const maxVel = speed * 2;
        particle.vx = Math.max(-maxVel, Math.min(maxVel, particle.vx));
        particle.vy = Math.max(-maxVel, Math.min(maxVel, particle.vy));
    }, [mouseInteract, mouseRadius, speed]);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = canvas;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        const particles = particlesRef.current;

        // Update and draw particles
        particles.forEach((particle) => {
            updateParticle(particle, width, height);
            drawParticle(ctx, particle);
        });

        // Draw connections
        if (showConnections) {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectDistance) {
                        drawConnection(ctx, particles[i], particles[j], distance);
                    }
                }
            }
        }

        animationRef.current = requestAnimationFrame(animate);
    }, [connectDistance, drawConnection, drawParticle, showConnections, updateParticle]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => {
            const { offsetWidth, offsetHeight } = canvas.parentElement || canvas;
            canvas.width = offsetWidth;
            canvas.height = offsetHeight;
            initParticles(offsetWidth, offsetHeight);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                isActive: true,
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current.isActive = false;
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animate, initParticles, refresh]);

    return (
        <canvas
            ref={canvasRef}
            className={cn('absolute inset-0 pointer-events-auto', className)}
        />
    );
};

export default Particles;
