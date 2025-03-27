import { AssetManager, AssetType } from "@e/AssetManager";
import { Component } from "@e/Component";
import { Scene } from "@e/Scene";
import { Object3D } from "three";
import invariant from "tiny-invariant";

export class CChessBoard extends Component {
  // @todo: Should be supplied by Game or World.
  // @todo: Find a way to preload assets
  private assetManager: AssetManager = new AssetManager();

  model: Object3D | null = null;

  async loadBoardModel() {
    const models = await this.assetManager.loadAsset({
      url: "/game/assets/chess.glb",
      type: AssetType.MODEL,
    });
    invariant(models, "Failed to load models");

    const model = models.scene.getObjectByName("Board");
    invariant(model, "Failed to find model");

    return model;
  }

  override async onAttachToScene(scene: Scene) {
    this.model = await this.loadBoardModel();

    // @todo: Better APIs for getting the Three scene?
    scene.getThreeScene().add(this.model);
  }

  override onDetachFromScene() {
    invariant(this.model, "Model not loaded");

    // @todo: Do we have to dispose model materials and textures?
    this.model.removeFromParent();
  }
}
