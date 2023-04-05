import { useAppDispatch } from "@store/index";
import { useMemo } from "react";
import { ActionCreatorsMapObject, bindActionCreators } from "redux";

export function useActions<X, T extends ActionCreatorsMapObject<X>>(actions: T) {
	const dispatch = useAppDispatch();

	return useMemo(() => bindActionCreators(actions, dispatch), [actions, dispatch]);
}


