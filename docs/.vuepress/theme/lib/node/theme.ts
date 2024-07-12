import { fs, getDirname, path } from "@vuepress/utils"
import { viteBundler } from "@vuepress/bundler-vite"
import { webpackBundler } from "@vuepress/bundler-webpack"

import { activeHeaderLinksPlugin } from "@vuepress/plugin-active-header-links"
import { readingTimePlugin } from "@vuepress/plugin-reading-time"
import { gitPlugin } from "@vuepress/plugin-git"
import { tocPlugin } from "@vuepress/plugin-toc"
import { nprogressPlugin } from "@vuepress/plugin-nprogress"
import { shikiPlugin } from "@vuepress/plugin-shiki"
import { markdownContainerPlugin } from "@vuepress/plugin-markdown-container"
import { seoPlugin } from "@vuepress/plugin-seo"
import { themeDataPlugin } from "@vuepress/plugin-theme-data"
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance"

import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import tailwindcssConfig from "../../tailwind.config"
import { useBlogPlugin } from "./utils/useBlog"
import { assignDefaultOption } from "./utils/assignDefaultOption"

import type { ThemePage } from "../shared"
import type { App, Bundler, AppConfig } from "vuepress/core"

const __dirname = getDirname(import.meta.url)
export const nesercodeTheme =
	({ themePlugins = {}, ...localeOptions } = {}) =>
	(app: App) => {
		let themeData = assignDefaultOption(localeOptions)

		return {
			name: "vuepress-theme-nesercode",
			templateBuild: path.resolve(__dirname, "../../templates/build.html"),
			alias: {
				// use alias to make all components replaceable
				...Object.fromEntries(
					fs
						.readdirSync(path.resolve(__dirname, "../client/components"))
						.filter((file) => file.endsWith(".vue"))
						.map((file) => [
							`@theme/${file}`,
							path.resolve(__dirname, "../client/components", file),
						])
				),
			},
			onInitialized(app: App) {
				if (app.options.bundler.name === "@vuepress/bundler-vite") {
					app.options.bundler = viteBundler({
						viteOptions: {
							css: {
								postcss: {
									plugins: [tailwindcss(tailwindcssConfig), autoprefixer({})],
								},
							},
						},
					})
				} else {
					app.options.bundler = webpackBundler({
						postcss: {
							postcssOptions: {
								plugins: [
									["tailwindcss", tailwindcssConfig],
									["autoprefixer", {}],
								],
							},
						},
					}) as unknown as Bundler
				}
			},
			clientConfigFile: path.resolve(__dirname, "../client/config.ts"),
			extendsBundlerOptions: (_config: AppConfig, _app: App) => {
				// addViteSsrNoExternal(config, app, "vuepress-shared")
			},
			extendsPage: (page: ThemePage) => {
				// save relative file path into page data to generate edit link
				page.data.filePathRelative = page.filePathRelative
				// save title into route meta to generate navbar and sidebar
				page.routeMeta.title = page.title
			},
			plugins: [
				activeHeaderLinksPlugin({
					headerLinkSelector: "a.vuepress-toc-link",
					headerAnchorSelector: ".header-anchor",
					offset: 5,
					delay: 300,
				}),
				readingTimePlugin(),
				gitPlugin(),
				tocPlugin(),
				nprogressPlugin(),
				shikiPlugin({
					langs: [
						"bash",
						"c++",
						"c#",
						"css",
						"dart",
						"diff",
						"docker",
						"go",
						"graphql",
						"html",
						"java",
						"js",
						"json",
						"jsx",
						"latex",
						"lua",
						"md",
						"php",
						"postcss",
						"powershell",
						"prisma",
						"python",
						"rust",
						"sass",
						"scss",
						"sql",
						"stylus",
						"swift",
						"ts",
						"vb",
						"vue",
						"wenyan",
						"xml",
						"yaml",
					],
					theme: "github-light",
					themes: {
						light: "github-light",
						dark: "nord",
					},

					lineNumbers: 3,
					notationDiff: true,
					notationFocus: true,
				}),
				markdownContainerPlugin({
					type: "tip",
				}),
				markdownContainerPlugin({
					type: "warning",
				}),
				markdownContainerPlugin({
					type: "danger",
				}),
				markdownContainerPlugin({
					type: "details",
				}),
				seoPlugin({
					hostname: "https://nesercode.github.io",
				}),
				useBlogPlugin(),
				themeDataPlugin({ themeData }),
				mdEnhancePlugin({
					gfm: true,
					delay: 200 + 300,
				}),
			],
		}
	}
