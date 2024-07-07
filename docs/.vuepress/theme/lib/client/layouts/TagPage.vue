<script lang="ts" setup>
import { ChevronLeftIcon } from "@heroicons/vue/24/outline"

import Base from "./Base.vue"
import Page from "../components/Page.vue"
import TagList from "../components/TagList.vue"
import ArticleList from "../components/ArticleList.vue"

import { usePageData } from "@vuepress/client"

import { useBlogCategory } from "@vuepress/plugin-blog/client"
import { ArticleInfo } from "../../shared"

const page = usePageData()
const tags = useBlogCategory<ArticleInfo>("tags")

function getComputedDescription() {
	const keys = Object.keys(tags.value.map)
	if (tags.value.currentItems) {
		return `共 ${keys.length} 类 · 此类下共有 ${tags.value.currentItems.length} 篇`
	}
	return `共 ${keys.length} 类`
}

console.log(`[Debug: List Tags]`, tags.value)
</script>

<template>
	<Base>
		<template #page>
			<div class="page-warpper" :key="page.path">
				<Page>
					<template #before-page-head>
						<slot name="tag-page-head" />
						<Transition name="-fade-slide-y" mode="out-in" appear>
							<RouteLink
								type="button"
								class="page-back"
								to="/tags/"
								v-if="tags.currentItems?.length"
							>
								<ChevronLeftIcon class="icon" />
								<span class="text">Back Tags</span>
							</RouteLink>
						</Transition>
					</template>
					<template #after-page-head>
						<span class="description">
							{{ getComputedDescription() }}
						</span>
					</template>
					<template #after-content>
						<tag-list :tag-map="tags.map" />

						<article-list
							v-if="tags.currentItems?.length"
							:articles="tags.currentItems"
						/>
						<slot name="tag-page-foot" />
					</template>
				</Page>
			</div>
		</template>
	</Base>
</template>

<style lang="postcss" scoped>
.v-nc-theme-page .page-main a.page-back {
	@apply absolute left-0 -top-8 inline-flex justify-center items-center py-0.5 px-1 pr-3
	rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-sm no-underline
	-translate-x-1 hover:translate-x-0
	transition-all ease-in-out duration-300;
}
.page-back .icon {
	@apply w-4 h-4;
}
</style>
