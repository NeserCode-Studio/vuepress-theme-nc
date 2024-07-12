<script lang="ts" setup>
import SubToc from "./SubToc.vue"

import { computed } from "vue"
import { usePageData, usePageFrontmatter } from "vuepress/client"

import { usePluginState } from "../composables/useComponentUtils"
import { defaultConstants } from "../../shared"
import { DefaultThemePageFrontmatter } from "../../shared"

const pageData = usePageData()
const pageFrontmatter = usePageFrontmatter<DefaultThemePageFrontmatter>()

const isNotFound = computed(() => pageFrontmatter.value.layout === "NotFound")
const isSidebarCategroyActive = computed(() =>
	usePluginState(
		"sidebarCategory",
		isNotFound.value
			? defaultConstants.notFoundPluginState
			: pageFrontmatter.value
	)
)

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

				<h1 class="page-title">
					<slot name="page-title">{{ pageTitle }}</slot>
				</h1>

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
				<SubToc v-if="isSidebarCategroyActive" />
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
	@apply relative mb-8 pb-4
	border-b-2 border-dotted 
	border-teal-300 dark:border-teal-800
	transition-colors ease-in-out duration-300 z-0;
}

.v-nc-content h2 a.header-anchor::before,
.v-nc-content h3 a.header-anchor::before,
.v-nc-content h4 a.header-anchor::before,
.v-nc-content h5 a.header-anchor::before,
.v-nc-content h6 a.header-anchor::before {
	content: "#";
	@apply absolute sm:inline-block hidden
	text-green-500
 	font-thin -translate-x-5;
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

.v-nc-content p,
.v-nc-content blockquote {
	@apply relative my-1;
	z-index: 1;
}

.v-nc-content blockquote {
	@apply w-full inline-flex items-center px-4
	rounded-r border-2 border-l-8 border-green-400 dark:border-green-600
	bg-zinc-100 dark:bg-zinc-700
	text-base
	transition-colors ease-in-out duration-300;
}

hr.footnotes-sep:has(+ section.footnotes) {
	@apply block mt-12;
}
section.footnotes {
	@apply relative mt-6 py-0;
}
section.footnotes::before {
	content: "👀注脚";
	@apply absolute inline-flex w-full
	text-lg font-semibold;
}

/* Inline code */
.v-nc-theme-page .page-main p code,
.v-nc-theme-page .page-main li code,
.v-nc-theme-page .page-main td code {
	@apply inline-flex justify-center items-center py-px px-1 mx-0.5
	rounded bg-slate-200 dark:bg-slate-700 -translate-y-px
	text-sm font-thin font-mono transition-all ease-in-out duration-300;
}

/* Inline link */
.v-nc-theme-page .page-main a:not(.header-anchor):not(.tag-item) {
	@apply relative inline-flex justify-center items-center p-px
	text-green-600 text-sm underline z-10 -translate-y-px;
}
.v-nc-theme-page .page-main a[target="_blank"]:not([href^="#"]) {
	@apply mr-3 pr-1 text-sky-500;
}
.v-nc-theme-page .page-main a[target="_blank"]:not([href^="#"])::after {
	content: "↗";
	@apply absolute inline-block left-full no-underline
	-translate-x-1;
}

/* Inline list */
.v-nc-theme-page .page-main ul {
	@apply block pl-4
	list-disc list-inside;
}
.v-nc-theme-page .page-main ul ul {
	list-style-type: circle;
}

/* Custom container */
.custom-container {
	@apply relative w-full inline-block px-4 py-2 pt-4 my-2
	border-2 border-transparent rounded bg-stone-100 dark:bg-stone-900
	font-medium text-base
	transition-all ease-in-out duration-300;
}
.custom-container::before {
	@apply inline-flex items-center
	font-thin font-mono;
}
.custom-container.tip {
	@apply border-sky-400 dark:border-sky-800;
}
.custom-container.warning {
	@apply border-orange-400 dark:border-yellow-500;
}
.custom-container.danger {
	@apply border-red-400 dark:border-red-700;
}
.custom-container.details {
	@apply border-green-400 dark:border-green-700;
}
.custom-container.tip::before {
	content: "💡 TIP";
}
.custom-container.warning::before {
	content: "🚨 WARNING";
}
.custom-container.danger::before {
	content: "🚧 DANGER";
}
.custom-container.details::before {
	content: "📚 DETAILS";
}
</style>
<style lang="postcss" scoped>
.v-nc-theme-page {
	@apply w-full flex justify-center gap-4 py-16 px-4 sm:px-8;
}

.v-nc-theme-page .page-main {
	@apply w-full lg:w-1/2 max-w-3xl min-w-0
	sm:w-full sm:min-w-[568px];
}

.page-side-left,
.page-side-right {
	@apply hidden lg:w-1/4 lg:block pt-24
	md:hidden;
}

.page-head {
	@apply relative my-4;
}
h1.page-title {
	@apply text-3xl font-black;
}
</style>
