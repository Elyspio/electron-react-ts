import { createAction as _createAction } from "@reduxjs/toolkit";
import { CounterState } from "./counter.reducer";

const createAction = <T>(type: string) => _createAction<T>(`counter/${type}`);

export const increment = createAction<number>("increment");

export const replaceCounterState = createAction<CounterState>("replace");
