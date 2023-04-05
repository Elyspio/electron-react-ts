import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useActions } from "../../hooks/useActions";
import { increment } from "@store/module/counter/counter.action";
import { incrementByRandom } from "@store/module/counter/counter.async.action";
import { useAppSelector } from "@store/index";


export function Counter() {

	const counter = useAppSelector(s => s.counter.value);

	const actions = useActions({ increment, incrementByRandom });

	return (
		<Stack spacing={2} alignItems={"center"}>
			<Typography>Counter {counter}</Typography>
			<Stack direction={"row"} spacing={1} m={1}>

				<Button variant={"contained"} onClick={() => actions.increment(1)}>
					Increment (+1)
				</Button>
				<Button variant={"contained"} onClick={() => actions.incrementByRandom()}>
					Random Increment
				</Button>
			</Stack>

		</Stack>
	);
}
