/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8eb',
          100: '#feedcb',
          200: '#fcdb94',
          300: '#fac253',
          400: '#f8a920',
          500: '#ea8b0a',
          600: '#cd6c06',
          700: '#a54c08',
          800: '#843d0e',
          900: '#6c330f',
        },
        crimson: {
          50: '#fdf2f2',
          100: '#fde6e6',
          200: '#fbd0d0',
          300: '#f7abab',
          400: '#f07474',
          500: '#e34242',
          600: '#cf2727',
          700: '#ae1d1d',
          800: '#8f1b1b',
          900: '#761c1c',
        }
      },
    },
  },
  plugins: [],
};
