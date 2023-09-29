import { GameSize } from "../../types/engine/engine";
import { GameObject } from "..";

export class GameUI {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	uiContainer: HTMLDivElement;

	constructor({ height, width }: Partial<GameSize>) {
		document.body.innerHTML = `
		<div id="root">
			<div id="game" style="position: relative; ${height ? `height: ${height};` : ""} ${
				width ? `width: ${width};` : ""
			}">
				<canvas id="canvas" style="height: 100%; width: 100%;"></canvas>
				<div id="ui" style="position: absolute; height: 100%; width: 100%; top: 0; left: 0;"></div>
			</div>
		</div>`;
		const uiContainer = document.querySelector<HTMLDivElement>("#div");
		if (!uiContainer) throw new Error("javascript not supported");
		this.uiContainer = uiContainer;
		const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
		if (!canvas) throw new Error("javascript not supported");
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("javascript not supported");
		this.canvas = canvas;
		this.ctx = ctx;
	}

	initialRender = (gameObjects: GameObject[]) => {
		// Should get created in the constructor
		this.uiContainer.innerHTML = gameObjects
			.map((gameObject) => {
				if (!gameObject.component.ui || !gameObject.component.ui.renderOnStart) return;
				return gameObject.component.ui.render(gameObject);
			})
			.filter((html) => !html)
			.join();
	};

	render = (gameObject: GameObject) => {
		this.uiContainer.innerHTML += gameObject.component.ui?.render(gameObject);
	};

	clear = () => {
		const ui = document.querySelector("#ui");
		if (ui) ui.innerHTML = "";
	};
}
