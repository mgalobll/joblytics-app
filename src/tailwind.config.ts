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
        // Base colors
        'light-grey': '#F3F4F6',  // Light background
        'medium-grey': '#4B5563', // Secondary text
        'dark-grey': '#1F2937',   // Primary text
        
        // Primary colors
        'primary': '#2563EB',     // Main brand color
        'primary-dark': '#1D4ED8', // Darker shade for hover
        'primary-light': '#DBEAFE', // Light background for primary
        
        // Status colors
        'success': '#059669',     // Green for success
        'success-light': '#D1FAE5', // Light green background
        'warning': '#D97706',     // Orange for warning
        'warning-light': '#FEF3C7', // Light orange background
        'error': '#DC2626',       // Red for error
        'error-light': '#FEE2E2',  // Light red background
        'info': '#2563EB',        // Blue for info
        'info-light': '#DBEAFE',   // Light blue background
        
        // Additional UI colors
        'background': '#FFFFFF',   // Main background
        'surface': '#F9FAFB',     // Card/surface background
        'border': '#E5E7EB',      // Border color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config; 