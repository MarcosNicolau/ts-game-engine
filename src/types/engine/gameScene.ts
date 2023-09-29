import { GameObject } from "../../engine";
import { GameCameraComponent } from "./gameObject";

export type GameScene = {
	gameObjects: GameObject[];
	mainCamera: GameCameraComponent;
};
