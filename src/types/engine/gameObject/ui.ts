import { GameObject } from "../../../engine";

export type GameUIComponent<State extends object = any> = {
	render: (gameObject: GameObject<State>) => string;
	renderOnStart: boolean;
	// Id is optional, if you don't provide one, the engine creates one for you
	// This is to keep track of the re renderings
	id?: string;
};
