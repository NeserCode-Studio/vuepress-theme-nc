<script lang="ts" setup>
import { useThemeLocaleData } from "@vuepress/plugin-theme-data/client"
import { usePageFrontmatter, useSiteData } from "vuepress/client"
import { computed } from "vue"

import type { DefaultThemeLocaleData } from "../../shared"

const themeLocale = useThemeLocaleData<DefaultThemeLocaleData>()
console.log("[Debug Footer]", themeLocale.value.footer)
const siteData = useSiteData()

const frontmatter = usePageFrontmatter()
const footerDisplay = computed(() => themeLocale.value.footer !== false)
const footer = computed(() => frontmatter.value.footer)
const footerHtml = computed(() => frontmatter.value.footerHtml)

const year = computed(() =>
	themeLocale.value.footer
		? themeLocale.value.footer.year ?? new Date().getFullYear()
		: new Date().getFullYear()
)
const copyright = computed(() =>
	themeLocale.value.footer
		? themeLocale.value.footer.copyRight
		: siteData.value.title ?? null
)
const themeInfoDisplay = computed(() =>
	themeLocale.value.footer ? themeLocale.value.footer.themeInfoDisplay : true
)
const footerLinks = computed(() =>
	themeLocale.value.footer ? themeLocale.value.footer.footerLinks : null
)
</script>

<template>
	<div
		v-if="footerHtml && footerDisplay"
		class="v-nc-page-footer"
		v-html="footer"
	/>
	<div
		v-else-if="footer && footerDisplay"
		class="v-nc-page-footer"
		v-text="footer"
	/>
	<div v-else-if="footerDisplay" class="v-nc-page-footer">
		<span class="normal-info">
			<span class="year" v-if="year">© {{ year }}</span>
			<span class="copyright" v-if="copyright" v-html="copyright"></span>
		</span>
		<span class="theme-info" v-if="themeInfoDisplay">
			Theme By NeserCode · Power By VuePress v2
		</span>
		<span class="links" v-if="footerLinks">
			<a
				v-for="link in footerLinks"
				:key="link.link"
				:href="link.link"
				target="_blank"
				rel="noopener noreferrer"
				>{{ link.title }}</a
			>
		</span>
	</div>
</template>

<style lang="postcss" scoped>
.v-nc-page-footer {
	@apply flex flex-col sm:items-center items-start justify-center gap-y-1 mt-12
  text-base font-semibold;
}

.v-nc-page-footer .normal-info {
	@apply w-fit inline-flex gap-x-2 pt-2
  border-t border-slate-400 dark:border-slate-700
  transition-all ease-in-out duration-300;
}

.v-nc-page-footer .theme-info {
	@apply text-slate-600 dark:text-slate-500
  text-sm
  transition-colors ease-in-out duration-300;
}

.v-nc-page-footer .links {
	@apply inline-flex flex-wrap gap-x-2 py-4;
}
</style>
