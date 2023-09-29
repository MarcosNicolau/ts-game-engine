import { GameObject } from "./gameObject";
import { GameUI } from "./ui";
import { GameSize } from "../types/engine/engine";
import { draw } from "../utils/draw";
import { pushAtSortPosition } from "../utils/array";
import { GameScene } from "../types/engine/gameScene";
import { GameScriptComponent } from "../types/engine/gameObject/script";

export class GameEngine2d {
	//@ts-expect-error gets initialized but typescript is not smart enough to realize that id does it with load scene @url ./src/engine/engine.ts:22:0
	private activeScene: GameScene;
	private scenes: (() => GameScene)[] = [];
	private ui: GameUI;
	private animationFrame = NaN;
	public isPaused = false;

	constructor(
		size: Partial<GameSize>,
		{ scenes, startSceneIndex }: { scenes: (() => GameScene)[]; startSceneIndex: number }
	) {
		this.scenes = scenes;
		this.ui = new GameUI(size);
		this.loadScene(startSceneIndex);
	}

	// ======== Rendering, drawing and scene loading ========

	public loadScene = (sceneIndex: number) => {
		this.activeScene = this.scenes[sceneIndex]();
		this.ui.clear();
		this.ui.ctx.clearRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
		this.onStart();
	};

	public render = (gameObject: GameObject) => {
		this.ui.render(gameObject);
	};

	private drawGameObjects = (ctx: CanvasRenderingContext2D) => {
		ctx.clearRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
		this.activeScene.gameObjects.forEach((gameObject) => {
			draw({ ctx, gameObject });
		});
	};

	// ======== Event functions ========
	private fireGameObjectFn = (cb: (script: ReturnType<GameScriptComponent>) => void) => {
		this.activeScene.gameObjects.forEach(
			(gameObject) =>
				gameObject.component.scripts?.forEach((script) => cb(script(gameObject)))
		);
	};

	private onStart = () => {
		const ctx = this.ui.ctx;
		this.ui.initialRender(this.activeScene.gameObjects);
		this.drawGameObjects(ctx);
		this.fireGameObjectFn((script) => script.onStart({ ctx }));
		this.animationFrame = window.setTimeout(
			() => window.requestAnimationFrame(this.onUpdate),
			60
		);
		console.log("Game started");
	};

	private onUpdate = () => {
		const ctx = this.ui.ctx;
		this.fireGameObjectFn((script) => script.onUpdate({ ctx }));
		this.drawGameObjects(ctx);
		this.animationFrame = window.requestAnimationFrame(this.onUpdate);
	};

	private onPause = () => {
		this.fireGameObjectFn((script) => script.onPause({ ctx: this.ui.ctx }));
	};

	// ======== Game Objects ========

	public destroy = (gameObject: GameObject) =>
		(this.activeScene.gameObjects = this.activeScene.gameObjects.filter(
			(el) => el.id === gameObject.id
		));

	public addGameObject = (gameObject: GameObject) =>
		pushAtSortPosition<GameObject>(
			this.activeScene.gameObjects,
			gameObject,
			(a, b) => a.component.transform.position.z - b.component.transform.position.z,
			0
		);

	public bulkAddGameObjects = (gameObjects: GameObject[]) =>
		gameObjects.forEach((gameObject) => this.addGameObject(gameObject));

	start = this.onStart;

	pause = () => {
		window.cancelAnimationFrame(this.animationFrame);
		this.isPaused = true;
		this.onPause();
		console.log("Game paused");
	};

	unPause = () => {
		this.animationFrame = window.requestAnimationFrame(this.onUpdate);
		this.isPaused = false;
	};
}
