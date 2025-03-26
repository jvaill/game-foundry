import { Actor } from "./Actor";
import { Scene } from "./Scene";
import { EnabledLifecycle } from "./Lifecycle/EnabledLifecycle";
import { AttachmentLifecycle } from "./Lifecycle/AttachmentLifecycle";
import { SceneAttachmentLifecycle } from "./Lifecycle/SceneAttachmentLifecycle";
import { UpdateLifecycle } from "./Lifecycle/UpdateLifecycle";

const ActorAttachment = AttachmentLifecycle<Actor>();
const Mixins = SceneAttachmentLifecycle(
  ActorAttachment(UpdateLifecycle(EnabledLifecycle(Object)))
);

export abstract class Component extends Mixins {
  getActor() {
    return this.getAttachment();
  }

  protected override _onAfterAttach(actor: Actor) {
    const scene = actor.getScene();
    if (scene) this._attachToScene(scene);
  }

  protected override _onAfterAttachToScene(scene: Scene) {
    if (scene.isEnabled()) this._enable();
  }

  protected override _onBeforeDetach() {
    if (this.isAttachedToScene()) this._detachFromScene();
  }

  protected override _onBeforeDetachFromScene() {
    if (this.isEnabled()) this._disable();
  }
}
