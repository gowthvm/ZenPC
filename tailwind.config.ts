import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        'surface-1': 'rgb(var(--surface-1) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        'surface-3': 'rgb(var(--surface-3) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        text: {
          primary: 'rgb(var(--text) / <alpha-value>)',
          muted: 'rgb(var(--muted) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          fg: 'rgb(var(--accent-fg) / <alpha-value>)',
        },
        // Semantic colors
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      transitionDuration: {
        instant: 'var(--dur-instant)',
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
        slower: 'var(--dur-slower)',
      },
      transitionTimingFunction: {
        premium: 'var(--ease-premium)',
        out: 'var(--ease-out)',
        spring: 'var(--ease-spring)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        elevated: 'var(--shadow-elevated)',
        lifted: 'var(--shadow-lifted)',
        'inset-sm': 'var(--shadow-inset)',
        glass: '0 1px 0 rgb(255 255 255 / 0.04) inset, 0 0 0 1px rgb(255 255 255 / 0.06) inset, 0 10px 30px rgb(0 0 0 / 0.45)',
        'glow-sm': '0 0 10px rgb(var(--accent) / 0.3)',
        'glow-md': '0 0 20px rgb(var(--accent) / 0.3), 0 0 40px rgb(var(--accent) / 0.1)',
        'glow-lg': '0 0 30px rgb(var(--accent) / 0.4), 0 0 60px rgb(var(--accent) / 0.2)',
        'glow-success': '0 0 20px rgb(74 222 128 / 0.3), 0 0 40px rgb(74 222 128 / 0.1)',
        'glow-warning': '0 0 20px rgb(251 191 36 / 0.3), 0 0 40px rgb(251 191 36 / 0.1)',
        'glow-error': '0 0 20px rgb(248 113 113 / 0.3), 0 0 40px rgb(248 113 113 / 0.1)',
        'depth-1': '0 1px 2px rgb(0 0 0 / 0.1), 0 1px 3px rgb(0 0 0 / 0.1)',
        'depth-2': '0 4px 6px rgb(0 0 0 / 0.1), 0 2px 4px rgb(0 0 0 / 0.1)',
        'depth-3': '0 10px 15px rgb(0 0 0 / 0.1), 0 4px 6px rgb(0 0 0 / 0.1)',
        'depth-4': '0 20px 25px rgb(0 0 0 / 0.15), 0 10px 10px rgb(0 0 0 / 0.1)',
      },
      opacity: {
        '8': '0.08',
        '12': '0.12',
        '15': '0.15',
        '92': '0.92',
      },
      backdropBlur: {
        glass: '12px',
        'glass-heavy': '24px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-from-top': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-from-left': {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-from-right': {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'scale-out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgb(var(--accent) / 0.3), 0 0 40px rgb(var(--accent) / 0.1)' },
          '50%': { boxShadow: '0 0 30px rgb(var(--accent) / 0.5), 0 0 60px rgb(var(--accent) / 0.2)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
          '25%': { borderRadius: '58% 42% 75% 25% / 76% 46% 54% 24%' },
          '50%': { borderRadius: '50% 50% 33% 67% / 55% 27% 73% 45%' },
          '75%': { borderRadius: '33% 67% 58% 42% / 63% 68% 32% 37%' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-out': 'fade-out 0.3s ease-in',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'scale-out': 'scale-out 0.2s ease-in',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        morph: 'morph 8s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
        wiggle: 'wiggle 0.3s ease-in-out',
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      const newUtilities = {
        '.gradient-radial': {
          background: 'radial-gradient(circle at center, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 70%)',
        },
        '.gradient-conic': {
          background: 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-from) 0deg, var(--tw-gradient-to) 360deg)',
        },
        '.z-5': { zIndex: '5' },
        // 3D Transform utilities
        '.transform-3d': {
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        // Text shadow utilities
        '.text-shadow-glow': {
          textShadow: '0 0 10px rgb(var(--accent) / 0.5), 0 0 20px rgb(var(--accent) / 0.3)',
        },
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgb(0 0 0 / 0.5)',
        },
        // Mask utilities for gradient borders
        '.mask-gradient-border': {
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};

export default config;
