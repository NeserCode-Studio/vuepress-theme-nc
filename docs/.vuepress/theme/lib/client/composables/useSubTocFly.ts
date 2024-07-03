import { nextTick, onMounted, type Ref, watch } from "vue"
import { useRoute } from "vuepress/client"

export const useSubTocFly = (
	toc: Ref<HTMLDivElement | null>,
	tocFly: Ref<HTMLDivElement | null>
) => {
	const $route = useRoute()

	onMounted(() => {
		watch(
			() => $route.hash,
			() => {
				let current = -1
				let sums = [] as number[]

				function getTotal(list: number[], index: number = list.length - 1) {
					let result = 0

					list.forEach((num, i) => {
						if (i < index + 1 && index >= 0) result += num
					})
					return result
				}

				nextTick(() => {
					const list = toc.value?.querySelector<HTMLDivElement>(
						".vuepress-toc-list"
					) as HTMLDivElement
					if (!list) return

					list.querySelectorAll("& > .vuepress-toc-item").forEach((l) => {
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
						sums.forEach((_sum, i) => {
							if (current > getTotal(sums, i - 1) + i) {
								index = i
							}
						})
						offsetRadius = current - (index > 0 ? getTotal(sums, index - 1) : 0)
					}
					// console.log(`[Debug Hash Fly Position]`, offsetRadius, sums, links)
					;(
						tocFly.value as HTMLDivElement
					).style.transform = `translateY(calc(${offsetRadius * 100}% + ${
						0.25 * offsetRadius
					}rem))`
				})
			},
			{ immediate: true }
		)
	})
}
