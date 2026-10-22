<script lang="ts" setup>
import { useSidebarItems } from "../composables/useSidebar"
import SidebarItem from "./SidebarItem.vue"

const sidebarItems = useSidebarItems()
</script>

<template>
	<ul v-if="sidebarItems.length" class="theme-sidebar-items">
		<SidebarItem
			v-for="item in sidebarItems"
			:key="`${item.text}${item.link}`"
			:item="item"
		/>
	</ul>
</template>

<style lang="postcss" scoped>
ul.theme-sidebar-items {
	@apply w-full flex flex-col py-4
	overflow-y-auto;
}
ul.theme-sidebar-items li {
	@apply w-full inline-flex flex-col justify-center items-baseline;
}
</style>
