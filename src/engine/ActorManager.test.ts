import { describe, test, expect, vi } from "vitest";
import { ActorManager } from "./ActorManager";
import {
  mockActorFactory,
  MockScene,
  MockActor,
  MockComponent,
  mockComponentFactory,
} from "./test-mocks";

const AnotherActor = mockActorFactory();
const AnotherComponent = mockComponentFactory();

describe("ActorManager", () => {
  test("should add and remove actors correctly", () => {
    const scene = new MockScene();
    const manager = new ActorManager(scene);
    const actor = new MockActor();

    expect(manager.getAll().size).toBe(0);

    manager.attach(actor);
    expect(manager.getAll().size).toBe(1);
    expect(actor.getScene()).toBe(scene);

    manager.detach(actor);
    expect(manager.getAll().size).toBe(0);
    expect(actor.getScene()).toBeNull();
  });

  test("should not add the same actor multiple times", () => {
    const scene = new MockScene();
    const manager = new ActorManager(scene);
    const actor = new MockActor();

    manager.attach(actor);
    manager.attach(actor); // Try adding again

    expect(manager.getAll().size).toBe(1);
  });

  test("should properly track actors by type", () => {
    const scene = new MockScene();
    const manager = new ActorManager(scene);
    const actor1 = new MockActor();
    const actor2 = new AnotherActor();

    manager.attach(actor1);
    manager.attach(actor2);

    expect(manager.getWithType(MockActor).size).toBe(1);
    expect(manager.getWithType(AnotherActor).size).toBe(1);

    manager.detach(actor1);
    expect(manager.getWithType(MockActor).size).toBe(0);
  });

  test("should properly track actors by component type", () => {
    const scene = new MockScene();
    const manager = new ActorManager(scene);
    const actor1 = new MockActor();
    const actor2 = new AnotherActor();

    const component1 = new MockComponent();
    const component2 = new AnotherComponent();

    actor1.attachComponent(component1);
    actor2.attachComponent(component2);

    manager.attach(actor1);
    manager.attach(actor2);

    expect(manager.getWithComponents(MockComponent).size).toBe(1);
    expect(manager.getWithComponents(AnotherComponent).size).toBe(1);
  });

  test("should update actors when their components change", () => {
    const scene = new MockScene();
    const manager = new ActorManager(scene);
    const actor = new MockActor();
    const component = new MockComponent();

    manager.attach(actor);
    expect(manager.getWithComponents(MockComponent).size).toBe(0);

    actor.attachComponent(component);
    expect(manager.getWithComponents(MockComponent).size).toBe(1);

    actor.detachComponent(component);
    expect(manager.getWithComponents(MockComponent).size).toBe(0);
  });

  test("should call onDetach when actors are removed", () => {
    const scene = new MockScene();
    const manager = new ActorManager(scene);
    const actor = new MockActor();

    const onDetachSpy = vi.spyOn(actor, "onDetach");

    manager.attach(actor);
    manager.detach(actor);

    expect(onDetachSpy).toHaveBeenCalledWith(scene);
  });

  test("should not throw an error when removing an actor that was never added", () => {
    const scene = new MockScene();
    const manager = new ActorManager(scene);
    const actor = new MockActor();

    expect(() => manager.detach(actor)).not.toThrow();
  });

  test("should properly reindex an actor after being removed and re-added", () => {
    const scene = new MockScene();
    const manager = new ActorManager(scene);
    const actor = new MockActor();

    manager.attach(actor);
    manager.detach(actor);
    manager.attach(actor);

    expect(manager.getAll().size).toBe(1);
  });

  test("should correctly track multiple actors with the same component", () => {
    const scene = new MockScene();
    const manager = new ActorManager(scene);
    const actor1 = new MockActor();
    const actor2 = new AnotherActor();
    const component1 = new MockComponent();
    const component2 = new MockComponent();

    actor1.attachComponent(component1);
    actor2.attachComponent(component2);

    manager.attach(actor1);
    manager.attach(actor2);

    expect(manager.getWithComponents(MockComponent).size).toBe(2);
  });

  test("should update component queries when a component is added/removed dynamically", () => {
    const scene = new MockScene();
    const manager = new ActorManager(scene);
    const actor = new MockActor();
    const component = new MockComponent();

    manager.attach(actor);
    expect(manager.getWithComponents(MockComponent).size).toBe(0);

    actor.attachComponent(component);
    expect(manager.getWithComponents(MockComponent).size).toBe(1);

    actor.detachComponent(component);
    expect(manager.getWithComponents(MockComponent).size).toBe(0);
  });

  test("should not call onDetach twice if an actor is removed multiple times", () => {
    const scene = new MockScene();
    const manager = new ActorManager(scene);
    const actor = new MockActor();

    const onDetachSpy = vi.spyOn(actor, "onDetach");

    manager.attach(actor);
    manager.detach(actor);
    manager.detach(actor); // Removing twice should not call onDetach again

    expect(onDetachSpy).toHaveBeenCalledTimes(1);
  });
});
