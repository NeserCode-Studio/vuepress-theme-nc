import { FrontmatterPluginState } from "./component"

export const defaultConstants: {
	dateFormat: string
	notFoundPluginState: FrontmatterPluginState
} = {
	dateFormat: "YY/MM-DD HH:mm",
	notFoundPluginState: {
		plugins: {
			readingTime: false,
			readingLine: false,
			comment: false,
			sidebarCategory: false,
		},
	},
}
