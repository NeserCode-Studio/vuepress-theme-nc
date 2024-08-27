<script lang="ts" setup>
defineProps<{
	readingProgress: number
}>()
</script>

<template>
	<div class="reading-line">
		<span class="reading-line-main" :style="{ width: readingProgress + '%' }" />
	</div>
</template>

<style lang="postcss" scoped>
.reading-line {
	@apply fixed w-full h-0.5 top-16 left-0
  z-20 overflow-hidden;
}

.reading-line-main {
	@apply absolute inline-block w-full h-0.5 left-0 top-0
  bg-green-400 dark:bg-green-600
  transition-all ease-in-out duration-300;
}
</style>
