import { viteBundler } from "@vuepress/bundler-vite"
import {
	nesercodeTheme,
	extendDefaultNavbarConfig,
	extendDefaultSidebarConfig,
} from "./theme"
import { defineUserConfig } from "vuepress"

export default defineUserConfig({
	bundler: viteBundler(),
	theme: nesercodeTheme({
		domain: "http://localhost:8080",
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
			year: "2022 - 2024",
			themeInfoDisplay: true,
			copyRight:
				"<a target='_blank' href='https://github.com/Nesercode'>NeserCode</a>",
			footerLinks: [
				{
					title: "GitHub",
					link: "https://github.com/nesercode",
				},
				{
					title: "Gitee",
					link: "https://gitee.com/nesercode",
				},
				{
					title: "Bilibili",
					link: "https://space.bilibili.com/nesercode",
				},
			],
		},
		navbar: extendDefaultNavbarConfig([
			{ text: "Github", link: "https://github.com/NeserCode" },
		]),
		sidebar: extendDefaultSidebarConfig([
			{
				text: "Desktop Application",
				collapsible: true,
				children: [
					{
						text: "RoCoX Codex(zh-CN)",
						link: "/blog/other/RoCoX-Codex.md",
						activeMatch: "^/blog/other/",
					},
					{
						text: "RoCoX Codex(en-US)",
						link: "/blog/other/RoCoX-Codex.en-US.md",
						activeMatch: "^/blog/other/",
					},
					{
						text: "KeyBoard Monitor(zh-CN)",
						link: "/blog/other/KeyBoard-Monitor.md",
						activeMatch: "^/blog/other/",
					},
					{
						text: "KeyBoard Monitor(zh-CN)",
						link: "/blog/other/KeyBoard-Monitor.en-US.md",
						activeMatch: "^/blog/other/",
					},
				],
			},
		]),

		github: {
			username: "nesercode",
			// it got expired
			accessServer: "https://github-info-server.onrender.com",
			accessToken: "nesercode",
		},
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
