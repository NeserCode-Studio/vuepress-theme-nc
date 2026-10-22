<script lang="ts" setup>
import { computed, ref } from "vue"
import {
	ArrowUpTrayIcon,
	CalendarIcon,
	ChartBarIcon,
	ChevronDownIcon,
	MagnifyingGlassIcon,
	PaperAirplaneIcon,
} from "@heroicons/vue/24/outline"
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
const journalLoad = computed(() =>
	Math.min(100, Math.round((articles.value.length / 12) * 100))
)
const searchQuery = ref("")
const topicFilter = ref("全部主题")
const readingDensity = ref(64)
const focusMode = ref(true)
const noteRead = ref(true)
const noteSaved = ref(false)
const noteReview = ref(false)
const contentTab = ref("笔记")
const contentTabs = ["笔记", "方案", "速记"]
const selectedDay = ref(2)
const email = ref("")
const subscribed = ref(false)
const uploadName = ref("")
const weekDays = ["一", "二", "三", "四", "五", "六", "日"]
const weeklyBars = [32, 58, 44, 72, 61, 84, 49]
const calendarDays = Array.from({ length: 28 }, (_, index) => index + 1)

function onFileChange(event: Event) {
	const target = event.target as HTMLInputElement
	uploadName.value = target.files?.[0]?.name ?? ""
}

function subscribe() {
	if (email.value.trim()) subscribed.value = true
}

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
		<div class="hero-board">
			<article class="wall-tile hero-anchor title-card">
				<p class="tile-tag">学习工作台</p>
				<h1 id="home-title">NeserCode</h1>
				<span class="title-note">
					{{ articles.length }} 篇 · {{ topicEntries.length }} 个主题
				</span>
			</article>

			<article class="wall-tile hero-anchor claim-card">
				<p class="hero-tagline">Make learning useful.</p>
				<p class="claim-sub">让每个概念都落到实践里。</p>
				<div class="hero-actions">
					<RouterLink class="primary-action" to="/time/">
						<span>看时间线</span>
						<span aria-hidden="true">&rarr;</span>
					</RouterLink>
					<RouterLink class="secondary-action" to="/tags/">
						<span>找主题</span>
					</RouterLink>
				</div>
			</article>

			<article class="wall-tile wall-search">
				<label class="tile-label" for="hero-search">检索框</label>
				<div class="search-shell">
					<MagnifyingGlassIcon class="search-icon" />
					<input
						id="hero-search"
						v-model="searchQuery"
						type="search"
						autocomplete="off"
						placeholder="搜索概念、代码或页面"
					/>
				</div>
			</article>

			<article class="wall-tile wall-check">
				<span class="tile-label">阅读状态</span>
				<label class="check-item">
					<input v-model="noteRead" type="checkbox" />
					<span class="check-mark" aria-hidden="true"></span>
					<span>已读</span>
				</label>
				<label class="check-item">
					<input v-model="noteSaved" type="checkbox" />
					<span class="check-mark" aria-hidden="true"></span>
					<span>稍后保存</span>
				</label>
				<label class="check-item">
					<input v-model="noteReview" type="checkbox" />
					<span class="check-mark" aria-hidden="true"></span>
					<span>复盘一次</span>
				</label>
			</article>

			<article class="wall-tile wall-calendar">
				<span class="tile-label">本周日程</span>
				<div class="calendar-head">
					<CalendarIcon class="icon" />
					<span>七月</span>
				</div>
				<div class="calendar-grid">
					<span
						class="calendar-week"
						v-for="day in weekDays"
						:key="day"
					>
						{{ day }}
					</span>
					<button
						v-for="day in calendarDays"
						:key="day"
						type="button"
						:class="{ active: selectedDay === day }"
						@click="selectedDay = day"
					>
						{{ day }}
					</button>
				</div>
			</article>

			<article class="wall-tile wall-toggle">
				<label class="switch">
					<input v-model="focusMode" type="checkbox" class="sr-only" />
					<span class="switch-track">
						<span class="switch-thumb"></span>
					</span>
					<span class="switch-text">专注模式</span>
				</label>
			</article>

			<article class="wall-tile wall-range">
				<label class="tile-label" for="hero-density">阅读密度</label>
				<input
					id="hero-density"
					v-model.number="readingDensity"
					class="range-input"
					type="range"
					min="0"
					max="100"
				/>
				<div class="range-scale">
					<span>简</span>
					<span>{{ readingDensity }}%</span>
					<span>繁</span>
				</div>
			</article>

			<article class="wall-tile wall-select">
				<label class="tile-label" for="hero-topic">主题筛选</label>
				<div class="select-shell">
					<select id="hero-topic" v-model="topicFilter">
						<option value="全部主题">全部主题</option>
						<option
							v-for="topic in topicEntries.slice(0, 6)"
							:key="topic.name"
							:value="topic.name"
						>
							{{ topic.name }}
						</option>
					</select>
					<ChevronDownIcon class="select-icon" />
				</div>
			</article>

			<article v-if="featuredArticle" class="wall-tile wall-note">
				<span class="business-label">业务块 · 当前在写</span>
				<RouteLink
					:to="featuredArticle.pathInferred!"
					class="note-title"
				>
					{{ featuredArticle.routeMeta._blog?.title }}
				</RouteLink>
				<div class="note-foot">
					<span>{{ formatDate(featuredArticle) }}</span>
					<span>
						{{ getTags(featuredArticle).slice(0, 2).join(" / ") || "札记" }}
					</span>
				</div>
			</article>

			<article class="wall-tile wall-form">
				<p class="tile-label">学习通讯</p>
				<form v-if="!subscribed" @submit.prevent="subscribe">
					<input
						v-model="email"
						class="form-input"
						type="email"
						required
						placeholder="填一个邮箱"
					/>
					<button class="form-button" type="submit">
						<PaperAirplaneIcon class="icon" />
						<span>加入</span>
					</button>
				</form>
				<p v-else class="form-success">已收到，下一期会寄到你那里。</p>
			</article>

			<article class="wall-tile wall-chart">
				<span class="tile-label">写作节奏</span>
				<div class="bar-chart">
					<span
						v-for="(value, index) in weeklyBars"
						:key="index"
						:style="{ height: `${value}%` }"
					></span>
				</div>
				<ChartBarIcon class="chart-icon" />
			</article>

			<article class="wall-tile wall-upload">
				<span class="tile-label">资料投放</span>
				<label class="upload-zone">
					<ArrowUpTrayIcon class="icon" />
					<span>{{ uploadName || "选择一份文件" }}</span>
					<input type="file" class="visually-hidden" @change="onFileChange" />
				</label>
			</article>

			<article class="wall-tile wall-segments">
				<span class="tile-label">内容形态</span>
				<div class="segmented" role="group" aria-label="内容形态">
					<button
						v-for="mode in contentTabs"
						:key="mode"
						type="button"
						:class="{ active: contentTab === mode }"
						@click="contentTab = mode"
					>
						{{ mode }}
					</button>
				</div>
			</article>

			</div>
		</section>

		<section class="featured-section" v-if="featuredArticle">
			<div class="section-heading">
				<span class="heading-label">精选阅读</span>
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
	@apply relative pb-10;
}

