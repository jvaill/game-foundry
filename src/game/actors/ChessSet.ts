import { Actor } from "@e/Actor";
import { CChessBoard } from "../components/ChessBoard";

export class AChessSet extends Actor {
  private chessBoard: CChessBoard = new CChessBoard();

  constructor() {
    super();
    this.attachComponent(this.chessBoard);
  }
}
