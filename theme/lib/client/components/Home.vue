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
const latestYear = computed(() => {
	const date = featuredArticle.value
		? new Date(featuredArticle.value.routeMeta._blog?.date ?? featuredArticle.value.date)
		: null
	return date && !Number.isNaN(date.getTime()) ? date.getFullYear() : "----"
})
const journalLoad = computed(() =>
	Math.min(100, Math.round((articles.value.length / 12) * 100))
)

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
	if (Number.isNaN(date.getTime())) return "草稿"

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
			<div class="hero-pile">
				<article class="pile-card controlled title-card">
					<p class="controlled-eyebrow">笔记与札记</p>
					<h1 id="home-title">{{ siteData.title }}</h1>
				</article>

				<article class="pile-card controlled tagline-card">
					<p class="hero-tagline">{{ siteData.description }}</p>
					<div class="hero-actions">
						<RouterLink class="primary-action" to="/time/">
							<span>浏览时间线</span>
							<span aria-hidden="true">&rarr;</span>
						</RouterLink>
						<RouterLink class="secondary-action" to="/tags/">
							<span>探索主题</span>
						</RouterLink>
					</div>
				</article>

				<article class="pile-card stat-card span-1">
					<span class="stat-label">篇目</span>
					<span class="stat-value">{{ articles.length }}</span>
				</article>

				<article class="pile-card stat-card span-1">
					<span class="stat-label">主题</span>
					<span class="stat-value">{{ topicEntries.length }}</span>
				</article>

				<article
					class="pile-card note-card span-2 row-2"
					v-if="featuredArticle"
				>
					<time>{{ formatDate(featuredArticle) }}</time>
					<RouteLink
						:to="featuredArticle.pathInferred!"
						class="pile-title"
					>
						{{ featuredArticle.routeMeta._blog?.title }}
					</RouteLink>
					<span class="pile-excerpt">
						{{ getExcerpt(featuredArticle) }}
					</span>
					<span class="pile-tags">
						{{ getTags(featuredArticle).slice(0, 3).join(" / ") }}
					</span>
				</article>

				<article
					class="pile-card recent-card span-1 row-2"
					v-for="article in recentArticles.slice(0, 4)"
					:key="article.slug"
				>
					<time>{{ formatDate(article) }}</time>
					<RouteLink :to="article.pathInferred!" class="pile-title">
						{{ article.routeMeta._blog?.title }}
					</RouteLink>
					<span class="pile-excerpt">
						{{ getExcerpt(article) }}
					</span>
				</article>

				<article class="pile-card code-card span-2 row-1">
					<span class="stat-label">灵感流</span>
					<pre><code>记录 → 理解 → 分享</code></pre>
				</article>

				<article class="pile-card progress-card span-2 row-1">
					<span class="stat-label">札记进度</span>
					<span class="stat-value">{{ articles.length }}/12</span>
					<span class="progress-track">
						<span
							class="progress-bar"
							:style="{ width: `${journalLoad}%` }"
						></span>
					</span>
				</article>

				<article class="pile-card timeline-card span-2 row-2">
					<span class="stat-label">时间脉络</span>
					<div class="timeline-track">
						<span
							class="timeline-dot"
							v-for="article in recentArticles.slice(0, 5)"
							:key="article.slug"
						></span>
					</div>
					<span class="timeline-years">{{ latestYear }}</span>
				</article>

				<article class="pile-card stamp-card span-1 row-1">
					<span class="stamp">共 {{ articles.length }} 篇</span>
				</article>

				<article class="pile-card quote-card span-2 row-2">
					<blockquote>
						长文记录，简短思考。
					</blockquote>
				</article>

				<article class="pile-card grid-card span-1 row-1" aria-hidden="true">
					<div class="dot-grid">
						<span v-for="dot in 9" :key="dot"></span>
					</div>
				</article>

				<article class="pile-card arrow-card span-1 row-1" aria-hidden="true">
					<span>&rarr;</span>
				</article>

				<RouterLink
					class="pile-card pile-topic-card span-1 row-1"
					v-for="topic in topicEntries.slice(0, 4)"
					:key="topic.name"
					:to="getTagPathByTag(topic.name)"
				>
					<span class="topic-name">{{ topic.name }}</span>
					<small>{{ topic.count }}</small>
				</RouterLink>
			</div>
		</section>

		<section class="featured-section" v-if="featuredArticle">
			<div class="section-heading">
				<span class="heading-label">精选阅读</span>
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
						阅读全文
					</RouteLink>
				</div>
			</article>
		</section>

		<section class="recent-section" v-if="recentArticles.length">
			<div class="section-heading">
				<h2>最近文章</h2>
				<RouteLink class="heading-link" to="/time/">全部文章</RouteLink>
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
						{{ getTags(article).slice(0, 2).join(" / ") || "札记" }}
					</span>
				</RouteLink>
			</div>
		</section>

		<section class="topic-section" v-if="topicEntries.length">
			<div class="section-heading">
				<h2>主题索引</h2>
				<RouteLink class="heading-link" to="/tags/">全部主题</RouteLink>
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

