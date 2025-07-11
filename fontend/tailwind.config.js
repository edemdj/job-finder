/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        brown: {
          50: '#F4E2D8',   // Light sand
          100: '#F0D7C7',  // Very light brown
          200: '#E8C5A6',  // Light beige
          300: '#D2B48C',  // Light brown/beige
          400: '#C19A6B',  // Medium light brown
          500: '#A0522D',  // Medium brown
          600: '#8B4513',  // Saddle brown
          700: '#7B3F00',  // Dark brown
          800: '#654321',  // Very dark brown
          900: '#4A2C17',  // Darkest brown
        },
      },
    },
  },
  plugins: [],
};