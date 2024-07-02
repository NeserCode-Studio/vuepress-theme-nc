import { WritableComputedRef } from "vue"

export const useDark: () => {
	toggle: (value?: boolean | undefined) => boolean
	isDark: WritableComputedRef<boolean>
}
