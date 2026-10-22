import type {
	Article,
	BlogCategoryData,
	BlogTypeData,
} from "@vuepress/plugin-blog/client"

export type ArticleInfo = {
	author: string
	categories: string[]
	date: string
	excerpt: string
	tags: string[]
	title: string
}

export type BlogCategoryArticleData = BlogCategoryData<ArticleInfo>
export type BlogTypeArticleData = BlogTypeData<ArticleInfo>
export type BlogCategoryArticle = Article<ArticleInfo>
