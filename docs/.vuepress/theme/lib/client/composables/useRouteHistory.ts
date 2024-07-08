import { tryOnMounted, useRefHistory } from "@vueuse/core"
import { computed, ref, watch } from "vue"
import { useRoute, useRoutes, resolveRoute } from "vuepress/client"

import { defaultConstants } from "../../shared"
import type { RouteHistoryRecord } from "../../shared"

export const useRouteHistory = (layouts: string[]) => {
	const route = useRoute()
	const routes = useRoutes()
	const routeMap = computed(() => {
		let keys = Object.keys(routes.value)

		return keys.map((key) => ({
			key,
			...routes.value[key],
		}))
	})
	const routeRef = ref<RouteHistoryRecord>({
		path: route.path,
		title: route.meta.title as string,
		_meta: { ...(route.meta as RouteHistoryRecord["_meta"]) },
		notFound: false,
	})
	const routeHistory = useRefHistory(routeRef)
	const routeChangeListener = (cb?: (path?: string) => void) => {
		tryOnMounted(() => {
			watch(
				() => route.path,
				(path) => {
					cb && cb(path)
					const resolveData = resolveRoute<RouteHistoryRecord["_meta"]>(path)
					routeRef.value._meta = resolveData.meta
					routeRef.value.path = resolveData.path
					routeRef.value.notFound = resolveData.notFound

					let mainPath = resolveData.path.split("/")[1]
					let matchTitle = "Back"

					let layoutTarget = Object.keys(defaultConstants.layoutPathMap).find(
						(key) => defaultConstants.layoutPathMap[key] == mainPath
					)

					if (resolveData.notFound)
						matchTitle = defaultConstants.layoutNameMap["notfound"]
					else if (layoutTarget) {
						matchTitle = defaultConstants.layoutNameMap[layoutTarget]
						routeRef.value.title = `${matchTitle} > ${resolveData.meta.title}`
					} else {
						routeRef.value.title = `Articles > ${resolveData.meta.title}`
					}

					console.log(routeRef.value)
				}
			)
		})
	}

	return {
		history: routeHistory,
		map: routeMap,
		route: routeRef,
		listener: routeChangeListener,
	}
}
