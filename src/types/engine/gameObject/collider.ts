import { GameObjectComponents } from ".";
import { GameObject } from "../../../engine";

export type GameColliderComponent = {
	rectangle?: {
		scale?: {
			x: number;
			y: number;
		};
	};
	ellipse?: {
		scale?: {
			x: number;
			y: number;
		};
		rotation: number;
		angle: {
			start: number;
			end: number;
		};
	};
	//If should auto scale to the object size
	fitToObject: boolean;
	active: boolean;
};

export type GameCollidingComponents = Exclude<keyof GameObjectComponents, "camera">;

export type GameCollision = {
	gameObject: GameObject;
	// at: Position;
};
