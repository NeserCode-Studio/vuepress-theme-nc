import { isArray } from "@vuepress/helper"
import {
	DefaultThemeLocaleOptions,
	NavbarOptions,
	SidebarOptions,
} from "../../shared"

const DefaultThemeNavbarConfig = [
	{
		text: "关于",
		activeMatch: "^/about/",
		link: "/blog/about/aboutme.md",
	},
	{
		text: "时间线",
		activeMatch: "^/time/",
		link: "/time/",
	},
	{
		text: "类",
		activeMatch: "^/tags/",
		link: "/tags/",
	},
	{
		text: "其他",
		children: [
			{
				text: "Markdown",
				link: "/blog/guide/markdown.md",
				activeMatch: "^/blog/guide/",
			},
			{ text: "$404", link: "/blog/guide/wtf" },
		],
	},
]
const DefaultThemeSidebarConfig = [
	{
		text: "关于",
		activeMatch: "^/about/",
		link: "/blog/about/aboutme.md",
	},
	{
		text: "时间线",
		activeMatch: "^/time/",
		link: "/time/",
	},
	{
		text: "类",
		activeMatch: "^/tags/",
		link: "/tags/",
	},
	{
		text: "其他",
		collapsible: true,
		children: [
			{
				text: "Markdown",
				link: "/blog/guide/markdown.md",
				activeMatch: "^/blog/guide/",
			},
			{ text: "$404", link: "/blog/guide/wtf" },
		],
	},
]

export const DEFAULT_LOCALE_OPTIONS = {
	// color mode
	colorMode: "auto",
	colorModeSwitch: true,
	// navbar
	navbar: DefaultThemeNavbarConfig,
	logo: null,
	repo: null,
	selectLanguageText: "Languages",
	selectLanguageAriaLabel: "Select language",
	// sidebar
	sidebar: DefaultThemeSidebarConfig,
	sidebarDepth: 2,
	// page meta
	editLink: false,
	editLinkText: "编辑",
	lastUpdated: true,
	lastUpdatedText: "⌚上次更新",
	contributors: true,
	contributorsText: "✍作者",
	prev: "上篇",
	next: "下篇",
	// 404 page messages
	notFound: [
		`There's nothing here.`,
		`How did we get here?`,
		`That's a Four-Oh-Four.`,
		`Looks like we've got some broken links.`,
	],
	backToHome: "回到首页",
	// a11y
	openInNewWindow: "在新窗口打开",
	toggleColorMode: "切换主题",
	toggleSidebar: "切换侧边栏",
}
export const DEFAULT_LOCALE_DATA = {
	// navbar
	selectLanguageName: "zh-CN",
}
/**
 * Assign default options
 */
export const assignDefaultOption = (
	localeOptions: DefaultThemeLocaleOptions
) => {
	if (!localeOptions.locales) {
		localeOptions.locales = {}
	}
	if (!localeOptions.locales["/"]) {
		localeOptions.locales["/"] = {}
	}
	let rt = Object.assign(localeOptions, {
		...DEFAULT_LOCALE_OPTIONS,
		...localeOptions,
	})
	Object.assign(localeOptions.locales["/"], {
		...DEFAULT_LOCALE_DATA,
		...localeOptions.locales["/"],
	})

	return rt
}

export const extendDefaultNavbarConfig = (config: NavbarOptions) => {
	if (!config) return []
	return [...DefaultThemeNavbarConfig, ...config]
}
export const extendDefaultSidebarConfig = (config: SidebarOptions) => {
	if (!config) return []
	if (config === "heading") return "heading"
	if (isArray(config)) return [...DefaultThemeSidebarConfig, ...config]
	return config
}
