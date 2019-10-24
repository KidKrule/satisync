import { app, BrowserWindow } from "electron"
import path from "path"
import { format as formatUrl } from "url"
import windowStateKeeper from "electron-window-state"

import { platform, homedir } from "os"
import fs from "fs"
import archiver from "archiver"
import chokidar from "chokidar"
import transfer from "transfer-sh"
import { EventEmitter } from "events"

const isDevelopment = process.env.NODE_ENV !== "production"

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
	let mainWindowState = windowStateKeeper({
		defaultWidth: 1000,
		defaultHeight: 800
	})

	const window = new BrowserWindow({
		webPreferences: { nodeIntegration: true },
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height
	})

	if (isDevelopment) {
		window.webContents.openDevTools()
	}

	if (isDevelopment) {
		window.loadURL(
			`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
		)
	} else {
		window.loadURL(
			formatUrl({
				pathname: path.join(__dirname, "index.html"),
				protocol: "file",
				slashes: true
			})
		)
	}

	window.on("closed", () => {
		mainWindow = null
	})

	window.webContents.on("devtools-opened", () => {
		window.focus()
		setImmediate(() => {
			window.focus()
		})
	})

	mainWindowState.manage(window)

	return window
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
	// on macOS it is common for applications to stay open until the user explicitly quits
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	// on macOS it is common to re-create a window even after all windows have been closed
	if (mainWindow === null) {
		mainWindow = createMainWindow()
	}
})

// create main BrowserWindow when electron is ready
app.on("ready", () => {
	mainWindow = createMainWindow()
})

export const satisfactoryDataDir = () => {
	const os = platform()

	if (os === "win32")
		return path.join(homedir(), "AppData", "Local", "satisfactory")

	if (os === "darwin") return path.join(homedir(), "satisync")

	return new Error("Unsupported platform")
}

export const watchFiles = () =>
	chokidar.watch(undefined, {
		ignored: /(^|[/\\])\../,
		alwaysStat: true,
		awaitWriteFinish: true
	})

export const zipFiles = (files, name, cb) => {
	if (!Array.isArray(files)) files = [files]
	const archiveName = `${app.getPath("temp")}${name}.zip`

	const output = fs.createWriteStream(archiveName)
	const archive = archiver("zip", {
		zlib: { level: 9 }
	})
	output.on("close", () => cb(null, archiveName))

	archive.on("warning", function(err) {
		if (err.code === "ENOENT") console.warning(err)
		else cb(err)
	})

	archive.on("error", function(err) {
		cb(err)
	})

	archive.pipe(output)

	files.map(file => {
		archive.file(file.path, { name: file.basename })
	})

	archive.finalize()
}

export const upload = (file, cb) => {
	new transfer(file)
		.upload()
		.then(link => cb(null, link))
		.catch(cb)
}

export const zipAndUpload = (files, name, cb) => {
	const zipAndUploadEmitter = new EventEmitter()

	const done = (err, archive) => {
		if (err) return cb(err)

		zipAndUploadEmitter.emit("uploading")
		upload(archive, cb)
	}

	zipFiles(files, name, done)

	return zipAndUploadEmitter
}
