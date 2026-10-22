import { DefaultPagesMapFilter, DefaultPageInfoTansformer } from "../../shared"

import type { App } from "vuepress/core"
import type {
	PagesMap,
	PagesMapFilter,
	PagesMapTransformer,
} from "../../shared"

export const getPagesMap = (
	{ pages }: App,
	filter: PagesMapFilter = DefaultPagesMapFilter,
	transformer: PagesMapTransformer = DefaultPageInfoTansformer
) => {
	const map: PagesMap = {}

	pages
		.filter(
			(page) =>
				filter(page) &&
				// filter 404
				page.path.substring(page.pathLocale.length - 1) !== "/404.html"
		)
		.forEach((page) => {
			;(map[page.pathLocale] ??= []).push(transformer(page))
		})

	return map
}
