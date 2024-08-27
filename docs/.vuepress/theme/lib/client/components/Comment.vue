<script lang="ts" setup>
// @ts-ignore
import Giscus from "@giscus/vue"
import { computed, ref, toRefs } from "vue"

import { GiscusOptions } from "../../shared"
import { useDark } from "../composables/useDark"

const $props = defineProps<{
	options?: GiscusOptions
}>()

const { options } = toRefs($props)
const { isDark } = useDark()

function generateGiscusOption(options?: GiscusOptions): GiscusOptions {
	let result = Object.assign({}, options)
	return result
}

const giscusOptions = ref<GiscusOptions>(generateGiscusOption(options.value))
const themeComputed = computed(() =>
	isDark.value
		? giscusOptions.value.darkTheme ?? "dark"
		: giscusOptions.value.theme
)

console.log("[Debug Comment]", [giscusOptions.value, options.value])
</script>

<template>
	<div class="v-nc-theme-comment">
		<h2 id="v-nc-comment" tabindex="-1" v-if="giscusOptions.repoId">
			<a class="header-anchor" href="#v-nc-comment" aria-hidden="true">评论</a>
		</h2>
		<Giscus
			v-if="giscusOptions.repoId"
			host="https://giscus.app"
			:repo="giscusOptions.repo"
			:repo-id="giscusOptions.repoId"
			:category="giscusOptions.category"
			:category-id="giscusOptions.categoryId"
			:mapping="giscusOptions.mapping"
			:strict="giscusOptions.strict"
			:reactions-enabled="giscusOptions.reactionsEnabled"
			:emit-metadata="giscusOptions.emitMetadata"
			:input-position="giscusOptions.inputPosition"
			:theme="themeComputed"
			:lang="giscusOptions.language"
			:loading="giscusOptions.loading"
		/>
		<div class="v-nc-comment-placeholder" v-else>
			<h2 id="v-nc-comment" tabindex="-1">
				<a class="header-anchor text" href="#v-nc-comment" aria-hidden="true"
					>评论已关闭</a
				>
			</h2>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.v-nc-theme-comment {
	@apply w-full mt-8;
}
.v-nc-comment-placeholder {
	@apply w-full inline-flex justify-center items-center my-4 py-3
  rounded bg-gray-100 dark:bg-gray-900
  text-base font-semibold
  transition-colors ease-in-out duration-300;
}
</style>
