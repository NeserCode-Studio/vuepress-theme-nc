/** @type {import('tailwindcss').Config} */
export default {
  content: ["./lib/**/*.{html, js, vue, cjs}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [{
    tailwindcss: {},
    autoprefixer: {},
  }],
  options: {
    safelist: ["html", "body"],
  }
}

