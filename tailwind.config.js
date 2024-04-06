/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        2: '0.625rem',
      },
      colors: {
        primary: '#f79090',
        primaryHover: '#f77575',
        black: 'black',
        black1: '#202020',
        black2: '#393737',
        gray1: '#A6A6A6',
        gray2: '#dfdfe5',
        gray3: '#666',
        gray4: '#fff',
        gray5: '#8a8787',
        gray7: '#383838',
        blue: '#005ae0',
        red: '#CC0000',
        pink1: '#fde4e4',
        pink2: '#f2cccc',
        overlay5: 'rgba(0, 0, 0, 0.5)',
      },
      width: {
        87.5: '350px'
      },
      maxWidth: {
        '80': '20rem',
        '7/10': '70%'
      },
      minWidth: {
        '12': '3rem',
        '16': '4rem',
        '20': '5rem'
      },
      minHeight: {
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '88': '22rem',
        '96': '24rem'
      },
      maxHeight: {
        '72': '18rem',
        '88': '22rem',
        '96': '24rem',
        '8/10': '80vh',
      }
    },
  },
  plugins: [],
}

