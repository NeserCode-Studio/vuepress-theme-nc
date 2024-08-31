import { useDebounceFn, useEventListener } from "@vueuse/core"
import { useRoute } from "vuepress/client"

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

export const useElementSrcolled = (elementSelector: string) => {
	if (!document) return false
	const element = document.querySelector(elementSelector)
	if (!element) return false

	return {
		onScroll: (callback: (total: number, scrolled: number) => void) => {
			const listener = useDebounceFn(() => {
				let rects = element.getBoundingClientRect()
				let scrolled =
					rects.height - rects.bottom > 0
						? rects.height - rects.bottom > rects.height
							? rects.height
							: rects.height - rects.bottom
						: 0
				if (rects.height === 0) return
				callback(rects.height, scrolled)
			}, 100)
			useEventListener(document, "scroll", listener)
		},
	}
}
