/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 4px 12px rgba(0,0,0,0.06)'
      },
      colors: {
        primary: '#0077B6',
        secondary: '#90E0EF'
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system']
      }
    },
  },
  plugins: [],
}

