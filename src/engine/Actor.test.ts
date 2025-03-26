import { describe, test, expect, vi } from "vitest";
import { MockScene, MockActor, MockComponent } from "./test-mocks";

describe("Actor", () => {
  test("should attach and detach from a scene", () => {
    const actor = new MockActor();
    const scene = new MockScene();

    actor._attach(scene);
    expect(actor.getScene()).toBe(scene);

    actor._detach();
    expect(actor.getScene()).toBeNull();
  });

  test("should call onActivate and onDeactivate", () => {
    const actor = new MockActor();

    actor._enable();
    expect(actor.onEnable).toHaveBeenCalled();

    actor._disable();
    expect(actor.onDisable).toHaveBeenCalled();
  });

  test("should add and remove components correctly", () => {
    const actor = new MockActor();
    const component = new MockComponent();

    expect(actor.getAllComponents().size).toBe(0);

    actor.attachComponent(component);
    expect(actor.getAllComponents().size).toBe(1);
    expect(component.onAttach).toHaveBeenCalled();

    actor.detachComponent(component);
    expect(actor.getAllComponents().size).toBe(0);
    expect(component.onDetach).toHaveBeenCalled();
  });

  test("should emit componentAttached and componentDetached events", () => {
    const actor = new MockActor();
    const component = new MockComponent();

    const attachedListener = vi.fn();
    const detachedListener = vi.fn();

    actor.on("componentAttached", attachedListener);
    actor.on("componentDetached", detachedListener);

    actor.attachComponent(component);
    expect(attachedListener).toHaveBeenCalledWith(actor, component);

    actor.detachComponent(component);
    expect(detachedListener).toHaveBeenCalledWith(actor, component);
  });

  test("should attach to a new scene and detach from the old scene", () => {
    const actor = new MockActor();
    const scene1 = new MockScene();
    const scene2 = new MockScene();

    actor._attach(scene1);
    expect(actor.getScene()).toBe(scene1);

    actor._attach(scene2);
    expect(actor.getScene()).toBe(scene2);
  });

  test("should not allow duplicate components", () => {
    const actor = new MockActor();
    const component = new MockComponent();

    actor.attachComponent(component);
    actor.attachComponent(component); // Try adding again

    expect(actor.getAllComponents().size).toBe(1);
  });

  test("should not throw error when removing a non-existent component", () => {
    const actor = new MockActor();
    const component = new MockComponent();

    expect(() => actor.detachComponent(component)).not.toThrow();
  });
});
