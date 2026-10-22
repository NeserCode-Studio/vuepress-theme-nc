<script lang="ts" setup>
import DropdownTransition from "./presets/DropdownTransition.vue"

import { useToggle } from "@vueuse/core"
import { computed, nextTick, onBeforeUnmount, toRefs } from "vue"
import { AutoLink, useRoute, useRouter } from "vuepress/client"

import { isActiveLinkItem } from "../utils"
import type { SidebarItem } from "../typings"
import type { SidebarLinkOptions } from "../../shared"

const props = withDefaults(
	defineProps<{
		item: SidebarItem
		depth?: number
	}>(),
	{ depth: 0 }
)

const { item, depth } = toRefs(props)
const route = useRoute()
const router = useRouter()

const collapsible = computed(
	() => "collapsible" in item.value && item.value.collapsible
)
const isActive = computed(() => isActiveLinkItem(item.value, route))
const itemClass = computed(() => ({
	"v-nc-sidebar-item": true,
	"v-nc-sidebar-heading": depth.value === 0,
	active: isActive.value,
	collapsible: collapsible.value,
}))

const isOpenDefault = computed(() =>
	collapsible.value ? isActive.value : true
)
const [isOpen, toggleIsOpen] = useToggle(isOpenDefault.value)
const onClick = (e: Event): void => {
	if (collapsible.value) {
		e.preventDefault()
		// toggle open status on click
		toggleIsOpen()
	}
}

// reset open status after navigation
const unregisterRouterHook = router.afterEach((to) => {
	nextTick(() => {
		isOpen.value = isOpenDefault.value
	})
})
onBeforeUnmount(() => {
	unregisterRouterHook()
})
</script>

<template>
	<li>
		<AutoLink
			v-if="item.link"
			:class="itemClass"
			:config="item as SidebarLinkOptions"
		/>
		<p
			v-else
			tabindex="0"
			:class="itemClass"
			@click="onClick"
			@keydown.enter="onClick"
		>
			{{ item.text }}
			<span
				v-if="collapsible"
				class="arrow"
				:class="isOpen ? 'down' : 'right'"
			/>
		</p>

		<DropdownTransition v-if="'children' in item && item.children.length">
			<ul v-show="isOpen" class="v-nc-sidebar-children">
				<SidebarItem
					v-for="child in item.children"
					:key="`${depth}${child.text}${child.link}`"
					:item="child"
					:depth="depth + 1"
				/>
			</ul>
		</DropdownTransition>
	</li>
</template>

<style lang="postcss" scoped>
li .auto-link.v-nc-sidebar-item,
li p.v-nc-sidebar-item.v-nc-sidebar-heading {
	@apply w-fit max-w-48 inline-block py-1.5
	text-slate-600 dark:text-slate-300
	truncate delay-0 cursor-pointer;
}
.auto-link.v-nc-sidebar-item.active {
	@apply text-green-500 dark:text-green-400;
}

p.v-nc-sidebar-heading + ul li,
p.v-nc-sidebar-heading + ul li ul li {
	@apply pl-3;
}
p.v-nc-sidebar-heading.active + ul > li > ul,
p.v-nc-sidebar-heading:not(.active) + ul {
	@apply border-l border-dashed border-slate-300 dark:border-slate-600
	transition-colors ease-in-out duration-300;
}

.auto-link.v-nc-sidebar-item.active:has(+ * .v-nc-sidebar-item.active) {
	@apply text-blue-500 dark:text-blue-400;
}
</style>
