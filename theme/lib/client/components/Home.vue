<script lang="ts" setup>
import { computed } from "vue"
import { RouteLink, useSiteData, type SiteData } from "vuepress/client"

import { defaultConstants } from "../../shared"
import type { PagesMap, PagesMapInfo } from "../../shared"
import { getTagPathByTag } from "../composables/useComponentUtils"

type HomeSiteData = { pagesMap?: PagesMap }

const siteData = useSiteData()
const siteDataWithPages = computed(
	() => siteData.value as SiteData & HomeSiteData
)

const articles = computed<PagesMapInfo[]>(() => {
	const list = siteDataWithPages.value.pagesMap?.["/"] ?? []

	return list
		.filter(
			(article) =>
				article.pathInferred &&
				article.routeMeta._blog &&
				!defaultConstants.exceptHomeListSlug.includes(article.slug)
		)
		.sort((left, right) => getDate(right) - getDate(left))
})

const featuredArticle = computed(() => articles.value[0] ?? null)
const recentArticles = computed(() => articles.value.slice(1, 7))

const topicEntries = computed(() => {
	const topicMap = new Map<string, number>()

	for (const article of articles.value) {
		for (const tag of getTags(article)) {
			topicMap.set(tag, (topicMap.get(tag) ?? 0) + 1)
		}
	}

	return [...topicMap.entries()]
		.map(([name, count]) => ({ name, count }))
		.sort((left, right) => right.count - left.count)
		.slice(0, 8)
})

function getTags(article: PagesMapInfo): string[] {
	const tags = article.routeMeta._blog?.tags
	if (!tags) return []
	return Array.isArray(tags) ? tags : [tags]
}

function getDate(article: PagesMapInfo): number {
	const date = new Date(article.routeMeta._blog?.date ?? article.date)
	return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}

function formatDate(article: PagesMapInfo): string {
	const date = new Date(article.routeMeta._blog?.date ?? article.date)
	if (Number.isNaN(date.getTime())) return "Draft"

	return date.toLocaleDateString("zh-CN", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})
}

function getExcerpt(article: PagesMapInfo): string {
	const excerpt = article.routeMeta._blog?.excerpt ?? ""
	const plainText = excerpt
		.replace(/<[Hh]([1-6])>[^<]*?<\/[Hh]\1>/g, "")
		.replace(/<[^>]+>/g, "")
		.replace(/\s+/g, " ")
		.trim()

	return plainText || "这篇笔记还没有摘要，直接点进去读正文吧。"
}

function getAuthor(article: PagesMapInfo): string {
	return article.routeMeta._blog?.author || siteData.value.title || "NeserCode"
}
</script>

<template>
	<div class="v-nc-home">
		<section class="home-hero" aria-labelledby="home-title">
			<p class="hero-eyebrow">Notes &amp; Journals</p>
			<h1 id="home-title">{{ siteData.title }}</h1>
			<p class="hero-tagline">{{ siteData.description }}</p>

			<div class="hero-actions">
				<RouterLink class="primary-action" to="/time/">
					<span>Browse journal</span>
					<span aria-hidden="true">&rarr;</span>
				</RouterLink>
				<RouterLink class="secondary-action" to="/tags/">
					<span>Explore topics</span>
				</RouterLink>
			</div>

			<dl class="hero-stats">
				<div class="stat">
					<dt>Entries</dt>
					<dd>{{ articles.length }}</dd>
				</div>
				<div class="stat">
					<dt>Topics</dt>
					<dd>{{ topicEntries.length }}</dd>
				</div>
				<div class="stat">
					<dt>Reading</dt>
					<dd>Long-form</dd>
				</div>
			</dl>
		</section>

		<section class="featured-section" v-if="featuredArticle">
			<div class="section-heading">
				<span class="heading-label">Featured</span>
				<span class="heading-rule" aria-hidden="true"></span>
			</div>

			<article class="featured-entry">
				<div class="entry-meta">
					<time>{{ formatDate(featuredArticle) }}</time>
					<span>&middot; {{ getAuthor(featuredArticle) }}</span>
				</div>
				<h2 class="featured-title">
					<RouteLink :to="featuredArticle.pathInferred!">
						{{ featuredArticle.routeMeta._blog?.title }}
					</RouteLink>
				</h2>
				<p class="entry-excerpt">{{ getExcerpt(featuredArticle) }}</p>
				<div class="entry-footer">
					<RouterLink
						v-for="tag in getTags(featuredArticle).slice(0, 3)"
						:key="tag"
						:to="getTagPathByTag(tag)"
						class="topic-link"
					>
						{{ tag }}
					</RouterLink>
					<RouteLink class="read-link" :to="featuredArticle.pathInferred!">
						Read note
					</RouteLink>
				</div>
			</article>
		</section>

		<section class="recent-section" v-if="recentArticles.length">
			<div class="section-heading">
				<h2>Recent entries</h2>
				<RouteLink class="heading-link" to="/time/">All entries</RouteLink>
			</div>

			<div class="entry-grid">
				<RouteLink
					v-for="article in recentArticles"
					:key="article.slug"
					:to="article.pathInferred!"
					class="entry-card"
				>
					<time>{{ formatDate(article) }}</time>
					<span class="card-title">
						{{ article.routeMeta._blog?.title }}
					</span>
					<span class="card-excerpt">{{ getExcerpt(article) }}</span>
					<span class="card-tags">
						{{ getTags(article).slice(0, 2).join(" / ") || "Journal" }}
					</span>
				</RouteLink>
			</div>
		</section>

		<section class="topic-section" v-if="topicEntries.length">
			<div class="section-heading">
				<h2>Topic index</h2>
				<RouteLink class="heading-link" to="/tags/">All topics</RouteLink>
			</div>

			<div class="topic-grid">
				<RouterLink
					v-for="topic in topicEntries"
					:key="topic.name"
					:to="getTagPathByTag(topic.name)"
					class="topic-card"
				>
					<span>{{ topic.name }}</span>
					<small>{{ topic.count }}</small>
				</RouterLink>
			</div>
		</section>
	</div>
