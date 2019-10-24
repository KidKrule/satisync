import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/en"
import filesize from "filesize"

dayjs.extend(relativeTime)
dayjs.extend(LocalizedFormat)
dayjs.locale("en")

export const timeAgo = date => {
	if (date === 0) return "never"

	try {
		return dayjs().to(dayjs(date))
	} catch (err) {
		return date
	}
}

export const formatDate = (date, format = "L") => {
	return dayjs(date).format(format)
}

export const fsize = num => {
	try {
		return filesize(num)
	} catch (err) {
		return num
	}
}

export const filename = path => {
	try {
		return path
			.split(".")
			.slice(0, -1)
			.join(".")
	} catch (err) {
		return path
	}
}
