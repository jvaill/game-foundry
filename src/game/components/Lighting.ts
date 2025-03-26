import { Component } from "@e/Component";
import { Scene } from "@e/Scene";
import { HemisphereLight } from "three";

export class CLighting extends Component {
  private light?: HemisphereLight;

  override onAttachToScene(scene: Scene) {
    this.light = new HemisphereLight(0xffffbb, 0x080820, 4);
    scene.getThreeScene().add(this.light);
  }

  override onDetachFromScene() {
    this.light!.removeFromParent();
  }
}
