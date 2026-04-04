import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'Courier New', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: '#E8620A',
          dark: '#C44E05',
          light: '#FAEBD7',
          muted: '#E8A070',
        },
        ink: {
          DEFAULT: '#1A1410',
          2: '#2C2420',
          3: '#3D3028',
          muted: '#6B5E52',
          subtle: '#9A8E80',
        },
        canvas: { DEFAULT: '#F5F0E8', warm: '#EDE8E0' },
        sand: { DEFAULT: '#DDD4C4', light: '#EDE8E0' },
      },
      boxShadow: {
        card: '0 2px 8px rgba(26,20,16,0.06), 0 8px 24px rgba(26,20,16,0.04)',
        hover: '0 8px 32px rgba(26,20,16,0.12), 0 2px 8px rgba(26,20,16,0.06)',
        deep: '0 16px 48px rgba(26,20,16,0.16)',
      },
    },
  },
  plugins: [],
};
export default config;
