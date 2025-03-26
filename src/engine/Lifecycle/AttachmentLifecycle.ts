import { Constructor } from "@e/types";

export function AttachmentLifecycle<TAttachment>() {
  return function <TBase extends Constructor>(Base: TBase) {
    return class extends Base {
      protected onAttach?(parent: TAttachment): void;
      protected onDetach?(parent: TAttachment): void;
      protected _onBeforeAttach?(parent: TAttachment): void;
      protected _onAfterAttach?(parent: TAttachment): void;
      protected _onBeforeDetach?(parent: TAttachment): void;
      protected _onAfterDetach?(parent: TAttachment): void;

      private attachment: TAttachment | null = null;

      getAttachment() {
        return this.attachment;
      }

      isAttached() {
        return this.attachment !== null;
      }

      _attach(parent: TAttachment) {
        if (this.attachment === parent) {
          console.warn(`${this.constructor.name}: Already attached`);
          return;
        }

        if (this.attachment) this._detach();

        this._onBeforeAttach?.(parent);
        this.attachment = parent;
        this.onAttach?.(parent);
        this._onAfterAttach?.(parent);
      }

      _detach() {
        if (!this.attachment) {
          console.warn(`${this.constructor.name}: Not attached`);
          return;
        }

        const parent = this.attachment;

        this._onBeforeDetach?.(parent);
        this.onDetach?.(parent);
        this.attachment = null;
        this._onAfterDetach?.(parent);
      }
    };
  };
}
