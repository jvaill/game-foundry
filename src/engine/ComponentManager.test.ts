import { describe, test, expect } from "vitest";
import { ComponentManager } from "./ComponentManager";
import { mockComponentFactory, MockActor, MockComponent } from "./test-mocks";

const AnotherComponent = mockComponentFactory();

describe("ComponentManager", () => {
  test("should add and remove components correctly", () => {
    const actor = new MockActor();
    const manager = new ComponentManager(actor);
    const component = new MockComponent();

    expect(manager.getAll().size).toBe(0);

    manager.attach(component);
    expect(manager.getAll().size).toBe(1);
    expect(component.onAttach).toHaveBeenCalledWith(actor);

    manager.detach(component);
    expect(manager.getAll().size).toBe(0);
    expect(component.onDetach).toHaveBeenCalledWith(actor);
  });

  test("should handle multiple components of different types", () => {
    const actor = new MockActor();
    const manager = new ComponentManager(actor);
    const testComponent = new MockComponent();
    const anotherComponent = new AnotherComponent();

    manager.attach(testComponent);
    manager.attach(anotherComponent);

    expect(manager.getAll().size).toBe(2);
    expect(manager.hasWithType(MockComponent)).toBe(true);
    expect(manager.hasWithType(AnotherComponent)).toBe(true);

    // Test querying by type returns only components of that type
    const testComponents = manager.getAllWithType(MockComponent);
    expect(testComponents.size).toBe(1);
    expect(testComponents.has(testComponent)).toBe(true);
    expect(testComponents.has(anotherComponent)).toBe(false);
  });

  test("should not add the same component multiple times", () => {
    const actor = new MockActor();
    const manager = new ComponentManager(actor);
    const component = new MockComponent();

    manager.attach(component);
    manager.attach(component); // Try adding again

    expect(manager.getAll().size).toBe(1);
  });

  test("should not throw error when removing a non-existent component", () => {
    const actor = new MockActor();
    const manager = new ComponentManager(actor);
    const component = new MockComponent();

    expect(() => manager.detach(component)).not.toThrow();
  });

  test("should check for component existence", () => {
    const actor = new MockActor();
    const manager = new ComponentManager(actor);
    const component = new MockComponent();

    expect(manager.has(component)).toBe(false);

    manager.attach(component);
    expect(manager.has(component)).toBe(true);
  });

  test("should query components by type", () => {
    const actor = new MockActor();
    const manager = new ComponentManager(actor);
    const component = new MockComponent();

    expect(manager.hasWithType(MockComponent)).toBe(false);

    manager.attach(component);
    expect(manager.hasWithType(MockComponent)).toBe(true);

    const retrievedComponents = manager.getAllWithType(MockComponent);
    expect(retrievedComponents.size).toBe(1);
    expect(retrievedComponents.has(component)).toBe(true);
  });
});
