import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";
import { windowOption } from "../config/electron";
import * as remoteMain from "@electron/remote/main";

remoteMain.initialize();
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
app.commandLine.appendSwitch("disable-site-isolation-trials");

let win: BrowserWindow | null;
const isDev = process.env.NODE_ENV !== "production";

const createWindow = async () => {
	win = new BrowserWindow({
		...windowOption,
	});

	if (isDev) {
		// Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
		win.webContents.once("dom-ready", async () => {});
	}

	remoteMain.enable(win.webContents);

	if (isDev) {
		process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "1"; // eslint-disable-line require-atomic-updates
		await win.loadURL(`http://localhost:2003`);
	} else {
		await win.loadURL(
			url.format({
				pathname: path.join(__dirname, "renderer", "index.html"),
				protocol: "file:",
				slashes: true,
			})
		);
	}

	win.on("closed", () => {
		win = null;
	});
};

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (win === null) {
		createWindow();
	}
});

app.on("browser-window-created", async (_, window) => {
	require("@electron/remote/main").enable(window.webContents);
	window!.webContents.openDevTools();
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
	app.quit();
} else {
	app.on("second-instance", (event, commandLine, workingDirectory) => {
		// Someone tried to run a second instance, we should focus our window.

		if (win) {
			if (win.isMinimized()) win.restore();
			win.focus();
		}
	});

	// Create myWindow, load the rest of the app, etc...
	app.on("ready", createWindow);
}


// find how to resolve sudoku