<script lang="ts" setup>
import { ChevronDownIcon } from "@heroicons/vue/24/solid"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { AutoLink } from "vuepress/client"

import type { NavbarItem } from "../typings"
import { toRefs } from "@vueuse/core"

const $props = defineProps<{
	items: NavbarItem[]
}>()
const { items } = toRefs($props)
</script>

<template>
	<div class="theme-navbar-items">
		<div class="navbar-item" v-for="item in items" :key="item.link">
			<Menu
				as="div"
				class="navbar-menu"
				v-slot="{ open }"
				v-if="'children' in item"
			>
				<MenuButton class="navbar-menu-btn" :class="{ opening: open }">
					<span class="text">{{ item.text }}</span>
					<ChevronDownIcon class="icon" />
				</MenuButton>
				<Transition name="menu" mode="out-in" appear>
					<MenuItems as="div" class="navbar-menu-items">
						<MenuItem
							as="span"
							v-for="subItem in item.children"
							:key="subItem.link"
							v-slot="{ active, close }"
							class="navbar-menu-item"
						>
							<AutoLink
								v-if="!('children' in subItem)"
								:config="subItem"
								:class="{ actived: active }"
								@click="close"
							/>
						</MenuItem>
					</MenuItems>
				</Transition>
			</Menu>
			<AutoLink v-else-if="item.link" :config="item" class="navbar-menu-btn" />
		</div>
	</div>
</template>

<style lang="postcss">
.theme-navbar-items {
	@apply inline-flex justify-center items-center gap-1
	text-sm font-medium;
}

.navbar-menu {
	@apply relative inline-block text-left;
}
.navbar-menu-btn {
	@apply w-fit inline-flex justify-center items-center px-2 py-1 gap-x-0.5
  rounded hover:bg-slate-200 hover:dark:bg-slate-700
  whitespace-nowrap transition-colors ease-in-out duration-300;
}

.navbar-menu-items {
	@apply min-w-fit absolute right-0 origin-top-right flex flex-col justify-center items-center mt-2 p-1
  rounded bg-slate-50 dark:bg-slate-950 shadow ring-1 ring-black ring-opacity-5
  outline-none;
}

.navbar-menu-item {
	@apply w-full max-w-32 inline-flex justify-center items-center;
}
.navbar-menu-item a.auto-link {
	@apply w-full max-w-full px-2 py-1
  rounded hover:bg-slate-200 dark:hover:bg-slate-800
  truncate;
}
.navbar-menu-item .route-link.actived {
	@apply bg-slate-200 dark:bg-slate-800;
}

.navbar-menu-item a.auto-link.external-link::after {
	content: "↗";
	@apply w-fit inline-flex justify-center items-center;
}

.navbar-menu-item .route-link.route-link-active,
.navbar-item:has(.route-link.route-link-active) .navbar-menu-btn {
	@apply bg-green-400 dark:bg-green-600 text-white
  transition-colors ease-in-out duration-300;
}

.navbar-menu-btn .icon {
	@apply w-3.5 h-3.5
	translate-y-0.5 opacity-60
	transition-transform ease-in-out duration-300;
}
.navbar-menu-btn.opening {
	@apply bg-slate-200 dark:bg-slate-700;
}
.navbar-menu-btn.opening .icon {
	@apply rotate-180 translate-y-0;
}
</style>
