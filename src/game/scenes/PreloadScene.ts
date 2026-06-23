import Phaser from "phaser";

/**
 * All current assets are generated in BootScene. This scene exists as the
 * place future external asset loading (sound files, etc.) would happen,
 * keeping the Boot/Preload separation the rest of the codebase expects.
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  create(): void {
    this.scene.start("WelcomeGarageScene");
  }
}
