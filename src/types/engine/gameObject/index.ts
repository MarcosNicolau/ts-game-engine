import { GameTransformComponent } from "./transform";
import { GameCameraComponent } from "./camera";
import { GameColliderComponent } from "./collider";
import { GameSpriteComponent } from "./sprite";
import { GameUIComponent } from "./ui";
import { GameScriptComponent } from "./script";

export * from "./camera";
export * from "./collider";
export * from "./transform";
export * from "./sprite";
export * from "./ui";

export type GameObjectComponents<State extends object = any> = {
	spriteRenderer: GameSpriteComponent;
	collider: GameColliderComponent;
	ui: GameUIComponent<State>;
	camera: GameCameraComponent;
	transform: GameTransformComponent;
	scripts: GameScriptComponent<State>[];
};
