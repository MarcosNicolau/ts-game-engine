import { GameObjectComponents } from "../types/engine";

export class GameObject<State extends object = object> {
	public id: number = Math.random();
	public name: string;
	public tags: string[] = [];
	public state: State;
	public component: Partial<Omit<GameObjectComponents<State>, "transform">> &
		Pick<GameObjectComponents, "transform">;

	constructor({
		name,
		state,
		component,
	}: {
		name: string;
		state: State;
		component: Partial<Omit<GameObjectComponents<State>, "transform">> &
			Pick<GameObjectComponents, "transform">;
	}) {
		this.name = name;
		this.state = state;
		this.component = component;
	}
}
