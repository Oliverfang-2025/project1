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
        // 暗色背景层次 (Linear/Vercel 风格)
        background: {
          DEFAULT: '#0a0a0f',  // 最深 - 页面主背景
          secondary: '#111118', // 中间 - 卡片/区块背景
          tertiary: '#1a1a24',  // 浅 - 悬浮/高亮背景
        },
        // 前景色/文字色
        foreground: {
          DEFAULT: '#fafafa',   // 主要文字
          muted: '#a1a1aa',     // 次要文字
          subtle: '#71717a',    // 辅助文字
        },
        // 科技蓝主色 (基于 sky-500)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // 主色
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // 青色强调色 (基于 cyan-400)
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',  // 强调色
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // 保留原有 secondary 但更新为暗色主题适配
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // 边框色
        border: {
          DEFAULT: '#27272a',
          hover: '#3f3f46',
          active: '#52525b',
        },
        // 静音/灰度
        muted: {
          DEFAULT: '#27272a',
          foreground: '#a1a1aa',
        },
        // 保留原有 neutral
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
          950: '#0a0a0a',
        },
        // 保留原有 chip 主题色
        chip: {
          dark: '#1a2332',
          gold: '#d4a853',
          silicon: '#4a5568',
          glow: '#22d3ee',  // 更新为青色
        },
        // 状态色
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#0ea5e9',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      // 自定义动画
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'border-glow': {
          '0%, 100%': { borderColor: '#0ea5e9' },
          '50%': { borderColor: '#22d3ee' },
        },
      },
      // 阴影
      boxShadow: {
        'glow-sm': '0 0 10px rgba(14, 165, 233, 0.3)',
        'glow': '0 0 20px rgba(14, 165, 233, 0.4)',
        'glow-lg': '0 0 30px rgba(14, 165, 233, 0.5)',
        'glow-accent': '0 0 20px rgba(34, 211, 238, 0.4)',
        // Semiconductor theme shadows
        'glow-gold': '0 0 15px rgba(212, 168, 83, 0.6)',
        'glow-gold-lg': '0 0 25px rgba(212, 168, 83, 0.8)',
        'laser-glow': '0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(14, 165, 233, 0.4)',
      },
      // 背景渐变
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-tech': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #22d3ee 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0f 0%, #111118 100%)',
      },
    },
  },
  plugins: [],
}; 