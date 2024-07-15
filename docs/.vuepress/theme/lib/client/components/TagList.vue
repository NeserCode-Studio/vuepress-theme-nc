<script lang="ts" setup>
import { usePageFrontmatter } from "@vuepress/client"

import { toRefs, computed, ref, onMounted } from "vue"
import { ChevronDownIcon } from "@heroicons/vue/24/outline"

import type {
	DefaultThemePageFrontmatter,
	BlogCategoryArticleData,
} from "../../shared"

const frontmatter = usePageFrontmatter<DefaultThemePageFrontmatter>()
const $props = defineProps<{
	tagMap: BlogCategoryArticleData["map"]
}>()
const { tagMap } = toRefs($props)

const compurtedMap = computed(() => {
	let keys = Object.keys(tagMap.value)

	return keys
		.map((key) => {
			return {
				name: key,
				count: tagMap.value[key].items.length,
				path: tagMap.value[key].path,
			}
		})
		.sort((a, b) => b.count - a.count)
})

// Show More btn
const shouldShowBtn = computed(() => {
	return compurtedMap.value.length > 20
})
const isShowAll = ref(false)
const showBtnClass = computed(() => {
	return !isShowAll.value ? "hide" : "show"
})
const shouldShowClass = (index: number) => {
	return isShowAll.value || index < 20 ? "show" : "hide"
}
// check it is selected tag in over than 20 tags
const isSelectedInMore = computed(() => {
	return compurtedMap.value.slice(20).some((tag) => {
		if (!frontmatter.value.blog) return false
		if ("name" in frontmatter.value.blog)
			return (
				tag.name.toLowerCase() === frontmatter.value.blog.name?.toLowerCase()
			)
	})
})
const slicedMap = computed(() =>
	isShowAll.value ? compurtedMap.value : compurtedMap.value.slice(0, 20)
)

function toggleShowAll() {
	isShowAll.value = !isShowAll.value
}

onMounted(() => {
	isShowAll.value = isSelectedInMore.value
})
</script>

<template>
	<div class="tag-list">
		<router-link
			:to="tag.path"
			class="tag-link tag-item"
			:class="shouldShowClass(index)"
			v-for="(tag, index) in slicedMap"
			:key="tag.name"
		>
			<span class="tag-name">{{ tag.name }}</span>
			<span class="tag-count">{{ tag.count }}</span>
		</router-link>
		<!-- if tag more than 20 -->
		<span class="tag-item" v-if="!isShowAll && shouldShowBtn">{{
			`+${compurtedMap.length - 20} tags`
		}}</span>
		<button
			type="button"
			:class="showBtnClass"
			v-if="shouldShowBtn"
			class="tag-item show-more"
			@click="toggleShowAll"
			title="Wheather show more tags"
		>
			<ChevronDownIcon class="icon" />
		</button>
	</div>
</template>

<style lang="postcss" scoped>
.tag-list {
	@apply flex flex-wrap gap-2;
}
.tag-list .tag-item {
	@apply inline-flex justify-center items-center gap-2 py-0.5 px-1
	border-2 border-transparent rounded bg-slate-200 dark:bg-slate-700
	hover:bg-slate-300 dark:hover:bg-slate-600 text-base cursor-pointer
	hover:shadow-md
	transition-all ease-in-out duration-300;
}

.tag-item .tag-name {
	@apply font-semibold;
}
.tag-item .tag-count {
	@apply inline-block text-sm font-thin px-1.5
	rounded bg-slate-100 dark:bg-slate-800
	transition-colors ease-in-out duration-300;
}

.tag-item.router-link-active {
	@apply border-green-400 dark:border-green-600
	text-green-500 dark:text-green-500 shadow-md;
}

.tag-item.show-more .icon {
	@apply w-4 h-4;
}
.show .icon {
	@apply rotate-180
	transition-transform ease-in-out duration-300;
}
</style>
