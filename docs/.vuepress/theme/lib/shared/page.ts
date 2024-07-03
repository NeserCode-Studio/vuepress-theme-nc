import type { Page, PageData } from "vuepress/core"

export interface ExtraPageData extends PageData {
	filePathRelative?: string | null
}

export interface ThemePage<T extends ExtraPageData = ExtraPageData>
	extends Page<T> {}
