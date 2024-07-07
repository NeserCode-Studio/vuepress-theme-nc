<script lang="ts" setup>
import { Ref, toRefs } from "vue"
import { useSiteLocaleData } from "@vuepress/client"

import type { SiteLocaleData } from "@vuepress/client"
import type { BlogCategoryArticleData } from "../../shared"

const $props = defineProps<{
	articles: BlogCategoryArticleData[]
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
	return `/tag/${tag.toLocaleLowerCase()}/`
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
						>{{ translateDate(article.info.date) }} ·
						{{ getTimeFromNow(article.info.date) }}</span
					>
					<span class="author">by {{ getAuthor(article.info.author) }}</span>
				</span>
				<span class="article-excerpt">{{
					stringfyExcerpt(article.info.excerpt)
				}}</span>
				<span class="article-tags">
					<span v-for="tag in article.info.tags" :key="tag" class="tag">
						<router-link :to="getTagPath(tag)">{{ tag }}</router-link>
					</span>
				</span>
			</div>
		</div>
	</div>
</template>
