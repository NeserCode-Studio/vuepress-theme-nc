<template>
	<span class="v-nc-divide">|</span>
</template>

<style lang="postcss" scoped>
.v-nc-divide {
	@apply inline-flex w-px min-h-full h-full
  border-x border-stone-200 dark:border-stone-700
  text-transparent pointer-events-none
  transition-all ease-in-out duration-300;
}
</style>
