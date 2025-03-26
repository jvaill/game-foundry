import { AssetManager, AssetType } from "@e/AssetManager";
import { Component } from "@e/Component";
import { Scene } from "@e/Scene";
import { GLTF } from "three/examples/jsm/Addons.js";

export class CChessBoard extends Component {
  // @todo: Should be supplied by Game or World.
  private assetManager: AssetManager = new AssetManager();

  private board?: GLTF;

  override async onAttachToScene(scene: Scene) {
    // @todo: Find a way to preload assets
    this.board = await this.assetManager.loadAsset({
      url: "/game/assets/board.glb",
      type: AssetType.MODEL,
    });

    // @todo: Better APIs for getting the Three scene?
    scene.getThreeScene().add(this.board!.scene);
  }

  override onDetachFromScene() {
    // @todo: Do I have to dispose of the board materials and textures?
    this.board!.scene.removeFromParent();
  }
}
