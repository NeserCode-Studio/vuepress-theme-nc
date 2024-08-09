<script setup lang="ts">
defineSlots<{
	default?: (props: Record<never, never>) => any
}>()

const setHeight = (items: any): void => {
	items.style.height = items.scrollHeight + "px"
}
const unsetHeight = (items: any): void => {
	items.style.height = ""
}
</script>

<template>
	<Transition
		name="dropdown"
		@enter="setHeight"
		@after-enter="unsetHeight"
		@before-leave="setHeight"
		mode="out-in"
		appear
	>
		<slot />
	</Transition>
</template>

<style lang="postcss">
.dropdown-enter-from,
.dropdown-leave-to {
	@apply h-0 opacity-0;
}
.dropdown-enter-active,
.dropdown-leave-active {
	@apply transition-all ease-in-out duration-300;
}
</style>