.home-hero::before {
	content: "";
	@apply pointer-events-none absolute inset-x-0 top-0 z-0 h-full;
	background-image:
		repeating-linear-gradient(
			90deg,
			rgba(148, 163, 184, 0.14) 0 1px,
			transparent 1px 36px
		),
		repeating-linear-gradient(
			0deg,
			rgba(148, 163, 184, 0.09) 0 1px,
			transparent 1px 30px
		);
	mask-image: linear-gradient(to bottom, black, transparent);
}

.hero-board {
	@apply relative z-10 grid grid-cols-2 gap-3;
	grid-auto-rows: minmax(3.6rem, auto);
	grid-auto-flow: dense;
}

.wall-tile {
	@apply relative flex min-w-0 flex-col gap-2 rounded-xl border p-3
	border-slate-200 bg-white/95 shadow-sm backdrop-blur
	text-slate-700 no-underline
	transition-colors ease-in-out duration-200
	hover:border-emerald-300 hover:bg-white
	dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200
	dark:hover:border-emerald-500 dark:hover:bg-slate-900;
}

.hero-anchor {
	@apply z-20;
	rotate: 0;
}

.title-card {
	@apply col-span-2 row-span-2 justify-center gap-3 min-h-40 p-4
	bg-white shadow-lg dark:bg-slate-900;
}

.tile-tag {
	@apply inline-flex items-center gap-2 text-sm font-semibold font-mono
	text-emerald-600 dark:text-emerald-400;
}

.tile-tag::before {
	content: "";
	@apply w-2 h-2 rounded-full bg-emerald-500;
}

.title-card h1 {
	@apply text-4xl leading-[1.05] font-black
	text-slate-900 dark:text-slate-50;
}

