import { BrowserWindowConstructorOptions } from "electron/main";

export const windowOption: BrowserWindowConstructorOptions = {
	width: 850,
	height: 600,
	backgroundColor: "#1b1b1b",
	webPreferences: {
		nodeIntegration: true,
		webSecurity: false,
		contextIsolation: false,
	},

	resizable: true,
};
