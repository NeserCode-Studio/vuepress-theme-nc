<script lang="ts" setup>
import { computed } from "vue"

import Base from "./Base.vue"
import Page from "../components/Page.vue"
import TimeList from "../components/TimeList.vue"

import { usePageData } from "@vuepress/client"
import { useBlogType } from "@vuepress/plugin-blog/client"
import type { ArticleInfo } from "../../shared"

const pageData = usePageData()
const timeLines = useBlogType<ArticleInfo>("timeLine")

const summaryItems = computed(() => {
	const times = timeLines.value.items.map((article) =>
		new Date(article.info.date).getTime()
	)
	const firstTime = times.length > 0 ? Math.min(...times) : null
	const lastTime = times.length > 0 ? Math.max(...times) : null
	const formatDate = (time: number) =>
		new Date(time).toLocaleDateString("zh-CN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		})

	return [
		{
			label: "篇数",
			value: `${timeLines.value.items.length}`,
		},
		{
			label: "年份",
			value:
				firstTime && lastTime
					? `${new Date(firstTime).getFullYear()} - ${new Date(
							lastTime
					  ).getFullYear()}`
					: "-",
		},
		{
			label: "最近更新",
			value: lastTime ? formatDate(lastTime) : "-",
		},
	]
})
</script>

<template>
	<Base>
		<template #page>
			<div class="page-warpper" :key="pageData.path">
				<Page>
					<template #page-title>时间线</template>
					<template #after-page-head>
						<div class="timeline-summary">
							<div
								class="summary-item"
								v-for="item in summaryItems"
								:key="item.label"
							>
								<span class="summary-label">{{ item.label }}</span>
								<span class="summary-value">{{ item.value }}</span>
							</div>
						</div>
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

<style lang="postcss" scoped>
.page-warpper {
	@apply w-full min-w-0;
}

.timeline-summary {
	@apply mt-3 flex flex-wrap items-center gap-x-6 gap-y-2;
}

.timeline-summary .summary-item {
	@apply inline-flex items-baseline gap-2;
}

.summary-label {
	@apply text-xs text-slate-400 dark:text-slate-500;
}

.summary-value {
	@apply text-sm font-semibold font-mono text-slate-700 dark:text-slate-200;
}
</style>
