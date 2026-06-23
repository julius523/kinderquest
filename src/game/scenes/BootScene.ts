import Phaser from "phaser";
import { generateCoreTextures } from "../systems/generateCoreTextures";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create(): void {
    generateCoreTextures(this);
    this.scene.start("PreloadScene");
  }
}
