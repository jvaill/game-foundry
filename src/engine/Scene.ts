import { ActorManager } from "./ActorManager";
import { SystemManager } from "./SystemManager";
import * as THREE from "three";
import { World } from "./World";
import { EnabledLifecycle } from "./Lifecycle/EnabledLifecycle";
import { AttachmentLifecycle } from "./Lifecycle/AttachmentLifecycle";
import { UpdateLifecycle } from "./Lifecycle/UpdateLifecycle";

const WorldAttachmentLifecycle = AttachmentLifecycle<World>();
const Mixins = WorldAttachmentLifecycle(
  UpdateLifecycle(EnabledLifecycle(Object))
);

export abstract class Scene extends Mixins {
  private threeScene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private am = new ActorManager(this);
  private sm = new SystemManager(this);

  getWorld() {
    return this.getAttachment();
  }

  getCamera() {
    return this.camera;
  }

  getThreeScene() {
    return this.threeScene;
  }

  attachActor = this.am.attach.bind(this.am);
  detachActor = this.am.detach.bind(this.am);
  getActors = this.am.getAll.bind(this.am);
  getActorsWithType = this.am.getWithType.bind(this.am);
  getActorsWithComponents = this.am.getWithComponents.bind(this.am);

  attachSystem = this.sm.attach.bind(this.sm);
  detachSystem = this.sm.detach.bind(this.sm);
  getSystems = this.sm.getAll.bind(this.sm);
  getSystemWithType = this.sm.getWithType.bind(this.sm);

  _updateCameraAspectRatio(aspect: number) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  protected override _onBeforeDisable() {
    this.am.forEach((a) => a._disable());
    this.sm.forEach((s) => s._disable());
  }

  protected override _onBeforeDetach() {
    if (this.isEnabled()) this._disable();
  }

  protected override _onBeforeEnable() {
    this.am.forEach((a) => a._enable());
    this.sm.forEach((s) => s._enable());
  }

  protected override _onBeforeUpdate(dt: number) {
    this.am.forEach((a) => a._update(dt));
    this.sm.forEach((s) => s._update(dt));
  }

  protected override _onBeforePostUpdate(dt: number) {
    this.am.forEach((a) => a._postUpdate(dt));
    this.sm.forEach((s) => s._postUpdate(dt));
  }
}
