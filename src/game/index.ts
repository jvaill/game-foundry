import { Game } from "@e/Game";
import { PlayChessScene } from "./scenes/PlayChessScene";

const domElement = document.getElementById("game");
if (!domElement) {
  throw new Error("Game element not found");
}

const game = new Game({
  domElement,
});

// Create and attach our first-person scene
const fpScene = new PlayChessScene();
game.attachScene(fpScene);
game.setActiveScene(fpScene);

game.start();
