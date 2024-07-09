import { defaultConstants } from "../../shared"
import { useTimeAgo, useDateFormat } from "@vueuse/core"

export const getFormatDate = (date: Date | string) =>
	useDateFormat(date, defaultConstants.dateFormat)
export const getTimeAgo = (date: Date | string) => useTimeAgo(date)
