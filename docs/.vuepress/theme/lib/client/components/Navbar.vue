<script lang="ts" setup>
import DarkButton from "./DarkButton.vue"
</script>

<template>
	<div class="v-nc-theme-navbar">
		<DarkButton />
	</div>
</template>

<style lang="postcss" scoped>
.v-nc-theme-navbar {
	@apply sticky top-0 w-full h-16 flex items-center justify-center
  border-b border-slate-200 dark:border-slate-600
  bg-white/60 dark:bg-slate-800/60 backdrop-blur
	transition-colors ease-in-out duration-300 z-50;
}
</style>
