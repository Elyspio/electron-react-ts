import { Container } from "inversify";
import { CounterService } from "@services/counter.service";

export function addServices(container: Container) {
	container.bind(CounterService).toSelf();

}
