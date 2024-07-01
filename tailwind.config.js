/** @type {import('tailwindcss').Config} */
export default {
  content: ["./docs/.vuepress/theme/lib/**/*.{html, js, vue, cjs}"],
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