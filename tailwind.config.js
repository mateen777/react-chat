/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'p1': '#2D033B',
        'p2': '#810CA8',
        'p3': '#C147E9',
        'p4': '#E5B8F4',
      }
    },
    screens: {
      'xs': {max:'475px'},
      'sm':{max:'640px'}
    },
    
  },
  plugins: [],
}