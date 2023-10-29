/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f9b6b5',
        black1: '#122643',
        gray1: '#A6A6A6',
      }
    },
  },
  plugins: [],
}

