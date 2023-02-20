import { configureStore, Middleware, PayloadAction } from "@reduxjs/toolkit";
import { reducer as counterReducer } from "./module/counter/counter.reducer";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { getCurrentWindow, ipcMain } from "@electron/remote";
import { ipcRenderer } from "electron";

const currentWindow = getCurrentWindow();

type ElectronAction = PayloadAction<any> & { alreadyDispatched?: boolean; idWindow: number };

const electronDispatcherMiddleware: Middleware = store => next => (action: ElectronAction) => {
	console.log("redux-action", action);

	if (!action.alreadyDispatched) {
		const electronAction: ElectronAction = { ...action, idWindow: currentWindow.id };
		ipcRenderer.send("redux-action", electronAction);
	}

	return next(action);
};

export const store = configureStore({
	reducer: {
		counter: counterReducer,
	},

	devTools: true,
	middleware: defaults => defaults().concat(electronDispatcherMiddleware),
});

export type StoreState = ReturnType<typeof store.getState>;

export default store;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

ipcMain.on("redux-action", (event, action: ElectronAction) => {
	if (!action.alreadyDispatched && action.idWindow !== currentWindow.id) {
		action.alreadyDispatched = true;
		store.dispatch(action);
	}

	console.log("received redux action from ipc", action);
});

// main window
if (currentWindow.id === 1) {
	ipcMain.on("redux-init", async event => {
		const state = store.getState();
		console.log("redux-init", state);
		event.returnValue = state;
	});
} else {
	updateInitialState();
}

function updateInitialState() {
	const state = ipcRenderer.sendSync("redux-init");
	console.log("state resp", state);
	const reducers = Object.keys(state) as (keyof StoreState)[];
	for (const reducer of reducers) {
		store.dispatch({ type: `${reducer}/replace`, payload: state[reducer] });
	}
}

