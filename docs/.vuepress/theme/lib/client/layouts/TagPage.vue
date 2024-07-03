<script lang="ts" setup>
import Base from "./Base.vue"
import Page from "../components/Page.vue"
import TagList from "../components/TagList.vue"
import ArticleList from "../components/ArticleList.vue"

import { usePageData } from "@vuepress/client"
import type { ArticleCategoryData } from "../../shared"

import { useBlogCategory } from "@vuepress/plugin-blog/client"
import { Ref } from "vue"

const page = usePageData()

const tags: Ref<ArticleCategoryData> = useBlogCategory("tag")

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
					<template #["before-page-head"]>
						<slot name="tag-page-head" />
					</template>
					<template #["after-page-head"]>
						<span class="description">
								{{ getComputedDescription() }}
							</span>
					</template>
					<template #["after-content"]>
						<tag-list :tag-map="tags.map" />

						<article-list
							v-if="tags.currentItems"
							:articles="tags.currentItems"
						/>
            <slot name="tag-page-foot" />
					</template>
				</Page>
			</div>
		</template>
	</Base>
</template>