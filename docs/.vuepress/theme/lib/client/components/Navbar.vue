<script lang="ts" setup>
import DarkButton from "./DarkButton.vue"

import {
	useSiteData,
	usePageHead,
	RouteLink,
	withBase,
	ClientOnly,
} from "vuepress/client"
import { useThemeData } from "@vuepress/plugin-theme-data/client"
import { computed, FunctionalComponent, h } from "vue"

import type { DefaultThemeData } from "../../shared"

const siteData = useSiteData()
const pageHead = usePageHead()
const themeConfig = useThemeData<DefaultThemeData>()

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
</script>

<template>
	<div class="v-nc-theme-navbar">
		<RouteLink to="/" class="navbar-hero-link">
			<NavbarLogo />
			<span class="hero-title">{{ heroTitle }}</span>
		</RouteLink>
		<div class="navbar-items">
			<DarkButton class="hover-style" />
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.v-nc-theme-navbar {
	@apply sticky top-0 w-full h-16 flex justify-between items-center px-4 py-2
  border-b border-slate-200 dark:border-slate-600
  bg-white/60 dark:bg-slate-800/60 backdrop-blur
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
</style>

<style lang="postcss">
.navbar-hero-link .hero-icon {
	@apply w-fit h-full justify-self-center
	rounded;
}
</style>
