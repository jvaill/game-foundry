import { describe, test, expect, vi } from "vitest";
import { World } from "./World";
import {
  MockScene,
  MockActor,
  MockComponent,
  mockActorFactory,
  MockSystem,
} from "./test-mocks";

const AnotherActor = mockActorFactory();

describe("Scene", () => {
  test("should attach to a world", () => {
    const world = new World();
    const scene = new MockScene();

    scene._attach(world);
    expect(scene.getWorld()).toBe(world);
  });

  test("should detach from a world", () => {
    const world = new World();
    const scene = new MockScene();

    scene._attach(world);
    scene._detach();

    expect(scene.getWorld()).toBeNull();
  });

  test("should activate and deactivate correctly", () => {
    const scene = new MockScene();

    const onEnableSpy = vi.spyOn(scene, "onEnable");
    const onDisableSpy = vi.spyOn(scene, "onDisable");

    scene._enable();
    expect(onEnableSpy).toHaveBeenCalled();

    scene._disable();
    expect(onDisableSpy).toHaveBeenCalled();
  });

  test("should add and remove actors correctly", () => {
    const scene = new MockScene();
    const actor = new MockActor();

    scene.attachActor(actor);
    expect(scene.getActors().size).toBe(1);

    scene.detachActor(actor);
    expect(scene.getActors().size).toBe(0);
  });

  test("should not throw error when removing a non-existent actor", () => {
    const scene = new MockScene();
    const actor = new MockActor();

    expect(() => scene.detachActor(actor)).not.toThrow();
  });

  test("should track actors by type", () => {
    const scene = new MockScene();
    const actor1 = new MockActor();
    const actor2 = new MockActor();

    scene.attachActor(actor1);
    scene.attachActor(actor2);

    expect(scene.getActorsWithType(MockActor).size).toBe(2);
  });

  test("should track actors by component", () => {
    const scene = new MockScene();
    const actor1 = new MockActor();
    const actor2 = new AnotherActor();

    const component1 = new MockComponent();
    const component2 = new MockComponent();

    actor1.attachComponent(component1);
    actor2.attachComponent(component2);

    scene.attachActor(actor1);
    scene.attachActor(actor2);

    expect(scene.getActorsWithComponents(MockComponent).size).toBe(2);
  });

  test("should update systems and actors on update call", () => {
    const scene = new MockScene();
    const system = new MockSystem();
    const actor = new MockActor();

    const onUpdateSpy = vi.spyOn(actor, "onUpdate");

    scene.attachSystem(system);
    scene.attachActor(actor);

    scene._enable();
    scene._update(16.67);

    expect(system.onUpdate).toHaveBeenCalledWith(16.67);
    expect(onUpdateSpy).toHaveBeenCalledWith(16.67);
  });

  test("should properly remove systems", () => {
    const scene = new MockScene();
    const system = new MockSystem();

    scene.attachSystem(system);
    scene.detachSystem(system);

    scene.onUpdate(16.67);
    expect(system.onUpdate).not.toHaveBeenCalled();
  });
});
