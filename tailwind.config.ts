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
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
      },
      transitionTimingFunction: {
        premium: 'var(--ease-premium)',
        out: 'var(--ease-out)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass:
          '0 1px 0 rgb(255 255 255 / 0.04) inset, 0 0 0 1px rgb(255 255 255 / 0.06) inset, 0 10px 30px rgb(0 0 0 / 0.45)',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      const newUtilities = {
        '.gradient-radial': {
          background: 'radial-gradient(circle at center, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 70%)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};

export default config;
