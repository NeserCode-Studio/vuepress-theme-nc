<script lang="ts" setup>
import { computed, ref, type Ref } from "vue";
import PageFooter from "./PageFooter.vue";
import Pagination from "./Pagination.vue";
import { RouteLink, type SiteData, useSiteData } from "vuepress/client";
import { usePaginationChanges } from "../composables/useComponentUtils";
import { type PagesMap, PaginationPages, defaultConstants } from "../../shared";

const siteData: Ref<SiteData & { pagesMap: PagesMap }> = useSiteData() as any;

const { "/": articles } = siteData.value.pagesMap;
const { exceptHomeListSlug } = defaultConstants;
const trimArticles = articles.filter((article) => {
  return !exceptHomeListSlug.includes(article.slug);
});

const pageSet = ref<PaginationPages>({
  total: trimArticles.length,
  offset: 0,
  limit: 1,
});
const pageChanges = usePaginationChanges(pageSet);
const slicedArticles = computed(() =>
  trimArticles.slice(
    pageSet.value.offset,
    pageSet.value.offset + pageSet.value.limit
  )
);
</script>

<template>
  <div class="v-nc-theme-home">
    <div class="page-main">
      <div class="home-article-list">
        <div class="articles">
          <div class="article" v-for="article in slicedArticles">
            <RouteLink class="home-link" :to="article.pathInferred!">
              <span class="title">{{ article.data.title }}</span>
            </RouteLink>
          </div>
        </div>
        <Pagination :pages="pageSet" :changes="pageChanges" />
      </div>
      <PageFooter />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.page-main {
  @apply flex flex-col justify-center items-center;
}
.home-article-list {
  @apply w-1/2 h-fit min-h-60 flex flex-col items-center justify-between my-24;
}

.articles {
  @apply flex flex-wrap gap-2;
}
.article {
  @apply w-fit h-fit;
}
.article .home-link {
  @apply inline-flex flex-col justify-center max-w-60 h-full
  rounded border-2 border-transparent bg-zinc-100 dark:bg-zinc-600
  hover:bg-green-100 hover:border-green-300 dark:hover:bg-green-700 dark:hover:border-green-500
  hover:text-green-500
  select-none cursor-pointer transition-all ease-in-out duration-300;
}
.home-link .title {
  @apply inline-block max-w-60 py-0.5 px-1.5
  text-xl shadow
  truncate;
}
</style>
