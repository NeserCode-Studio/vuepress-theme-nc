<script lang="ts" setup></script>

<template>
	<div class="base-layout font-family-noto">
		<slot />
	</div>
</template>

<style lang="postcss">
.font-family-noto {
	font-family: "Noto Serif SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
		Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans";
}
.font-family-code {
	font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
}
</style>

<style lang="postcss" scoped></style>
