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
	| "comment"
	| "sidebarCategory"
export type FrontmatterPluginState = {
	plugins: Record<PluginName, boolean>
}
