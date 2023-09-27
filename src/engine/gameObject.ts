import { GameCollision, Scale, Position, runnerFn, GameObjectType } from "../types/engine";

export class GameObject {
	public name = "";
	public id: number = Math.random();
	public tags?: string[];
	public position: Position = { x: 0, y: 0, z: 0 };
	public scale: Scale = { x: 0, y: 0 };
	public color?: string;
	public type: GameObjectType = "Empty";
	onStart: runnerFn = () => null;
	onUpdate: runnerFn = () => null;
	onCollision: (collisionInfo: GameCollision) => void = () => null;
	onPause: runnerFn = () => null;
}
