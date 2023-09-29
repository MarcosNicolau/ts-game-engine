import { Position } from "./transform";

export type GameCameraComponent = {
	position: Position;
	zoom: number;
	// In degrees
	angle: number;
};
