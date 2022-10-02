/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary' : '#FFC639',
        'secondary' : '#881226',
        'info' : '#F13D9E',
        'sky' : "#32B7E8",
        'dark' : "#151515"
      }
    },
  },
  plugins: [],
}