</template>

<style lang="postcss" scoped>
.v-nc-home {
	@apply w-full max-w-6xl flex flex-col px-4 py-14 sm:px-8 sm:py-20
	lg:px-12;
}

.home-hero {
	@apply relative pb-10 border-b
	border-slate-200 dark:border-slate-700;
}

.hero-eyebrow {
	@apply inline-flex items-center gap-2 mb-4
	text-sm font-semibold font-mono
	text-emerald-600 dark:text-emerald-400;
}

.hero-eyebrow::before {
	content: "";
	@apply w-2 h-2 rounded-full bg-emerald-500;
}

.home-hero h1 {
	@apply max-w-3xl mb-4
	text-4xl leading-[1.1] font-black
	text-slate-900 dark:text-slate-50;
}

.hero-tagline {
	@apply max-w-2xl mb-8
	text-lg leading-8
	text-slate-600 dark:text-slate-300;
}

.hero-actions {
	@apply flex flex-wrap items-center gap-3;
}

.primary-action,
.secondary-action {
	@apply inline-flex h-10 items-center justify-center gap-2 rounded px-4
	text-sm font-semibold no-underline
	transition-colors ease-in-out duration-200;
}

.primary-action {
	@apply bg-emerald-500 text-white hover:bg-emerald-600;
}

.secondary-action {
	@apply border border-slate-300 text-slate-700
	hover:border-slate-400 hover:bg-slate-100
	dark:border-slate-600 dark:text-slate-100
	dark:hover:border-slate-500 dark:hover:bg-slate-800;
}

.hero-stats {
	@apply mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3;
}

.hero-stats .stat {
	@apply px-4 py-3 border-l-2
	border-emerald-500/70 bg-slate-100/60
	dark:bg-slate-800/50;
}

.hero-stats dt {
	@apply text-xs font-semibold font-mono uppercase
	text-slate-500 dark:text-slate-400;
}

.hero-stats dd {
	@apply mt-1 text-xl font-bold;
}

.section-heading {
	@apply flex items-center justify-between gap-4 mt-12 mb-6;
}

.section-heading h2 {
	@apply text-xl font-bold text-slate-900 dark:text-slate-50;
}

.heading-label {
	@apply text-sm font-bold font-mono uppercase
	text-emerald-600 dark:text-emerald-400;
}

.heading-rule {
	@apply hidden flex-1 h-px bg-slate-200 dark:bg-slate-700 sm:block;
}

.heading-link {
	@apply text-sm font-semibold text-slate-600 no-underline
	hover:text-emerald-600
	dark:text-slate-300 dark:hover:text-emerald-400;
}

.featured-entry {
	@apply relative flex flex-col gap-3 border-l-2
	border-emerald-500 pl-4 sm:pl-6;
}

.entry-meta,
.entry-card time {
	@apply text-sm font-medium font-mono
	text-slate-500 dark:text-slate-400;
}

.featured-title {
	@apply max-w-3xl text-2xl font-black leading-8;
}

.featured-title a {
	@apply no-underline
	text-slate-900 hover:text-emerald-600
	dark:text-slate-50 dark:hover:text-emerald-400;
}

.entry-excerpt {
	@apply max-w-3xl leading-7
	text-slate-600 dark:text-slate-300;
}

.entry-footer {
	@apply flex flex-wrap items-center gap-2;
}

.topic-link {
	@apply inline-flex items-center rounded bg-slate-200 px-2 py-0.5
	text-sm font-semibold no-underline text-slate-700
	hover:bg-slate-300
	dark:bg-slate-800 dark:text-slate-200
	dark:hover:bg-slate-700;
}

.read-link {
	@apply ml-auto inline-flex items-center gap-1
	text-sm font-semibold text-emerald-600 no-underline
	hover:text-emerald-700
	dark:text-emerald-400 dark:hover:text-emerald-300;
}

.entry-grid {
	@apply grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3;
}

.entry-card {
	@apply flex min-h-44 flex-col gap-2 rounded-lg border p-4
	border-slate-200 bg-white no-underline
	transition-all ease-in-out duration-200
	hover:-translate-y-0.5 hover:border-emerald-400
	dark:border-slate-700 dark:bg-slate-900/70
	dark:hover:border-emerald-500;
}

.card-title {
	@apply text-lg font-bold leading-6
	text-slate-900 dark:text-slate-50;
}

.card-excerpt {
	@apply line-clamp-3 text-sm leading-6
	text-slate-600 dark:text-slate-300;
}

.card-tags {
	@apply mt-auto text-xs font-semibold font-mono
	text-emerald-600 dark:text-emerald-400;
}

.topic-grid {
	@apply grid grid-cols-2 gap-3 sm:grid-cols-4;
}

.topic-card {
	@apply flex h-12 items-center justify-between rounded border px-3
	border-slate-200 bg-slate-50 no-underline
	text-sm font-semibold text-slate-700
	transition-colors ease-in-out duration-200
	hover:border-emerald-400 hover:bg-white
	dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200
	dark:hover:border-emerald-500 dark:hover:bg-slate-900;
}

.topic-card small {
	@apply rounded-full bg-slate-200 px-1.5
	text-xs font-bold
	dark:bg-slate-800;
}

@media (max-width: 640px) {
	.home-hero h1 {
		@apply text-3xl;
	}

	.featured-entry {
		@apply pl-4;
	}

	.entry-card {
		min-height: 9rem;
	}
}
</style>
