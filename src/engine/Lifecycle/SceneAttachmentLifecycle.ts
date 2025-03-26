import { Constructor } from "@e/types";
import { Scene } from "@e/Scene";

export function SceneAttachmentLifecycle<TBase extends Constructor>(
  Base: TBase
) {
  return class extends Base {
    protected onAttachToScene?(scene: Scene): void;
    protected onDetachFromScene?(scene: Scene): void;
    protected _onBeforeAttachToScene?(scene: Scene): void;
    protected _onAfterAttachToScene?(scene: Scene): void;
    protected _onBeforeDetachFromScene?(scene: Scene): void;
    protected _onAfterDetachFromScene?(scene: Scene): void;

    private scene: Scene | null = null;

    getScene() {
      return this.scene;
    }

    isAttachedToScene() {
      return this.scene !== null;
    }

    _attachToScene(scene: Scene) {
      if (this.scene === scene) {
        console.warn(`${this.constructor.name}: Already attached to scene`);
        return;
      }

      if (this.scene) this._detachFromScene();

      this._onBeforeAttachToScene?.(scene);
      this.scene = scene;
      this.onAttachToScene?.(scene);
      this._onAfterAttachToScene?.(scene);
    }

    _detachFromScene() {
      if (!this.scene) {
        console.warn(`${this.constructor.name}: Not attached to scene`);
        return;
      }

      const scene = this.scene;
      this._onBeforeDetachFromScene?.(scene);
      this.onDetachFromScene?.(scene);
      this.scene = null;
      this._onAfterDetachFromScene?.(scene);
    }
  };
}
