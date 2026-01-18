/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f3ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0066CC',
          600: '#0052a3',
          700: '#003d7a',
          800: '#002952',
          900: '#00142b',
        },
        secondary: {
          50: '#e6faff',
          100: '#b3f0ff',
          200: '#80e5ff',
          300: '#4ddbff',
          400: '#1ad1ff',
          500: '#00C2FF',
          600: '#0099cc',
          700: '#007399',
          800: '#004d66',
          900: '#002633',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        chip: {
          dark: '#1a2332',
          gold: '#d4a853',
          silicon: '#4a5568',
          glow: '#00C2FF',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'serif'],
      },
    },
  },
  plugins: [],
}; 