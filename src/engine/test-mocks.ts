import { vi } from "vitest";
import { Component } from "./Component";
import { Actor } from "./Actor";
import { Scene } from "./Scene";
import { System } from "./System";

export function mockSystemFactory() {
  return class extends System {
    override onAttach = vi.fn();
    override onDetach = vi.fn();
    override onEnable = vi.fn();
    override onDisable = vi.fn();
    override onUpdate = vi.fn();
    override onPostUpdate = vi.fn();
  };
}
export const MockSystem = mockSystemFactory();
export const MockSystem2 = mockSystemFactory();

export function mockSceneFactory() {
  return class extends Scene {
    override onAttach = vi.fn();
    override onDetach = vi.fn();
    override onEnable = vi.fn();
    override onDisable = vi.fn();
    override onUpdate = vi.fn();
    override onPostUpdate = vi.fn();
  };
}
export const MockScene = mockSceneFactory();
export const MockScene2 = mockSceneFactory();

export function mockActorFactory() {
  return class extends Actor {
    props = {};
    override onAttach = vi.fn();
    override onDetach = vi.fn();
    override onEnable = vi.fn();
    override onDisable = vi.fn();
    override onUpdate = vi.fn();
    override onPostUpdate = vi.fn();
  };
}
export const MockActor = mockActorFactory();
export const MockActor2 = mockActorFactory();

export function mockComponentFactory() {
  return class extends Component {
    override onAttach = vi.fn();
    override onDetach = vi.fn();
    override onEnable = vi.fn();
    override onDisable = vi.fn();
    override onUpdate = vi.fn();
    override onPostUpdate = vi.fn();
  };
}
export const MockComponent = mockComponentFactory();
export const MockComponent2 = mockComponentFactory();
