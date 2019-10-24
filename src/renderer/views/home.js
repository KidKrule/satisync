import React, { useEffect, useState } from "react"
import ViewWrapper from "../components/viewWrapper"
import { remote } from "electron"

import FilesList from "../components/filesList"
import { actions } from "../store"
const { satisfactoryDataDir, watchFiles } = remote.require("./main")

const Home = () => {
	const [watchedDirectory] = useState(satisfactoryDataDir())

	useEffect(() => {
		const watcher = watchFiles()

		watcher
			.on("ready", () =>
				console.log("Initial scan complete. Ready for changes")
			)
			.on("error", function(error) {
				console.error("chokidar watch error occurred " + error)
			})
			.on("change", actions.changeFile)
			.on("add", actions.addFile)
			.on("unlink", actions.unlinkFile)

		watcher.add(watchedDirectory)

		return watcher.close
	}, [])

	return (
		<ViewWrapper>
			<div className="pure-g">
				<div className="pure-u-5-5">
					<h3>Local saves</h3>
					{/* <p>Watching {watchedDirectory}</p> */}
					<FilesList />
				</div>
			</div>
		</ViewWrapper>
	)
}

export default Home
