/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefdf5',
          100: '#d6f8e6',
          200: '#b0f0d0',
          300: '#7ee4b4',
          400: '#43cf94',
          500: '#1bb477',
          600: '#109361',
          700: '#0d754f',
          800: '#0f5c41',
          900: '#104a37',
          950: '#032a1f',
        },
        secondary: {
          50: '#eff6ff',
          100: '#d9e8fd',
          200: '#bcd6fc',
          300: '#8ebdfb',
          400: '#589af7',
          500: '#377af3',
          600: '#215ce7',
          700: '#1c49cf',
          800: '#1d3ea6',
          900: '#1d3884',
          950: '#172453',
        },
        accent: {
          50: '#fff8eb',
          100: '#feefc7',
          200: '#fddb8a',
          300: '#fcc14d',
          400: '#fba724',
          500: '#f5830a',
          600: '#db6204',
          700: '#b64706',
          800: '#92370c',
          900: '#782f0e',
          950: '#431505',
        },
        success: {
          50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
          400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
          800: '#065f46', 900: '#064e3b',
        },
        warning: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
          800: '#92400e', 900: '#78350f',
        },
        danger: {
          50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5',
          400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c',
          800: '#991b1b', 900: '#7f1d1d',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px -8px rgba(16, 147, 97, 0.12)',
        'card-hover': '0 12px 36px -10px rgba(16, 147, 97, 0.22)',
        glow: '0 0 0 4px rgba(27, 180, 119, 0.15)',
      },
      backgroundImage: {
        'hero-pattern': "radial-gradient(circle at 20% 20%, rgba(27,180,119,0.10), transparent 45%), radial-gradient(circle at 80% 30%, rgba(55,122,243,0.10), transparent 45%)",
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'beat': {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.18)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.12)' },
          '60%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'beat': 'beat 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
