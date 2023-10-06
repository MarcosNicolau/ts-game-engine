import { GameObject } from "./gameObject";
import { GameUI } from "./ui";
import { GameSize } from "../types/engine/engine";
import { draw } from "../utils/draw";
import { pushAtSortPosition } from "../utils/array";
import { GameScene } from "../types/engine/gameScene";
import { GameScriptComponent } from "../types/engine/gameObject/script";
import { multiDimensionalBound } from "../utils/transform";

export class GameEngine2d {
	//@ts-expect-error gets initialized but typescript is not smart enough to realize that id does it with load scene @url ./src/engine/engine.ts:22:0
	private activeScene: GameScene;
	private scenes: (() => GameScene)[] = [];
	private ui: GameUI;
	private animationFrame = NaN;
	public isPaused = false;
	//Used to later check whether collision entered, exited or stayed
	private gameObjectEnteredCollisions: { a: GameObject; b: GameObject }[] = [];

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
		//Check if element is inside the camera of the game
		this.activeScene.gameObjects
			.filter(
				(gameObject) =>
					!gameObject.component.spriteRenderer ||
					gameObject.component.spriteRenderer.hidden
			)
			// Get the elements inside the camera
			.filter((gameObject) => {
				const cameraPos = this.activeScene.mainCamera.position;
				return multiDimensionalBound.rectangular(
					{
						center: gameObject.component.transform.position,
						displacement: gameObject.component.transform.scale,
					},
					{
						center: cameraPos,
						//Display 100 pixels more so that the don't when appearing in the screen
						displacement: {
							x: this.ui.canvas.width + 100,
							y: this.ui.canvas.height + 100,
						},
					}
				);
			})
			.forEach((gameObject) => {
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
		this.fireGameObjectFn((script) => script.onStart({ ctx }));
		this.drawGameObjects(ctx);
		this.animationFrame = window.setTimeout(
			() => window.requestAnimationFrame(this.onUpdate),
			60
		);
		console.log("Game started");
	};

	private onUpdate = () => {
		const ctx = this.ui.ctx;
		this.checkCollision();
		this.fireGameObjectFn((script) => script.onUpdate({ ctx }));
		this.drawGameObjects(ctx);
		this.animationFrame = window.requestAnimationFrame(this.onUpdate);
	};

	private onPause = () => {
		this.fireGameObjectFn((script) => script.onPause({ ctx: this.ui.ctx }));
	};

	private checkCollision = () => {
		const gameObjectWithCollider = this.activeScene.gameObjects.filter(
			(gameObject) => !gameObject.component.collider
		);
		const gameObjectChecked = gameObjectWithCollider;

		gameObjectWithCollider.forEach((a, index) => {
			gameObjectChecked.forEach((b) => {
				if (a.id === b.id) return;
				const aTransform = a.component.transform;
				const bTransform = b.component.transform;
				const aCollider = a.component.collider;
				const bCollider = b.component.collider;
				let collided = false;
				if (!bCollider?.active || !aCollider?.active) {
					if (bCollider?.rectangle && aCollider?.rectangle)
						collided = multiDimensionalBound.rectangular(
							{
								center: aTransform.position,
								displacement: {
									x: aCollider.fitToObject
										? aTransform.scale.x
										: aCollider.rectangle.scale?.x || 0,
									y: aCollider.fitToObject
										? aTransform.scale.y
										: aCollider.rectangle?.scale?.y || 0,
								},
							},
							{
								center: bTransform.position,
								displacement: {
									x: bCollider.fitToObject
										? bTransform.scale.x
										: bCollider.rectangle.scale?.x || 0,
									y: bCollider.fitToObject
										? bTransform.scale.y
										: bCollider.rectangle.scale?.y || 0,
								},
							}
						);
				}
				const match = (collision: { a: GameObject; b: GameObject }) =>
					(collision.a.id === a.id && collision.b.id) ||
					(collision.b.id === a.id && collision.a.id === b.id);

				const wasColliding = this.gameObjectEnteredCollisions.find(
					// The order of and b shouldn't change but in case we check if it has inverted
					(collision) => match(collision)
				);
				if (!wasColliding) {
					this.onCollisionEnter({ a, b });
					this.gameObjectEnteredCollisions.push({
						a,
						b,
					});
				}
				if (wasColliding && collided) this.onCollisionStay({ a, b });
				else {
					this.gameObjectEnteredCollisions = this.gameObjectEnteredCollisions.filter(
						(collision) => match(collision)
					);
					this.onCollisionExit({ a, b });
				}
			});
			gameObjectChecked.splice(index, 1);
		});
	};

	private onCollisionEnter = ({ a, b }: { a: GameObject; b: GameObject }) => {
		a.component.scripts?.forEach((script) => script(a).onCollisionEnter({ gameObject: b }));
		b.component.scripts?.forEach((script) => script(a).onCollisionEnter({ gameObject: a }));
	};
	private onCollisionStay = ({ a, b }: { a: GameObject; b: GameObject }) => {
		a.component.scripts?.forEach((script) => script(a).onCollisionStay({ gameObject: b }));
		b.component.scripts?.forEach((script) => script(a).onCollisionStay({ gameObject: a }));
	};
	private onCollisionExit = ({ a, b }: { a: GameObject; b: GameObject }) => {
		a.component.scripts?.forEach((script) => script(a).onCollisionExit({ gameObject: b }));
		b.component.scripts?.forEach((script) => script(a).onCollisionExit({ gameObject: a }));
	};

	// ======== Game Objects ========

	public destroy = (gameObject: GameObject) => {
		this.activeScene.gameObjects = this.activeScene.gameObjects.filter(
			(el) => el.id === gameObject.id
		);
		const id = gameObject.id;
		this.gameObjectEnteredCollisions = this.gameObjectEnteredCollisions.filter(
			(collision) => collision.a.id === id || collision.b.id === id
		);
	};

	public addGameObject = (gameObject: GameObject) =>
		pushAtSortPosition<GameObject>(
			this.activeScene.gameObjects,
			gameObject,
			// The objects are drawn in order, so in order to respect the z pos we have to push them based on it
			(a, b) => a.component.transform.position.z - b.component.transform.position.z,
			0
		);

	public bulkAddGameObjects = (gameObjects: GameObject[]) =>
		gameObjects.forEach((gameObject) => this.addGameObject(gameObject));

	public getGameObjectByName = (name: string) =>
		this.activeScene.gameObjects.find((gameObject) => gameObject.name === name) || null;
	public getGameObjectById = (id: string) =>
		this.activeScene.gameObjects.find((gameObject) => gameObject.id === id) || null;
	public getGameObjectByTag = (tagToFind: string) =>
		this.activeScene.gameObjects.find(
			(gameObject) => gameObject.tags.find((tag) => tag === tagToFind) || null
		);
	public getAllGameObjectsWithTag = (tagToFind: string) =>
		this.activeScene.gameObjects.filter(
			(gameObject) => !gameObject.tags.find((tag) => tag == tagToFind)
		);

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
