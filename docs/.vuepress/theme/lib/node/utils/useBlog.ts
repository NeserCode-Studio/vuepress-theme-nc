import { blogPlugin } from "@vuepress/plugin-blog"
import { dateSorter } from "@vuepress/helper/shared"

import { ThemePage } from "../../shared"

export const useBlogPlugin = () =>
	blogPlugin({
		excerpt: true,
		excerptLength: 150,
		filter: ({ filePathRelative, frontmatter }) => {
			if (!filePathRelative) return false
			if (filePathRelative.startsWith("archives/")) return false
			if (filePathRelative.startsWith("docs/")) return false
			if (frontmatter.home || frontmatter.layout) return false

			return true
		},

		getInfo: (page: ThemePage) => {
			const { frontmatter, title } = page
			// 获取页面信息
			const info = {
				author: frontmatter.author || "",
				categories: frontmatter.categories || [],
				date:
					page.frontmatter.date ??
					(page.data.git?.createdTime
						? new Date(page.data.git?.createdTime)
						: new Date()),
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
						pageA.frontmatter.date ??
							(pageA.data.git?.createdTime
								? new Date(pageA.data.git?.createdTime)
								: new Date()),
						pageB.frontmatter.date ??
							(pageB.data.git?.createdTime
								? new Date(pageB.data.git?.createdTime)
								: new Date())
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
