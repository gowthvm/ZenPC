import React from 'react';

const badgeStyles = {
  success: 'bg-green-600/20 text-green-300 border-green-700/40',
  warning: 'bg-yellow-700/20 text-yellow-300 border-yellow-700/40',
  error: 'bg-red-700/20 text-red-300 border-red-700/40',
  default: 'bg-surface-1/60 text-text-primary border-border/20',
  accent: 'bg-accent/20 text-accent border-accent/40',
  critical: 'bg-red-600/30 text-red-200 border-red-700/50',
  danger: 'bg-red-700/30 text-red-200 border-red-800/50',
  outline: 'border border-border/20 text-text-primary bg-transparent',
  blue: 'bg-blue-600/20 text-blue-300 border-blue-700/40',
  green: 'bg-green-600/20 text-green-300 border-green-700/40',
  yellow: 'bg-yellow-700/20 text-yellow-300 border-yellow-700/40',
  red: 'bg-red-700/20 text-red-300 border-red-700/40',
  gray: 'bg-surface-1/60 text-text-muted border-border/20',
  indigo: 'bg-indigo-600/20 text-indigo-300 border-indigo-700/40',
  emerald: 'bg-emerald-600/20 text-emerald-300 border-emerald-700/40',
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant: 'success' | 'warning' | 'error' | 'default' | 'accent' | 'critical' | 'danger' | 'outline' | 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'indigo' | 'emerald';
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant, ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium ${badgeStyles[variant]} ${className}`}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';
