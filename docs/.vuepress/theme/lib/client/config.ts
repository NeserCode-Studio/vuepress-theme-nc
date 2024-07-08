import { defineClientConfig, resolvers, useLayouts } from "vuepress/client"
import { hasGlobalComponent } from "@vuepress/helper/client"
import Layout from "./layouts/Layout.vue"
import NotFound from "./layouts/NotFound.vue"
import TimeLine from "./layouts/TimeLine.vue"
import TagPage from "./layouts/TagPage.vue"
import Badge from "./components/global/Badge.vue"

import "./style/index.css"
import { useRouteHistory } from "./composables/useRouteHistory"

export default defineClientConfig({
	enhance: ({ app, router, siteData }) => {
		// Title resolve
		resolvers.resolvePageHeadTitle = (page, siteLocale) =>
			`${siteLocale.title} · ${page.title}`
		// Component
		if (!hasGlobalComponent("Badge")) app.component("Badge", Badge)
	},
	setup() {
		const layouts = useLayouts()
		const layoutNames = Object.keys(layouts.value).map((key) =>
			key.toLocaleLowerCase()
		)
		const { listener } = useRouteHistory(layoutNames)
		listener()
	},
	layouts: {
		Layout,
		TimeLine,
		TagPage,
		NotFound,
	},
})
