<script lang="ts" setup>
import SidebarItems from "./SidebarItems.vue"

defineSlots<{
	before: (props: Record<never, never>) => any
	after: (props: Record<never, never>) => any
}>()
</script>

<template>
	<aside class="v-nc-sidebar">
		<slot name="before" />
		<SidebarItems />
		<slot name="after" />
	</aside>
</template>

<style lang="postcss" scoped></style>
