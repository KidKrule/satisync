import React, { useState } from "react"

import { remote } from "electron"

const { zipAndUpload } = remote.require("./main")

export default ({ group, groupname }) => {
	const [state, setState] = useState(false)

	const handleUpload = () => {
		setState("zipping")

		const cb = (err, url) => {
			setState(false)
			console.log(url)
		}

		const uploader = zipAndUpload(group, groupname, cb)
		uploader.on("uploading", () => setState("uploading"))
	}

	switch (state) {
		case false:
		default:
			return (
				<button className="pure-button" onClick={handleUpload}>
					Upload
				</button>
			)
		case "zipping":
			return (
				<button className="pure-button" disabled>
					Zipping...
				</button>
			)
		case "uploading":
			return (
				<button className="pure-button" disabled>
					Uploading...
				</button>
			)
	}
}
