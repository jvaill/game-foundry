import * as THREE from "three";
import { World } from "./World";
import { Scene } from "./Scene";

export class Game {
  private domElement?: HTMLElement;
  private isStarted = false;
  private renderer?: THREE.WebGLRenderer;
  private clock?: THREE.Clock;
  private animationFrameId?: number;
  private world: World;

  constructor(options: { domElement?: HTMLElement } = {}) {
    this.domElement = options.domElement;
    this.world = new World();
  }

  setDomElement(domElement: HTMLElement) {
    this.domElement = domElement;
  }

  attachScene(scene: Scene) {
    this.world.attachScene(scene);
  }

  setActiveScene(scene: Scene) {
    if (this.domElement) {
      scene._updateCameraAspectRatio(
        this.domElement.clientWidth / this.domElement.clientHeight
      );
    }
    this.world.setActiveScene(scene);
  }

  start() {
    if (this.isStarted) {
      console.warn("Game: Already started");
      return;
    }

    if (!this.domElement) {
      console.warn("Game: No domElement");
      return;
    }

    this.clock = new THREE.Clock();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      // Fixes some z-fighting issues, however, may decrease performance
      logarithmicDepthBuffer: true,
    });

    const width = this.domElement.clientWidth;
    const height = this.domElement.clientHeight;
    this.world.getActiveScene()?._updateCameraAspectRatio(width / height);

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.domElement.appendChild(this.renderer.domElement);

    window.addEventListener("resize", this.handleResize);

    this.isStarted = true;

    this.requestAnimationFrame();
  }

  stop() {
    if (!this.isStarted) {
      console.warn("Game not started");
      return;
    }

    this.isStarted = false;

    window.cancelAnimationFrame(this.animationFrameId!);
    this.animationFrameId = undefined;

    window.removeEventListener("resize", this.handleResize);

    this.domElement!.removeChild(this.renderer!.domElement);

    this.renderer!.dispose();
    this.renderer = undefined;

    this.clock!.stop();
    this.clock = undefined;

    // @todo: Dispose world
  }

  private update() {
    this.world.update(this.clock!.getDelta());
  }

  private render() {
    const scene = this.world.getActiveScene();
    if (scene) {
      this.renderer!.render(scene.getThreeScene(), scene.getCamera());
    }
  }

  private requestAnimationFrame = () => {
    this.animationFrameId = requestAnimationFrame(this.requestAnimationFrame);

    if (!this.isStarted) {
      console.warn("Game: Not started");
      return;
    }

    this.update();
    this.render();
  };

  private handleResize = () => {
    if (!this.domElement) return;

    const { clientWidth: width, clientHeight: height } = this.domElement;

    this.renderer?.setSize(width, height);
    this.world.getActiveScene()?._updateCameraAspectRatio(width / height);
  };
}
