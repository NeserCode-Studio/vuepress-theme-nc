<script lang="ts" setup>
import { computed, toRefs, type Ref } from "vue";
import { useSiteLocaleData } from "vuepress/client";

import { getTimeAgo } from "../composables/useDate";
import { getTagPathByTag } from "../composables/useComponentUtils";

import type { SiteLocaleData } from "vuepress/client";
import type { BlogTypeArticleData } from "../../shared";

type TimelineArticle = BlogTypeArticleData["items"][number];

const $props = defineProps<{
  articles: BlogTypeArticleData["items"];
}>();

const { articles } = toRefs($props);
const siteLocale: Ref<SiteLocaleData> = useSiteLocaleData();

const timelineGroups = computed(() => {
  const groups = new Map<number, TimelineArticle[]>();

  for (const article of articles.value) {
    const year = new Date(article.info.date).getFullYear();
    const group = groups.get(year) ?? [];
    group.push(article);
    groups.set(year, group);
  }

  let startIndex = 0;
  return [...groups.entries()]
    .sort(([currentYear], [nextYear]) => nextYear - currentYear)
    .map(([year, groupArticles]) => {
      const numberedArticles = groupArticles.map((article, index) => ({
        article,
        index: startIndex + index,
      }));
      startIndex += groupArticles.length;

      return {
        year,
        articles: numberedArticles,
      };
    });
});

function stringfyExcerpt(excerpt: string) {
  let result: string;
  if (excerpt === undefined || excerpt.trim() === "")
    return "暂时没有摘要，要不进来看看？";
  else {
    result = excerpt
      .replace(/<[Hh]([1-6])>[^<]*?<\/[Hh]\1>/, "")
      .replace(/<[^>]+>/g, "");
  }
  return result.trim() === "" ? "暂时没有摘要，要不进来看看？" : result;
}

function getAuthor(author: string) {
  if (author.trim() === "") return siteLocale.value.title ?? "Unknown";
  return author === undefined ? "Unknown" : author;
}

function getMonthDay(date: Date | string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

function getClock(date: Date | string) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h24",
  }).format(new Date(date));
}

function getISODate(date: Date | string) {
  return new Date(date).toISOString();
}

function getIndexLabel(index: number) {
  return String(index + 1).padStart(2, "0");
}
</script>

<template>
  <div class="timeline-list">
    <section
      class="timeline-group"
      v-for="group in timelineGroups"
      :key="group.year"
    >
      <header class="timeline-group-header">
        <span class="group-year">{{ group.year }}</span>
        <span class="group-rule" aria-hidden="true"></span>
        <span class="group-count">{{ group.articles.length }} 篇</span>
      </header>

      <div class="timeline-entries">
        <article
          class="timeline-entry"
          v-for="{ article, index } in group.articles"
          :key="article.path"
          :style="{ '--timeline-index': index }"
        >
          <div class="entry-date">
            <span class="month-day">{{ getMonthDay(article.info.date) }}</span>
            <span class="year">{{ group.year }}</span>
          </div>
          <span class="entry-node" aria-hidden="true"></span>

          <div class="entry-main">
            <div class="entry-head">
              <router-link
                :to="article.path"
                class="entry-title article-title"
                >{{ article.info.title }}</router-link
              >
              <span class="entry-index">No.{{ getIndexLabel(index) }}</span>
            </div>

            <p class="entry-excerpt">
              {{ stringfyExcerpt(article.info.excerpt) }}
            </p>

            <div class="entry-meta">
              <time :datetime="getISODate(article.info.date)">
                {{ getClock(article.info.date) }}
              </time>
              <span>{{ getTimeAgo(article.info.date) }}</span>
              <span>by {{ getAuthor(article.info.author) }}</span>
            </div>

            <div class="entry-tags" v-if="article.info.tags.length > 0">
              <router-link
                :to="getTagPathByTag(tag)"
                v-for="tag in article.info.tags.slice(0, 3)"
                :key="tag"
                class="tag-item"
                >{{ tag }}</router-link
              >
              <span
                class="tag-item more-tag"
                v-if="article.info.tags.length > 3"
              >
                +{{ article.info.tags.length - 3 }} tags
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.timeline-list {
  @apply w-full;
}

.timeline-group {
  @apply mt-8 first:mt-0;
}

.timeline-group-header {
  @apply mb-5 flex items-center gap-3;
}

.timeline-group-header .group-year {
  @apply text-2xl font-black font-mono text-slate-900 dark:text-slate-100;
}

.timeline-group-header .group-rule {
  @apply h-px min-w-6 flex-1 bg-slate-200 dark:bg-slate-700;
}

.timeline-group-header .group-count {
  @apply text-xs text-slate-400 dark:text-slate-500;
}

.timeline-entries {
  @apply relative;
}

.timeline-entries::before {
  content: "";
  @apply absolute top-3 bottom-3 w-px
	border-l border-dashed
	border-slate-200 dark:border-slate-700;
  left: 0.5rem;
}

@media (min-width: 640px) {
  .timeline-entries::before {
    left: 7.25rem;
  }
}

.timeline-entry {
  @apply grid items-start gap-x-3;
  grid-template-columns: 1.25rem minmax(0, 1fr);
  animation: timeline-enter 0.45s ease-out forwards;
  animation-delay: calc(var(--timeline-index) * 60ms);
}

@media (min-width: 640px) {
  .timeline-entry {
    grid-template-columns: 5.5rem 2rem minmax(0, 1fr);
  }
}

@keyframes timeline-enter {
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.entry-date {
  @apply hidden flex-col text-right font-mono sm:flex;
}

.entry-date .month-day {
  @apply text-lg font-bold text-slate-700 dark:text-slate-200;
}

.entry-date .year {
  @apply text-xs text-slate-400 dark:text-slate-500;
}

.entry-node {
  @apply relative z-10 mt-1 h-4 w-4 justify-self-center rounded-full
	border-2 border-green-400 bg-slate-50 dark:border-green-500 dark:bg-slate-900
	transition-all ease-in-out duration-200;
}

.timeline-entry:hover .entry-node {
  @apply scale-110 bg-green-400;
}

.entry-main {
  @apply flex min-w-0 flex-col gap-2 pb-6;
}

.entry-head {
  @apply flex items-start justify-between gap-3;
}

.entry-main .entry-title {
  @apply inline-flex min-w-0 text-lg font-bold
	text-slate-900 no-underline
	hover:text-green-600
	dark:text-slate-100 dark:hover:text-green-400
	transition-colors ease-in-out duration-200;
}

.entry-index {
  @apply shrink-0 pt-1 text-xs font-mono text-slate-400 dark:text-slate-500;
}

.entry-excerpt {
  @apply line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300;
}

.entry-meta {
  @apply flex flex-wrap items-center gap-x-2 gap-y-1 text-xs
	text-slate-400 dark:text-slate-500;
}

.entry-tags {
  @apply flex flex-wrap gap-1;
}

.entry-tags .tag-item {
  @apply inline-flex max-w-full items-center justify-center gap-2
	rounded border-2 border-transparent bg-slate-200 px-1 py-0.5
	text-sm text-slate-700 no-underline
	hover:bg-slate-300
	dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600
	cursor-pointer transition-all ease-in-out duration-200 truncate;
}
</style>
