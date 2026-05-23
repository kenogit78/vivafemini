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
        primary: '#E91E8C',
        'primary-light': '#FF4D8D',
        'primary-bg': '#FFF0F5',
        'app-bg': '#F8F8F8',
        'text-primary': '#1A1A2E',
        'text-secondary': '#6B7280',
      },
      borderRadius: {
        card: '16px',
        pill: '999px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
