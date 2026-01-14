import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-5 py-2 h-10 text-base',
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-fg hover:bg-accent/90',
        outline: 'border border-border bg-transparent text-text-primary hover:bg-surface-2/60',
        subtle: 'bg-surface-2 text-text-primary hover:bg-surface-2/80',
        ghost: 'bg-transparent hover:bg-surface-2/50 text-text-muted hover:text-text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => (
    <button ref={ref} className={buttonVariants({ variant, className })} {...props} />
  )
);
Button.displayName = 'Button';
