import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { bindActionCreators } from "redux";
import { increment } from "../store/module/counter/counter.action";
import { incrementByRandom } from "../store/module/counter/counter.async.action";
import { BrowserWindow } from "@electron/remote";
import { windowOption } from "../../config/electron";

export function Application() {
	const counter = useAppSelector(s => s.counter.value);

	const dispatch = useAppDispatch();

	const actions = useMemo(() => bindActionCreators({ increment, incrementByRandom }, dispatch), [dispatch]);

	const duplicate = async () => {
		const win = new BrowserWindow(windowOption);

		await win.loadURL("http://localhost:2003");

		win.show();
	};

	return (
		<Box m={2}>
			<Paper>
				<Stack p={4} spacing={2} bgcolor={"background.default"}>
					<Typography>Hello</Typography>
					<Typography>Counter {counter}</Typography>
					<Stack direction={"row"} spacing={2}>
						<Button variant={"contained"} onClick={() => actions.increment(1)}>
							Increment (+1)
						</Button>
						<Button variant={"contained"} onClick={() => actions.incrementByRandom()}>
							Random Increment
						</Button>
						<Button variant={"contained"} onClick={duplicate}>
							New Window
						</Button>
					</Stack>
				</Stack>
			</Paper>
		</Box>
	);
}

export default Application;
