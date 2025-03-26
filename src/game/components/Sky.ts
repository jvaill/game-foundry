import { Component } from "@e/Component";
import { Scene } from "@e/Scene";
import { Sky } from "three/examples/jsm/Addons.js";
import { MathUtils, Vector3 } from "three";

export class CSky extends Component {
  private sky?: Sky;

  override onAttachToScene(scene: Scene) {
    this.sky = new Sky();
    this.sky.scale.setScalar(450000);

    const phi = MathUtils.degToRad(90);
    const theta = MathUtils.degToRad(180);
    const sunPosition = new Vector3().setFromSphericalCoords(1, phi, theta);

    this.sky.material.uniforms.sunPosition.value = sunPosition;

    scene.getThreeScene().add(this.sky);
  }

  override onDetachFromScene() {
    this.sky!.removeFromParent();
  }
}
