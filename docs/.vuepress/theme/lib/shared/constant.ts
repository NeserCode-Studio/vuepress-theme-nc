import { Page } from "vuepress"
import { PagesMapFilter, PagesMapTransformer } from "."
import { FrontmatterPluginState } from "./component"

export const defaultConstants: {
	dateFormat: string
	notFoundPluginState: FrontmatterPluginState
} = {
	dateFormat: "YY/MM-DD HH:mm",
	notFoundPluginState: {
		plugins: {
			readingTime: false,
			readingLine: false,
			comment: false,
			sidebarCategory: false,
			sidebar: false,
		},
	},
}

export const DefaultPagesMapFilter: PagesMapFilter = (page: Page) =>
	!!page.filePathRelative
export const DefaultPageInfoTansformer: PagesMapTransformer = (page: Page) => ({
	data: page.data,
	date: page.date,
	links: page.links,
	pathInferred: page.pathInferred,
	permalink: page.permalink,
	routeMeta: page.routeMeta,
	slug: page.slug,
	filePathRelative: page.filePathRelative,
})
