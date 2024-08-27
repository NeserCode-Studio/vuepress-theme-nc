<script lang="ts" setup>
import DarkButton from "./DarkButton.vue"
import NavbarItems from "./NavbarItems.vue"
import Divide from "./presets/Divide.vue"

import {
	useSiteData,
	usePageHead,
	RouteLink,
	withBase,
	ClientOnly,
} from "vuepress/client"
import { useThemeData } from "@vuepress/plugin-theme-data/client"
import { computed, type FunctionalComponent, h, onMounted } from "vue"
import { useNavbarConfig } from "../composables/useNavbarConfig"

import type { DefaultThemeData } from "../../shared"

const siteData = useSiteData()
const pageHead = usePageHead()
const themeConfig = useThemeData<DefaultThemeData>()
const navbarConfig = useNavbarConfig()

const logo = computed(() => themeConfig.value.logo)
const headLinkIcon = computed(() => {
	let links = pageHead.value.filter((item) => item[0] === "link")
	if (!links.length) return ""
	return links.filter((item) => item[1].rel === "icon")[0][1].href as string
})
const heroIconLink = computed(() =>
	logo.value ? logo.value : headLinkIcon.value
)
console.log("[Debug Navbar] Using icon href", heroIconLink.value)

const NavbarLogo: FunctionalComponent = () => {
	if (!heroIconLink.value) return null
	const img = h("img", {
		class: "logo hero-icon",
		src: withBase(heroIconLink.value),
		alt: heroIconLink.value,
	})
	return h(ClientOnly, () => img)
}

const heroTitle = computed(() => siteData.value.title)

onMounted(() => {
	document
		?.querySelector(".navbar-search input")
		?.setAttribute("placeholder", " ")
})
</script>

<template>
	<div class="v-nc-theme-navbar">
		<RouteLink to="/" class="navbar-hero-link">
			<NavbarLogo />
			<span class="hero-title">{{ heroTitle }}</span>
		</RouteLink>
		<div class="navbar-divied-items">
			<SearchBox class="navbar-search" />
			<NavbarItems class="navbar-items" :items="navbarConfig" />
			<Divide />
			<DarkButton class="hover-style" />
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.v-nc-theme-navbar {
	@apply fixed top-0 w-full h-16 flex justify-between items-center px-4 py-2
  border-b border-slate-200 dark:border-slate-600
  bg-white/60 dark:bg-slate-800/60 backdrop-blur shadow-sm
	transition-colors ease-in-out duration-300 z-50;
}

.navbar-hero-link {
	@apply w-32 h-full inline-flex justify-center items-center gap-2 py-2
	rounded;
}
.navbar-hero-link .hero-title {
	@apply text-sm font-black font-mono;
}

.hover-style {
	@apply hover:bg-slate-200 dark:hover:bg-slate-600
	transition-colors ease-in-out duration-100;
}

.navbar-divied-items {
	@apply flex w-fit gap-2 items-center;
}
.navbar-items {
	@apply sm:inline-flex hidden;
}
</style>

<style lang="postcss">
.navbar-hero-link .hero-icon {
	@apply w-fit h-full justify-self-center
	rounded;
}

.navbar-search {
	@apply relative mr-2
	transition-all ease-in-out duration-300;
}
.navbar-search::before {
	content: "检索";
	@apply absolute top-1/2 sm:left-2 -left-2 inline-flex justify-center items-center
	text-gray-500 dark:text-gray-400 sm:text-sm text-base -translate-y-1/2 whitespace-nowrap
	pointer-events-none transition-all ease-in-out duration-300;
}
.navbar-search:has(input:focus)::before {
	@apply opacity-100 sm:-translate-x-12 -translate-x-8
	text-gray-900 dark:text-gray-100;
}
.navbar-search:has(input:not(:placeholder-shown)):has(
		input:not(:focus)
	)::before {
	@apply opacity-0 translate-x-0;
}

.navbar-search input {
	@apply px-2 py-0.5 w-0 sm:w-32 focus:w-24
	bg-none bg-transparent border-2 rounded border-transparent sm:border-zinc-200 sm:dark:border-zinc-600
	text-neutral-800 dark:text-neutral-200
	transition-all ease-in-out duration-300;
}
</style>
