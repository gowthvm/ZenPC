import React from 'react';

const badgeStyles = {
  success: 'bg-green-600/20 text-green-300 border-green-700/40',
  warning: 'bg-yellow-700/20 text-yellow-300 border-yellow-700/40',
  error: 'bg-red-700/20 text-red-300 border-red-700/40',
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant: 'success' | 'warning' | 'error';
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
