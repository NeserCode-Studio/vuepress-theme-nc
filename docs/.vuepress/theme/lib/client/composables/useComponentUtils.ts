import type {
	DefaultThemePageFrontmatter,
	FrontmatterPluginState,
	PaginationChanges,
	PaginationPages,
	PluginName,
} from "../../shared"
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

export const usePluginState = (
	keyName: PluginName,
	states?: DefaultThemePageFrontmatter | FrontmatterPluginState
) => {
	if (typeof states === "undefined") return true
	else if (states instanceof Array) {
		let tempValue = true
		for (let i = 0; i < states.length; i++) {
			Object.keys(states[i]).forEach((key) => {
				if (key === keyName && states.plugins)
					tempValue = states.plugins[i][key]
			})
		}
		return tempValue
	} else if (states.plugins) return !(states.plugins[keyName] === false)
	else return true
}
