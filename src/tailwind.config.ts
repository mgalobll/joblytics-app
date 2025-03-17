import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'light-grey': '#F8F9FA',
        'medium-grey': '#6B7280',
        'dark-grey': '#111827',
        'primary': '#2563EB',
        'primary-dark': '#1D4ED8',
        'primary-light': '#60A5FA',
        'success': '#059669',
        'success-light': '#D1FAE5',
        'warning': '#D97706',
        'warning-light': '#FEF3C7',
        'error': '#DC2626',
        'error-light': '#FEE2E2',
        'info': '#2563EB',
        'info-light': '#DBEAFE',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config; 