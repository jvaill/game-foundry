import { Constructor } from "@e/types";

export function EnabledLifecycle<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    protected onEnable?(): void;
    protected onDisable?(): void;
    protected _onBeforeEnable?(): void;
    protected _onAfterEnable?(): void;
    protected _onBeforeDisable?(): void;
    protected _onAfterDisable?(): void;

    private enabled = false;

    isEnabled() {
      return this.enabled;
    }

    _enable() {
      if (this.enabled) {
        console.warn(`${this.constructor.name}: Already enabled`);
        return;
      }

      this._onBeforeEnable?.();
      this.enabled = true;
      this.onEnable?.();
      this._onAfterEnable?.();
    }

    _disable() {
      if (!this.enabled) {
        console.warn(`${this.constructor.name}: Not enabled`);
        return;
      }

      this._onBeforeDisable?.();
      this.onDisable?.();
      this.enabled = false;
      this._onAfterDisable?.();
    }
  };
}
