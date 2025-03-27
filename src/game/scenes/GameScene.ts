import { Scene } from "@e/Scene";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { AEnvironment } from "../actors/Environment";
import { AChessBoard } from "../actors/ChessBoard";
import { AChessPiece } from "../actors/ChessPiece";

export class GameScene extends Scene {
  private controls?: OrbitControls;

  constructor() {
    super();
    this.attachActor(new AEnvironment());
    this.attachActor(new AChessBoard());
    this.attachActor(new AChessPiece());
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
