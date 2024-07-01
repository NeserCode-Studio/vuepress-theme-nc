import { defineClientConfig } from "vuepress/client"
import Layout from "./layouts/Layout.vue"
import NotFound from "./layouts/NotFound.vue"

import "./style/index.css"

export default defineClientConfig({
	layouts: {
		Layout,
		NotFound,
	},
})
