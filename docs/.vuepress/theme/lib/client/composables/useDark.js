import { useDark as useDarkMode, useToggle } from '@vueuse/core'

export const useDark = () => {
  const isDark = useDarkMode({
    disableTransition: false
  })
  const toggle = useToggle(isDark)

  return {
    isDark, toggle
  }
}