import { defineClientConfig, resolvers } from "vuepress/client"
import Layout from "./layouts/Layout.vue"
import NotFound from "./layouts/NotFound.vue"
import TimeLine from "./layouts/TimeLine.vue"
import TagPage from "./layouts/TagPage.vue"

import "./style/index.css"

export default defineClientConfig({
	enhance: ({ app, router, siteData }) => {
		resolvers.resolvePageHeadTitle = (page, siteLocale) =>
			`${siteLocale.title} · ${page.title}`
	},
	layouts: {
		Layout,
		TimeLine,
		TagPage,
		NotFound,
	},
})
