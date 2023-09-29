import { GameObject } from "../engine";
import { GameTransformComponent, SpritePrimitives } from "../types/engine";

type Draw = ({
	gameObject,
	ctx,
}: {
	gameObject: GameObject;
	ctx: CanvasRenderingContext2D;
}) => void;

type PrimitiveDrawer = {
	[key in SpritePrimitives]: ({
		ctx,
		transform,
	}: {
		ctx: CanvasRenderingContext2D;
		transform: GameTransformComponent;
	}) => void;
};

const primitiveDrawer: PrimitiveDrawer = {
	ellipse: ({ ctx, transform }) =>
		ctx.ellipse(
			transform.position.x,
			transform.position.y,
			transform.scale.x,
			transform.scale.y,
			transform.rotation,
			0,
			0
		),
	rectangle: ({ ctx, transform }) => {
		ctx.fillRect(
			transform.position.x,
			transform.position.y,
			transform.scale.x,
			transform.scale.y
		);
		ctx.rotate(transform.rotation);
	},
};

export const draw: Draw = ({ ctx, gameObject }) => {
	const spriteToRender = gameObject.component.spriteRenderer;
	const transform = gameObject.component.transform;
	if (!spriteToRender) return;
	if (spriteToRender.type === "primitive") {
		ctx.fillStyle = spriteToRender.style?.color || "#0";
		primitiveDrawer[spriteToRender.sprite]({ ctx, transform });
		return;
	}
	if (spriteToRender.type === "image_url") {
		const imageEl = document.createElement("img");
		imageEl.src = spriteToRender.sprite;
		ctx.drawImage(
			imageEl,
			transform.position.x,
			transform.position.y,
			transform.scale.x,
			transform.scale.y
		);
	}
};
