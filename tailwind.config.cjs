/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './app.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effcf9',
          100: '#d1f5ee',
          500: '#0d9488',
          600: '#0f766e',
          700: '#115e59',
        },
      },
      boxShadow: {
        card: '0 2px 8px rgba(15, 27, 51, 0.04), 0 14px 32px rgba(15, 27, 51, 0.045)',
      },
    },
  },
  plugins: [],
};
