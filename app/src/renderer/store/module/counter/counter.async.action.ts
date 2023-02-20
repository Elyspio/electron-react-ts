import { createAsyncThunk } from "@reduxjs/toolkit";

export const incrementByRandom = createAsyncThunk("counter/random", () => {
	return Math.floor(Math.random() * 100) / 100;
});
