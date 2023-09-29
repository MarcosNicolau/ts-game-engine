import { Position } from "./transform";

export type GameCameraComponent = {
	position: Omit<Position, "z">;
	zoom: number;
};
