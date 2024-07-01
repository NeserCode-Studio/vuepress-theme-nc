// post.config.cjs
module.exports = {
  plugins: [
    [
      "postcss-preset-env",
      {
        tailwindcss: {},
        autoprefixer: {},
      },
    ],
  ],
}