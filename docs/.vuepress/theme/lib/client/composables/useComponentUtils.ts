import type { PaginationChanges, PaginationPages } from "../../shared"
import type { Ref } from "vue"

export const usePaginationChanges: (
	pageSet: Ref<PaginationPages>
) => PaginationChanges = (pages) => ({
	prev: () => {
		if (pages.value.offset <= 0) return
		pages.value.offset -= pages.value.limit
	},
	next: () => {
		if (pages.value.offset + pages.value.limit >= pages.value.total) return
		pages.value.offset += pages.value.limit
	},
	page: (page: number) => {
		return (pages.value.offset = (page - 1) * pages.value.limit)
	},
	top: () => {
		pages.value.offset = 0
	},
	bottom: () => {
		let totalPages = Math.ceil(pages.value.total / pages.value.limit)
		pages.value.offset = (totalPages - 1) * pages.value.limit
	},
})
