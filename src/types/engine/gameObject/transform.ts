export type Scale = { x: number; y: number; rotation: number };

export type Position = {
	x: number;
	y: number;
	z: number;
};

export type GameTransformComponent = {
	position: Position;
	scale: Scale;
	//Must be in radians
	rotation: number;
};
