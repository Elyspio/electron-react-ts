import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import logger from "redux-logger";
import { container } from "../main/di";
import { Container } from "inversify";
import { counterReducer } from "./module/counter/counter.reducer";
import { createBrowserHistory } from "history";
import { createReduxHistoryContext } from "redux-first-history";


const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
	history: createBrowserHistory(),
});
export const store = configureStore({
	// Reducers  de l'application
	reducer: {
		counter: counterReducer,
		router: routerReducer,
	},
	devTools: true,

	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
			immutableCheck: false,
			thunk: { extraArgument: { container } },
		}).concat(logger, routerMiddleware),
});

export const history = createReduxHistory(store);


// region typage
export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ExtraArgument = { container: Container; };

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

export type StoreType = typeof store;

// endregion typage
