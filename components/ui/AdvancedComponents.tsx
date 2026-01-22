'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

/**
 * ULTRA-PREMIUM COMPONENT LIBRARY
 * All components come with advanced animations, glassmorphism, and neon effects
 */

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'neon' | 'gradient';
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'shine';
  interactive?: boolean;
  onClick?: () => void;
}

export const PremiumCard: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hoverEffect = 'lift',
  interactive = false,
  onClick,
}) => {
  const variants = {
    default: 'card',
    accent: 'card-accent',
    neon: 'card-neon',
    gradient: 'card-gradient',
  };

  const hoverClasses = {
    lift: 'hover:translate-y-[-4px]',
    scale: 'hover:scale-105',
    glow: 'hover:shadow-glow-lg',
    shine: 'group',
  };

  return (
    <motion.div
      className={`${variants[variant]} ${hoverClasses[hoverEffect]} ${className} ${interactive ? 'cursor-pointer' : ''}`}
      whileHover={{ y: hoverEffect === 'lift' ? -4 : 0, scale: hoverEffect === 'scale' ? 1.05 : 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  gradient?: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  badge,
  gradient = true,
}) => {
  return (
    <motion.div
      className="feature-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {badge && (
        <div className="mb-4">
          <span className="badge-neon">{badge}</span>
        </div>
      )}
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="font-display text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-muted text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

interface StatCardProps {
  value: string | number;
  label: string;
  change?: { value: number; isPositive: boolean };
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, change, icon }) => {
  return (
    <motion.div
      className="stat-card"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {icon && <div className="mb-3 text-accent text-2xl">{icon}</div>}
      <div className="text-3xl font-bold text-text-primary mb-2">{value}</div>
      <div className="text-sm text-text-muted mb-2">{label}</div>
      {change && (
        <div className={`text-xs font-semibold ${change.isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
        </div>
      )}
    </motion.div>
  );
};

interface PremiumButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  onClick,
  disabled = false,
  fullWidth = false,
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  };

  return (
    <motion.button
      className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </motion.button>
  );
};

interface GradientTextProps {
  children: ReactNode;
  variant?: 'primary' | 'neon';
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const variantClasses = {
    primary: 'text-gradient-primary',
    neon: 'text-gradient-neon',
  };

  return <span className={`${variantClasses[variant]} ${className}`}>{children}</span>;
};

interface AnimatedBadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neon';
  animated?: boolean;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  children,
  variant = 'primary',
  animated = false,
}) => {
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    neon: 'badge-neon',
  };

  return (
    <motion.div
      className={`badge ${variantClasses[variant]}`}
      animate={animated ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
};

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  heavy?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  heavy = false,
}) => {
  const panelClass = heavy ? 'glass-panel-heavy' : 'glass-panel';
  return (
    <div className={`${panelClass} p-6 md:p-8 ${className}`}>{children}</div>
  );
};

interface LoadingSkeletonProps {
  count?: number;
  height?: string;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 3,
  height = 'h-12',
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${height} rounded-lg`} />
      ))}
    </div>
  );
};

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        const newCount = Math.min(prev + Math.ceil(value / 50), value);
        return newCount;
      });
    }, duration / 50);

    return () => clearInterval(interval);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

interface ShineEffectProps {
  children: ReactNode;
}

export const ShineEffect: React.FC<ShineEffectProps> = ({ children }) => {
  return (
    <div className="relative overflow-hidden">
      {children}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 translate-x-[-100%] hover:translate-x-[100%] transition-all duration-500" />
    </div>
  );
};

interface RevealProps {
  children: ReactNode;
  delay?: number;
}

export const Reveal: React.FC<RevealProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

interface PulseProps {
  children: ReactNode;
  intensity?: 'subtle' | 'normal' | 'strong';
}

export const Pulse: React.FC<PulseProps> = ({ children, intensity = 'normal' }) => {
  const scales = {
    subtle: [1, 1.02, 1],
    normal: [1, 1.05, 1],
    strong: [1, 1.08, 1],
  };

  return (
    <motion.div
      animate={{ scale: scales[intensity] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
};

interface FloatProps {
  children: ReactNode;
  duration?: number;
  distance?: number;
}

export const Float: React.FC<FloatProps> = ({
  children,
  duration = 3,
  distance = 10,
}) => {
  return (
    <motion.div
      animate={{ y: [-distance, distance, -distance] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

interface CtaBoxProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  icon?: React.ReactNode;
}

export const CtaBox: React.FC<CtaBoxProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
  icon,
}) => {
  return (
    <motion.div
      className="card-gradient p-8 md:p-12 text-center"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {icon && <div className="text-5xl mb-4 text-center">{icon}</div>}
      <h3 className="font-display text-2xl font-bold text-text-primary mb-3">
        {title}
      </h3>
      <p className="text-text-muted mb-6">{description}</p>
      <PremiumButton
        variant="primary"
        onClick={onButtonClick}
        icon={<ArrowRight size={20} />}
      >
        {buttonText}
      </PremiumButton>
    </motion.div>
  );
};

interface ComparisonTableProps {
  items: Array<{
    label: string;
    values: (string | React.ReactNode)[];
  }>;
  headers: string[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  items,
  headers,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/10">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/10 bg-surface-1/40">
            <th className="px-6 py-4 text-left font-semibold text-text-primary">
              Feature
            </th>
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-6 py-4 text-center font-semibold text-text-primary"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr
              key={i}
              className="border-b border-border/5 transition-colors hover:bg-surface-1/20"
            >
              <td className="px-6 py-4 font-medium text-text-primary">
                {item.label}
              </td>
              {item.values.map((value, j) => (
                <td key={j} className="px-6 py-4 text-center text-text-muted">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface TimelineItemProps {
  step: number;
  title: string;
  description: string;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  step,
  title,
  description,
  isLast = false,
}) => {
  return (
    <motion.div
      className="relative pl-8 pb-8"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gradient-to-r from-accent to-accent-secondary ring-4 ring-surface-1 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{step}</span>
      </div>

      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-3 top-6 w-0.5 h-12 bg-gradient-to-b from-accent/50 to-transparent" />
      )}

      {/* Content */}
      <h4 className="font-semibold text-text-primary mb-2">{title}</h4>
      <p className="text-text-muted text-sm">{description}</p>
    </motion.div>
  );
};
