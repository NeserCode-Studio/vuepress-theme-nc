<script lang="ts" setup>
import { BookmarkSquareIcon } from "@heroicons/vue/24/outline"

import { Ref, onBeforeMount, toRefs } from "vue"
import { useStorage } from "@vueuse/core"
import { useThemeLocaleData } from "@vuepress/plugin-theme-data/client"

import { onRouteChange } from "../composables/usePageHook"

import type { DefaultThemeLocaleData } from "../../shared"
const $props = withDefaults(
	defineProps<{
		owner?: string
		repo?: string
	}>(),
	{}
)
const { owner, repo } = toRefs($props)
const themeLocale: Ref<DefaultThemeLocaleData> = useThemeLocaleData()

let repoInfo = useStorage<{
	data: any
	timestamp: number
}>(`v-nc-github-repo[${owner?.value}/${repo?.value}]`, {
	data: {},
	timestamp: -1,
})
onRouteChange(() => {
	repoInfo = useStorage<{
		data: any
		timestamp: number
	}>(`v-nc-github-repo[${owner?.value}/${repo?.value}]`, {
		data: {},
		timestamp: -1,
	})
})

onBeforeMount(() => {
	const updateRepoInfo = async () =>
		await fetch(`${themeLocale.value.github?.accessServer}/repo`, {
			method: "POST",
			body: JSON.stringify({ username: owner.value, repo: repo.value }),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${themeLocale.value.github?.accessToken}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				repoInfo.value.data = res
				repoInfo.value.timestamp = Date.now()
			})
	if (repoInfo.value.timestamp == -1) {
		if (owner && repo && themeLocale.value.github?.accessServer)
			updateRepoInfo()
	} else if (repoInfo.value.timestamp + 1000 * 60 * 60 * 24 < Date.now()) {
		if (owner && repo && themeLocale.value.github?.accessServer)
			updateRepoInfo()
	}
})
</script>

<template>
	<Transition name="fade" mode="out-in" appear>
		<div class="github-repo-card" v-if="owner && repo">
			<span class="prefix">Linked Github Repo</span>
			<a :href="repoInfo?.data?.html_url" class="card-main" target="_blank">
				<span class="repo-title">
					<BookmarkSquareIcon class="icon" />
					<span class="repo-name">
						<span class="repo">{{ repo }}</span>
						<span class="owner">{{ owner }}</span>
					</span>
				</span>
				<span class="repo-description" v-if="repoInfo?.data?.description">{{
					repoInfo?.data?.description
				}}</span>
				<span class="repo-tags" v-if="repoInfo?.data?.topics?.length">
					<span v-for="tag in repoInfo?.data?.topics" class="repo-tag">{{
						tag
					}}</span>
				</span>
				<span class="other">
					<span class="license" v-html="repoInfo?.data?.license?.spdx_id" />
					<span class="lang" v-html="repoInfo?.data?.language" />
				</span>
			</a>
		</div>
	</Transition>
</template>

<style lang="postcss" scoped>
.github-repo-card {
	@apply relative flex flex-col gap-y-2 px-1.5 my-2;
}

.github-repo-card .prefix {
	@apply text-sm font-semibold text-green-600;
}

.github-repo-card .card-main {
	@apply w-fit max-w-48 flex flex-col justify-center py-1 px-2 gap-1
  border-2 rounded border-sky-300 dark:border-sky-600
  bg-sky-100 dark:bg-sky-950
  transition-all ease-in-out duration-300;
}
.github-repo-card .card-main:has(a[href*="github.com"]) {
	@apply cursor-pointer;
}

.card-main .repo-title {
	@apply inline-flex items-center gap-x-1;
}
.card-main .repo-name {
	@apply inline-flex flex-col
  text-sm text-blue-500;
}

.repo-name span {
	@apply inline-block max-w-36
  truncate;
}

.repo-description {
	@apply text-xs opacity-50;
}

.repo-tags {
	@apply inline-flex flex-wrap gap-1;
}

.repo-tag {
	@apply inline-flex items-center px-1 py-px
  rounded bg-blue-300 dark:bg-blue-800
  text-xs;
}

.other {
	@apply inline-flex justify-center items-center gap-x-3
  text-xs text-gray-500 dark:text-gray-400;
}

.card-main .icon {
	@apply w-7 h-7 stroke-blue-500;
}
</style>
