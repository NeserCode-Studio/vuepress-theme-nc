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
	"vp-sidebar-item": true,
	"vp-sidebar-heading": depth.value === 0,
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
			<ul v-show="isOpen" class="vp-sidebar-children">
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

<style lang="postcss" scoped></style>
