import { Actor } from "./Actor";
import { Component } from "./Component";
import { Constructor } from "./types";
import { Scene } from "./Scene";

export class ActorManager {
  private actors = new Set<Actor>();
  private actorsByType = new Map<Function, Set<Actor>>();
  private actorsByComponent = new Map<Function, Set<Actor>>();

  constructor(private scene: Scene) {}

  attach(actor: Actor): void {
    if (this.actors.has(actor)) {
      console.warn("ActorManager: Actor already added");
      return;
    }

    // Detach from previous scene
    actor.getScene()?.detachActor(actor);

    this.actors.add(actor);
    this.index(actor);
    this.indexComponents(actor);

    // Subscribe to actor component changes for indexing
    actor.on("componentAttached", this.handleComponentAttached);
    actor.on("componentDetached", this.handleComponentDetached);

    actor._attach(this.scene);
  }

  detach(actor: Actor): void {
    if (!this.actors.has(actor)) {
      console.warn("ActorManager: Actor not found");
      return;
    }

    actor._detach();

    actor.off("componentAttached", this.handleComponentAttached);
    actor.off("componentDetached", this.handleComponentDetached);

    this.actors.delete(actor);
    this.unindex(actor);
    this.unindexComponents(actor);
  }

  forEach(callback: (actor: Actor) => void) {
    this.actors.forEach(callback);
  }

  getAll() {
    return this.actors;
  }

  getWithType<T extends Actor>(actorType: Constructor<T>): Set<T> {
    return (this.actorsByType.get(actorType) as Set<T>) ?? new Set();
  }

  getWithComponents<T extends Component>(
    ...componentTypes: Constructor<T>[]
  ): Set<Actor> {
    let result: Actor[] | null = null;

    for (const componentType of componentTypes) {
      const actorsWithComponent = this.actorsByComponent.get(componentType);

      // Return early if no actors have this component
      if (!actorsWithComponent) {
        return new Set();
      }

      if (result === null) {
        result = [...actorsWithComponent];
      } else {
        result = result.filter((actor) => actorsWithComponent.has(actor));
      }
    }

    return new Set(result);
  }

  private index(actor: Actor) {
    const type = actor.constructor;
    if (!this.actorsByType.has(type)) {
      this.actorsByType.set(type, new Set());
    }
    this.actorsByType.get(type)!.add(actor);
  }

  private unindex(actor: Actor) {
    const type = actor.constructor;
    const actors = this.actorsByType.get(type);
    actors?.delete(actor);
    if (actors?.size === 0) {
      this.actorsByType.delete(type);
    }
  }

  private indexComponent(actor: Actor, component: Component) {
    const type = component.constructor;
    if (!this.actorsByComponent.has(type)) {
      this.actorsByComponent.set(type, new Set());
    }
    this.actorsByComponent.get(type)!.add(actor);
  }

  private unindexComponent(actor: Actor, component: Component) {
    const type = component.constructor;
    const actors = this.actorsByComponent.get(type);
    actors?.delete(actor);
    if (actors?.size === 0) {
      this.actorsByComponent.delete(type);
    }
  }

  private indexComponents(actor: Actor) {
    for (const component of actor.getAllComponents()) {
      this.indexComponent(actor, component);
    }
  }

  private unindexComponents(actor: Actor) {
    for (const component of actor.getAllComponents()) {
      this.unindexComponent(actor, component);
    }
  }

  private handleComponentAttached = (
    actor: Actor,
    component: Component
  ): void => {
    this.indexComponent(actor, component);
  };

  private handleComponentDetached = (
    actor: Actor,
    component: Component
  ): void => {
    this.unindexComponent(actor, component);
  };
}
