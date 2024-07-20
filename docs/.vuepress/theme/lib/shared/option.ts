import type { ThemeData } from "@vuepress/plugin-theme-data"
import type { LocaleData } from "@vuepress/shared"
import type { SidebarOptions } from "./sidebar"
import { NavbarOptions } from "./navbar"
export interface DefaultThemePluginsOptions {
	/**
	 * Enable @vuepress/plugin-active-header-links or not
	 */
	activeHeaderLinks?: boolean
	/**
	 * Enable @vuepress/plugin-back-to-top or not
	 */
	backToTop?: boolean
	/**
	 * Enable @vuepress/plugin-container or not
	 */
	container?: {
		tip?: boolean
		warning?: boolean
		danger?: boolean
		details?: boolean
		codeGroup?: boolean
		codeGroupItem?: boolean
	}
	/**
	 * Enable @vuepress/plugin-external-link-icon or not
	 */
	externalLinkIcon?: boolean
	/**
	 * Enable @vuepress/plugin-git or not
	 */
	git?: boolean
	/**
	 * Enable @vuepress/plugin-medium-zoom or not
	 */
	mediumZoom?: boolean
	/**
	 * Enable @vuepress/plugin-nprogress or not
	 */
	nprogress?: boolean
	/**
	 * Enable @vuepress/plugin-prismjs or not
	 */
	prismjs?: boolean
}
export type DefaultThemeLocaleOptions = DefaultThemeData
export type DefaultThemeData = ThemeData<DefaultThemeLocaleData>

