<script lang="ts" setup>
import { computed, toRefs } from "vue"
import { Switch } from "@headlessui/vue"

const enabled = defineModel<boolean>("switch", {
	default: false,
	required: true,
})
const props = withDefaults(
	defineProps<{
		disabled?: boolean
	}>(),
	{
		disabled: false,
	}
)
const { disabled } = toRefs(props)
const cssEnabled = computed(() => {
	return enabled.value ? "enabled" : null
})
const cssDisabled = computed(() => {
	return disabled.value ? "disabled" : null
})
</script>

<template>
	<Switch
		v-model="enabled"
		:class="[cssEnabled, cssDisabled]"
		class="switch-main"
		:disabled="disabled"
	>
		<span class="sr-only"><slot name="sr-only"></slot></span>
		<span
			aria-hidden="true"
			:class="[cssEnabled, cssDisabled]"
			class="switch-handle"
		>
			<slot name="handle"></slot>
		</span>
	</Switch>
</template>

<style lang="postcss">
.switch-main {
	@apply relative h-7 w-12 inline-flex shrink-0
  rounded-full border-2 border-transparent bg-teal-600
  transition-all ease-in-out duration-300
  outline-none focus-visible:ring-2 focus-visible:ring-white/75;
}
.switch-main.enabled {
	@apply bg-green-400;
}
.switch-main.disabled {
	@apply grayscale filter cursor-not-allowed;
}

.switch-handle {
	@apply pointer-events-none w-4 h-4
	inline-block transform translate-x-1 translate-y-1
	rounded-full bg-white shadow-lg ring-0 outline-none
	transition ease-in-out duration-300;
}
.switch-handle.enabled {
	@apply translate-x-6;
}

.switch-main:hover .switch-handle {
	@apply scale-125;
}
</style>
