/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,svelte,ts,jsx,tsx}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: "#c3cbe4",
          },
        },
      }),
      textColor: {},
      colors: {
        "gray-secondary": "#2a3042",
        "gray-primary": "#262B3C",
        dark: "#222736",
        primary: "#556EE6",
        success: "#34C38F",
        orange: "#F1B44C",
        danger: "#F46A6A",
        "dark-blue": "#34406B",
      },
      fontFamily: {
        sans: ["Poppins"],
      },
    },
  },
  plugins: [
      require("flowbite/plugin"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
  ],
  darkMode: "class",
};
