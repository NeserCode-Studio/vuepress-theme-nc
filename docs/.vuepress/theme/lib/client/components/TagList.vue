<script lang="ts" setup>
import { usePageFrontmatter } from "@vuepress/client"

import { toRefs, computed, ref, onMounted } from "vue"
import { ChevronDownIcon } from "@heroicons/vue/24/outline"

import type { DefaultThemePageFrontmatter, ArticleMap } from "../../shared"

interface ExtraPageFrontmatter extends DefaultThemePageFrontmatter {
	blog: {
		name: string
	}
}

const frontmatter = usePageFrontmatter<ExtraPageFrontmatter>()
const $props = defineProps<{
	tagMap: ArticleMap
}>()
const { tagMap } = toRefs($props)

const compurtedMap = computed(() => {
	let keys = Object.keys(tagMap.value)

	return keys.map((key) => {
		return {
			name: key,
			count: tagMap.value[key].items.length,
			path: tagMap.value[key].path,
		}
	})
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
		return tag.name.toLowerCase() === frontmatter.value.blog!.name
	})
})

function toggleShowAll() {
	isShowAll.value = !isShowAll.value
}

onMounted(() => {
	isShowAll.value = isSelectedInMore.value
})
</script>

<template>
	<div class="tag-list">
		<div
			:class="['tag-item', shouldShowClass(index)]"
			v-for="(tag, index) in compurtedMap"
			:key="tag.name"
		>
			<router-link :to="tag.path" class="tag-link">
				<span class="tag-name">{{ tag.name }}</span>
				<span class="tag-count">{{ tag.count }}</span>
			</router-link>
		</div>
		<!-- if tag more than 20 -->
		<div :class="['tag-item', 'show-more', showBtnClass]" v-if="shouldShowBtn">
			<span
				class="icon btn"
				@click="toggleShowAll"
				title="Wheather show more tags"
			>
				<ChevronDownIcon />
			</span>
		</div>
	</div>
</template>
