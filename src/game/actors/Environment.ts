import { Actor } from "@e/Actor";
import { CSky } from "../components/Sky";
import { CLighting } from "../components/Lighting";

export class AEnvironment extends Actor {
  private sky: CSky = new CSky();
  private lighting: CLighting = new CLighting();

  constructor() {
    super();
    this.attachComponent(this.sky);
    this.attachComponent(this.lighting);
  }
}
