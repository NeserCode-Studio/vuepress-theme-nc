<script lang="ts" setup>
import Base from "./Base.vue";
import Page from "../components/Page.vue";

import { useRouteLocale } from "@vuepress/client";
import { useThemeLocaleData } from "@vuepress/plugin-theme-data/client";

import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";

const routeLocale = useRouteLocale();
const themeLocale = useThemeLocaleData();

const messages = themeLocale.value.notFound ?? ["Not Found"];
const getMsg = (): string =>
  messages[Math.floor(Math.random() * messages.length)];
const homeLink = themeLocale.value.home ?? routeLocale.value;
const homeText = themeLocale.value.backToHome ?? "Back to home";
</script>

<template>
  <Base>
    <template #page>
      <main id="not-found">
        <span class="not-found-number">404</span>
        <span class="message">{{ getMsg() }}</span>

        <RouterLink :to="homeLink" class="home-link">
          <ArrowUturnLeftIcon class="icon" />
          <span class="text">{{ homeText }}</span>
        </RouterLink>
      </main>
    </template>
  </Base>
</template>

<style lang="postcss" scoped>
#not-found {
  @apply flex flex-col min-h-60 w-full justify-center items-center;
}

.not-found-number,
.not-found-number::after {
  @apply relative w-fit h-fit inline-flex justify-center items-center
  font-mono font-black whitespace-nowrap
  select-none;
  font-size: 12rem;
}
.not-found-number::after {
  @apply w-fit absolute top-0 left-0 bottom-0 right-0;
  content: "404";
  animation: 3s glitch infinite steps(3, jump-none);
}

.home-link {
  @apply inline-flex justify-center items-center gap-2
  text-lg;
}
.home-link .icon {
  @apply inline-block w-4 h-4;
}
</style>
