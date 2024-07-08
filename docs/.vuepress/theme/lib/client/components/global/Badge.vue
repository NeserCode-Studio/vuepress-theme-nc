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
		class="vp-badge"
		:class="type"
		:style="{
			verticalAlign: vertical,
		}"
	>
		<slot>{{ text }}</slot>
	</span>
</template>

<style lang="postcss">
.vp-badge {
	@apply h-4 inline-block align-top px-1
  rounded-sm text-xs font-semibold
  transition-colors;
}

.vp-badge.tip {
	@apply bg-cyan-200 text-cyan-800;
}

.vp-badge.warning {
	background-color: var(--c-badge-warning);
	color: var(--c-badge-warning-text);
}

.vp-badge.danger {
	background-color: var(--c-badge-danger);
	color: var(--c-badge-danger-text);
}

.table-of-contents .vp-badge {
	vertical-align: middle;
}

.vp-badge + .vp-badge {
	margin-left: 5px;
}
</style>
