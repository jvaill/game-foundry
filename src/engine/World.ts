import { SystemManager } from "./SystemManager";
import { SceneManager } from "./SceneManager";

export class World {
  private sceneManager = new SceneManager(this);
  private systemManager = new SystemManager(this);

  setActiveScene = this.sceneManager.setActive.bind(this.sceneManager);
  getActiveScene = this.sceneManager.getActive.bind(this.sceneManager);
  attachScene = this.sceneManager.attach.bind(this.sceneManager);
  detachScene = this.sceneManager.detach.bind(this.sceneManager);

  attachSystem = this.systemManager.attach.bind(this.systemManager);
  detachSystem = this.systemManager.detach.bind(this.systemManager);
  getSystem = this.systemManager.getWithType.bind(this.systemManager);

  update(dt: number): void {
    for (const system of this.systemManager.getAll()) {
      system._update(dt);
    }
    this.sceneManager.getActive()?._update(dt);

    for (const system of this.systemManager.getAll()) {
      system._postUpdate(dt);
    }
    this.sceneManager.getActive()?._postUpdate(dt);
  }

  // @todo: Implement dispose?
}
