<script lang="ts" setup>
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/solid"
import { computed, ref, watch, type FunctionalComponent, h } from "vue"
import {
	ClientOnly,
	RouteLink,
	usePageHead,
	useRoute,
	useSiteData,
	withBase,
} from "vuepress/client"
import { useThemeData } from "@vuepress/plugin-theme-data/client"

import DarkButton from "./DarkButton.vue"
import NavbarItems from "./NavbarItems.vue"
import { useNavbarConfig } from "../composables/useNavbarConfig"
import type { DefaultThemeData } from "../../shared"

const siteData = useSiteData()
const pageHead = usePageHead()
const themeConfig = useThemeData<DefaultThemeData>()
const navbarConfig = useNavbarConfig()
const route = useRoute()

const mobileNavOpen = ref(false)
watch(
	() => route.path,
	() => {
		mobileNavOpen.value = false
	}
)

const logo = computed(() => themeConfig.value.logo)
const headLinkIcon = computed(() => {
	const links = pageHead.value.filter((item) => item[0] === "link")
	if (!links.length) return ""
	return links.filter((item) => item[1].rel === "icon")[0][1].href as string
})
const heroIconLink = computed(() => logo.value || headLinkIcon.value)

const NavbarLogo: FunctionalComponent = () => {
	if (!heroIconLink.value) return null
	const image = h("img", {
		class: "logo hero-icon",
		src: withBase(heroIconLink.value),
		alt: heroIconLink.value,
	})
	return h(ClientOnly, () => image)
}

const heroTitle = computed(() => siteData.value.title)
</script>

<template>
	<header class="v-nc-theme-navbar">
		<div class="navbar-inner">
			<RouteLink to="/" class="navbar-hero-link">
				<NavbarLogo />
				<span class="hero-title">{{ heroTitle }}</span>
			</RouteLink>

			<div class="navbar-actions">
				<SearchBox class="navbar-search" />
				<NavbarItems class="navbar-items" :items="navbarConfig" />
				<DarkButton class="hover-style" />
				<button
					type="button"
					class="navbar-toggle"
					:aria-expanded="mobileNavOpen"
					aria-controls="navbar-mobile-panel"
					aria-label="Toggle navigation"
					@click="mobileNavOpen = !mobileNavOpen"
				>
					<XMarkIcon v-if="mobileNavOpen" class="icon" />
					<Bars3Icon v-else class="icon" />
				</button>
			</div>
		</div>

		<div id="navbar-mobile-panel" class="mobile-panel" v-if="mobileNavOpen">
			<NavbarItems class="mobile-items" :items="navbarConfig" />
		</div>
	</header>
</template>

<style lang="postcss" scoped>
.v-nc-theme-navbar {
	@apply fixed top-0 w-full z-50
	border-b border-slate-200
	bg-white/85 backdrop-blur shadow-sm
	transition-colors ease-in-out duration-300
	dark:border-slate-700 dark:bg-slate-900/90;
}

.navbar-inner {
	@apply mx-auto flex h-16 w-full max-w-7xl items-center justify-between
	px-4 sm:px-6 lg:px-10;
}

.navbar-hero-link {
	@apply inline-flex min-w-0 items-center gap-2 rounded py-1 pr-2
	no-underline;
}

.navbar-hero-link .hero-title {
	@apply truncate text-sm font-black font-mono
	text-slate-900 dark:text-slate-100;
}

.hover-style {
	@apply hover:bg-slate-200 dark:hover:bg-slate-700
	transition-colors ease-in-out duration-100;
}

.navbar-actions {
	@apply flex items-center gap-2;
}

.navbar-items {
	@apply hidden sm:inline-flex;
}

.navbar-toggle {
	@apply inline-flex h-9 w-9 items-center justify-center rounded
	text-slate-700 transition-colors ease-in-out duration-200
	hover:bg-slate-200
	dark:text-slate-200 dark:hover:bg-slate-700
	sm:hidden;
}

.navbar-toggle .icon {
	@apply h-5 w-5;
}

.mobile-panel {
	@apply absolute left-0 top-full w-full max-h-[calc(100vh-4rem)]
	overflow-y-auto border-b border-slate-200
	bg-white px-4 pb-3
	dark:border-slate-700 dark:bg-slate-900;
}

.mobile-panel :deep(.theme-navbar-items) {
	@apply flex w-full flex-col items-stretch gap-1 pt-2
	text-base;
}
</style>

<style lang="postcss">
.navbar-hero-link .hero-icon {
	@apply h-8 w-8 rounded object-cover;
}

.navbar-search {
	@apply relative hidden transition-all ease-in-out duration-300 sm:block;
}

.navbar-search input {
	@apply w-28 rounded border border-slate-200 bg-transparent px-2 py-1
	text-sm text-slate-800 transition-all ease-in-out duration-300
	focus:w-40 focus:border-emerald-400 focus:outline-none
	dark:border-slate-700 dark:text-slate-100;
}
</style>
