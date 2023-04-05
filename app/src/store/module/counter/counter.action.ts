import { createActionGenerator } from "../../utils/utils.actions";

const createAction = createActionGenerator("counter");

export const increment = createAction<number>("increment");

