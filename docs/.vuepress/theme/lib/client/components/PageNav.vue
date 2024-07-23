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

<style lang="postcss" scoped></style>
