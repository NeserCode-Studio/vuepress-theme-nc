import { viteBundler } from "@vuepress/bundler-vite"
// import { defaultTheme } from "@vuepress/theme-default"
import { nesercodeTheme } from "./theme"
import { defineUserConfig } from "vuepress"

export default defineUserConfig({
	bundler: viteBundler(),
	theme: nesercodeTheme(),

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
