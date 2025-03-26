import { World } from "./World";
import { Scene } from "./Scene";

export class SceneManager {
  private scenes = new Set<Scene>();
  private activeScene: Scene | null = null;

  constructor(private world: World) {}

  getActive(): Scene | null {
    return this.activeScene;
  }

  attach(scene: Scene) {
    if (this.scenes.has(scene)) {
      console.warn("SceneManager: Scene already attached");
      return;
    }

    // Detach from previous world
    scene.getWorld()?.detachScene(scene);

    this.scenes.add(scene);
    scene._attach(this.world);
  }

  detach(scene: Scene) {
    if (!this.scenes.has(scene)) {
      console.warn("SceneManager: Scene not attached");
      return;
    }

    scene._detach();
    this.scenes.delete(scene);
    this.activeScene = null;
  }

  setActive(scene: Scene | null) {
    if (this.activeScene === scene) {
      console.warn("SceneManager: Scene already active");
      return;
    }

    if (scene && !this.scenes.has(scene)) {
      console.warn("SceneManager: Scene not attached");
      return;
    }

    // Disable previous scene
    if (this.activeScene?.isEnabled()) this.activeScene._disable();

    this.activeScene = scene;
    scene?._enable();
  }

  getAll() {
    return this.scenes;
  }
}
