# 🌌 Game Foundry

A modular, extensible, and lifecycle-aware WebGL game engine built on top of [Three.js](https://threejs.org/). Designed with a clean architecture to support scalable open-world games, real-time simulations, and interactive applications.

> 🧠 Core philosophy: Composability through `Actor`s, `Component`s, and `System`s with explicit lifecycle management and full scene/world separation.

---

## 🚧 Disclaimer

Despite how the README might sound, this is a very, very, very, early game engine I've been working on. It's not really usable or useful at the moment.

---

## 🚀 Features

- **Entity-Component-System (ECS)** inspired design.
- **Actors** with modular **Components** and well-defined lifecycles.
- **Systems** for handling cross-cutting concerns across Actors.
- **Scenes** encapsulate their own actors, systems, and render state.
- **World** manages scenes and global systems.
- Three.js renderer integration out of the box.
- Asset pipeline supporting models, textures, audio, JSON, and text.
- Strong focus on extensibility and testability.

---

## 📦 Installation

This engine is not yet published to npm. To use it:

```bash
git clone https://github.com/jvaill/game-foundry.git
cd game-foundry
npm install && npm run dev
```

---

## 🧱 Core Concepts

### 🎭 `Actor`

Encapsulates logic and holds multiple components. Attached to a scene.

### 🧩 `Component`

Modular, reusable logic chunks that attach to actors. Fully lifecycle-aware.

### ⚙️ `System`

Scene- or world-level managers that update logic across actors.

### 🎬 `Scene`

Container for actors and systems. Manages its own lifecycle and render tree.

### 🌍 `World`

Owns multiple scenes and global systems. Drives game loop updates.

### 🗃 `AssetManager`

Handles model, texture, audio, JSON, and text loading with caching and transformation hooks.

---

## 🧪 Testing

Mocks are available for `System`, `Scene`, `Actor`, and `Component`, making it easy to unit test your engine extensions.

```ts
import { MockActor, MockComponent } from "@engine/test-mocks";
```

All core classes are designed with testability in mind.

---

## 🛠 Example Usage

```ts
const game = new Game({ domElement: document.getElementById("game")! });

const myScene = new MyScene();
game.attachScene(myScene);
game.setActiveScene(myScene);
game.start();
```

Define your own custom `Actor`, `Component`, and `System` classes to build your game logic. [See the game folder for an example.](/src/game/)

---

## 📁 Directory Structure

```bash
src/engine/
  ├── Game.ts              # Main game loop & renderer
  ├── World.ts             # Manages global systems and scenes
  ├── Scene.ts             # Owns actors, systems, and a Three.js scene
  ├── Actor.ts             # Entity container for components
  ├── Component.ts         # Logic unit attached to actors
  ├── System.ts            # Logic processor working across actors
  ├── AssetManager.ts      # Loads and caches assets
  └── Lifecycle/           # Composable lifecycle hooks (attach, enable, update, etc.)
```

---

# 🤝 Contributing

Contributions are welcome! Please open an issue or PR with your ideas, improvements, or bugfixes. This project is in active development and evolving rapidly.

---

# 📜 License

MIT — use it for anything, attribution appreciated.

<!--

---

# 💬 A Note from the Author

This engine is built for clarity, extensibility, and control. It's ideal for those who want a deeply customizable foundation to build 3D games or simulations from scratch. Use it, break it, fork it, and build something amazing.
-->

---

Star this repo if you like it. Contributions and feedback welcome!
