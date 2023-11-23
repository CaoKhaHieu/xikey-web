/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f79090',
        primaryHover: '#f77575',
        black: 'black',
        black1: '#202020',
        gray1: '#A6A6A6',
        gray2: '#dfdfe5',
        gray3: '#666',
        gray4: '#fff',
        blue: '#005ae0',
      },
      width: {
        87.5: '350px'
      },
      maxWidth: {
        '7/10': '70%'
      }
    },
  },
  plugins: [],
}

