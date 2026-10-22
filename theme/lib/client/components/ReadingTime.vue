<script lang="ts" setup>
import { toRefs } from "vue"
import type { ReadingTime } from "@vuepress/plugin-reading-time/client"

const $props = defineProps<{
	data?: ReadingTime
}>()
const { data } = toRefs($props)
</script>

<template>
	<div class="page-reading-time" v-if="data">
		<span class="reading-time-label">📖阅读时间</span>
		<span class="reading-time">
			总字数 <span class="number">{{ data.words }}</span
			>, 大约需要 <span class="number">{{ data.minutes }}</span> 分钟阅读
		</span>
	</div>
</template>

<style lang="postcss" scoped>
.page-reading-time {
	@apply w-full inline-flex items-center gap-x-2
  text-sm text-gray-500 dark:text-gray-400
  transition-colors ease-in-out duration-300;
}

.reading-time-label {
	@apply font-bold;
}
.reading-time {
	@apply text-sm;
}

.reading-time .number {
	@apply font-mono font-bold;
}
</style>
