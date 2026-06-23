import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { createBigButton } from "../systems/uiFactory";
import { FLASH_CARD_DECKS } from "../../data/flashCardDecks";

/** Category picker for the Flash Cards section — alphabet, numbers,
 * shapes, colors, sight words. */
export class FlashCardHubScene extends Phaser.Scene {
  constructor() {
    super("FlashCardHubScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#fdf4ff");
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.1, "Flash Cards", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "34px",
        fontStyle: "bold",
        color: "#581c87",
      })
      .setOrigin(0.5);

    speak("Pick a flash card deck!");

    const columns = 2;
    const spacingX = width / (columns + 1);
    const spacingY = 150;
    const startY = height * 0.32;

    FLASH_CARD_DECKS.forEach((deck, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);

      createBigButton(
        this,
        spacingX * (col + 1),
        startY + row * spacingY,
        deck.title,
        () => this.scene.start("FlashCardScene", { deckId: deck.id }),
        { width: 220, height: 100, color: deck.themeColor, entranceDelay: index * 80 },
      );
    });

    createBigButton(this, width / 2, height * 0.92, "Back to Map", () => {
      this.scene.start("WorldMapScene");
    });
  }
}
