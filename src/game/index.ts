import { Game } from "@e/Game";
import { GameScene } from "./scenes/GameScene";

const domElement = document.getElementById("game");
if (!domElement) {
  throw new Error("Game element not found");
}

const game = new Game({
  domElement,
});

// Create and attach our first-person scene
const fpScene = new GameScene();
game.attachScene(fpScene);
game.setActiveScene(fpScene);

game.start();
