<script setup lang="ts">
import type { VNode } from "vue"

withDefaults(
	defineProps<{
		type?: string
		text?: string
		vertical?: string
	}>(),
	{
		type: "tip",
		text: "",
		vertical: undefined,
	}
)

defineSlots<{
	default?: () => VNode | VNode | string | null
}>()
</script>

<template>
	<span
		class="v-nc-badge"
		:class="type"
		:style="{
			verticalAlign: vertical,
		}"
	>
		<slot>{{ text }}</slot>
	</span>
</template>

<style lang="postcss">
.v-nc-badge {
	@apply h-5 inline-block align-top px-1
  rounded text-sm font-medium
  transition-colors ease-in-out duration-300;
}

.v-nc-badge.tip {
	@apply bg-cyan-200 text-cyan-800
	dark:bg-cyan-700 dark:text-cyan-100;
}

.v-nc-badge.warning {
	@apply bg-orange-200 text-orange-800
	dark:bg-orange-700 dark:text-orange-100;
}

.v-nc-badge.danger {
	@apply bg-red-200 text-red-800
	dark:bg-red-700 dark:text-red-100;
}

.table-of-contents .v-nc-badge {
	@apply align-middle;
}

.v-nc-badge + .v-nc-badge {
	@apply ml-1.5;
}
</style>
