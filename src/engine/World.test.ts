import { describe, test, expect, vi } from "vitest";
import { World } from "./World";
import {
  MockScene,
  MockActor,
  MockActor2,
  MockComponent,
  MockSystem,
  MockScene2,
} from "./test-mocks";

describe("World", () => {
  test("should add and remove scenes correctly", () => {
    const world = new World();
    const scene = new MockScene();

    world.attachScene(scene);
    expect(scene.onAttach).toHaveBeenCalledWith(world);

    world.detachScene(scene);
    expect(scene.onDetach).toHaveBeenCalledWith(world);
  });

  test("should not throw error when removing a non-existent scene", () => {
    const world = new World();
    const scene = new MockScene();

    expect(() => world.detachScene(scene)).not.toThrow();
  });

  test("should set active scene correctly", () => {
    const world = new World();
    const scene1 = new MockScene();
    const scene2 = new MockScene2();

    world.attachScene(scene1);
    world.attachScene(scene2);

    world.setActiveScene(scene1);
    expect(world.getActiveScene()).toBe(scene1);
    expect(scene1.onEnable).toHaveBeenCalled();

    world.setActiveScene(scene2);
    expect(scene1.onDisable).toHaveBeenCalled();
    expect(scene2.onEnable).toHaveBeenCalled();
  });

  test("should not re-enable the same scene twice", () => {
    const world = new World();
    const scene = new MockScene();

    world.attachScene(scene);
    world.setActiveScene(scene);
    world.setActiveScene(scene); // Should not call onEnable again

    expect(scene.onEnable).toHaveBeenCalledTimes(1);
  });

  test("should call update on active scene and systems", () => {
    const world = new World();
    const scene = new MockScene();
    const system = new MockSystem();

    world.attachScene(scene);
    world.setActiveScene(scene);
    world.attachSystem(system);

    world.update(16.67);

    expect(scene.onUpdate).toHaveBeenCalledWith(16.67);
    expect(system.onUpdate).toHaveBeenCalledWith(16.67);
  });

  test("should properly remove systems", () => {
    const world = new World();
    const system = new MockSystem();

    world.attachSystem(system);
    world.detachSystem(system);

    world.update(16.67);
    expect(system.onUpdate).not.toHaveBeenCalled();
  });

  test("should reset active scene when removed", () => {
    const world = new World();
    const scene = new MockScene();

    world.attachScene(scene);
    world.setActiveScene(scene);

    world.detachScene(scene);
    expect(world.getActiveScene()).toBeNull();
  });

  test("should not set an active scene that has not been added", () => {
    const world = new World();
    const scene = new MockScene();

    expect(() => world.setActiveScene(scene)).not.toThrow();
    expect(world.getActiveScene()).toBeNull();
  });

  test("should reset active scene when removed", () => {
    const world = new World();
    const scene = new MockScene();

    world.attachScene(scene);
    world.setActiveScene(scene);
    expect(world.getActiveScene()).toBe(scene);

    world.detachScene(scene);
    expect(world.getActiveScene()).toBeNull();
  });

  test("should update systems even if no active scene is set", () => {
    const world = new World();
    const system = new MockSystem();

    world.attachSystem(system);
    world.update(16.67);

    expect(system.onUpdate).toHaveBeenCalledWith(16.67);
  });

  test("should correctly remove systems and not call update on removed ones", () => {
    const world = new World();
    const system1 = new MockSystem();
    const system2 = new MockSystem();

    world.attachSystem(system1);
    world.attachSystem(system2);

    world.detachSystem(system1);
    world.update(16.67);

    expect(system1.onUpdate).not.toHaveBeenCalled();
    expect(system2.onUpdate).toHaveBeenCalledWith(16.67);
  });

  test("should correctly handle multiple scenes switching rapidly", () => {
    const world = new World();
    const scene1 = new MockScene();
    const scene2 = new MockScene2();

    world.attachScene(scene1);
    world.attachScene(scene2);

    world.setActiveScene(scene1);
    world.setActiveScene(scene2);
    world.setActiveScene(scene1);

    expect(scene1.onEnable).toHaveBeenCalledTimes(2);
    expect(scene1.onDisable).toHaveBeenCalledTimes(1);
    expect(scene2.onEnable).toHaveBeenCalledTimes(1);
    expect(scene2.onDisable).toHaveBeenCalledTimes(1);
  });

  test("should not call update on a removed scene", () => {
    const world = new World();
    const scene = new MockScene();

    world.attachScene(scene);
    world.setActiveScene(scene);
    world.detachScene(scene);

    world.update(16.67);
    expect(scene.onUpdate).not.toHaveBeenCalled();
  });

  test("should attach and detach scenes correctly", () => {
    const world = new World();
    const scene = new MockScene();

    world.attachScene(scene);
    expect(scene.onAttach).toHaveBeenCalledWith(world);

    world.detachScene(scene);
    expect(scene.onDetach).toHaveBeenCalledWith(world);
  });

  test("should switch active scenes correctly and trigger lifecycle hooks", () => {
    const world = new World();
    const scene1 = new MockScene();
    const scene2 = new MockScene2();

    world.attachScene(scene1);
    world.attachScene(scene2);

    world.setActiveScene(scene1);
    expect(scene1.onEnable).toHaveBeenCalled();
    expect(scene2.onEnable).not.toHaveBeenCalled();

    world.setActiveScene(scene2);
    expect(scene1.onDisable).toHaveBeenCalled();
    expect(scene2.onEnable).toHaveBeenCalled();
  });

  test("should add actors to a scene and trigger lifecycle hooks", () => {
    const world = new World();
    const scene = new MockScene();
    const actor = new MockActor();

    world.attachScene(scene);
    world.setActiveScene(scene);
    scene.attachActor(actor);

    expect(actor.onAttach).toHaveBeenCalledWith(scene);

    world.setActiveScene(null);
    expect(actor.onDisable).toHaveBeenCalled();
  });

  test("should add components to an actor and trigger lifecycle hooks", () => {
    const world = new World();
    const scene = new MockScene();
    const actor = new MockActor();
    const component = new MockComponent();

    world.attachScene(scene);
    world.setActiveScene(scene);
    scene.attachActor(actor);
    actor.attachComponent(component);

    expect(component.onAttach).toHaveBeenCalledWith(actor);

    world.setActiveScene(null);
    expect(component.onDisable).toHaveBeenCalled();
  });

  test("should remove actors and components properly and trigger detach hooks", () => {
    const world = new World();
    const scene = new MockScene();
    const actor = new MockActor();
    const component = new MockComponent();

    world.attachScene(scene);
    world.setActiveScene(scene);
    scene.attachActor(actor);
    actor.attachComponent(component);

    scene.detachActor(actor);

    expect(actor.onDetach).toHaveBeenCalledWith(scene);
  });

  test("should add and remove systems correctly and trigger lifecycle hooks", () => {
    const world = new World();
    const system = new MockSystem();

    world.attachSystem(system);
    expect(system.onAttach).toHaveBeenCalledWith(world);

    world.detachSystem(system);
    expect(system.onDetach).toHaveBeenCalledWith(world);
  });

  test("should call update on active scene and all systems", () => {
    const world = new World();
    const scene = new MockScene();
    const system = new MockSystem();

    world.attachScene(scene);
    world.setActiveScene(scene);
    world.attachSystem(system);

    world.update(16.67);

    expect(scene.onUpdate).toHaveBeenCalledWith(16.67);
    expect(system.onUpdate).toHaveBeenCalledWith(16.67);
  });

  test("should handle rapid scene switching correctly", () => {
    const world = new World();
    const scene1 = new MockScene();
    const scene2 = new MockScene2();

    world.attachScene(scene1);
    world.attachScene(scene2);

    world.setActiveScene(scene1);
    world.setActiveScene(scene2);
    world.setActiveScene(scene1);

    expect(scene1.onEnable).toHaveBeenCalledTimes(2);
    expect(scene1.onDisable).toHaveBeenCalledTimes(1);
    expect(scene2.onEnable).toHaveBeenCalledTimes(1);
    expect(scene2.onDisable).toHaveBeenCalledTimes(1);
  });

  test("should remove an active scene and reset state properly", () => {
    const world = new World();
    const scene = new MockScene();

    world.attachScene(scene);
    world.setActiveScene(scene);
    world.detachScene(scene);

    expect(world.getActiveScene()).toBeNull();
  });

  test("should not throw errors when removing a non-existent scene", () => {
    const world = new World();
    const scene = new MockScene();

    expect(() => world.detachScene(scene)).not.toThrow();
  });

  test("should call onEnable on Scene, all Actors, and all Components when setting an active scene", () => {
    const world = new World();
    const scene = new MockScene();
    const actor = new MockActor();
    const component = new MockComponent();

    world.attachScene(scene);
    scene.attachActor(actor);
    actor.attachComponent(component);

    world.setActiveScene(scene);

    expect(scene.onEnable).toHaveBeenCalled();
    expect(actor.onEnable).toHaveBeenCalled();
    expect(component.onEnable).toHaveBeenCalled();
  });

  test("should call onDisable when switching scenes", () => {
    const world = new World();
    const scene1 = new MockScene();
    const scene2 = new MockScene2();
    const actor1 = new MockActor();
    const component1 = new MockComponent();

    world.attachScene(scene1);
    world.attachScene(scene2);
    scene1.attachActor(actor1);
    actor1.attachComponent(component1);

    world.setActiveScene(scene1);
    world.setActiveScene(scene2); // Switching to scene2 should deactivate scene1

    expect(scene1.onDisable).toHaveBeenCalled();
    expect(actor1.onDisable).toHaveBeenCalled();
    expect(component1.onDisable).toHaveBeenCalled();
  });

  test("should call onEnable when setting a scene as active", () => {
    const world = new World();
    const scene = new MockScene();
    const actor = new MockActor();
    const component = new MockComponent();

    world.attachScene(scene);
    scene.attachActor(actor);
    actor.attachComponent(component);

    world.setActiveScene(scene);

    expect(scene.onEnable).toHaveBeenCalled();
    expect(actor.onEnable).toHaveBeenCalled();
    expect(component.onEnable).toHaveBeenCalled();
  });

  test("should call onDisable when switching active scenes", () => {
    const world = new World();
    const scene1 = new MockScene();
    const scene2 = new MockScene2();
    const actor1 = new MockActor();
    const component1 = new MockComponent();

    world.attachScene(scene1);
    world.attachScene(scene2);
    scene1.attachActor(actor1);
    actor1.attachComponent(component1);

    world.setActiveScene(scene1);
    world.setActiveScene(scene2); // Switching to scene2 should deactivate scene1

    expect(scene1.onDisable).toHaveBeenCalled();
    expect(actor1.onDisable).toHaveBeenCalled();
    expect(component1.onDisable).toHaveBeenCalled();
  });

  test("should handle dynamically added actors to an active scene", () => {
    const world = new World();
    const scene = new MockScene();
    const actor = new MockActor();

    world.attachScene(scene);
    world.setActiveScene(scene);

    scene.attachActor(actor); // Actor is added after the scene is already active

    expect(actor.onAttach).toHaveBeenCalledWith(scene);
    expect(actor.onEnable).toHaveBeenCalled(); // Actor should receive activation immediately
  });

  test("should handle dynamically added components to an active actor", () => {
    const world = new World();
    const scene = new MockScene();
    const actor = new MockActor();
    const component = new MockComponent();

    world.attachScene(scene);
    world.setActiveScene(scene);
    scene.attachActor(actor);

    actor.attachComponent(component); // Component is added after the actor is already active

    expect(component.onAttach).toHaveBeenCalledWith(actor);
    expect(component.onEnable).toHaveBeenCalled(); // Component should receive activation immediately
  });

  test("should not call lifecycle methods multiple times on redundant operations", () => {
    const world = new World();
    const scene = new MockScene();

    world.attachScene(scene);
    world.setActiveScene(scene);
    world.setActiveScene(scene); // Redundant

    expect(scene.onEnable).toHaveBeenCalledTimes(1);

    world.detachScene(scene);
    world.detachScene(scene); // Redundant

    expect(scene.onDetach).toHaveBeenCalledTimes(1);
  });

  test("should handle removing an active scene properly", () => {
    const world = new World();
    const scene = new MockScene();
    const actor = new MockActor();
    const component = new MockComponent();

    world.attachScene(scene);
    world.setActiveScene(scene);
    scene.attachActor(actor);
    actor.attachComponent(component);

    world.detachScene(scene);

    expect(scene.onDisable).toHaveBeenCalled();
    expect(actor.onDisable).toHaveBeenCalled();
    expect(component.onDisable).toHaveBeenCalled();
    expect(world.getActiveScene()).toBeNull();
  });

  test("onDisable should be called before onDetach when removing an actor from an active scene", () => {
    const world = new World();
    const scene = new MockScene();
    const actor = new MockActor();

    world.attachScene(scene);
    world.setActiveScene(scene);
    scene.attachActor(actor);
    scene.detachActor(actor);

    expect(actor.onDisable as any).toHaveBeenCalledBefore(
      actor.onDetach as any
    );
  });

  test("onDisable should be called before onDetach when removing a component from an active actor", () => {
    const world = new World();
    const scene = new MockScene();
    const actor = new MockActor();
    const component = new MockComponent();

    world.attachScene(scene);
    world.setActiveScene(scene);
    scene.attachActor(actor);
    actor.attachComponent(component);
    actor.detachComponent(component);

    expect(component.onDisable as any).toHaveBeenCalledBefore(
      component.onDetach as any
    );
  });

  test("onDisable should be called before onDetach when removing an active scene from the world", () => {
    const world = new World();
    const scene = new MockScene();

    world.attachScene(scene);
    world.setActiveScene(scene);
    world.detachScene(scene);

    expect(scene.onDisable as any).toHaveBeenCalledBefore(
      scene.onDetach as any
    );
  });

  test("Switching scenes should disable all actors and components", () => {
    const world = new World();
    const scene1 = new MockScene();
    const scene2 = new MockScene2();
    const actor = new MockActor();
    const component = new MockComponent();

    world.attachScene(scene1);
    world.attachScene(scene2);
    scene1.attachActor(actor);
    actor.attachComponent(component);

    world.setActiveScene(scene1);
    world.setActiveScene(scene2); // Switching to scene2 should disable scene1's actors and components

    expect(scene1.onDisable).toHaveBeenCalled();
    expect(actor.onDisable).toHaveBeenCalled();
    expect(component.onDisable).toHaveBeenCalled();
  });

  test("Removing an actor from an inactive scene should not call onDisable", () => {
    const scene = new MockScene();
    const actor = new MockActor();

    scene.attachActor(actor); // Scene is inactive
    scene.detachActor(actor);

    expect(actor.onDisable).not.toHaveBeenCalled();
    expect(actor.onDetach).toHaveBeenCalled();
  });

  test("Removing a component from an inactive actor should not call onDisable", () => {
    const scene = new MockScene();
    const actor = new MockActor();
    const component = new MockComponent();

    scene.attachActor(actor);
    actor.attachComponent(component);
    scene.detachActor(actor); // Actor is inactive now
    actor.detachComponent(component);

    expect(component.onDisable).not.toHaveBeenCalled();
    expect(component.onDetach).toHaveBeenCalled();
  });

  test("Rapidly removing and re-adding an actor should not break lifecycle order", () => {
    const world = new World();
    const scene = new MockScene();
    const actor = new MockActor();

    world.attachScene(scene);
    world.setActiveScene(scene);
    scene.attachActor(actor);
    scene.detachActor(actor);
    scene.attachActor(actor);

    expect(actor.onDisable as any).toHaveBeenCalledBefore(
      actor.onDetach as any
    );
    expect(actor.onAttach).toHaveBeenCalledTimes(2);
  });

  test("Rapidly switching scenes should correctly call onDisable before onDetach for all actors", () => {
    const world = new World();
    const scene1 = new MockScene();
    const scene2 = new MockScene2();
    const actor1 = new MockActor();
    const actor2 = new MockActor2();

    world.attachScene(scene1);
    world.attachScene(scene2);
    scene1.attachActor(actor1);
    scene2.attachActor(actor2);

    world.setActiveScene(scene1);
    world.setActiveScene(scene2);
    world.setActiveScene(scene1);

    expect(actor1.onDisable).toHaveBeenCalledTimes(1);
    expect(actor2.onDisable).toHaveBeenCalledTimes(1);
    expect(actor1.onEnable).toHaveBeenCalledTimes(2);
    expect(actor2.onEnable).toHaveBeenCalledTimes(1);
  });
});

