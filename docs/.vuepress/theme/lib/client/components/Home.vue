<script lang="ts" setup>
import { type Ref } from "vue";
import PageFooter from "./PageFooter.vue";
import { RouteLink, type SiteData, useSiteData } from "vuepress/client";
import { type PagesMap, defaultConstants } from "../../shared";

const siteData: Ref<SiteData & { pagesMap: PagesMap }> = useSiteData() as any;

const { "/": articles } = siteData.value.pagesMap;
const { exceptHomeListSlug } = defaultConstants;
const trimArticles = articles.filter((article) => {
  return !exceptHomeListSlug.includes(article.slug);
});
</script>

<template>
  <div class="v-nc-theme-home">
    <div class="page-main">
      <div class="home-article-list">
        <div class="article" v-for="article in trimArticles">
          <RouteLink class="no-underline title" :to="article.pathInferred!">{{
            article.data.title
          }}</RouteLink>
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
  @apply w-1/2 h-fit flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 my-24;
}
.article {
  @apply w-fit h-fit;
}
.article .title {
  @apply inline-block max-w-60 h-full px-1
  rounded border-2 border-transparent bg-zinc-100 dark:bg-zinc-600
  hover:border-green-300
  select-none truncate cursor-pointer transition-all ease-in-out duration-300;
}
</style>
