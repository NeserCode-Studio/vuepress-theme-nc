<script lang="ts" setup>
import SubToc from "./SubToc.vue"

import { computed } from "vue"
import { usePageData } from "vuepress/client"

const pageData = usePageData()
const pageTitle = computed(() => pageData.value.title)
</script>

<template>
	<div class="v-nc-theme-page">
		<div class="page-side-left">
			<slot name="page-side-left"></slot>
		</div>
		<div class="page-main">
			<div class="page-head">
				<slot name="before-page-head"></slot>
				<h1 class="page-title">{{ pageTitle }}</h1>
				<slot name="after-page-head"></slot>
			</div>
			<slot name="before-content"></slot>
			<Content class="v-nc-content" />
			<slot name="after-content"></slot>
			<div class="page-foot">
				<slot name="before-page-foot"></slot>
				<span class="page-foot"> </span>
				<slot name="after-page-foot"></slot>
			</div>
		</div>
		<div class="page-side-right">
			<slot name="page-side-right">
				<SubToc />
			</slot>
		</div>
	</div>
</template>

<style lang="postcss">
.v-nc-content h1 {
	@apply hidden;
}
.v-nc-content h2,
.v-nc-content h3,
.v-nc-content h4,
.v-nc-content h5,
.v-nc-content h6 {
	margin-top: calc(0.5rem - 64px);
	padding-top: calc(0.5rem + 64px);
	@apply mb-2;
}

.v-nc-content h2 {
	@apply text-2xl font-bold;
}
.v-nc-content h3 {
	@apply text-xl font-bold;
}
.v-nc-content h4 {
	@apply text-lg font-bold;
}
.v-nc-content h5,
.v-nc-content h6 {
	@apply text-base font-bold;
}
</style>
<style lang="postcss" scoped>
.v-nc-theme-page {
	@apply w-full flex justify-center gap-4 py-16;
}

.v-nc-theme-page .page-main {
	@apply w-1/2;
}

.page-side-left,
.page-side-right {
	@apply w-1/4 pt-24;
}

.page-head {
	@apply my-4;
}
h1.page-title {
	@apply text-3xl font-black;
}
</style>
