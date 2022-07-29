/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}', './.{html}'],
  theme: {
    extend: {
      colors: {
        'gray-secondary': '#2a3042',
        'gray-primary' : '#262B3C',
        'dark' : '#222736',
        'primary' : "#556EE6",
        'success' : '#34C38F',
        'orange' : '#F1B44C',
        'danger' : '#F46A6A',
        'dark-blue' : "#34406B"
      },
      fontFamily: {
        'sans' : ['Poppins']
      }
    },
  },
  plugins: []
};