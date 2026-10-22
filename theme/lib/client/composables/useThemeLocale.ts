import { computed, inject } from "vue"
import { useRouteLocale } from "vuepress/client"
import {
	resolveThemeLocaleData,
	themeData,
	themeLocaleDataSymbol,
} from "@vuepress/plugin-theme-data/client"

import type { ComputedRef } from "vue"
import type { ThemeData } from "@vuepress/plugin-theme-data/client"

type ThemeLocaleDataRef<T extends ThemeData> = ComputedRef<T>

export const useThemeLocaleData = <
	T extends ThemeData = ThemeData,
>(): ThemeLocaleDataRef<T> => {
	const provided = inject(themeLocaleDataSymbol, null)
	if (provided) return provided as ThemeLocaleDataRef<T>

	const routeLocale = useRouteLocale()
	return computed(
		() => resolveThemeLocaleData(themeData.value, routeLocale.value) as T
	)
}
