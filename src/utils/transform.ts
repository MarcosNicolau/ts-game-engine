import { Position } from "../types/engine";

type Bounds = {
	rectangle: {
		center: Omit<Position, "z">;
		xDisplacement: number;
		yDisplacement: number;
		open?: boolean;
	};
};

type BoundArgs<T extends keyof Bounds> = (
	position: Omit<Position, "z">,
	bounds: Bounds[T]
) => boolean;

export const linearBound = (number: number, leftBound: number, rightBound: number, open = false) =>
	open ? number >= leftBound && number <= rightBound : number > leftBound && number < rightBound;

export const multiDimensionalBound: { [key in keyof Bounds]: BoundArgs<key> } = {
	rectangle: (position, { center, xDisplacement, yDisplacement, open = false }) =>
		linearBound(position.x, center.x - xDisplacement, center.x + xDisplacement, open) &&
		linearBound(position.y, center.y - yDisplacement, center.y + yDisplacement, open),
};
