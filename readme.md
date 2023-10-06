# Simple ts game engine

This a simple game engine I built for my own needs for a game but ended up being quite helpful and now it's being shipped as a separate library :)

## Roadmap/To-do

This engine works under the HTML Canvas, for know only for 2d games. Anyway, we are planning to support 3d with the use of three.js.

-   [x] Create GameScript
-   [x] Create GameUIComponent
-   [x] Create GameScene
-   [ ] Re-do the entire engine:
    -   [x] Render ui (ditch react completely and ui should get updated through scripting)
    -   [x] Scene loading, transition, etc
    -   [x] Dynamically add and destroy GameObject
    -   [x] Trigger framing functions
    -   [x] make gameObjects private and access them with a getter that finds by id or tag or name
    -   [x] Draw to canvas (camera and spritesRenderers)
    -   [x] Trigger collisions events
    -   [ ] Create some kind of event emitter
    -   [ ] Create some kind of state management
    -   [ ] Create a transform relative to another object
-   [ ] Add Input(controls) API
-   [ ] Add AudioSource Component
-   [ ] Add ui auto re rendering and all that (follow kinda what [redom](https://github.com/redom/redom) does)
-   [ ] Add Animated sprite renderer (custom shapes, etc) Component
-   [ ] Camera zoom feature (will have to move all the positions relative to the camera position and zoom)
-   [ ] Add elliptic and rectangular elliptic collisions (will have to move all the positions relative to the camera position and zoom)
-   [ ] Create an example
-   [ ] TileMaps Component
-   [ ] RigidBody physics
-   [ ] Local saving API
-   [ ] Some kind of Network API (Support for React query, base fetch)

To build the different apis we are following the vocabulary and flow of unity. That is why it is a good idea to read their documentation and watch videos about the specific of the work in unity.

Also, a lot of the things that are being built could be much better in terms of performance. For now we are sticking to make everything work and later we'll see how to optimize it all.

Here I am writing the things that we could improve in terms of API/performance/design but work alright(so that we don't forget)

-   **GameObjectsDrawing**: Should put the gameobjects to render in a separated array.