test("should call onDisable before onDetach when removing an actor mid-update", () => {
  const world = new World();
  const scene = new MockScene();
  const actor = new MockActor();

  world.attachScene(scene);
  world.setActiveScene(scene);
  scene.attachActor(actor);

  // Simulate mid-update removal
  vi.spyOn(scene, "onUpdate").mockImplementation(() => {
    scene.detachActor(actor);
  });

  world.update(16.67);

  expect(actor.onDisable).toHaveBeenCalledBefore(actor.onDetach as any);
});

test("should call onDisable before onDetach when removing a component from an active actor", () => {
  const world = new World();
  const scene = new MockScene();
  const actor = new MockActor();
  const component = new MockComponent();

  world.attachScene(scene);
  world.setActiveScene(scene);
  scene.attachActor(actor);
  actor.attachComponent(component);

  actor.detachComponent(component);

  expect(component.onDisable).toHaveBeenCalledBefore(component.onDetach as any);
});

test("should call onDisable before onDetach when switching scenes rapidly", () => {
  const world = new World();
  const scene1 = new MockScene();
  const scene2 = new MockScene2();

  world.attachScene(scene1);
  world.attachScene(scene2);
  world.setActiveScene(scene1);
  world.setActiveScene(scene2);
  world.detachScene(scene1);

  expect(scene1.onDisable).toHaveBeenCalledBefore(scene1.onDetach as any);
});

test("should not call onAttach again if a scene is already attached", () => {
  const world = new World();
  const scene = new MockScene();

  world.attachScene(scene);
  world.attachScene(scene); // Adding the same scene again should do nothing

  expect(scene.onAttach).toHaveBeenCalledTimes(1); // Should only be called once
});
