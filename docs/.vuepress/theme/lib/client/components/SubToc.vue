<script lang="ts" setup>
import { computed, ref } from "vue"
import { usePageData, usePageFrontmatter, useRoute } from "vuepress/client"
import { PageHeader } from "vuepress/shared"

import { useSubTocFly } from "../composables/useSubTocFly"
import { usePluginState } from "../composables/useComponentUtils"
import { defaultConstants, DefaultThemePageFrontmatter } from "../../shared"
import { Hook } from "../composables/useHook"

const pageData = usePageData()
const pageFrontmatter = usePageFrontmatter<DefaultThemePageFrontmatter>()

const isNotFound = computed(() => pageFrontmatter.value.layout === "NotFound")
const computedStateSource = computed(() =>
	isNotFound.value
		? defaultConstants.notFoundPluginState
		: pageFrontmatter.value
)
const isCommentActive = computed(() =>
	usePluginState("comment", computedStateSource.value)
)
const tocHeaders = ref<PageHeader[]>(pageData.value.headers ?? [])

const tocOptions = {
	containerTag: "nav",
	containerClass: "toc-main",
	listClass: "vuepress-toc-list",
	itemClass: "vuepress-toc-item",
	linkTag: "a",
	linkClass: "vuepress-toc-link",
	linkActiveClass: "active",
	linkChildrenActiveClass: "active",
}

const toc = ref<HTMLDivElement | null>(null)
const tocFly = ref<HTMLDivElement | null>(null)
useSubTocFly(toc, tocFly)

const $route = useRoute()
Hook.onRoute(
	() => {
		if (!isCommentActive || !document) return
		if (document.querySelector("h2#v-nc-comment"))
			tocHeaders.value.push({
				level: 2,
				link: `#v-nc-comment`,
				slug: `v-nc-comment`,
				title: `评论`,
				children: [],
			})
	},
	$route,
	{ immediate: true }
)
</script>

<template>
	<div class="v-nc-theme-sub-toc">
		<Toc ref="toc" :options="tocOptions" :headers="tocHeaders" />
		<div class="toc-fly" ref="tocFly"></div>
	</div>
</template>

<style lang="postcss" scoped>
.v-nc-theme-sub-toc {
	@apply pl-4;
}
.toc-fly {
	@apply absolute w-1 h-[23.5px] top-1 left-[15px]
  rounded-full bg-green-400 dark:bg-green-600
  translate-y-0 transition-all ease-in-out duration-100 z-10;
}
</style>
<style lang="postcss">
.toc-main {
	@apply w-fit pl-2
	border-l-2 border-slate-200 dark:border-slate-700
	transition-colors ease-in-out duration-300;
}
.toc-main::before {
	content: "On This Page";
	@apply absolute -top-6 left-2
  text-green-600 text-sm font-semibold;
}

.toc-main .vuepress-toc-list {
	@apply inline-flex flex-col justify-center
  list-none transition-all ease-in-out duration-100;
}
.toc-main .vuepress-toc-list .vuepress-toc-item {
	@apply relative inline-flex flex-col
	text-base;
}
.toc-main
	.vuepress-toc-list
	.vuepress-toc-item:has(.vuepress-toc-list .vuepress-toc-item)::before {
	content: "H";
	@apply absolute top-1 -left-6
	opacity-50 text-xs font-semibold font-mono
	translate-y-[12%];
}

.toc-main > .vuepress-toc-list > .vuepress-toc-item > .vuepress-toc-link,
.toc-main
	> .vuepress-toc-list
	> .vuepress-toc-item
	> .vuepress-toc-list
	> .vuepress-toc-item
	> .vuepress-toc-link {
	@apply max-w-[16ch] py-1 truncate
	text-sm;
}

/* Active */
.toc-main > .vuepress-toc-list > .vuepress-toc-item > .vuepress-toc-list {
	@apply hidden;
}
.toc-main
	> .vuepress-toc-list:has(.vuepress-toc-list .vuepress-toc-link.active),
.toc-main
	> .vuepress-toc-list
	> .vuepress-toc-item
	> .vuepress-toc-list:has(.vuepress-toc-link.active),
.toc-main
	> .vuepress-toc-list
	> .vuepress-toc-item:has(.vuepress-toc-link.active)
	> .vuepress-toc-list {
	@apply inline-flex;
}

.toc-main
	> .vuepress-toc-list
	> .vuepress-toc-item
	> .vuepress-toc-list
	> .vuepress-toc-item
	> .vuepress-toc-link.active {
	@apply pl-[1ch]
		rounded bg-green-400 text-slate-50 dark:bg-green-600 dark:text-slate-50
		transition-all ease-in-out duration-300;
}

.toc-main > .vuepress-toc-list > .vuepress-toc-item .vuepress-toc-link.active {
	@apply text-blue-500 font-semibold;
}
</style>
