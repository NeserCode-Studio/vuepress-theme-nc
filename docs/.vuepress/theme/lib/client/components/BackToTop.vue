<script lang="ts" setup>
import { ArrowUpIcon } from "@heroicons/vue/24/outline"
import { onMounted, ref } from "vue"
import { useElementSrcolled } from "../composables/useComponentUtils"
import { Hook } from "../composables/useHook"
import { useRoute } from "vuepress/client"

const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	})
}

const progress = ref("0.00")
const $route = useRoute()
onMounted(() => {
	Hook.onRoute(() => {
		const scrollUtils = useElementSrcolled(".v-nc-content")
		if (scrollUtils)
			scrollUtils.onScroll((total, scrolled) => {
				progress.value = ((scrolled / total) * 100).toFixed(2)
			})
	}, $route)
})
</script>

<template>
	<div class="v-nc-back-to-top">
		<button type="button" class="back-btn" @click="scrollToTop()">
			<ArrowUpIcon class="icon" />
		</button>
		<span class="progress">Read {{ progress }}%</span>
	</div>
</template>

<style lang="postcss" scoped>
.v-nc-back-to-top {
	@apply w-full max-w-48 h-fit inline-flex justify-start items-center p-2 mt-2 gap-x-2
  transition-all ease-in-out duration-200;
}

.back-btn {
	@apply w-fit h-full p-1
  rounded
  bg-green-400 dark:bg-green-700
  text-sm transition-all ease-in-out duration-200;
}
.back-btn .icon {
	@apply h-4 w-fit;
}

.progress {
	@apply text-xs opacity-60;
}
</style>
