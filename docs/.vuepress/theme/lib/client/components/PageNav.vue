<script lang="ts" setup>
import { AutoLink } from "vuepress/client"
import { onMounted } from "vue"
import { useEventListener } from "@vueuse/core"
import { useThemeLocaleData } from "@vuepress/plugin-theme-data/client"

import { useRelatedLinks } from "../composables/useRelatedLinks"
import { useNavigate } from "../composables/useNavigate"

import type { DefaultThemeLocaleData } from "../../shared"

const themeLocale = useThemeLocaleData<DefaultThemeLocaleData>()
const navigate = useNavigate()
const { prevLink, nextLink } = useRelatedLinks()

console.log("[Debug PageNav]", [prevLink.value, nextLink.value])

onMounted(() => {
	useEventListener("keydown", (event): void => {
		if (event.altKey) {
			if (event.key === "ArrowRight") {
				if (nextLink.value) {
					navigate(nextLink.value.link)
					event.preventDefault()
				}
			} else if (event.key === "ArrowLeft") {
				if (prevLink.value) {
					navigate(prevLink.value.link)
					event.preventDefault()
				}
			}
		}
	})
})
</script>

<template>
	<div class="v-nc-page-nav">
		<nav v-if="prevLink || nextLink" class="page-nav-main">
			<AutoLink v-if="prevLink" class="prev" :config="prevLink">
				<div class="hint">
					<span class="arrow left" />
					{{ themeLocale.prev ?? "Prev" }}
				</div>
				<div class="link">
					<span>{{ prevLink.text }}</span>
				</div>
			</AutoLink>

			<AutoLink v-if="nextLink" class="next" :config="nextLink">
				<div class="hint">
					{{ themeLocale.next ?? "Next" }}
					<span class="arrow right" />
				</div>
				<div class="link">
					<span>{{ nextLink.text }}</span>
				</div>
			</AutoLink>
		</nav>
	</div>
</template>

<style lang="postcss" scoped>
.v-nc-page-nav {
	@apply w-full flex justify-end pt-4 pr-4;
}

.page-nav-main {
	@apply w-fit flex flex-col justify-center items-end gap-y-2;
}

.page-nav-main .auto-link {
	@apply inline-flex flex-col justify-center items-end px-3 py-1
	rounded bg-stone-100 dark:bg-stone-900
	border-2 border-green-400 dark:border-green-600
	hover:bg-slate-200 dark:hover:bg-slate-800
	text-gray-500 dark:text-gray-400
	transition-colors ease-in-out duration-300;
}
.auto-link .link {
	@apply w-full max-w-48 inline-block 
	text-green-600 dark:text-green-400
	truncate;
}

.page-nav-main .hint {
	@apply w-full inline-flex justify-end items-center
	text-sm;
}
</style>
