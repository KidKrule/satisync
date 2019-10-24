import React, { useState, useEffect } from "react"
import { timeAgo, formatDate } from "../utils"

const Timeago = ({ date, includeFull, fullFormat = "lll" }) => {
	const [relativeTime, setRelativeTime] = useState(timeAgo(date))

	useEffect(() => {
		const updateRelativeTime = () => {
			const newRelativeTime = timeAgo(date)

			if (relativeTime !== newRelativeTime)
				setRelativeTime(newRelativeTime)
		}

		updateRelativeTime()

		const timer = setInterval(() => {
			updateRelativeTime()
		}, 60 * 1e3) // Update every minute

		return () => clearInterval(timer)
	}, [date, relativeTime])

	return (
		<>
			{relativeTime}
			{includeFull && date !== 0 && (
				<span className="d-block text-muted small">
					{formatDate(date, fullFormat)}
				</span>
			)}
		</>
	)
}

export default Timeago
