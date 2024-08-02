import { computed } from "vue"
import { useThemeLocaleData } from "@vuepress/plugin-theme-data/client"
import { usePageData, usePageFrontmatter } from "vuepress/client"

import { getFormatDate, getTimeAgo } from "./useDate"

import type { ComputedRef } from "vue"
import type {
	DefaultThemeLocaleData,
	DefaultThemeNormalPageFrontmatter,
	DefaultThemePageData,
} from "../../shared"

export const useLastUpdated = (): ComputedRef<null | string> => {
	const themeLocale = useThemeLocaleData<DefaultThemeLocaleData>()
	const page = usePageData<DefaultThemePageData>()
	const frontmatter = usePageFrontmatter<DefaultThemeNormalPageFrontmatter>()

	const updatedDate = computed(() => {
		const showLastUpdated =
			frontmatter.value.lastUpdated ?? themeLocale.value.lastUpdated ?? true
		if (!showLastUpdated) return null
		if (!page.value.git?.updatedTime) return null
		return new Date(page.value.git?.updatedTime)
	})

	return computed(
		() =>
			`${getFormatDate(updatedDate.value ?? "").value}, ${
				getTimeAgo(updatedDate.value ?? "").value
			}`
	)
}

export const useContributors = (): ComputedRef<
	null | Required<DefaultThemePageData["git"]>["contributors"]
> => {
	const themeLocale = useThemeLocaleData<DefaultThemeLocaleData>()
	const page = usePageData<DefaultThemePageData>()
	const frontmatter = usePageFrontmatter<DefaultThemeNormalPageFrontmatter>()

	return computed(() => {
		const showContributors =
			frontmatter.value.contributors ?? themeLocale.value.contributors ?? true

		if (!showContributors) return null

		return page.value.git?.contributors ?? null
	})
}
