import { GameObject } from "./gameObject";
import { GameUI } from "./ui";
import { GameSize, GameUIComponent, runnerFn } from "../types/engine";
import { draw } from "../utils/draw";
import { pushAtSortPosition } from "../utils/array";

export class GameEngine2d {
	ui: GameUI;
	isPaused = false;
	private uiComponents: GameUIComponent[] = [];
	private gameObjects: GameObject[] = [];
	private animationFrame = NaN;

	constructor(size: Partial<GameSize>) {
		this.ui = new GameUI(size);
	}

	private triggerRender = () => {
		this.ui.render({
			gameObjects: this.gameObjects,
			uiComponents: this.uiComponents,
			isPaused: this.isPaused,
		});
	};

	private drawGameObjects = (ctx: CanvasRenderingContext2D) => {
		ctx.clearRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
		this.gameObjects.forEach((gameObject) => {
			ctx.fillStyle = gameObject.color || "#0";
			if (gameObject.type === "Audio") return;
			draw[gameObject.type]({ ctx, gameObject });
		});
	};

	private collisions() {
		this.gameObjects.forEach((gameObject_1) => {
			if (!gameObject_1.type) return;
			this.gameObjects.forEach((gameObject_2) => {
				if (gameObject_2.id == gameObject_1.id) return;
				//Collides on the x axis
				if (gameObject_1.position.x) {
					//Collides on the y axis
					if (gameObject_1.position.y) {
						gameObject_1.onCollision({
							gameObject: gameObject_2,
							at: { x: 1, y: 1, z: 1 },
						});
					}
				}
			});
		});
	}

	private onStart = () => {
		this.triggerRender();
		if (!this.ui.canvas) return;
		const ctx = this.ui.canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas not supported");
		this.gameObjects.forEach((gameObject) => gameObject.onStart({ ctx }));
		this.drawGameObjects(ctx);
		this.animationFrame = window.setTimeout(
			() => window.requestAnimationFrame(() => this.onUpdate({ ctx })),
			60
		);
		console.log("Game started");
	};

	private onUpdate: runnerFn = (args) => {
		this.gameObjects.forEach((gameObject) => gameObject.onUpdate(args));
		const ctx = args.ctx;
		this.drawGameObjects(ctx);
		this.collisions();
		this.triggerRender();
		this.animationFrame = window.requestAnimationFrame(() => this.onUpdate(args));
	};

	private onPause = () => {
		if (!this.ui.canvas) return;
		const ctx = this.ui.canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas not supported");
		this.gameObjects.forEach((gameObject) => gameObject.onPause({ ctx }));
		this.triggerRender();
		console.log("Game paused");
	};

	//Based on the z index
	addGameObject = (gameObject: GameObject) => {
		pushAtSortPosition<GameObject>(
			this.gameObjects,
			gameObject,
			(a, b) => a.position.z - b.position.z,
			0
		);
	};

	bulkAddGameObjects = (gameObjects: GameObject[]) => {
		gameObjects.forEach((gameObject) => {
			pushAtSortPosition<GameObject>(
				this.gameObjects,
				gameObject,
				(a, b) => b.position.z - a.position.z,
				0
			);
		});
	};

	addUIComponent = (component: GameUIComponent) => {
		this.uiComponents.push(component);
	};

	bulkAddUIComponents = (components: GameUIComponent[]) => {
		components.forEach((component) => this.uiComponents.push(component));
	};

	start = this.onStart;

	pause = () => {
		window.cancelAnimationFrame(this.animationFrame);
		this.isPaused = true;
		this.onPause();
	};
}
