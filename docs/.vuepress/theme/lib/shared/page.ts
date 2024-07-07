import type { Page, PageData } from "vuepress/core"
import type { GitPluginPageData } from "@vuepress/plugin-git"
import type { NavLink, SidebarConfig } from "./nav.js"
import {
	BlogPluginPageData,
	BlogPluginFrontmatter,
} from "@vuepress/plugin-blog"
import { ReadingTimePluginPageData } from "@vuepress/plugin-reading-time"
import { SeoPluginPageData } from "@vuepress/plugin-seo"

import type { FrontmatterPluginState } from "."

export interface ExtraPageData extends PageData {
	filePathRelative?: string | null
}
export interface DefaultThemePageData extends GitPluginPageData {
	filePathRelative: string | null
}
export interface ThemePageData
	extends BlogPluginPageData,
		Partial<GitPluginPageData>,
		Partial<ReadingTimePluginPageData>,
		Partial<SeoPluginPageData> {
	filePathRelative?: string | null
}
export type ThemePage = Page<ThemePageData>

export interface DefaultThemePageFrontmatter {
	home?: boolean
	navbar?: boolean
	plugins?: FrontmatterPluginState
	blog?: BlogPluginFrontmatter["blog"]
}
