import Phaser from "phaser";
import { composeCarTextures } from "../systems/carTextures";

/**
 * All current assets are generated in code (BootScene + here) — no
 * external files to load. This scene exists as the place future external
 * asset loading would happen, keeping the Boot/Preload separation the
 * rest of the codebase expects.
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  create(): void {
    try {
      composeCarTextures(this);
    } catch {
      // Never let a texture-generation failure strand the game on a
      // blank preload screen — worlds that don't use cars still work.
    }
    this.scene.start("WelcomeGarageScene");
  }
}
