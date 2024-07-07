import { blogPlugin } from "@vuepress/plugin-blog"
import { dateSorter } from "@vuepress/helper/shared"

import { ThemePage } from "../../shared"

export const useBlogPlugin = () =>
	blogPlugin({
		excerpt: true,
		excerptLength: 150,
		filter: ({ filePathRelative, frontmatter }) => {
			// 舍弃那些不是从 Markdown 文件生成的页面
			if (!filePathRelative) return false
			// 舍弃 `archives` 文件夹的页面
			if (filePathRelative.startsWith("archives/")) return false
			// 舍弃 `docs` 文件夹的页面
			if (filePathRelative.startsWith("docs/")) return false
			// 舍弃那些没有使用默认布局的页面
			if (frontmatter.home || frontmatter.layout) return false

			return true
		},

		getInfo: (page: ThemePage) => {
			const { frontmatter, title } = page
			// 获取页面信息
			const info = {
				author: frontmatter.author || "",
				categories: frontmatter.categories || [],
				date: page.data.git?.createdTime
					? new Date(page.data.git?.createdTime)
					: page.frontmatter.date,
				tags: frontmatter.tags || frontmatter.tag || [],
				excerpt: page.data.excerpt || "",
				title,
			}

			return info
		},
		category: [
			{
				key: "tags",
				getter: ({ frontmatter }) => (frontmatter.tag as any[]) || [],
				path: "/tags/",
				layout: "TagPage",
				frontmatter: (path) => ({
					title: "类",
					localePath: path,
					plugins: {
						readingTime: false,
						readingLine: false,
						comment: false,
						sidebarCategory: false,
					},
					layout: "TagPage",
				}),
				itemPath: "/tags/:name/",
				itemLayout: "TagPage",
				itemFrontmatter: (name, path) => ({
					title: `${name.toUpperCase()}`,
					localePath: path,
					plugins: {
						readingTime: false,
						readingLine: false,
						comment: false,
						sidebarCategory: false,
					},
					layout: "TagPage",
				}),
			},
		],
		type: [
			{
				key: "timeLine",
				filter: (page) => page.data.path.startsWith("/blog/"),
				sorter: (pageA: ThemePage, pageB: ThemePage) =>
					dateSorter(
						pageA.data.git?.createdTime
							? new Date(pageA.data.git?.createdTime)
							: pageA.frontmatter.date,
						pageB.data.git?.createdTime
							? new Date(pageB.data.git?.createdTime)
							: pageB.frontmatter.date
					),
				path: "/time/",
				layout: "TimeLine",
				frontmatter: (path) => ({
					title: "时",
					localePath: path,
					plugins: {
						readingTime: false,
						readingLine: false,
						comment: false,
						sidebarCategory: false,
					},
					layout: "TimeLine",
				}),
			},
		],
	})
