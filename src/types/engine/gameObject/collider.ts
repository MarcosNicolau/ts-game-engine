import { GameObjectComponents } from ".";
import { GameObject } from "../../../engine";
import { Position } from "./transform";

export type GameColliderComponent = {
	rectangle?: {
		scale?: {
			x: number;
			y: number;
		};
		//If should auto scale to the object size
		fitToObject: boolean;
	};
	elipse?: {
		scale?: {
			x: number;
			y: number;
		};
		rotation: number;
		angle: {
			start: number;
			end: number;
		};
		//If should auto scale to the object size
		fitToObject: boolean;
	};
};

export type GameCollidingComponents = Exclude<keyof GameObjectComponents, "camera">;

export type GameCollision = {
	gameObject: GameObject;
	at: Position;
};
