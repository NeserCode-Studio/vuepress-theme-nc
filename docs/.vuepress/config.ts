import { viteBundler } from "@vuepress/bundler-vite"
// import { defaultTheme } from "@vuepress/theme-default"
import { nesercodeTheme, extendDefaultNavbarConfig } from "./theme"
import { defineUserConfig } from "vuepress"

export default defineUserConfig({
	bundler: viteBundler(),
	theme: nesercodeTheme({
		giscus: {
			repo: "NeserCode/NeserCode.github.io",
			repoId: "R_kgDOHf8WIA",
			category: "General",
			categoryId: "DIC_kwDOHf8WIM4CRa-j",
			mapping: "title",
			strict: "1",
			theme: "light",
			darkTheme: "dark_dimmed",
			reactionsEnabled: "1",
			inputPosition: "top",
			language: "zh-CN",
			loading: "lazy",
		},
		footer: {
			copyRight: "© 2022~~ NeserCode",
		},
		navbar: extendDefaultNavbarConfig([
			{ text: "Github", link: "https://github.com/NeserCode" },
		]),
	}),

	title: "NeserCode",
	description: "Make learning useful.",
	lang: "zh-CN",
	head: [
		[
			// Icon
			"link",
			{
				rel: "icon",
				href: "https://q1.qlogo.cn/g?b=qq&nk=510648363&s=640",
			},
		],
		[
			// Font preload?
			"link",
			{
				rel: "preload",
				href: "https://static.imalan.cn/file/font/noto-serif-sc/fonts.css",
				as: "style",
			},
		],
		[
			// Font
			"link",
			{
				rel: "stylesheet",
				href: "https://static.imalan.cn/file/font/noto-serif-sc/fonts.css",
			},
		],
	],
})
