import { Root, createRoot } from "react-dom/client";
import { GameBaseUI, GameUIProps } from "./base";
import { GameSize } from "../../types/engine";

export class GameUI {
	canvas: HTMLCanvasElement;
	private root: Root;

	constructor({ height, width }: Partial<GameSize>) {
		document.body.innerHTML = `
		<div id="root">
			<div id="game" style="position: relative; ${height ? `height: ${height};` : ""} ${
			width ? `width: ${width};` : ""
		}">
				<canvas id="canvas"></canvas>
				<div id="ui"></div>
			</div>
		</div>`;
		const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
		const ui = document.querySelector("#ui");
		if (!canvas || !ui) throw new Error("javascript not supported");
		this.root = createRoot(ui);
		this.root.render(GameBaseUI({ gameObjects: [], uiComponents: [], isPaused: false }));
		this.canvas = canvas;
	}

	render = (props: Omit<GameUIProps, "canvas">) => {
		this.root.render(GameBaseUI({ ...props }));
	};
}
