import { injectable } from "inversify";

@injectable()
export class CounterService {
	getRandomNumber() {
		return Math.random() * 10;
	}
}
