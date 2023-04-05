import "reflect-metadata";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import Application from "./components/Application";
import { history, store } from "@store/index";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { theme } from "../config/theme";
import { ToastContainer } from "react-toastify";
import { HistoryRouter } from "redux-first-history/rr6";
import "./index.scss";


// Create main element

const root = createRoot(document.getElementById("root")!);

root.render(
	<StyledEngineProvider injectFirst>
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<HistoryRouter history={history}>
					<Application />
				</HistoryRouter>
				<ToastContainer theme={"dark"} position={"top-right"} className={"no-autoresize"} />
			</Provider>
		</ThemeProvider>
	</StyledEngineProvider>,
);
