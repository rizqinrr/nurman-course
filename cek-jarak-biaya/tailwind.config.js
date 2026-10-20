/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        utama: {
          50: '#f0f5fc',
          100: '#e1ecf8',
          200: '#c2d9f1',
          500: '#2e4b7a',
          600: '#233a60',
          700: '#1a2c49',
        },
      },
    },
  },
  plugins: [],
}
