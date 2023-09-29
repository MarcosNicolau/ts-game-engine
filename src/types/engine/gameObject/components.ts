// type AnimatedAssetAction = {
// 	name: string;
// 	asset: Asset;
// };

type Style = {
	color?: string;
};

export type SpritePrimitives = "rectangle" | "ellipse";

type SpriteUnions = {
	primitive: SpritePrimitives;
	image_url: string;
};

export type GameSpriteComponent<T extends "primitive" | "image_url" = "primitive"> = {
	style: Style;
	type: T;
	sprite: SpriteUnions[T];
};

// export type GameObjectAnimatedSprite = {
// 	actions: AnimatedAssetAction[];
// 	defaultAction: string;
// 	style: ShapeStyle;
// };
