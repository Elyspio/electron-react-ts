import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { Box, Paper, Stack } from "@mui/material";
import { bindActionCreators } from "redux";
import { increment } from "@store/module/counter/counter.action";
import { incrementByRandom } from "@store/module/counter/counter.async.action";
import { Route, Routes } from "react-router-dom";
import { Counter } from "./counter/Counter";

export function Application() {
	const counter = useAppSelector(s => s.counter.value);

	const dispatch = useAppDispatch();

	const actions = useMemo(() => bindActionCreators({ increment, incrementByRandom }, dispatch), [dispatch]);

	return (
		<Box m={2}>
			<Paper>
				<Stack p={4} spacing={2} bgcolor={"background.default"}>
					<Routes>
						<Route path="/" element={<Counter />} />
					</Routes>

				</Stack>
			</Paper>
		</Box>
	);
}

export default Application;
