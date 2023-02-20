import { createSlice } from "@reduxjs/toolkit";
import { increment, replaceCounterState } from "./counter.action";
import { incrementByRandom } from "./counter.async.action";

export interface CounterState {
	value: number;
}

const defaultState: CounterState = {
	value: 0,
};

const slice = createSlice({
	initialState: defaultState,
	name: "Counter",
	reducers: {},
	extraReducers: ({ addCase }) => {
		addCase(increment, (state, action) => {
			state.value += action.payload;
		});

		addCase(incrementByRandom.fulfilled, (state, action) => {
			state.value += action.payload;
		});
		addCase(replaceCounterState, (state, action) => {
			(Object.keys(action.payload) as (keyof CounterState)[]).forEach(key => {
				state[key] = action.payload[key];
			});
		});
	},
});

export const { reducer } = slice;
