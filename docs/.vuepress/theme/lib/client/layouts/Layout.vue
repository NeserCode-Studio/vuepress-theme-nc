<script lang="ts" setup>
import Base from "./Base.vue"
import Page from "../components/Page.vue"
import Home from "../components/Home.vue"

import GithubRepo from "../components/GithubRepo.vue"
import Copyright from "../components/Copyright.vue"
import ReadingLine from "../components/ReadingLine.vue"

import {
	usePageData,
	usePageFrontmatter,
	useSiteData,
	useRoute,
} from "vuepress/client"
import { computed, onMounted, ref } from "vue"
import { useThemeData } from "@vuepress/plugin-theme-data/client"
import { Hook } from "../composables/useHook"
import {
	useElementSrcolled,
	usePluginState,
} from "../composables/useComponentUtils"

import {
	defaultConstants,
	type DefaultThemeData,
	type DefaultThemeNormalPageFrontmatter,
	type DefaultThemePageData,
} from "../../shared"

const pageData = usePageData<DefaultThemePageData>()
const pageFrontmatter = usePageFrontmatter<DefaultThemeNormalPageFrontmatter>()
const themeLocale = useThemeData<DefaultThemeData>()
const siteData = useSiteData()
const $route = useRoute()

// repo info
const githubRepoData = computed(() => {
	let data = pageFrontmatter.value.repo?.split("/")
	if (!data?.length) return false
	return {
		owner: data[0],
		repo: data[1],
	}
})

/* Original */
const isOriginal = computed(() => {
	if (pageFrontmatter.value.original === false) return false
	else return true
})
const originalUrl = computed(() => {
	if (pageFrontmatter.value.originalUrl)
		return pageFrontmatter.value.originalUrl
	return (
		themeLocale.value.domain +
		((siteData.value.base ?? "") + pageData.value.path).replace("//", "/")
	)
})
const copyrightTips = [""]

// Scroll listener
const readingLineProgress = ref(0)
onMounted(() => {
	Hook.onRoute(() => {
		const scrollUtils = useElementSrcolled(".v-nc-content")
		if (scrollUtils)
			scrollUtils.onScroll((total, scrolled) => {
				readingLineProgress.value = parseFloat(
					((scrolled / total) * 100).toFixed(2)
				)
			})
	}, $route)
})

const isNotFound = computed(() => pageFrontmatter.value.layout === "NotFound")
const computedStateSource = computed(() =>
	isNotFound.value
		? defaultConstants.notFoundPluginState
		: pageFrontmatter.value
)
const isReadingLineActive = computed(() =>
	usePluginState("readingLine", computedStateSource.value)
)
</script>

<template>
	<Base>
		<template #page>
			<div class="page-wrapper" :key="pageData.path">
				<ReadingLine
					:reading-progress="readingLineProgress"
					v-if="isReadingLineActive"
				/>
				<Home v-if="pageFrontmatter.home" />
				<Page v-else>
					<template #before-page> </template>
					<template #page-side-left>
						<slot name="page-side-left" />
					</template>
					<template #page-side-right>
						<GithubRepo
							:owner="githubRepoData.owner"
							:repo="githubRepoData.repo"
							v-if="githubRepoData"
						/>
						<slot name="page-side-right" />
					</template>
					<template #before-page-head>
						<slot name="before-page-head" />
					</template>
					<template #after-page-head>
						<slot name="after-page-head" />
					</template>
					<template #before-content>
						<slot name="before-content" />
					</template>
					<template #before-comment>
						<Copyright
							:isOriginal="isOriginal"
							:originalUrl="originalUrl"
							:tips="copyrightTips"
						/>
					</template>
					<template #after-content>
						<slot name="after-content" />
					</template>
					<template #before-page-foot>
						<slot name="before-page-foot" />
					</template>
					<template #after-page-foot>
						<slot name="after-page-foot" />
					</template>
				</Page>
			</div>
		</template>
	</Base>
</template>

<style lang="postcss" scoped></style>
