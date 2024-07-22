import { DefaultThemeLocaleOptions, NavbarOptions } from "../../shared"

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
	sidebar: "auto",
	sidebarDepth: 2,
	// page meta
	editLink: true,
	editLinkText: "Edit this page",
	lastUpdated: true,
	lastUpdatedText: "Last Updated",
	contributors: true,
	contributorsText: "Contributors",
	// 404 page messages
	notFound: [
		`There's nothing here.`,
		`How did we get here?`,
		`That's a Four-Oh-Four.`,
		`Looks like we've got some broken links.`,
	],
	backToHome: "Take me home",
	// a11y
	openInNewWindow: "open in new window",
	toggleColorMode: "toggle color mode",
	toggleSidebar: "toggle sidebar",
}
export const DEFAULT_LOCALE_DATA = {
	// navbar
	selectLanguageName: "en-US",
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
