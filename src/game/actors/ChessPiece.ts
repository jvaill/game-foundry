import { Actor } from "@e/Actor";
import { CChessPiece } from "../components/ChessPiece";

export class AChessPiece extends Actor {
  private piece: CChessPiece = new CChessPiece("King");

  constructor() {
    super();
    this.attachComponent(this.piece);
  }
}
