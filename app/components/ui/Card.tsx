import React from 'react';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'glass' | 'solid';
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'glass', ...props }, ref) => (
    <div
      ref={ref}
      className={
        variant === 'glass'
          ? `card ${className}`
          : `rounded-xl border border-border/10 bg-surface-2 shadow-md ${className}`
      }
      {...props}
    />
  )
);
Card.displayName = 'Card';
