import { Constructor } from "../types";

interface EnabledLike {
  isEnabled(): boolean;
}

export function UpdateLifecycle<TBase extends Constructor<EnabledLike>>(
  Base: TBase
) {
  return class extends Base {
    protected onUpdate?(dt: number): void;
    protected onPostUpdate?(dt: number): void;
    protected _onBeforeUpdate?(dt: number): void;
    protected _onAfterUpdate?(dt: number): void;
    protected _onBeforePostUpdate?(dt: number): void;
    protected _onAfterPostUpdate?(dt: number): void;

    _update(dt: number) {
      if (!this.isEnabled()) {
        console.warn(`${this.constructor.name}: Not enabled`);
        return;
      }

      this._onBeforeUpdate?.(dt);
      this.onUpdate?.(dt);
      this._onAfterUpdate?.(dt);
    }

    _postUpdate(dt: number) {
      if (!this.isEnabled()) {
        console.warn(`${this.constructor.name}: Not enabled`);
        return;
      }

      this._onBeforePostUpdate?.(dt);
      this.onPostUpdate?.(dt);
      this._onAfterPostUpdate?.(dt);
    }
  };
}
