<script lang="ts" setup>
import { ChevronRightIcon } from "@heroicons/vue/24/solid"
import { computed } from "vue"
import { useSidebarCollapsed } from "../composables/useSidebar"
import SidebarItems from "./SidebarItems.vue"

defineSlots<{
	before: (props: Record<never, never>) => any
	after: (props: Record<never, never>) => any
}>()

const { collapsed, toggle } = useSidebarCollapsed()

const toggleClass = computed(() => (collapsed.value ? "collapsed" : null))
</script>

<template>
	<aside class="v-nc-sidebar" :class="toggleClass">
		<slot name="before" />
		<SidebarItems class="theme-sidebar-items" />
		<slot name="after" />
		<span class="v-nc-sidebar-collapse" @click="toggle()">
			<ChevronRightIcon class="icon" />
		</span>
	</aside>
</template>

<style lang="postcss" scoped>
.v-nc-sidebar {
	@apply w-72 h-full fixed top-0 left-0 flex flex-col justify-start items-start pt-16 px-4
	border-r border-slate-200 dark:border-slate-600
	bg-white/60 dark:bg-slate-800/60 backdrop-blur
	transition-all ease-in-out duration-200 z-40 whitespace-nowrap;
}

.v-nc-sidebar .theme-sidebar-items {
	@apply transition-all ease-in-out duration-200 delay-200;
}
.v-nc-sidebar.collapsed {
	@apply w-0 px-0 delay-200;
}
.v-nc-sidebar.collapsed .theme-sidebar-items {
	@apply opacity-0 pointer-events-none delay-0;
}

.v-nc-sidebar-collapse {
	@apply w-8 h-8 absolute bottom-16 right-0 inline-flex justify-center items-center p-1
	rounded-full border-2 border-slate-200 dark:border-slate-600
	bg-slate-50 dark:bg-slate-900
	translate-x-1/2
	transition-all ease-in-out duration-200;
}
.v-nc-sidebar-collapse .icon {
	@apply rotate-180 origin-center
	fill-slate-400 dark:fill-slate-500
	-translate-x-px
	transition-all ease-in-out duration-200;
}
.v-nc-sidebar.collapsed .v-nc-sidebar-collapse .icon {
	@apply rotate-0 translate-x-px;
}
.v-nc-sidebar.collapsed .v-nc-sidebar-collapse {
	@apply translate-x-12;
}
</style>
