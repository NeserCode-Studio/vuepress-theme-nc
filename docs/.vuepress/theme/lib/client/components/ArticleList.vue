<script lang="ts" setup>
import Pagination from "./Pagination.vue"

import { computed, ref, Ref, toRefs, watch } from "vue"
import { useSiteLocaleData } from "@vuepress/client"
import { usePaginationChanges } from "../composables/useComponentUtils"
import { getTimeAgo, getFormatDate } from "../composables/useDate"

import type { SiteLocaleData } from "@vuepress/client"
import type { BlogCategoryArticle, PaginationPages } from "../../shared"

const $props = defineProps<{
	articles: BlogCategoryArticle[]
}>()

const { articles } = toRefs($props)
console.log(`[DeBug: List Pages]`, articles.value)

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
	return encodeURI(`/tags/${tag.toLowerCase()}/`)
}

/* Pagination */
const articleListPages = ref<PaginationPages>({
	total: articles.value.length,
	offset: 0,
	limit: 10,
})
const articleListChanges = usePaginationChanges(articleListPages)
const currentPage = computed(() => {
	const { offset, limit } = articleListPages.value
	return Math.floor(offset / limit) + 1
})
const slicedArticles = computed(() => {
	const { offset, limit } = articleListPages.value
	return articles.value.slice(offset, offset + limit)
})

watch(
	articles,
	(list) => {
		articleListPages.value.total = list.length
	},
	{ immediate: true }
)
</script>

<template>
	<Transition name="fade-slide-x" appear mode="out-in">
		<div class="article-list" :key="currentPage">
			<div
				class="article-wrapper"
				v-for="article in slicedArticles"
				:key="article.path"
			>
				<div class="article-main">
					<router-link :to="article.path" class="article-title route-link">{{
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
							v-for="tag of article.info.tags.slice(0, 3)"
							:key="tag"
							class="tag-item"
							:to="getTagPath(tag)"
							>{{ tag }}</router-link
						>
						<span
							class="tag-item tag-count-except"
							v-if="article.info.tags.length > 3"
							>{{ `+${article.info.tags.length - 3} tags` }}</span
						>
					</span>
				</div>
			</div>
		</div>
	</Transition>
	<Pagination
		v-if="slicedArticles.length > 0"
		:pages="articleListPages"
		:changes="articleListChanges"
	/>
</template>

<style scoped lang="postcss">
.article-list {
	@apply flex flex-col gap-y-4 mt-8;
}

.article-main {
	@apply flex flex-col items-start gap-1 pb-4;
}
.article-wrapper:not(:last-child) .article-main {
	@apply border-b border-dashed
	border-slate-400 dark:border-slate-500
	transition-colors ease-in-out duration-300;
}
.v-nc-theme-page .page-main a:not(.header-anchor):not(.tag-item).article-title {
	@apply text-2xl font-bold p-0 no-underline;
}

.article-info {
	@apply w-full inline-flex flex-wrap gap-x-2
	text-sm font-mono;
}
.article-info .date {
	@apply text-gray-400;
}
.article-info .author {
	@apply text-neutral-400;
}

.article-excerpt {
	@apply text-base text-gray-600 dark:text-gray-400
	transition-colors ease-in-out duration-300;
}

.article-tags {
	@apply w-full flex flex-nowrap gap-1
	whitespace-nowrap overflow-hidden;
}
.article-tags .tag-item {
	@apply inline-flex justify-center items-center gap-2 py-0.5 px-1
	border-2 border-transparent rounded bg-slate-200 dark:bg-slate-700
	hover:bg-slate-300 dark:hover:bg-slate-600 text-sm font-semibold cursor-pointer
	transition-all ease-in-out duration-300;
}
.tag-item.router-link-active {
	@apply border-green-400 dark:border-green-600
	text-green-500 dark:text-green-500;
}
</style>
