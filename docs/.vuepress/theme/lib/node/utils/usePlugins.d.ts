import type { App } from "@vuepress/core"
import type { GitPluginOptions } from "@vuepress/plugin-git"

export const useGitPlugin: (app: App, options: GitPluginOptions) => void
export const removeGitPlugin: (app: App) => void
