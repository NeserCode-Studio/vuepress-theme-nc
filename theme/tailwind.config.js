/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./theme/**/*.{html,js,ts,vue}",
    "./docs/.vuepress/**/*.{html,js,ts,vue}",
    "./docs/**/*.md",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
};
