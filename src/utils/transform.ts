import { Position } from "../types/engine";

type Bounds = {
	rectangle: {
		center: Omit<Position, "z">;
		xDisplacement: number;
		yDisplacement: number;
		open?: boolean;
	};
	ellipse: {
		center: Omit<Position, "z">;
		xRadius: number;
		yRadius: number;
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
	ellipse: (position, { xRadius, yRadius, center, open = false }) => {
		// If a point is inside of an ellipse, then it should fulfill the polar coordinates equations.
		// Working that equation we conclude that:
		// (x,y) belongs to an ellipse of a major-axis, b minor-axis and center (x1, y1) if and only if asin(y + y1/b) = acos(x + x1/a) ;)
		// Of course, we also need to make sure that both x and y are less or equal to the radius, since asin and acos expect a number between 0 and 1.
		//TODO: See whether this is an expensive calculation. Probably it is coz it uses sum series and whatnot
		return (
			linearBound(position.x, center.x - xRadius, center.x + xRadius, open) &&
			linearBound(position.y, center.y - yRadius, center.y + yRadius, open) &&
			Math.acos(position.x + center.x / xRadius) ===
				Math.asin(position.y + center.y / yRadius)
		);
	},
};
