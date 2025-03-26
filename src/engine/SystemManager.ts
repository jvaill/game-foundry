import { Scene } from "./Scene";
import { System } from "./System";
import { Constructor } from "./types";
import { World } from "./World";

export class SystemManager {
  private systems = new Set<System>();
  private systemByType = new Map<Function, System>();

  constructor(private worldOrScene: World | Scene) {}

  attach(system: System) {
    if (this.systems.has(system)) {
      console.warn("SystemManager: System already attached");
      return;
    }

    // Detach from previous world or scene
    system.getWorldOrScene()?.detachSystem(system);

    this.systems.add(system);
    this.systemByType.set(system.constructor, system);
    system._attach(this.worldOrScene);
  }

  detach(system: System) {
    if (!this.systems.has(system)) {
      console.warn("SystemManager: System not attached");
      return;
    }

    system._detach();
    this.systems.delete(system);
    this.systemByType.delete(system.constructor);
  }

  getAll() {
    return this.systems;
  }

  forEach(callback: (system: System) => void) {
    this.systems.forEach(callback);
  }

  has(system: System) {
    return this.systems.has(system);
  }

  hasWithType<T extends System>(systemType: Constructor<T>) {
    return this.systemByType.has(systemType);
  }

  getWithType<T extends System>(systemType: Constructor<T>): T | undefined {
    return this.systemByType.get(systemType) as T | undefined;
  }
}
