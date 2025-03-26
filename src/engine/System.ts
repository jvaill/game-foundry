import { Scene } from "./Scene";
import { World } from "./World";

import { EnabledLifecycle } from "./Lifecycle/EnabledLifecycle";
import { AttachmentLifecycle } from "./Lifecycle/AttachmentLifecycle";
import { UpdateLifecycle } from "./Lifecycle/UpdateLifecycle";

const WorldAttachmentLifecycle = AttachmentLifecycle<World | Scene>();
const Mixins = WorldAttachmentLifecycle(
  UpdateLifecycle(EnabledLifecycle(Object))
);

export abstract class System extends Mixins {
  getWorldOrScene() {
    return this.getAttachment();
  }

  protected override _onBeforeDetach() {
    if (this.isEnabled()) this._disable();
  }

  protected override _onAfterAttach(worldOrScene: World | Scene) {
    if (worldOrScene instanceof World || worldOrScene.isEnabled()) {
      this._enable();
    }
  }
}
