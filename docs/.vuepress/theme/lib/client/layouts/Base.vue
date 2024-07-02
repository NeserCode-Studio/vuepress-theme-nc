<script lang="ts" setup></script>

<template>
	<div class="base-layout font-family-noto">
		<slot />
	</div>
</template>

<style lang="postcss">
/* font global class */
.font-family-noto {
	font-family: "Noto Serif SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
		Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans";
}
.font-family-code {
	font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
}

/* html config */
html {
	@apply text-[16px] text-gray-800
	scroll-smooth z-0;
	color-scheme: light;
}
html.dark {
	@apply text-gray-200;
	color-scheme: dark;
}

/* transitions */
.fade-enter-active,
.fade-leave-active {
	@apply transition-opacity ease-in-out duration-100;
}
.fade-enter-from,
.fade-leave-to {
	@apply opacity-0;
}
</style>

<style lang="postcss" scoped>
.base-layout {
	@apply flex flex-col justify-center items-center
	bg-zinc-50 dark:bg-zinc-800
	transition-colors ease-in-out duration-300;
}
</style>