.title-note {
	@apply text-sm font-medium font-mono
	text-slate-500 dark:text-slate-400;
}

.claim-card {
	@apply col-span-2 row-span-2 justify-between min-h-32 p-4
	border-dashed;
}

.hero-tagline {
	@apply text-xl leading-8
	text-slate-700 dark:text-slate-200;
}

.claim-sub {
	@apply text-sm leading-6
	text-slate-500 dark:text-slate-400;
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

.tile-label,
.business-label {
	@apply text-xs font-semibold font-mono uppercase tracking-wide
	text-slate-500 dark:text-slate-400;
}

.search-shell {
	@apply flex h-10 items-center gap-2 rounded border px-3
	border-slate-300 bg-white
	focus-within:border-emerald-400
	dark:border-slate-600 dark:bg-slate-950;
}

.search-shell input {
	@apply min-w-0 flex-1 bg-transparent text-sm outline-none
	text-slate-700 dark:text-slate-100;
}

.search-icon {
	@apply h-4 w-4 shrink-0 text-slate-400;
}

.check-item {
	@apply inline-flex items-center gap-2 text-sm;
}

.check-item input {
	@apply sr-only;
}

.check-mark {
	@apply inline-block h-4 w-4 rounded border border-slate-400 bg-white
	transition-colors ease-in-out duration-200
	dark:border-slate-500 dark:bg-slate-800;
}

.check-item input:checked + .check-mark {
	@apply border-emerald-500 bg-emerald-500;
}

.check-item input:checked + .check-mark::after {
	content: "";
	@apply mt-1 ml-1 block h-2 w-2 rounded-full bg-white;
}

.wall-calendar .calendar-head {
	@apply inline-flex items-center gap-2 text-sm font-semibold;
}

.calendar-head .icon {
	@apply h-4 w-4 text-emerald-500;
}

.calendar-grid {
	@apply grid grid-cols-7 gap-1 text-xs;
}

.calendar-week {
	@apply text-center font-semibold font-mono text-slate-400;
}

.calendar-grid button {
	@apply aspect-square rounded border border-transparent text-center
	text-slate-600 transition-colors ease-in-out duration-200
	hover:border-emerald-300 hover:bg-emerald-50
	dark:text-slate-300 dark:hover:border-emerald-500
	dark:hover:bg-emerald-500/10;
}

.calendar-grid button.active {
	@apply border-emerald-500 bg-emerald-500 text-white;
}

.switch {
	@apply inline-flex items-center gap-3 text-sm;
}

.switch-track {
	@apply relative inline-flex h-6 w-11 items-center rounded-full
	bg-slate-300 transition-colors ease-in-out duration-200
	dark:bg-slate-700;
}

.switch-thumb {
	@apply block h-4 w-4 rounded-full bg-white shadow transition-transform
	ease-in-out duration-200;
}

.switch input:checked + .switch-track {
	@apply bg-emerald-500;
}

.switch input:checked + .switch-track .switch-thumb {
	transform: translateX(1.5rem);
}

.range-input {
	@apply w-full accent-emerald-500;
}

.range-scale {
	@apply flex items-center justify-between text-xs text-slate-400;
}

.select-shell {
	@apply relative flex h-10 items-center;
}

.select-shell select {
	@apply h-full w-full appearance-none rounded border bg-white px-3 pr-8
	text-sm outline-none border-slate-300 text-slate-700
	focus:border-emerald-400
	dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100;
}

.select-icon {
	@apply pointer-events-none absolute right-3 h-4 w-4 text-slate-400;
}

.business-label {
	@apply text-emerald-600 dark:text-emerald-400;
}

.note-title {
	@apply line-clamp-2 text-lg font-bold leading-6
	text-slate-900 no-underline hover:text-emerald-600
	dark:text-slate-50 dark:hover:text-emerald-400;
}

.note-foot {
	@apply mt-auto flex items-center justify-between gap-2 text-xs
	text-slate-500 dark:text-slate-400;
}

.wall-form form {
	@apply flex gap-2;
}

.form-input {
	@apply h-10 min-w-0 flex-1 rounded border border-slate-300 bg-white px-3
	text-sm outline-none focus:border-emerald-400
	dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100;
}

.form-button {
	@apply inline-flex h-10 items-center gap-2 rounded bg-emerald-500 px-3
	text-sm font-semibold text-white hover:bg-emerald-600;
}

.form-button .icon {
	@apply h-4 w-4;
}

.form-success {
	@apply text-sm text-emerald-600 dark:text-emerald-400;
}

.bar-chart {
	@apply flex flex-1 items-end gap-1.5;
}

.bar-chart span {
	@apply block min-h-2 flex-1 rounded-t bg-emerald-400/70
	dark:bg-emerald-500/60;
}

.chart-icon {
	@apply h-4 w-4 self-end text-slate-400;
}

.upload-zone {
	@apply flex min-h-20 flex-1 cursor-pointer flex-col items-center
	justify-center gap-2 rounded border border-dashed px-2 text-center
	text-sm text-slate-600 border-slate-300 bg-slate-50
	hover:border-emerald-400 hover:bg-emerald-50
	dark:border-slate-600 dark:bg-slate-950 dark:text-slate-300
	dark:hover:border-emerald-500 dark:hover:bg-emerald-500/10;
}

.upload-zone .icon {
	@apply h-5 w-5 text-emerald-500;
}

.visually-hidden {
	@apply sr-only;
}

.segmented {
	@apply inline-flex w-full rounded bg-slate-200 p-1
	dark:bg-slate-800;
}

.segmented button {
	@apply h-8 min-w-0 flex-1 rounded px-2 text-sm font-semibold
	text-slate-600 transition-colors ease-in-out duration-200
	hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-700;
}

.segmented button.active {
	@apply bg-white text-slate-900 shadow-sm
	dark:bg-slate-950 dark:text-emerald-400;
}

.wall-search {
	rotate: -0.4deg;
}

.wall-check {
	rotate: 0.6deg;
}

.wall-calendar {
	rotate: -0.2deg;
}

.wall-toggle {
	rotate: 1.1deg;
}

.wall-range {
	rotate: -0.8deg;
}

.wall-select {
	rotate: 0.4deg;
}

.wall-note {
	rotate: -0.6deg;
}

.wall-form {
	rotate: 0.8deg;
}

.wall-chart {
	rotate: -0.5deg;
}

.wall-upload {
	rotate: 1deg;
}

.wall-segments {
	rotate: -0.2deg;
}

@media (min-width: 640px) {
	.hero-board {
		grid-template-columns: repeat(6, minmax(0, 1fr));
		grid-auto-rows: minmax(3.4rem, auto);
	}

	.title-card,
	.claim-card {
		grid-column: span 3;
		grid-row: span 2;
	}

	.wall-search,
	.wall-check,
	.wall-calendar,
	.wall-select,
	.wall-note,
	.wall-form {
		grid-column: span 3;
	}

	.wall-calendar {
		grid-row: span 2;
	}

	.wall-toggle {
		grid-column: span 1;
	}

	.wall-range {
		grid-column: span 2;
	}

	.wall-chart,
	.wall-upload {
		grid-column: span 2;
	}

	.wall-segments {
		grid-column: span 4;
	}

}

@media (min-width: 1024px) {
	.hero-board {
		grid-template-columns: repeat(12, minmax(0, 1fr));
		grid-auto-rows: minmax(4rem, auto);
	}

	.wall-search {
		border-radius: 0.5rem;
	}

	.wall-check {
		border-radius: 1.1rem;
		margin-top: 1.25rem;
	}

	.wall-calendar {
		border-radius: 0.9rem;
	}

	.wall-toggle {
		border-radius: 0.7rem;
		margin-top: 0.75rem;
	}

	.wall-range {
		border-radius: 1rem;
		margin-top: 1.25rem;
	}

	.wall-select {
		border-radius: 0.65rem;
		margin-top: 0.5rem;
	}

	.wall-note {
		border-radius: 1rem;
		margin-top: 1rem;
	}

	.wall-form {
		border-radius: 0.75rem;
		margin-top: 0.5rem;
	}

	.wall-chart {
		border-radius: 0.9rem;
		margin-top: 1.25rem;
	}

	.wall-upload {
		border-radius: 0.6rem;
		margin-top: 0.5rem;
	}

	.wall-segments {
		border-radius: 0.8rem;
		margin-top: 1rem;
	}

	.title-card {
		grid-column: span 5;
		grid-row: span 2;
	}

	.claim-card {
		grid-column: span 4;
		grid-row: span 2;
	}

	.wall-search,
	.wall-check,
	.wall-calendar,
	.wall-range,
	.wall-chart,
	.wall-upload {
		grid-column: span 3;
	}

	.wall-calendar {
		grid-row: span 2;
	}

	.wall-toggle {
		grid-column: span 2;
	}

	.wall-select,
	.wall-note,
	.wall-form {
		grid-column: span 4;
	}

	.wall-segments {
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
