<script lang="ts" setup>
import { Ref, toRefs } from "vue"
import { useSiteLocaleData } from "@vuepress/client"

import { getTimeAgo, getFormatDate } from "../composables/useDate"

import type { SiteLocaleData } from "@vuepress/client"
import type { BlogTypeArticleData } from "../../shared"

const $props = defineProps<{
	articles: BlogTypeArticleData["items"]
}>()

const { articles } = toRefs($props)

const siteLocale: Ref<SiteLocaleData> = useSiteLocaleData()

function stringfyExcerpt(excerpt: string) {
	let result: string
	if (excerpt === undefined || excerpt.trim() === "")
		return "暂时没有摘要，要不进来看看？"
	else {
		result = excerpt
			.replace(/<[Hh]([1-6])>[^<]*?<\/[Hh]\1>/, "")
			.replace(/<[^>]+>/g, "")
	}
	return result.trim() === "" ? "暂时没有摘要，要不进来看看？" : result
}

function getAuthor(author: string) {
	if (author.trim() === "") return siteLocale.value.title ?? "Unknown"
	return author === undefined ? "Unknown" : author
}

function getTagPath(tag: string) {
	return `/tags/${tag.toLocaleLowerCase()}/`
}
</script>

<template>
	<div class="timeline-list">
		<div
			class="timeline-wrapper"
			v-for="article in articles"
			:key="article.path"
		>
			<div class="timeline-main">
				<router-link :to="article.path" class="article-title">{{
					article.info.title
				}}</router-link>
				<span class="article-info">
					<span class="date"
						>{{ getFormatDate(article.info.date) }} ·
						{{ getTimeAgo(article.info.date) }}</span
					>
					<span class="author">by {{ getAuthor(article.info.author) }}</span>
				</span>
				<span class="article-excerpt">{{
					stringfyExcerpt(article.info.excerpt)
				}}</span>
				<span class="article-tags">
					<router-link
						:to="getTagPath(tag)"
						v-for="tag in article.info.tags.slice(0, 3)"
						:key="tag"
						class="tag-item"
						>{{ tag }}</router-link
					>
					<span class="tag-item" v-if="article.info.tags.length > 3">
						+{{ article.info.tags.length - 3 }} tags
					</span>
				</span>
			</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.timeline-list {
	@apply w-full flex flex-col;
}

.timeline-wrapper {
	@apply relative inline-block  sm:w-1/2 w-[90%] py-2
	first:pt-4 last:pb-4
	sm:odd:self-start odd:self-auto sm:even:self-end even:self-auto
	sm:odd:border-r-2 sm:odd:border-l-0 odd:border-l-2 even:border-l-2
	border-sky-400 dark:border-sky-700
	sm:odd:pr-[5%] sm:odd:pl-0 odd:pr-0 odd:pl-[5%] even:pl-[5%]
	sm:odd:translate-x-px odd:translate-x-0 sm:even:-translate-x-px even:translate-x-0
	transition-colors ease-in-out duration-300;
}
.timeline-wrapper:nth-child(odd)::before {
	@apply sm:left-full right-full
	transform -translate-y-px sm:-translate-x-full translate-x-full;
}
.timeline-wrapper:nth-child(even)::before {
	@apply right-full
	transform -translate-y-px translate-x-full;
}
.timeline-wrapper:nth-child(odd)::before,
.timeline-wrapper:nth-child(even)::before {
	content: "";
	width: calc(5% + 0.25rem);
	@apply absolute top-1/2 sm:w-[10%] h-0.5
	bg-green-400 dark:bg-green-500;
}
.timeline-wrapper:nth-child(odd)::after {
	@apply sm:left-full left-0
	transform -translate-y-2 sm:-translate-x-[7px] -translate-x-1/2;
}
.timeline-wrapper:nth-child(even)::after {
	@apply right-full
	transform -translate-y-2 translate-x-[7px];
}
.timeline-wrapper:nth-child(odd)::after,
.timeline-wrapper:nth-child(even)::after {
	content: "";
	@apply absolute w-4 h-4 top-1/2
	border-2 rounded-full
	border-green-400 dark:border-green-500
	bg-slate-50 dark:bg-sky-900
	transition-all ease-in-out duration-300;
}

.timeline-main {
	@apply flex flex-col gap-1 justify-center px-4 py-3
	rounded border-2 border-green-400 dark:border-green-500
	transition-all ease-in-out duration-300;
}

.timeline-main .article-title {
	@apply w-fit inline-flex justify-center items-center
	text-lg font-semibold text-green-500;
}
.timeline-main .article-info {
	@apply inline-flex items-center gap-x-2 flex-wrap
	text-sm text-gray-400 font-thin font-mono;
}
.article-info .date {
	@apply text-neutral-400;
}
.timeline-main .article-excerpt {
	@apply text-base text-gray-600 dark:text-gray-300
	transition-colors ease-in-out duration-300;
}

.timeline-main .article-tags {
	@apply flex flex-wrap gap-1 mt-2
	text-sm;
}
.article-tags .tag-item {
	@apply w-fit max-w-full inline-flex justify-center items-center gap-2 py-0.5 px-1
	border-2 border-transparent rounded bg-slate-200 dark:bg-slate-700
	hover:bg-slate-300 dark:hover:bg-slate-600 text-sm cursor-pointer
	transition-all ease-in-out duration-300 truncate;
}
</style>
