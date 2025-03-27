import { Actor } from "@e/Actor";
import { CChessBoard } from "../components/ChessBoard";

export class AChessBoard extends Actor {
  private board: CChessBoard = new CChessBoard();

  constructor() {
    super();
    this.attachComponent(this.board);
  }
}
