import { useThemeLocaleData } from "@vuepress/plugin-theme-data/client"
import { getHeaders, keys, startsWith } from "@vuepress/helper/client"
import type { MenuItem } from "@vuepress/helper/client"
import { computed, inject, nextTick, onMounted, provide, ref, watch } from "vue"
import type { ComputedRef, InjectionKey, Ref } from "vue"
import {
	usePageData,
	usePageFrontmatter,
	useRoute,
	useRouteLocale,
	useRouter,
} from "vuepress/client"
import type { PageData } from "vuepress/client"
import { isPlainObject, isString } from "vuepress/shared"
import type {
	DefaultThemeLocaleData,
	DefaultThemeNormalPageFrontmatter,
	SidebarArrayOptions,
	SidebarItemOptions,
	SidebarObjectOptions,
	SidebarOptions,
	ThemePageData,
} from "../../shared"
import type { SidebarHeaderItem, SidebarItem } from "../typings"
import { getAutoLink, isLinkInternal, resolvePrefix } from "../utils"
import { useStorage, useToggle } from "@vueuse/core"

export type HeadersRef = Ref<MenuItem[]>

export const headersRef: HeadersRef = ref([])

export const setupHeaders = (): void => {
	const router = useRouter()
	const pageData = usePageData<ThemePageData>()
	const themeLocale = useThemeLocaleData<DefaultThemeLocaleData>()
	const frontmatter = usePageFrontmatter<DefaultThemeNormalPageFrontmatter>()
	const levels = computed(
		() => frontmatter.value.sidebarDepth ?? themeLocale.value.sidebarDepth ?? 2
	)

	router.beforeEach((to, from) => {
		if (to.path !== from.path) {
			headersRef.value = []
		}
	})

	const updateHeaders = (): void => {
		if (levels.value <= 0) {
			headersRef.value = []
			return
		}

		headersRef.value = getHeaders({
			selector: [...new Array(6)]
				.map((_, i) => `.v-nc-content h${i + 1}`)
				.join(","),
			levels: [2, levels.value + 1],
			ignore: [".v-nc-badge"],
		})
	}

	onMounted(updateHeaders)
	watch(
		() => pageData.value.filePathRelative,
		() => {
			nextTick(updateHeaders)
		}
	)
}

export const useHeaders = (): HeadersRef => headersRef

export type SidebarItemsRef = ComputedRef<SidebarItem[]>

export const sidebarItemsSymbol: InjectionKey<SidebarItemsRef> =
	Symbol("sidebarItems")

/**
 * Inject sidebar items global computed
 */
export const useSidebarItems = (): SidebarItemsRef => {
	const sidebarItems = inject(sidebarItemsSymbol)
	if (!sidebarItems) {
		throw new Error("useSidebarItems() is called without provider.")
	}
	return sidebarItems
}

/**
 * Create sidebar items ref and provide as global computed in setup
 */
export const setupSidebarItems = (): void => {
	const themeLocale = useThemeLocaleData<DefaultThemeLocaleData>()
	const frontmatter = usePageFrontmatter<DefaultThemeNormalPageFrontmatter>()
	const page = usePageData()
	const route = useRoute()
	const routeLocale = useRouteLocale()
	const headers = useHeaders()

	const sidebarConfig = computed<false | SidebarOptions>(() =>
		frontmatter.value.home
			? false
			: frontmatter.value.sidebar ?? themeLocale.value.sidebar ?? "heading"
	)

	const sidebarItems = computed(() =>
		resolveSidebarItems(
			sidebarConfig.value,
			page.value,
			route.path,
			routeLocale.value,
			headers.value
		)
	)
	provide(sidebarItemsSymbol, sidebarItems)
}

/**
 * Resolve sidebar items global computed
 *
 * It should only be resolved and provided once
 */
export const resolveSidebarItems = (
	sidebarConfig: false | SidebarOptions,
	page: PageData,
	path: string,
	routeLocale: string,
	headers: MenuItem[]
): SidebarItem[] => {
	// resolve sidebar items according to the config
	if (sidebarConfig === false) {
		return []
	}

	if (sidebarConfig === "heading") {
		return resolveSidebarHeadingItem(page, headers)
	}

	if (Array.isArray(sidebarConfig)) {
		return resolveArraySidebarItems(sidebarConfig, headers, path, routeLocale)
	}

	if (isPlainObject(sidebarConfig)) {
		return resolveMultiSidebarItems(sidebarConfig, page, headers, path)
	}

	return []
}

/**
 * Util to transform page header to sidebar item
 */
export const resolveSidebarHeaderItem = (
	header: MenuItem
): SidebarHeaderItem => ({
	text: header.title,
	link: header.link,
	children: resolveSidebarHeaderItems(header.children),
})

export const resolveSidebarHeaderItems = (
	headers?: MenuItem[]
): SidebarHeaderItem[] =>
	headers ? headers.map((header) => resolveSidebarHeaderItem(header)) : []

/**
 * Resolve current page and its header to sidebar items if the config is `heading`
 */
export const resolveSidebarHeadingItem = (
	page: PageData,
	headers: MenuItem[]
): SidebarItem[] => [
	{
		text: page.title,
		link: page.path,
		children: resolveSidebarHeaderItems(headers),
	},
]

/**
 * Resolve sidebar items if the config is an array
 */
export const resolveArraySidebarItems = (
	sidebarConfig: SidebarArrayOptions,
	headers: MenuItem[],
	path: string,
	prefix = ""
): SidebarItem[] => {
	const handleChildItem = (
		item: SidebarItemOptions,
		pathPrefix: string
	): SidebarItem => {
		const childItem: SidebarItemOptions = isString(item)
			? getAutoLink(resolvePrefix(pathPrefix, item))
			: isString(item.link)
			? {
					...item,
					link: isLinkInternal(item.link)
						? getAutoLink(resolvePrefix(pathPrefix, item.link)).link
						: item.link,
			  }
			: item

		if ("children" in childItem) {
			return {
				...childItem,
				children: childItem.children.map((item) =>
					handleChildItem(item, resolvePrefix(pathPrefix, childItem.prefix))
				),
			}
		}

		// if the sidebar item is current page and children is not set
		// use headers of current page as children
		if (childItem.link === path) {
			// skip h1 header
			const currentHeaders =
				headers[0]?.level === 1 ? headers[0].children : headers

			return {
				...childItem,
				children: resolveSidebarHeaderItems(currentHeaders),
			}
		}

		return childItem
	}

	return sidebarConfig.map((item) => handleChildItem(item, prefix))
}

/**
 * Resolve sidebar items if the config is a key -> value (path-prefix -> array) object
 */
export const resolveMultiSidebarItems = (
	sidebarConfig: SidebarObjectOptions,
	page: PageData,
	headers: MenuItem[],
	path: string
): SidebarItem[] => {
	const sidebarRoutes = keys(sidebarConfig).sort((x, y) => y.length - x.length)

	// Find matching config
	for (const base of sidebarRoutes)
		if (startsWith(decodeURI(path), base)) {
			const matched = sidebarConfig[base]

			return matched
				? matched === "heading"
					? resolveSidebarHeadingItem(page, headers)
					: resolveArraySidebarItems(matched, headers, path, base)
				: []
		}

	console.warn(`${decodeURI(path)} is missing sidebar config.`)

	return []
}

export const useSidebarCollapsed = () => {
	const sidebarCollapsed = useStorage("v-nc-sidebar-collapsed", false)
	const toggleSidebarCollapsed = useToggle(sidebarCollapsed)

	return {
		collapsed: sidebarCollapsed,
		toggle: toggleSidebarCollapsed,
	}
}
