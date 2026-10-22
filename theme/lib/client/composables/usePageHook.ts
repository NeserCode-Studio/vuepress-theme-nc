import { useRoute } from "@vuepress/client"
import { watchOnce } from "@vueuse/core"
import { watch } from "vue"

export const onRouteChangeOnce = (callback: () => void) => {
	const $route = useRoute()

	watchOnce(() => $route.path, callback)
}
export const onRouteChange = (callback: () => void) => {
	const $route = useRoute()

	watch(() => $route.path, callback)
}
