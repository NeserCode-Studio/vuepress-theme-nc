import { defineClientConfig, resolvers } from "vuepress/client"
import { hasGlobalComponent } from "@vuepress/helper/client"
import Layout from "./layouts/Layout.vue"
import NotFound from "./layouts/NotFound.vue"
import TimeLine from "./layouts/TimeLine.vue"
import TagPage from "./layouts/TagPage.vue"
import Badge from "./components/global/Badge.vue"

import "./style/index.css"

export default defineClientConfig({
	enhance: ({ app, router, siteData }) => {
		// Title resolve
		resolvers.resolvePageHeadTitle = (page, siteLocale) =>
			`${siteLocale.title} · ${page.title}`
		// Component
		if (!hasGlobalComponent("Badge")) app.component("Badge", Badge)
	},
	setup() {},
	layouts: {
		Layout,
		TimeLine,
		TagPage,
		NotFound,
	},
})
