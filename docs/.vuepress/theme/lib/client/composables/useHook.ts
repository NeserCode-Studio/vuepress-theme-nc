import { nextTick, watch } from "vue"
import type { RouteLocationNormalizedLoadedGeneric } from "vue-router"

export const Hook = {
	onRoute: (
		callback: () => void,
		route: RouteLocationNormalizedLoadedGeneric
	) => {
		watch(
			() => route.path,
			() => {
				nextTick(callback)
			},
			{ immediate: true }
		)
	},
}
