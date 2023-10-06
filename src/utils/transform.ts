import { Position } from "../types/engine";

type Bounds = {
	rectangular: {
		center: Omit<Position, "z">;
		displacement: {
			x: number;
			y: number;
		};
		open?: boolean;
	};
	elliptic: {
		center: Omit<Position, "z">;
		radius: {
			x: number;
			y: number;
		};
		open?: boolean;
	};
};

type BoundingFn<T extends keyof Bounds> = (bounds1: Bounds[T], bounds2: Bounds[T]) => boolean;

export const linearBound = (number: number, leftBound: number, rightBound: number, open = false) =>
	open ? number >= leftBound && number <= rightBound : number > leftBound && number < rightBound;

export const multiDimensionalBound: { [key in keyof Bounds]: BoundingFn<key> } = {
	rectangular: (bound1, bound2) => {
		const checkBound = (axis: "x" | "y") =>
			linearBound(
				bound1.center[axis] + bound1.displacement[axis],
				bound2.center[axis] - bound2.displacement[axis],
				bound2.center[axis] + bound2.displacement[axis],
				bound2.open
			) ||
			linearBound(
				bound1.center[axis] - bound1.displacement[axis],
				bound2.center[axis] - bound2.displacement[axis],
				bound2.center[axis] + bound2.displacement[axis],
				bound2.open
			);

		return checkBound("x") && checkBound("y");
	},
	elliptic: (bound1, bound2) => {
		// If a point is inside of an ellipse, then it should fulfill the polar coordinates equations.
		// Working that equation we conclude that:
		// (x,y) belongs to an ellipse of a major-axis, b minor-axis and center (x1, y1) if and only if asin(y + y1/b) = acos(x + x1/a) ;)
		// Of course, we also need to make sure that both x and y are less or equal to the radius, since asin and acos expect a number between 0 and 1.
		//TODO: See whether this is an expensive calculation. Probably it is coz it uses sum series and whatnot

		//To save resource, it is better to first check by rectangular collisions
		return multiDimensionalBound.rectangular(
			{
				center: bound1.center,
				displacement: bound1.radius,
				open: bound1.open,
			},
			{
				center: bound2.center,
				displacement: bound2.radius,
				open: bound2.open,
			}
		);
		// linearBound(position.x, center.x - xRadius, center.x + xRadius, open) &&
		// linearBound(position.y, center.y - yRadius, center.y + yRadius, open) &&
		// Math.acos(position.x + center.x / xRadius) ===
		// 	Math.asin(position.y + center.y / yRadius)
	},
};
