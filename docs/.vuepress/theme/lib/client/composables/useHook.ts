import { nextTick, watch } from "vue"
import type { RouteLocationNormalizedLoadedGeneric } from "vue-router"

export const Hook = {
	onRoute: (
		callback: () => void,
		route: RouteLocationNormalizedLoadedGeneric,
		options?: { immediate?: boolean }
	) => {
		watch(
			() => route.path,
			() => {
				if (!options?.immediate) nextTick(callback)
				else callback()
			},
			{ immediate: true }
		)
	},
}
