<script lang="ts" setup>
import Base from "./Base.vue"
import Page from "../components/Page.vue"
import TimeList from "../components/TimeList.vue"

import { usePageData } from "@vuepress/client"
import { useBlogType } from "@vuepress/plugin-blog/client"
import { ArticleInfo, BlogTypeArticleData } from "../../shared"

const pageData = usePageData()
const timeLines = useBlogType<ArticleInfo>("timeLine")

console.log("[Debug Timeline]", [timeLines.value])

function getFormatTimeString(time: string) {
	if (new Date(time))
		return new Date(time).toLocaleString("zh-CN", {
			hourCycle: "h24",
		})
	return time
}

function getTimeLimit(timeLines: BlogTypeArticleData) {
	const early = timeLines.items[0].info.date
	const late = timeLines.items[timeLines.items.length - 1].info.date
	return [getFormatTimeString(late), getFormatTimeString(early)]
}

function getComputedDescription() {
	const timeLimit = getTimeLimit(timeLines.value)
	return `共 ${timeLines.value.items.length} 篇 · 从 ${timeLimit[0]} 到 ${timeLimit[1]}`
}
</script>

<template>
	<Base>
		<template #page>
			<div class="page-warpper" :key="pageData.path">
				<Page>
					<template #before-page-head> </template>
					<template #after-page-head>
						<span class="description">
							{{ getComputedDescription() }}
						</span>
					</template>
					<template #before-content>
						<TimeList :articles="timeLines.items" />
					</template>
					<template #after-content> </template>
				</Page>
			</div>
		</template>
	</Base>
</template>
