import { ComputedRef, inject, InjectionKey } from "vue"
import { Page } from "vuepress/core"

export type PagesMap = Record<string, Page[]>
export type PagesMapRef = ComputedRef<PagesMap>
export const pagesMapSymbol: InjectionKey<PagesMapRef> = Symbol("pagesMap")

export const usePagesMap = () => {
	const pagesMap = inject(pagesMapSymbol)
	if (!pagesMap) throw new Error("usePagesMap() is called without provider.")
	return pagesMap
}
