<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from "vue"
import { usePageData, useRoute } from "vuepress/client"
import { PageHeader } from "vuepress/shared"

const pageData = usePageData()
const isOpenComment = ref(false)
const tocHeaders = computed<PageHeader[]>(() => {
	const headers: PageHeader[] = pageData.value.headers ?? []
	if (!isOpenComment.value) return headers
	else if (headers[headers.length - 1].title !== "评论")
		headers.push({
			level: 2,
			link: `#Comment-for-Up-and-Down`,
			slug: `Comment-for-Up-and-Down`,
			title: `评论`,
			children: [],
		})
	return headers
})

const tocOptions = {
	containerTag: "nav",
	containerClass: "toc-main",
	listClass: "vuepress-toc-list",
	itemClass: "vuepress-toc-item",
	linkTag: "a",
	linkClass: "vuepress-toc-link",
	linkActiveClass: "active",
	linkChildrenActiveClass: "active",
}

const $route = useRoute()
const toc = ref<HTMLDivElement | null>(null)
const tocFly = ref<HTMLDivElement | null>(null)
onMounted(() => {
	watch(
		() => $route.hash,
		() => {
			let current = -1
			let sums = [] as number[]

			function getTotal(list: number[], index: number = list.length - 1) {
				let result = 0

				list.forEach((l, i) => {
					if (i < index + 1 && index >= 0) result += l
				})
				return result
			}

			nextTick(() => {
				const list = toc.value?.querySelector<HTMLDivElement>(
					".vuepress-toc-list"
				) as HTMLDivElement
				if (!list) return

				list.querySelectorAll(".vuepress-toc-list").forEach((l) => {
					sums.push(l.querySelectorAll(".vuepress-toc-link").length)
				})

				const links = list.querySelectorAll(".vuepress-toc-link")
				links.forEach((link, index) => {
					if (!link.classList.contains("active")) return
					else current = index
				})

				let offsetRadius = 0
				let index = 0
				if (current === -1) {
				} else {
					if (current == links.length - 1)
						offsetRadius = sums.length > 1 ? sums.length : current
					else {
						sums.forEach((_sum, i) => {
							if (current >= getTotal(sums, i - 1) + i) {
								index = i
							}
						})
						offsetRadius = current - (index > 0 ? getTotal(sums, index - 1) : 0)
					}
				}
				// console.log(`[Debug Hash Fly Position]`, offsetRadius)

				;(tocFly.value as HTMLDivElement).style.transform = `translateY(calc(${
					offsetRadius * 100
				}% + ${0.485 * offsetRadius}rem))`
			})
		},
		{ immediate: true }
	)
})
</script>

<template>
	<div class="v-nc-theme-sub-toc">
		<Toc ref="toc" :options="tocOptions" :headers="tocHeaders" />
		<div class="toc-fly" ref="tocFly"></div>
	</div>
</template>

<style lang="postcss" scoped>
.v-nc-theme-sub-toc {
	@apply relative;
}

.toc-main {
	@apply sticky top-20 w-fit;
}
.toc-main::before {
	content: "On This Page";
	@apply absolute top-0 left-0
  text-green-400 text-sm font-semibold;
}

.toc-main .vuepress-toc-list {
	@apply inline-flex flex-col justify-center
  list-none transition-all ease-in-out duration-100;
}
.toc-main .vuepress-toc-list .vuepress-toc-item {
	@apply inline-flex flex-col;
}
.toc-main
	.vuepress-toc-list
	.vuepress-toc-item:has(.vuepress-toc-list .vuepress-toc-item)::before {
	content: "H2";
	@apply absolute top-0 -left-[3ch];

	position: absolute;
	left: -3.25ch;

	opacity: 0.5;
	font-size: small;
	font-weight: 900;
	font-family: var(--font-family-code);

	transform: translateY(12%);
}

.toc-main > .vuepress-toc-list > .vuepress-toc-item > .vuepress-toc-link,
.toc-main
	> .vuepress-toc-list
	> .vuepress-toc-item
	> .vuepress-toc-list
	> .vuepress-toc-item
	> .vuepress-toc-link {
	max-width: 15ch;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	padding: 0 0.5ch;
}

/* Active */
.toc-main > .vuepress-toc-list > .vuepress-toc-item > .vuepress-toc-list {
	display: none;
}
.toc-main
	> .vuepress-toc-list:has(.vuepress-toc-list .vuepress-toc-link.active),
.toc-main
	> .vuepress-toc-list
	> .vuepress-toc-item
	> .vuepress-toc-list:has(.vuepress-toc-link.active),
.toc-main
	> .vuepress-toc-list
	> .vuepress-toc-item:has(.vuepress-toc-link.active)
	> .vuepress-toc-list {
	display: inline-flex;
}

.toc-main
	> .vuepress-toc-list
	> .vuepress-toc-item
	> .vuepress-toc-list
	> .vuepress-toc-item
	> .vuepress-toc-link.active {
	padding-left: 1ch;

	background: var(--c-brand-light);
	color: var(--c-bg-light);
	border-radius: 0.25rem;
	transition: all ease-in-out 0.4s;
}

.toc-main > .vuepress-toc-list > .vuepress-toc-item .vuepress-toc-link.active {
	color: var(--c-text-lighter);
	font-weight: bolder;
}

.toc-fly {
	@apply absolute w-1 h-[2.5ch] left-5
  rounded-sm bg-green-300
  translate-y-0 transition-all ease-in-out duration-100 z-10;
}
</style>
