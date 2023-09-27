import { GameObject } from "../engine";
import { GameObjectType } from "../types/engine";

export const draw: {
	[key in Exclude<GameObjectType, "Audio">]: ({
		gameObject,
		ctx,
	}: {
		gameObject: GameObject;
		ctx: CanvasRenderingContext2D;
	}) => void;
} = {
	AnimatedAsset: () => {},
	Circle: () => {},
	Rectangle: ({ ctx, gameObject }) => {
		ctx.fillRect(
			gameObject.position.x,
			gameObject.position.y,
			gameObject.scale.x,
			gameObject.scale.y
		);
	},
	StaticAsset: () => {},
	Text: () => {},
	Empty: () => {},
};
