<script lang="ts" setup>
import { type Ref } from "vue";
import PageFooter from "./PageFooter.vue";
import { RouteLink, type SiteData, useSiteData } from "vuepress/client";
import { getTagPathByTag } from "../composables/useComponentUtils";
import { type PagesMap, defaultConstants } from "../../shared";

const siteData: Ref<SiteData & { pagesMap: PagesMap }> = useSiteData() as any;

const { "/": articles } = siteData.value.pagesMap;
const { exceptHomeListSlug } = defaultConstants;
const trimArticles = articles.filter((article) => {
  return !exceptHomeListSlug.includes(article.slug);
});

console.log(trimArticles);
</script>

<template>
  <div class="v-nc-theme-home">
    <div class="page-main">
      <div class="home-article-list">
        <div class="article" v-for="article in trimArticles">
          <RouteLink class="home-link" :to="article.pathInferred!">
            <span class="title">{{ article.data.title }}</span>
            <span class="tags">
              <RouteLink
                class="tag"
                v-for="tag in article.routeMeta?._blog?.tags"
                :to="getTagPathByTag(tag)"
                >{{ tag }}</RouteLink
              >
            </span>
          </RouteLink>
        </div>
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
  @apply w-1/2 h-fit flex flex-wrap items-center gap-2 my-24;
}

.article {
  @apply w-fit h-fit;
}
.article .home-link {
  @apply inline-flex flex-col justify-center max-w-60 h-full px-1
  rounded border-2 border-transparent bg-zinc-100 dark:bg-zinc-600
  hover:bg-green-100 hover:border-green-300 dark:hover:bg-green-700 dark:hover:border-green-500
  select-none cursor-pointer transition-all ease-in-out duration-300;
}
.home-link .title {
  @apply inline-block max-w-60
  text-xl
  truncate;
}
.home-link .tags {
  @apply inline-flex max-w-60 gap-0.5
  flex-wrap
  text-sm;
}
</style>
