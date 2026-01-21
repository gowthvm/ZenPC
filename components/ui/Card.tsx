'use client';

import React, { forwardRef, useRef, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export type CardVariant = 'glass' | 'solid' | 'gradient' | 'glow' | 'interactive' | '3d';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: CardVariant;
  hover?: boolean;
  magnetic?: boolean;
  children?: React.ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  glass: 'card',
  solid: 'rounded-xl border border-border/10 bg-surface-2 shadow-md',
  gradient: 'card-gradient',
  glow: 'card-glow',
  interactive: 'card-interactive',
  '3d': 'card-3d',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'glass', hover = true, magnetic = false, children, ...props }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!magnetic || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Subtle tilt effect
      setRotateX(-mouseY / 20);
      setRotateY(mouseX / 20);
    };

    const handleMouseLeave = () => {
      if (!magnetic) return;
      setRotateX(0);
      setRotateY(0);
    };

    const magneticStyle = magnetic ? {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.1s ease-out',
    } : {};

    return (
      <motion.div
        ref={ref || cardRef}
        className={cn(variantClasses[variant], !hover && 'hover:transform-none', className)}
        style={magneticStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// Card Header component
export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={cn('space-y-4 pb-4', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

// Card Title component
export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', ...props }, ref) => (
    <h3 ref={ref} className={cn('font-display text-lg font-semibold text-text-primary', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

// Card Description component
export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-text-muted', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

// Card Content component
export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

// Card Footer component  
export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4 border-t border-border/10', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export default Card;
