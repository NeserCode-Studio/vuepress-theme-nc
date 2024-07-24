<script lang="ts" setup>
import SidebarItems from "./SidebarItems.vue"

import { usePagesMap } from "../composables/usePagesMap"
import { onMounted } from "vue"

defineSlots<{
	before: (props: Record<never, never>) => any
	after: (props: Record<never, never>) => any
}>()

// onMounted(() => {
// 	const pagesMap = usePagesMap()
// 	console.log("[Debug Sidebar]", [pagesMap.value])
// })
</script>

<template>
	<aside class="v-nc-sidebar">
		<slot name="before" />
		<SidebarItems />
		<slot name="after" />
	</aside>
</template>

<style lang="postcss" scoped></style>
