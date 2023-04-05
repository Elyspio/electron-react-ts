import { createAsyncActionGenerator, getService } from "../../utils/utils.actions";
import { CounterService } from "@services/counter.service";

const createAsyncThunk = createAsyncActionGenerator("counter");

export const incrementByRandom = createAsyncThunk("random", (_, { extra }) => {
	const counterService = getService(CounterService, extra);
	return counterService.getRandomNumber();
});
