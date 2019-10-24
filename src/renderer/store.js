import { createStore } from "@coriou/react-easy-store"
import { remote } from "electron"
import { DataFrame } from "data-forge"
import { computed } from "mobx"
import { filename } from "./utils"

const path = remote.require("path")

const initialState = {
	watchedFiles: [],
	get sortedWatchedFiles() {
		return new DataFrame(this.watchedFiles)
			.orderByDescending(r => r.mtimeMs)
			.groupBy(r => {
				return filename(r.basename).split("_")[0]
			})

			.select(group => group.toArray())
			.toArray()
	}
}

const processFile = (file, stats = {}) => {
	return { path: file, basename: path.basename(file), ...stats }
}

const reducers = {
	addFile: (store, [file, stats]) => {
		if (!store.watchedFiles.map(f => f.path).includes(file))
			store.watchedFiles.push(processFile(file, stats))
	},
	unlinkFile: (store, [file]) => {
		store.watchedFiles = store.watchedFiles.filter(f => f.path !== file)
	},
	changeFile: (store, [file, stats]) => {
		const storedFile = store.watchedFiles.findIndex(f => f.path === file)
		if (storedFile !== -1)
			store.watchedFiles[storedFile] = processFile(file, stats)
	},
	sortStore: store => {
		computed()
		// console.log("Sorting", sortStore(store))
		store.watchedFiles = sortStore(store)
		// console.log(store.watchedFiles.map(f => f.size))
	}
}

export const { Consumer, store, actions } = createStore(initialState, reducers)