export interface GithubOptions {
	/**
	 * username - github username to get github info
	 **/
	username?: string
	/**
	 * accessServer - github access server to get github info
	 */
	accessServer?: string
	/**
	 * accessToken - github access token to get github info
	 * Just generate a base token without any manage right.
	 */
	accessToken?: string
}
export interface GiscusOptions {
	/**
	 * repo - The GitHub repository to store comments
	 **/
	repo: `${string}/${string}`
	/**
	 * repoId - The GitHub repository ID
	 **/
	repoId: string
	/**
	 * category - The GitHub issue category to store comments
	 * @default 'General'
	 **/
	category: string
	/**
	 * categoryId - The GitHub issue category ID
	 **/
	categoryId: string
	/**
	 * mapping - The GitHub issue mapping, e.g. pathname, URL or any custom string
	 * @default 'pathname'
	 **/
	mapping: "url" | "title" | "og:title" | "specific" | "number" | "pathname"
	/**
	 * strict - Whether to use strict mapping
	 * @default '0'
	 **/
	strict?: "0" | "1"
	/**
	 * input position - The position of the comment input box
	 * @default 'bottom'
	 **/
	inputPosition?: "bottom" | "top"
	/**
	 * reactionsEnabled - Enable or disable reactions
	 * @default '1'
	 **/
	reactionsEnabled?: "0" | "1"
	/**
	 * emitMetadata - Emit metadata for commit author and URL
	 * @default '0'
	 **/
	emitMetadata?: "0" | "1"
	/**
	 * theme - The color theme, available values: light, dark, dark_dimmed, dark_high_contrast
	 * @default 'light'
	 **/
	theme?:
		| "light"
		| "dark"
		| "dark_dimmed"
		| "dark_high_contrast"
		| "light_high_contrast"
		| "light_protanopia"
		| "light_tritanopia"
		| "dark_protanopia"
		| "dark_tritanopia"
		| "preferred_color_scheme"
		| "transparent_dark"
		| "cobalt"
	/**
	 * darkTheme - The dark color theme
	 * @default 'dark'
	 **/
	darkTheme?:
		| "dark"
		| "dark_dimmed"
		| "dark_high_contrast"
		| "dark_protanopia"
		| "dark_tritanopia"
		| "preferred_color_scheme"
		| "transparent_dark"
		| "cobalt"
	/**
	 * language - The language of the widget
	 * @default 'zh-CN'
	 **/
	language?: string
	/**
	 * loading - lazy or eager
	 **/
	loading?: "lazy" | "eager"
}
export interface DefaultThemeLocaleData extends LocaleData {
	/**
	 * Default color mode
	 *
	 * @default 'auto'
	 */
	colorMode?: "auto" | "dark" | "light"
	/**
	 * Enable color mode switching and display a button in navbar or not
	 *
	 * @default true
	 */
	colorModeSwitch?: boolean
	/**
	 * Home path of current locale
	 *
	 * Used as the link of back-to-home and navbar logo
	 */
	home?: string
	/**
	 * Navbar config
	 *
	 * Set to `false` to disable navbar in current locale
	 */
	navbar?: false | NavbarOptions
	/**
	 * Navbar logo config
	 *
	 * Logo to display in navbar
	 */
	logo?: null | string
	/**
	 * Navbar logo config for dark mode
	 *
	 * Logo to display in navbar in dark mode
	 */
	logoDark?: null | string
	/**
	 * Navbar repository config
	 *
	 * Used for the repository link of navbar
	 */
	repo?: null | string
	/**
	 * Navbar repository config
	 *
	 * Used for the repository text of navbar
	 */
	repoLabel?: string
	/**
	 * Navbar language selection config
	 *
	 * Text of the language selection dropdown
	 */
	selectLanguageText?: string
	/**
	 * Navbar language selection config
	 *
	 * Aria label of of the language selection dropdown
	 */
	selectLanguageAriaLabel?: string
	/**
	 * Navbar language selection config
	 *
	 * Language name of current locale
	 *
	 * Displayed inside the language selection dropdown
	 */
	selectLanguageName?: string
	/**
	 * Sidebar config
	 *
	 * Set to `false` to disable sidebar in current locale
	 */
	sidebar?: "auto" | false | SidebarOptions
	/**
	 * Sidebar depth
	 *
	 * - Set to `0` to disable all levels
	 * - Set to `1` to include `<h2>`
	 * - Set to `2` to include `<h2>` and `<h3>`
	 * - ...
	 *
	 * The max value depends on which headers you have extracted
	 * via `markdown.headers.level`.
	 *
	 * The default value of `markdown.headers.level` is `[2, 3]`,
	 * so the default max value of `sidebarDepth` is `2`
	 */
	sidebarDepth?: number
	/**
	 * Page meta - edit link config
	 *
	 * Whether to show "Edit this page" or not
	 */
	editLink?: boolean
	/**
	 * Page meta - edit link config
	 *
	 * The text to replace the default "Edit this page"
	 */
	editLinkText?: string
	/**
	 * Page meta - edit link config
	 *
	 * Pattern of edit link
	 *
	 * @example ':repo/edit/:branch/:path'
	 */
	editLinkPattern?: string
	/**
	 * Page meta - edit link config
	 *
	 * Use `repo` config by default
	 *
	 * Set this config if your docs is placed in a different repo
	 */
	docsRepo?: string
	/**
	 * Page meta - edit link config
	 *
	 * Set this config if the branch of your docs is not 'main'
	 */
	docsBranch?: string
	/**
	 * Page meta - edit link config
	 *
	 * Set this config if your docs is placed in sub dir of your `docsRepo`
	 */
	docsDir?: string
	/**
	 * Page meta - last updated config
	 *
	 * Whether to show "Last Updated" or not
	 */
	lastUpdated?: boolean
	/**
	 * Page meta - last updated config
	 *
	 * The text to replace the default "Last Updated"
	 */
	lastUpdatedText?: string
	/**
	 * Page meta - contributors config
	 *
	 * Whether to show "Contributors" or not
	 */
	contributors?: boolean
	/**
	 * Page meta - contributors config
	 *
	 * The text to replace the default "Contributors"
	 */
	contributorsText?: string
	/**
	 * Custom block config
	 *
	 * Default title of TIP custom block
	 */
	tip?: string
	/**
	 * Custom block config
	 *
	 * Default title of WARNING custom block
	 */
	warning?: string
	/**
	 * Custom block config
	 *
	 * Default title of DANGER custom block
	 */
	danger?: string
	/**
	 * 404 page config
	 *
	 * Not Found messages for 404 page
	 */
	notFound?: string[]
	/**
	 * 404 page config
	 *
	 * Text of back-to-home link in 404 page
	 */
	backToHome?: string
	/**
	 * A11y text for external link icon
	 */
	openInNewWindow?: string
	/**
	 * A11y text for color mode toggle button
	 */
	toggleColorMode?: string
	/**
	 * A11y text for sidebar toggle button
	 */
	toggleSidebar?: string
	/**
	 * Reading Time meta - OutTime config
	 *
	 * Text of Invalid Time
	 * @example '"非法时间"'
	 * @default '"非法时间"'
	 **/
	outTime?: string
	/**
	 * Data Helper Options
	 * @default HelperOptions from plugin
	 */
	// helperOptions: HelperOptions
	/**
	 * Github Object
	 **/
	github?: GithubOptions
	/**
	 * Domain
	 */
	domain?: `http://${string}` | `https://${string}`
	/**
	 * Comment Options - Giscus
	 **/
	giscus?: GiscusOptions
	/**
	 * Footer Options
	 **/
	footer?:
		| false
		| {
				/**
				 * copyRight - CopyRight Text
				 **/
				copyRight?: false | string
				/**
				 * year - CopyRight Year
				 **/
				year?: false | string
				/**
				 * footerLinks - Footer Links
				 **/
				footerLinks?:
					| false
					| {
							/**
							 * title - Footer Link Title
							 **/
							title?: string
							/**
							 * link - Footer Link
							 **/
							link?: string
					  }[]
				/**
				 * themeInfoDisplay - Theme Info Display
				 * @default true
				 **/
				themeInfoDisplay?: boolean
		  }
}

export interface DefaultThemeOptions extends DefaultThemeLocaleOptions {
	/**
	 * To avoid confusion with the root `plugins` option,
	 * we use `themePlugins`
	 */
	themePlugins?: DefaultThemePluginsOptions
}
