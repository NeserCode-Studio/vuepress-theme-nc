import { fs, getDirname, path } from '@vuepress/utils';
import { viteBundler } from "@vuepress/bundler-vite"
import { webpackBundler } from '@vuepress/bundler-webpack'

import tailwindcssConfig from '../../tailwind.config'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

const __dirname = getDirname(import.meta.url);
export const nesercodeTheme = ({ themePlugins = {}, ...localeOptions } = {}) => (app) => {
  // assignDefaultLocaleOptions(localeOptions);
  // useGitPlugin(app, {
  //     createdTime: true,
  //     updatedTime: localeOptions.lastUpdated !== false,
  //     contributors: localeOptions.contributors !== false,
  // })

  return {
    name: 'vuepress-theme-nesercode',
    templateBuild: path.resolve(__dirname, '../../templates/build.html'),
    alias: {
      // use alias to make all components replaceable
      ...Object.fromEntries(fs
        .readdirSync(path.resolve(__dirname, '../client/components'))
        .filter((file) => file.endsWith('.vue'))
        .map((file) => [
          `@theme/${file}`,
          path.resolve(__dirname, '../client/components', file),
        ])),
    },
    onInitialized(app) {
      if (app.options.bundler.name === '@vuepress/bundler-vite') {
        app.options.bundler = viteBundler({
          viteOptions: {
            css: {
              postcss: {
                plugins: [
                  tailwindcss(tailwindcssConfig),
                  autoprefixer({}),
                ]
              }
            },
          }
        })
      } else {
        app.options.bundler = webpackBundler({
          postcss: {
            postcssOptions: {
              plugins: [
                ['tailwindcss', tailwindcssConfig],
                ['autoprefixer', {}],
              ]
            },
          },
        })
      }
    },
    clientConfigFile: path.resolve(__dirname, '../client/config.js'),
    extendsBundlerOptions: (config, app) => {
      // addViteSsrNoExternal(config, app, "vuepress-shared")
    },
    extendsPage: (page) => {
      // save relative file path into page data to generate edit link
      page.data.filePathRelative = page.filePathRelative;
      // save title into route meta to generate navbar and sidebar
      page.routeMeta.title = page.title;
    },
    plugins: [],
  };
};