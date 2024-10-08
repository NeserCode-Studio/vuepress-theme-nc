<script lang="ts" setup>
import { AutoLink } from "vuepress/client"
import { computed, toRefs } from "vue"

const $props = defineProps<{
	isOriginal: boolean
	originalUrl?: string
	tips?: string[]
}>()
const { isOriginal, originalUrl, tips } = toRefs($props)

const decodedUrl = computed(() => {
	if (originalUrl && originalUrl.value) {
		return decodeURIComponent(originalUrl.value)
	}
	return ""
})

const linkItem = computed(() => ({
	text: "CC BY-SA 4.0",
	link: "https://creativecommons.org/licenses/by-sa/4.0/deed",
}))

function copyInfo() {
	const text = `本文遵循 ${linkItem.value.text} 版权协议，转载请附上出处链接及本声明。文章出处：${decodedUrl.value}`
	if (navigator && navigator.clipboard) navigator.clipboard.writeText(text)
}
function copyLink() {
	if (navigator && navigator.clipboard)
		navigator.clipboard.writeText(decodedUrl.value)
}
function goLink() {
	window.open(decodedUrl.value)
}
</script>

<template>
	<div class="v-nc-copyright">
		<div class="copyright-container">
			<span class="info">
				<span class="title" v-if="isOriginal"
					>本文为原创文章，遵循
					<AutoLink :config="linkItem" />
					版权协议，转载请附上原文出处链接及本声明。</span
				>
				<span class="title" v-else>本文为转载文章，如欲转载请联系原作者</span>
				<span v-for="tip in tips" :key="tip" class="tip">{{ tip }}</span>
				<span class="origin-url">文章链接：{{ decodedUrl }}</span>
				<span class="operate">
					<button class="btn" @click="copyInfo">一键复制</button>
					<button class="btn" @click="copyLink">复制文章地址</button>
					<button class="btn" @click="goLink" v-if="!isOriginal">
						前往文章地址
					</button>
				</span>
			</span>
			<span class="icon">
				<svg
					t="1679731809836"
					class="cc-svg"
					viewBox="0 0 1024 1024"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					p-id="893"
				>
					<path
						d="M516.56 512.016m-461.376 0a461.376 461.376 0 1 0 922.752 0 461.376 461.376 0 1 0-922.752 0Z"
						fill="transparent"
						p-id="894"
					></path>
					<path
						class="cc-svg-path"
						d="M511.056 0c143.216 0 265.152 50 365.712 149.952 48.128 48.144 84.72 103.168 109.712 165.024 24.976 61.872 37.504 127.536 37.504 197.024 0 70.096-12.368 135.776-37.024 197.008-24.688 61.248-61.12 115.36-109.248 162.288-49.968 49.36-106.656 87.168-170.064 113.376-63.376 26.208-128.912 39.312-196.56 39.312s-132.416-12.928-194.288-38.864c-61.856-25.888-117.328-63.376-166.4-112.432-49.072-49.056-86.4-104.384-112-165.952S0 580.272 0 512c0-67.664 12.944-132.72 38.848-195.2 25.904-62.48 63.552-118.4 112.912-167.776C249.28 49.696 369.04 0 511.056 0z m1.856 92.352c-117.024 0-215.472 40.848-295.328 122.512-40.24 40.848-71.168 86.704-92.8 137.6a403.264 403.264 0 0 0-32.464 159.552c0 54.864 10.8 107.744 32.464 158.608 21.648 50.928 52.56 96.336 92.8 136.256 40.224 39.936 85.616 70.384 136.24 91.44a410.432 410.432 0 0 0 159.088 31.536c54.848 0 108-10.64 159.568-31.984 51.504-21.36 97.936-52.112 139.408-92.336 79.84-78.016 119.744-175.84 119.744-293.504 0-56.688-10.368-110.32-31.088-160.912-20.688-50.592-50.88-95.68-90.464-135.328-82.336-82.288-181.36-123.44-297.168-123.44z m-6.416 334.64l-68.592 35.664c-7.328-15.216-16.304-25.904-26.96-32-10.672-6.08-20.576-9.136-29.728-9.136-45.696 0-68.576 30.16-68.576 90.512 0 27.424 5.792 49.344 17.36 65.808 11.584 16.464 28.656 24.704 51.216 24.704 29.872 0 50.896-14.64 63.104-43.888l63.072 32c-13.408 25.008-32 44.656-55.776 58.976-23.744 14.336-49.968 21.488-78.624 21.488-45.712 0-82.608-14-110.64-42.064-28.032-28.032-42.048-67.04-42.048-117.008 0-48.768 14.176-87.456 42.512-116.112 28.336-28.64 64.144-42.976 107.44-42.976 63.408-0.032 108.8 24.656 136.24 74.032z m295.312 0l-67.664 35.664c-7.312-15.216-16.32-25.904-26.976-32-10.688-6.08-20.912-9.136-30.624-9.136-45.712 0-68.592 30.16-68.592 90.512 0 27.424 5.808 49.344 17.376 65.808 11.568 16.464 28.624 24.704 51.216 24.704 29.84 0 50.88-14.64 63.056-43.888l64 32c-14 25.008-32.912 44.656-56.656 58.976a147.728 147.728 0 0 1-77.712 21.488c-46.336 0-83.344-14-111.056-42.064-27.776-28.032-41.632-67.04-41.632-117.008 0-48.768 14.16-87.456 42.528-116.112 28.32-28.64 64.128-42.976 107.408-42.976 63.392-0.032 108.528 24.656 135.328 74.032z"
						p-id="895"
					></path>
				</svg>
			</span>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.v-nc-copyright {
	@apply w-full my-4 mt-12 flex 
  opacity-90 overflow-hidden;
}

.v-nc-copyright .copyright-container {
	@apply relative w-full flex p-4
	rounded border-2 border-slate-400 dark:border-slate-500;
}

.copyright-container .info {
	@apply w-full inline-flex flex-col
	z-10;
}
.copyright-container .icon {
	@apply absolute w-36 right-2 top-2
	fill-slate-400 dark:fill-slate-500
	z-0;
}

.info .operate {
	@apply w-fit inline-flex flex-wrap gap-x-2 mt-2;
}

.info .operate .btn {
	@apply w-fit inline-block px-2 py-1
	rounded bg-slate-200 dark:bg-slate-700
	text-sm
	transition-all ease-in-out duration-300;
}
</style>