.hero-pile {
	@apply grid grid-cols-2 gap-3;
	grid-auto-rows: minmax(4.5rem, auto);
	grid-auto-flow: dense;
}

.pile-card {
	@apply relative flex min-w-0 flex-col gap-2 rounded-xl border p-3
	border-slate-200 bg-white/90 shadow-sm backdrop-blur
	text-slate-700 no-underline
	transition-colors ease-in-out duration-200
	hover:border-emerald-300 hover:bg-white
	dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200
	dark:hover:border-emerald-500 dark:hover:bg-slate-900;
}

.pile-card:nth-child(3n) {
	rotate: 0.45deg;
}

.pile-card:nth-child(3n + 1) {
	rotate: -0.7deg;
}

.controlled {
	@apply z-20;
}

.title-card {
	@apply justify-center col-span-2 row-2 min-h-40 p-4
	bg-white shadow-lg dark:bg-slate-900;
}

.controlled-eyebrow {
	@apply inline-flex items-center gap-2
	text-sm font-semibold font-mono
	text-emerald-600 dark:text-emerald-400;
}

.controlled-eyebrow::before {
	content: "";
	@apply w-2 h-2 rounded-full bg-emerald-500;
}

.title-card h1 {
	@apply text-4xl leading-[1.05] font-black
	text-slate-900 dark:text-slate-50;
}

.tagline-card {
	@apply justify-between col-span-2 row-2 min-h-36 p-4
	border-dashed;
}

.hero-tagline {
	@apply text-lg leading-8
	text-slate-600 dark:text-slate-300;
}

.hero-actions {
	@apply mt-4 flex flex-wrap items-center gap-3;
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

.row-1 {
	grid-row: span 1;
}

.row-2 {
	grid-row: span 2;
}

.stat-card {
	@apply justify-center col-span-2 p-3
	bg-slate-100/85 dark:bg-slate-800/55;
}

.stat-label {
	@apply text-xs font-semibold font-mono
	text-slate-500 dark:text-slate-400;
}

.stat-value {
	@apply text-xl font-bold;
}

.pile-title {
	@apply line-clamp-2 text-lg font-bold leading-6
	text-slate-900 no-underline
	hover:text-emerald-600
	dark:text-slate-50 dark:hover:text-emerald-400;
}

.pile-excerpt {
	@apply line-clamp-3 text-sm leading-6
	text-slate-600 dark:text-slate-300;
}

.pile-tags {
	@apply mt-auto text-xs font-semibold font-mono
	text-emerald-600 dark:text-emerald-400;
}

.code-card {
	@apply justify-center col-span-2
	bg-slate-950 text-slate-100
	dark:bg-slate-950;
}

.code-card pre {
	@apply m-0 overflow-x-auto text-sm font-mono;
}

.progress-track {
	@apply h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700;
}

.progress-bar {
	@apply block h-full rounded-full bg-emerald-500;
}

.timeline-track {
	@apply relative flex flex-1 items-center;
}

.timeline-track::before {
	content: "";
	@apply absolute left-2 right-2 h-px
	border-t border-dashed border-emerald-400/60;
}

.timeline-dot {
	@apply relative z-10 h-3 w-3 rounded-full border-2
	border-emerald-500 bg-white dark:bg-slate-900;
}

.timeline-years {
	@apply text-sm font-mono text-slate-500 dark:text-slate-400;
}

.stamp-card {
	@apply justify-center items-center col-span-2;
}

.stamp {
	@apply rounded-full border-2 border-dashed px-3 py-1
	text-sm font-bold font-mono text-emerald-600
	rotate-[-6deg] dark:text-emerald-400;
}

.quote-card {
	@apply justify-center col-span-2;
}

.quote-card blockquote {
	@apply m-0 text-lg font-semibold leading-7
	text-slate-800 dark:text-slate-100;
}

.grid-card {
	@apply justify-center items-center col-span-2;
}

.dot-grid {
	@apply grid grid-cols-3 gap-2;
}

.dot-grid span {
	@apply block h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600;
}

.arrow-card {
	@apply justify-center items-center col-span-2 text-2xl;
}

.pile-topic-card {
	@apply flex-row items-center justify-between col-span-2;
}

.pile-topic-card .topic-name {
	@apply truncate text-sm font-semibold;
}

.pile-topic-card small {
	@apply rounded-full bg-slate-200 px-1.5
	text-xs font-bold dark:bg-slate-800;
}

@media (min-width: 640px) {
	.hero-pile {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.span-1 {
		grid-column: span 1;
	}

	.span-2 {
		grid-column: span 2;
	}

	.title-card {
		grid-column: span 3;
	}

	.tagline-card {
		grid-column: span 3;
	}
}

@media (min-width: 1024px) {
	.hero-pile {
		grid-template-columns: repeat(12, minmax(0, 1fr));
	}

	.span-1 {
		grid-column: span 2;
	}

	.span-2 {
		grid-column: span 3;
	}

	.title-card {
		grid-column: span 5;
	}

	.tagline-card {
		grid-column: span 5;
	}
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
