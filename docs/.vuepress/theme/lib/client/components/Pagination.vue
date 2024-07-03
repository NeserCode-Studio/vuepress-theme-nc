<script lang="ts" setup>
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ArrowUturnLeftIcon,
	ArrowUturnRightIcon,
} from "@heroicons/vue/24/solid"
import { useThrottleFn } from "@vueuse/core"
import { computed, toRefs } from "vue"

const $props = defineProps<{
	pages: {
		total: number
		offset: number
		limit: number
	}
	changes?: {
		prev: () => void
		next: () => void
		page: (page: number) => void
		top: () => void
		bottom: () => void
	}
}>()

const { pages, changes } = toRefs($props)
const totalPage = computed(() =>
	Math.ceil(pages.value.total / pages.value.limit)
)
const currentPage = computed(() => {
	const current = Math.floor(pages.value.offset / pages.value.limit) + 1
	if (!!changes.value?.page) changes.value.page(current)
	return current
})
const shownPages = computed(() => {
	if (totalPage.value <= 5) return totalPage.value
	return currentPage.value <= 3
		? [1, 2, 3, 4, 5]
		: currentPage.value >= totalPage.value - 2
		? [
				totalPage.value - 4,
				totalPage.value - 3,
				totalPage.value - 2,
				totalPage.value - 1,
				totalPage.value,
		  ]
		: [
				currentPage.value - 1,
				currentPage.value,
				currentPage.value + 1,
				currentPage.value + 2,
				currentPage.value + 3,
		  ]
})

const disabledSet = computed(() => {
	const { offset, limit, total } = pages.value
	return {
		prev: offset === 0 || total <= limit,
		next: offset + limit >= pages.value.total,
		top: offset === 0 || total <= limit,
		bottom: offset + limit >= pages.value.total,
	}
})

const prevFn = useThrottleFn(() => {
	changes.value?.prev()
}, 500)
const nextFn = useThrottleFn(() => {
	changes.value?.next()
}, 500)
const topFn = useThrottleFn(() => {
	changes.value?.top()
}, 500)
const bottomFn = useThrottleFn(() => {
	changes.value?.bottom()
}, 500)
const pageFn = useThrottleFn((page: number) => {
	if (currentPage.value !== page) changes.value?.page(page)
}, 500)

const matchClass = (page: number) =>
	page === currentPage.value ? "curr" : null
</script>

<template>
	<div class="pagination-main">
		<button
			class="list-top btn"
			:class="{ 'btn-disabled': disabledSet.prev }"
			type="button"
			@click="topFn"
			:disabled="disabledSet.prev"
		>
			<ArrowUturnLeftIcon class="icon" />
		</button>
		<button
			class="prev btn"
			:class="{ 'btn-disabled': disabledSet.prev }"
			type="button"
			@click="prevFn"
			:disabled="disabledSet.prev"
		>
			<ChevronLeftIcon class="icon" />
		</button>
		<button
			class="page btn"
			:class="matchClass(page)"
			v-for="page in shownPages"
			:key="page"
			@click="pageFn(page)"
		>
			{{ page }}
		</button>
		<button
			class="next btn"
			:class="{ 'btn-disabled': disabledSet.next }"
			type="button"
			@click="nextFn"
			:disabled="disabledSet.next"
		>
			<ChevronRightIcon class="icon" />
		</button>
		<button
			class="list-bottom btn"
			:class="{ 'btn-disabled': disabledSet.next }"
			type="button"
			@click="bottomFn"
			:disabled="disabledSet.next"
		>
			<ArrowUturnRightIcon class="icon" />
		</button>
	</div>
</template>

<style lang="postcss" scoped>
.pagination-main {
	@apply w-full flex items-center justify-center gap-2 py-4
	select-none;
}

.pagination-main .btn {
	@apply inline-flex justify-center items-center p-1.5
	rounded
	bg-slate-200 dark:bg-slate-500
	hover:bg-slate-300 dark:hover:bg-slate-400
	transition-colors ease-in-out duration-300;
}
.btn .icon {
	@apply w-4 h-4;
}
.btn-disabled {
	@apply opacity-50 cursor-not-allowed;
}
.text {
	@apply text-sm;
}

.pagination-main .page.btn {
	@apply py-0.5 px-2
	text-sm rounded;
}
.page.btn.curr {
	@apply bg-green-300 dark:bg-green-600;
}
</style>
