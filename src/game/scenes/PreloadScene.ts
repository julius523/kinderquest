import Phaser from "phaser";
import { preloadCarSprites, composeCarTextures } from "../systems/carTextures";

/**
 * Loads licensed external sprite assets (currently just the Kenney car
 * sprites — see src/assets/README.md) and composes them with drawn faces
 * before any scene that needs them starts.
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload(): void {
    preloadCarSprites(this);
  }

  create(): void {
    composeCarTextures(this);
    this.scene.start("WelcomeGarageScene");
  }
}
