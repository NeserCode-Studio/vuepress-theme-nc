<script lang="ts" setup>
import Base from "./Base.vue"
import Page from "../components/Page.vue"
import Home from "../components/Home.vue"

import { usePageFrontmatter, usePageData } from "vuepress/client"
const pageFrontmatter = usePageFrontmatter()
const pageData = usePageData()

console.log("[Debug Page - Layout]", pageData.value)
</script>

<template>
	<Base>
		<template #page>
			<Home v-if="pageFrontmatter.home" />
			<Page v-else>
				<template #page-side-left>
					<slot name="page-side-left" />
				</template>
				<template #page-side-right>
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
		</template>
	</Base>
</template>

<style lang="postcss" scoped></style>
