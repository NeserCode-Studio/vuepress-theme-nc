/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./theme/**/*.{html,js,ts,vue}",
    "./docs/.vuepress/**/*.{html,js,ts,vue}",
    "./docs/**/*.md",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        moss: {
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
      },
    },
  },
  plugins: [],
};
