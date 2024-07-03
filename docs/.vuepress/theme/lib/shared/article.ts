export interface ArticleInfo {
	author: string
	categories: string[]
	date: string
	excerpt: string
	tags: string[]
	title: string
}

export interface ArticleMap {
	[key: string]: {
		items: ArticleData[]
		path: string
	}
}

export interface Article {
	path: string
}

export interface ArticleData extends Article {
	info: ArticleInfo
}

export interface ArticleTypeData extends Article {
	items: ArticleData[]
}

export interface ArticleCategoryData extends Article {
	map: ArticleMap
	currentItems?: ArticleData[]
}
