import { createSlice } from "@reduxjs/toolkit";
import { increment } from "./counter.action";
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
	},
});

export const { reducer: counterReducer } = slice;
