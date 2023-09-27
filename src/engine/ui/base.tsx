import React, { createContext, useContext } from "react";
import { GameObject } from "../gameObject";

type GameContext = {
	gameObjects: GameObject[];
	isPaused: boolean;
};

const GameContext = createContext<GameContext>({
	gameObjects: [],
	isPaused: false,
});

export const useGameContext = () => useContext(GameContext);

export interface GameUIProps {
	gameObjects: GameObject[];
	uiComponents: React.FC[];
	isPaused: boolean;
}

export const GameBaseUI: React.FC<GameUIProps> = ({ gameObjects, uiComponents, isPaused }) => {
	return (
		<div style={{ position: "absolute", height: "100%", width: "100%", top: 0, left: 0 }}>
			<GameContext.Provider value={{ gameObjects, isPaused }}>
				{uiComponents.map((Component, index) => (
					<Component key={index} />
				))}
			</GameContext.Provider>
		</div>
	);
};
