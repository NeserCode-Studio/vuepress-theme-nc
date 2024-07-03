<script lang="ts" setup>
import Pagination from "./Pagination.vue"

import { computed, ref, Ref, toRefs, watch } from "vue"
import { useSiteLocaleData } from "@vuepress/client"
import { usePaginationChanges } from "../composables/useComponentUtils"

import type { SiteLocaleData } from "@vuepress/client"
import type { ArticleData, PaginationPages } from "../../shared"

const $props = defineProps<{
	articles: ArticleData[]
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

function translateDate(date: string) {
	function addZero(num: number) {
		return num < 10 ? `0${num}` : num
	}

	const dateObj = new Date(date)
	const year = dateObj.getFullYear()
	const month = dateObj.getMonth() + 1
	const day = dateObj.getDate()
	const hour = dateObj.getHours()
	const minute = dateObj.getMinutes()
	const second = dateObj.getSeconds()

	return `${year}/${month}/${day}
	${addZero(hour)}:${addZero(minute)}:${addZero(second)}`
}

function getTimeFromNow(date: string) {
	const dateObj = new Date(date)
	const now = new Date()
	const diff = now.getTime() - dateObj.getTime()
	const day = 1000 * 60 * 60 * 24
	const days = Math.floor(diff / day)
	const hours = Math.floor((diff % day) / (1000 * 60 * 60))
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

	if (days > 0) return `${days} days ago`
	else if (hours > 0) return `${hours} hours ago`
	else if (minutes > 0) return `${minutes} minutes ago`
	else return "just now"
}

function getAuthor(author: string) {
	if (author.trim() === "") return siteLocale.value.title ?? "Unknown"
	return author === undefined ? "Unknown" : author
}

function getTagPath(tag: string) {
	return encodeURI(`/tag/${tag.toLowerCase()}/`)
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
					<router-link :to="article.path" class="article-title">{{
						article.info.title
					}}</router-link>
					<span class="article-info">
						<span class="date"
							>{{ translateDate(article.info.date) }} ·
							{{ getTimeFromNow(article.info.date) }}</span
						>
						<span class="author">by {{ getAuthor(article.info.author) }}</span>
					</span>
					<span class="article-excerpt">{{
						stringfyExcerpt(article.info.excerpt)
					}}</span>
					<span class="article-tags">
						<span v-for="tag of article.info.tags" :key="tag" class="tag">
							<router-link :to="getTagPath(tag)">{{ tag }}</router-link>
						</span>
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
