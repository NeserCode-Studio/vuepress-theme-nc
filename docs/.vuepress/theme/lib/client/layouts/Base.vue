<script lang="ts" setup>
import { usePageData, usePageFrontmatter } from "vuepress/client"
import Navbar from "../components/Navbar.vue"

import { useScrollPromise } from "../composables/useScrollbarPromise"

const pageData = usePageData()
const pageFrontmatter = usePageFrontmatter()

// handle scrollBehavior with transition
const scrollPromise = useScrollPromise()
const onBeforeEnter = scrollPromise.resolve
const onBeforeLeave = scrollPromise.pending

console.log("[Debug Page - Base Layout]", [
	pageData.value,
	pageFrontmatter.value,
])
</script>

<template>
	<div class="base-layout font-family-noto">
		<Navbar></Navbar>
		<Transition
			name="fade-slide-y"
			mode="out-in"
			appear
			@before-enter="onBeforeEnter"
			@before-leave="onBeforeLeave"
		>
			<slot name="page" />
		</Transition>
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
	scroll-smooth z-0 underline-offset-4;
	color-scheme: light;
}
html.dark {
	@apply text-gray-200;
	color-scheme: dark;
}

/* shiki theme config */
.base-layout pre,
.base-layout pre[class*="language-"] {
	@apply overflow-auto leading-7;
}
.base-layout pre code,
.base-layout pre[class*="language-"] code {
	@apply w-fit min-w-full block pl-8 py-4
	rounded bg-transparent
	box-border;
}

div[class*="language-"] {
	@apply relative my-4
	rounded overflow-hidden shadow;
}
div[class*="language-"] pre,
div[class*="language-"] pre[class*="language-"] {
	@apply relative bg-transparent;
	z-index: 1;
}
div[class*="language-"]:before {
	@apply absolute top-2 right-3
	uppercase
	transition-all ease-in-out duration-300
	text-xs font-light;
	content: attr(data-title);
	z-index: 3;
}
div[class*="language-"]:has(:hover):before {
	@apply opacity-0 pointer-events-none;
}
div[class*="language-"] code span.line {
	@apply inline-block w-full;
}

div[class*="language-"].line-numbers-mode pre {
	@apply align-middle ml-8;
}
div[class*="language-"].line-numbers-mode code {
	@apply pl-4;
}
div[class*="language-"].line-numbers-mode .line-numbers {
	@apply w-8 absolute top-0 pt-4
	text-sm leading-7 text-center font-mono opacity-50;
	counter-reset: line-number;
}
div[class*="language-"].line-numbers-mode .line-numbers .line-number {
	@apply relative z-10 select-none;
}
div[class*="language-"].line-numbers-mode .line-numbers .line-number:before {
	content: counter(line-number);
	counter-increment: line-number;
}
div[class*="language-"].line-numbers-mode:after {
	content: "";
	@apply h-full absolute top-0 left-8
		rounded-r border-l 
		border-slate-200 dark:border-slate-600
		z-10 transition-colors ease-in-out duration-300;
}
div[class*="language-"]:not(.line-numbers-mode) .line-numbers {
	@apply hidden;
}

div[class*="language-"] .line.highlighted {
	@apply relative w-full inline-block px-6 -mx-6
	bg-slate-200 dark:bg-slate-900
	transition-colors ease-in-out duration-300;
}
div[class*="language-"] .line.highlighted::after {
	content: " ";
	@apply absolute -right-6 w-6 inline-block
	bg-slate-200 dark:bg-slate-900
	transition-colors ease-in-out duration-300 -z-10;
}

div[class*="language-"] .line.diff {
	@apply w-full inline-block -mx-6 px-6
	transition-colors ease-in-out duration-300;
}
div[class*="language-"] .line.diff::before {
	@apply absolute left-3;
}
div[class*="language-"] .line.diff.remove {
	@apply bg-red-300 dark:bg-red-900;
}
div[class*="language-"] .line.diff.remove::before {
	content: "-";
}
div[class*="language-"] .line.diff.add {
	@apply bg-green-300 dark:bg-green-900;
}
div[class*="language-"] .line.diff.add::before {
	content: "+";
}

div[data-highlighter="shiki"] {
	@apply transition-colors ease-in-out duration-300;
	background-color: var(--shiki-light-bg);
}
.dark div[data-highlighter="shiki"] {
	background-color: var(--shiki-dark-bg);
}

.shiki span {
	color: var(--shiki-light, inherit);
	font-style: var(--shiki-light-font-style);
	font-weight: var(--shiki-light-font-weight);
	text-decoration: var(--shiki-light-text-decoration);
}
.dark .shiki span {
	color: var(--shiki-dark, inherit);
	font-style: var(--shiki-dark-font-style);
	font-weight: var(--shiki-dark-font-weight);
	text-decoration: var(--shiki-dark-text-decoration);
}

/* transitions */
.fade-enter-active,
.fade-leave-active {
	@apply transition-all ease-in-out duration-100;
}
.fade-enter-from,
.fade-leave-to {
	@apply opacity-0 translate-y-1;
}

.fade-slide-y-enter-active,
.fade-slide-y-leave-active {
	@apply transition-all ease-in-out duration-200;
}
.fade-slide-y-enter-from,
.fade-slide-y-leave-to {
	@apply opacity-0 translate-y-4;
}

.-fade-slide-y-enter-active,
.-fade-slide-y-leave-active {
	@apply transition-all ease-in-out duration-200;
}
.-fade-slide-y-enter-from,
.-fade-slide-y-leave-to {
	@apply opacity-0 -translate-y-4;
}

.fade-slide-x-enter-active,
.fade-slide-x-leave-active {
	@apply transition-all ease-in-out duration-200;
}
.fade-slide-x-enter-from,
.fade-slide-x-leave-to {
	@apply translate-x-4 opacity-0;
}

.menu-enter-active,
.menu-leave-active {
	@apply transition-all ease-in-out duration-200;
}
.menu-enter-from,
.menu-leave-to {
	@apply scale-90 opacity-0;
}

/* Arrow span */
span.arrow {
	@apply relative inline-block w-4 h-4 align-middle bg-center bg-no-repeat
	transition-all ease-in-out duration-200;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='rgba(0,0,0,0.5)' d='M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z'/%3E%3C/svg%3E");
}
html.dark span.arrow {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='rgba(255,255,255,0.5)' d='M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z'/%3E%3C/svg%3E");
}
span.arrow.right {
	@apply rotate-90;
}
span.arrow.down {
	@apply rotate-180;
}
span.arrow.left {
	@apply -rotate-90;
}
</style>

<style lang="postcss" scoped>
.base-layout {
	@apply w-full min-w-full h-full min-h-screen flex flex-col items-center py-16
	bg-zinc-50 dark:bg-zinc-800
	transition-colors ease-in-out duration-300;
}
</style>
