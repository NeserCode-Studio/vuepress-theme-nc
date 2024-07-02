<script lang="ts" setup>
import { SunIcon, MoonIcon } from "@heroicons/vue/24/solid"
import { useDark } from "../composables/useDark"

const { isDark, toggle } = useDark()
</script>

<template>
	<button type="button" class="v-nc-dark-button" @click="toggle(!isDark)">
		<SunIcon class="icon about-dark" v-if="!isDark"></SunIcon>
		<MoonIcon class="icon about-dark" v-else></MoonIcon>
	</button>
</template>

<style lang="postcss" scoped>
.v-nc-dark-button {
	@apply w-8 h-8 inline-flex justify-center items-center
	rounded hover:bg-slate-200 dark:hover:bg-slate-600
	transition-colors ease-in-out duration-300 delay-0;
}
.icon {
	@apply w-2/3 h-2/3
	fill-slate-600 dark:fill-slate-200;
}
</style>
