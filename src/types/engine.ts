import { GameObject } from "../engine";

export type runnerFn = ({ ctx }: { ctx: CanvasRenderingContext2D }) => void;
export type GameObjectType =
	| "Rectangle"
	| "Circle"
	| "AnimatedAsset"
	| "StaticAsset"
	| "Text"
	| "Audio"
	| "Empty";

export type Position = {
	x: number;
	y: number;
	z: number;
};

export type Scale = {
	x: number;
	y: number;
};

export type GameSize = {
	width: string;
	height: string;
};

export type GameCollision = {
	gameObject: GameObject;
	at: Position;
};

export type GameUIComponent = React.FC;
