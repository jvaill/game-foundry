import { Scene } from "@e/Scene";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { AEnvironment } from "../actors/Environment";
import { AChessSet } from "../actors/ChessSet";

export class PlayChessScene extends Scene {
  private controls?: OrbitControls;

  constructor() {
    super();
    this.attachActor(new AEnvironment());
    this.attachActor(new AChessSet());
  }

  override onAttach() {
    this.getCamera().position.set(25, 20, 50);

    // @todo: Find a way to get this
    const domElement = document.getElementById("game");
    this.controls = new OrbitControls(this.getCamera(), domElement);
  }

  override onDetach() {
    this.controls!.dispose();
  }
}
