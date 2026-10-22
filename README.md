# vuepress-theme-nc

An editorial VuePress 2 theme for technical notes, journals, and long-form documentation. The theme uses Tailwind CSS and keeps VuePress plugins for blog collections, search, Git metadata, reading time, Shiki syntax highlighting, SEO, and Giscus comments.

## Structure

```text
theme/
  lib/client/     # layouts, components, composables, utilities, styles
  lib/node/       # theme factory, plugin wiring, blog helpers
  lib/shared/     # public types and defaults
  templates/      # build HTML template
docs/
  .vuepress/      # demo-site configuration
  blog/           # demo articles
```

The theme source is a local TypeScript package consumed directly by the demo site. `package.json` exposes `theme/lib/node`, `theme/lib/client`, `theme/lib/shared`, components, layouts, styles, and templates.

## Commands

```bash
# Install with the committed lockfile
yarn install --frozen-lockfile

# Start the docs demo with hot reload
yarn dev

# Run Vue TypeScript checking
yarn check

# Build docs/.vuepress to docs/.vuepress/dist
yarn build
```

The project targets VuePress `2.0.0-rc.31` and the matching official plugin release line. The CI workflow installs with Corepack-enabled Yarn, runs `yarn check`, then builds the demo.

## Theme Configuration

`docs/.vuepress/config.ts` is the working configuration example. It wires:

- Vite bundling and the local `nesercodeTheme` factory.
- Giscus comment options.
- Footer metadata and external links.
- Navbar and sidebar configuration through the theme helpers.
- Site title, description, language, icon, and font metadata.

Component aliases are generated from `theme/lib/client/components`, so a site can override a theme component by replacing the corresponding `@theme/*.vue` alias.
