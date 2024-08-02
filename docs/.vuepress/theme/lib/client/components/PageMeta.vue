<script lang="ts" setup>
import { useThemeLocaleData } from "@vuepress/plugin-theme-data/client"
import { useLastUpdated, useContributors } from "../composables/usePageMeta"

import type { DefaultThemeLocaleData } from "../../shared"

const themeLocale = useThemeLocaleData<DefaultThemeLocaleData>()
const lastUpdated = useLastUpdated()
const contributors = useContributors()
</script>

<template>
	<div class="v-nc-page-meta">
		<div class="meta-item git-info">
			<div v-if="lastUpdated" class="git-info-item last-updated">
				<span class="meta-item-label">{{ themeLocale.lastUpdatedText }}</span>
				<ClientOnly>
					<span class="meta-item-info">{{ lastUpdated }}</span>
				</ClientOnly>
			</div>

			<div
				v-if="contributors && contributors.length"
				class="git-info-item contributors"
			>
				<span class="meta-item-label">{{ themeLocale.contributorsText }}</span>
				<span class="meta-item-info">
					<template v-for="(contributor, index) in contributors" :key="index">
						<span class="contributor" :title="`email: ${contributor.email}`">
							{{ contributor.name }}
						</span>
						<template v-if="index !== contributors.length - 1">, </template>
					</template>
				</span>
			</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.v-nc-page-meta {
	@apply w-full flex flex-col mt-4;
}

.meta-item {
	@apply w-full inline-flex flex-col justify-center gap-y-1
  text-sm text-gray-500 dark:text-gray-400
  transition-colors ease-in-out duration-300;
}

.git-info-item {
	@apply w-fit inline-flex items-center gap-x-1;
}

.meta-item-label {
	@apply pr-1.5
  font-bold
  border-r border-slate-300 dark:border-slate-600
  transition-colors ease-in-out duration-300;
}
.meta-item-info {
	@apply font-mono;
}
</style>
