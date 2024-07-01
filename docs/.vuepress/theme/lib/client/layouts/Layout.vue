<script lang="ts" setup>
import Base from "./Base.vue"
</script>

<template>
	<Base>
		<AutoLink> 123</AutoLink>
		<Content class="v-nc-content" />
	</Base>
</template>

<style lang="postcss" scoped>
.v-nc-content {
	@apply text-5xl;
}
</style>
