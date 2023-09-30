import { FrameFn } from "../engine";
import { GameCollision } from "./collider";
import { GameObject } from "../../../engine";

export type GameScriptComponent<T extends object = object> = (gameObject: GameObject<T>) => {
	onStart: FrameFn;
	onUpdate: FrameFn;
	onPause: FrameFn;
	onCollisionEnter: (collisionInfo: GameCollision) => void;
	onCollisionStay: (collisionInfo: GameCollision) => void;
	onCollisionExit: (collisionInfo: GameCollision) => void;
};
