import type { Page, PageData } from "vuepress/core"
import type { GitPluginPageData } from "@vuepress/plugin-git"

import {
	BlogPluginPageData,
	BlogPluginFrontmatter,
} from "@vuepress/plugin-blog"
import { ReadingTimePluginPageData } from "@vuepress/plugin-reading-time"
import { SeoPluginPageData } from "@vuepress/plugin-seo"

import type { FrontmatterPluginState, SidebarArrayOptions } from "."
import { AutoLinkConfig } from "vuepress/client"

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

export interface DefaultThemeHomePageFrontmatter
	extends DefaultThemePageFrontmatter {
	home: true
	heroImage?: string
	heroImageDark?: string
	heroAlt?: string
	heroHeight?: number
	heroText?: string | null
	tagline?: string | null
	actions?: {
		text: string
		link: string
		type?: "primary" | "secondary"
	}[]
	features?: {
		title: string
		details: string
	}[]
	footer?: string
	footerHtml?: boolean
}

export interface DefaultThemeNormalPageFrontmatter
	extends DefaultThemePageFrontmatter {
	home?: false
	editLink?: boolean
	editLinkPattern?: string
	lastUpdated?: boolean
	contributors?: boolean
	sidebar?: false | "heading" | SidebarArrayOptions
	sidebarDepth?: number
	prev?: string | AutoLinkConfig
	next?: string | AutoLinkConfig
}
