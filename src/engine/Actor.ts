import { TypedEmitter } from "tiny-typed-emitter";
import { Component } from "./Component";
import { ComponentManager } from "./ComponentManager";
import { Scene } from "./Scene";
import { EnabledLifecycle } from "./Lifecycle/EnabledLifecycle";
import { AttachmentLifecycle } from "./Lifecycle/AttachmentLifecycle";
import { UpdateLifecycle } from "./Lifecycle/UpdateLifecycle";

type ActorEvents = {
  componentAttached: (actor: Actor, component: Component) => void;
  componentDetached: (actor: Actor, component: Component) => void;
};

const SceneAttachment = AttachmentLifecycle<Scene>();
const Mixins = SceneAttachment(
  UpdateLifecycle(EnabledLifecycle(TypedEmitter<ActorEvents>))
);

export abstract class Actor extends Mixins {
  private cm = new ComponentManager(this);

  getScene() {
    return this.getAttachment();
  }

  getAllComponents = this.cm.getAll.bind(this.cm);
  hasComponentWithType = this.cm.hasWithType.bind(this.cm);
  getComponentsWithType = this.cm.getAllWithType.bind(this.cm);
  getComponentWithType = this.cm.getWithType.bind(this.cm);

  attachComponent(component: Component) {
    if (this.cm.has(component)) {
      console.warn("Actor: Component already attached");
      return;
    }
    this.cm.attach(component);
    this.emit("componentAttached", this, component);
  }

  detachComponent(component: Component) {
    if (!this.cm.has(component)) {
      console.warn("Actor: Component not attached");
      return;
    }
    this.cm.detach(component);
    this.emit("componentDetached", this, component);
  }

  protected override _onBeforeAttach(scene: Scene) {
    this.cm.forEach((c) => c._attachToScene(scene));
  }

  protected override _onAfterAttach(scene: Scene) {
    if (scene.isEnabled()) this._enable();
  }

  protected override _onBeforeDetach() {
    this.cm.forEach((c) => c._detachFromScene());
    if (this.isEnabled()) this._disable();
  }

  protected override _onBeforeEnable() {
    this.cm.forEach((c) => c._enable());
  }

  protected override _onBeforeDisable() {
    this.cm.forEach((c) => c._disable());
  }

  protected override _onBeforeUpdate(dt: number) {
    this.cm.forEach((c) => c._update(dt));
  }

  protected override _onBeforePostUpdate(dt: number) {
    this.cm.forEach((c) => c._postUpdate(dt));
  }
}
