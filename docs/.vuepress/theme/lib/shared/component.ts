import type { ArticleInfo } from "."

export interface PaginationPages {
	total: number
	offset: number
	limit: number
}

export interface PaginationChanges {
	prev: () => void
	next: () => void
	page: (page: number) => void
	top: () => void
	bottom: () => void
}

export interface PaginationProps {
	pages: {
		total: number
		offset: number
		limit: number
	}
	changes?: {
		prev: () => void
		next: () => void
		page: (page: number) => void
		top: () => void
		bottom: () => void
	}
}

export type PluginName =
	| "readingTime"
	| "readingLine"
	| "pageMeta"
	| "comment"
	| "sidebar"
	| "sidebarCategory"
export type PluginState = Record<PluginName, boolean>
export type FrontmatterPluginState = {
	plugins: PluginState
}
