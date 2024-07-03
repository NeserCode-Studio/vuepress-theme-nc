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

				function getTotal(numbers: number[], index: number) {
					let sum = 0
					for (let i = 0; i < index; i++) {
						sum += numbers[i]
					}
					return sum
				}
				function findGroup(groups: number[], position: number) {
					let tempGroups = [...groups]

					for (let i = 0; i < tempGroups.length; i++) {
						const group = tempGroups[i]
						if (position <= group) return i
						else position -= group
					}

					return -1
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
					let actived: number[] = []
					links.forEach((link, index) => {
						if (!link.classList.contains("active")) return
						actived.push(index)
						current = index
					})

					let offsetRadius = 0
					if (current === -1) {
					} else {
						if (actived.length === 1)
							offsetRadius = findGroup(sums, current + 1)
						else if (actived.length > 1) {
							const groupIndex = findGroup(sums, current + 1)
							offsetRadius = current - getTotal(sums, groupIndex) + groupIndex
						}
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
