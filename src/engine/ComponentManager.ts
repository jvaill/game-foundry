import { Actor } from "./Actor";
import { Component } from "./Component";
import { Constructor } from "./types";

export class ComponentManager {
  private components = new Set<Component>();
  private componentsByType = new Map<Function, Set<Component>>();

  constructor(private actor: Actor) {}

  attach(component: Component) {
    if (this.components.has(component)) {
      console.warn("ComponentManager: Component already attached");
      return;
    }

    // Detach from previous actor
    component.getActor()?.detachComponent(component);

    this.components.add(component);
    this.index(component);
    component._attach(this.actor);
  }

  detach(component: Component) {
    if (!this.components.has(component)) {
      console.warn("ComponentManager: Component not attached");
      return;
    }

    component._detach();
    this.components.delete(component);
    this.unindex(component);
  }

  forEach(callback: (component: Component) => void) {
    this.components.forEach(callback);
  }

  getAll() {
    return this.components;
  }

  has(component: Component) {
    return this.components.has(component);
  }

  hasWithType<T extends Component>(componentType: Constructor<T>) {
    return this.componentsByType.has(componentType);
  }

  getAllWithType<T extends Component>(componentType: Constructor<T>): Set<T> {
    return (this.componentsByType.get(componentType) as Set<T>) ?? new Set();
  }

  getWithType<T extends Component>(
    componentType: Constructor<T>
  ): T | undefined {
    const components = this.getAllWithType(componentType);
    return components.size > 0 ? components.values().next().value : undefined;
  }

  private index(component: Component) {
    const type = component.constructor;
    if (!this.componentsByType.has(type)) {
      this.componentsByType.set(type, new Set());
    }
    this.componentsByType.get(type)!.add(component);
  }

  private unindex(component: Component) {
    const type = component.constructor;
    const components = this.componentsByType.get(type);
    components?.delete(component);
    if (components?.size === 0) {
      this.componentsByType.delete(type);
    }
  }
}
