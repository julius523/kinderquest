import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { createBigButton } from "../systems/uiFactory";
import { popIn } from "../systems/feedback";
import { drawShape } from "../systems/shapeDrawing";
import { getFlashCardDeck, FLASH_CARD_DECKS } from "../../data/flashCardDecks";
import type { FlashCardDeck, FlashCardVisual } from "../../types/flashcards";

/** A generic flash card browser reused by every deck (alphabet, numbers,
 * shapes, colors, sight words) — only the deck data changes. */
export class FlashCardScene extends Phaser.Scene {
  private deck!: FlashCardDeck;
  private index = 0;
  private cardLayer!: Phaser.GameObjects.Container;
  private progressText!: Phaser.GameObjects.Text;

  constructor() {
    super("FlashCardScene");
  }

  create(data: { deckId: string }): void {
    this.deck = getFlashCardDeck(data.deckId) ?? FLASH_CARD_DECKS[0];
    this.index = 0;
    this.cameras.main.setBackgroundColor("#fdf4ff");

    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.07, this.deck.title, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "30px",
        fontStyle: "bold",
        color: "#581c87",
      })
      .setOrigin(0.5);

    speak(this.deck.spokenTitle);

    this.progressText = this.add
      .text(width / 2, height * 0.14, "", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "16px",
        color: "#7e22ce",
      })
      .setOrigin(0.5);

    this.cardLayer = this.add.container(0, 0);

    createBigButton(this, width * 0.12, height * 0.5, "Back", () => this.goPrev(), {
      width: 90,
      height: 90,
      color: 0x94a3b8,
      fontSize: "16px",
    });

    createBigButton(this, width * 0.88, height * 0.5, "Next", () => this.goNext(), {
      width: 90,
      height: 90,
      color: this.deck.themeColor,
      fontSize: "16px",
    });

    createBigButton(this, width / 2, height * 0.92, "Done", () => {
      this.scene.start("FlashCardHubScene");
    });

    this.renderCard();
  }

  private renderCard(): void {
    this.cardLayer.removeAll(true);
    const { width, height } = this.scale;
    const card = this.deck.cards[this.index];

    this.progressText.setText(`${this.index + 1} / ${this.deck.cards.length}`);

    const cardBg = this.add.graphics();
    cardBg.fillStyle(0xffffff, 1);
    cardBg.fillRoundedRect(-160, -160, 320, 320, 32);
    cardBg.lineStyle(6, this.deck.themeColor, 1);
    cardBg.strokeRoundedRect(-160, -160, 320, 320, 32);

    const visualNode = this.renderVisual(card.visual);

    const labelText = this.add
      .text(0, 120, card.label, {
        fontFamily: "system-ui, sans-serif",
        fontSize: card.visual.type === "word" ? "30px" : "24px",
        fontStyle: "bold",
        color: "#581c87",
        align: "center",
        wordWrap: { width: 280 },
      })
      .setOrigin(0.5);

    const repeatHint = this.add
      .text(0, 152, "(tap card to hear again)", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "12px",
        color: "#a78bfa",
      })
      .setOrigin(0.5);

    this.cardLayer.add([cardBg, visualNode, labelText, repeatHint]);
    this.cardLayer.setPosition(width / 2, height * 0.48);

    cardBg.setInteractive(new Phaser.Geom.Rectangle(-160, -160, 320, 320), Phaser.Geom.Rectangle.Contains);
    cardBg.on("pointerdown", () => speak(card.spokenText));

    popIn(this, this.cardLayer, 0, 1);
    speak(card.spokenText);
  }

  private renderVisual(visual: FlashCardVisual): Phaser.GameObjects.GameObject {
    if (visual.type === "letter") {
      return this.add
        .text(0, -10, visual.value, {
          fontFamily: "system-ui, sans-serif",
          fontSize: "120px",
          fontStyle: "bold",
          color: `#${this.deck.themeColor.toString(16).padStart(6, "0")}`,
        })
        .setOrigin(0.5);
    }

    if (visual.type === "number") {
      const container = this.add.container(0, 0);
      const numberText = this.add
        .text(0, -60, String(visual.value), {
          fontFamily: "system-ui, sans-serif",
          fontSize: "70px",
          fontStyle: "bold",
          color: "#9a3412",
        })
        .setOrigin(0.5);
      container.add(numberText);

      const dotsPerRow = 5;
      const dotSpacing = 26;
      for (let i = 0; i < visual.value; i++) {
        const row = Math.floor(i / dotsPerRow);
        const col = i % dotsPerRow;
        const countInRow = Math.min(dotsPerRow, visual.value - row * dotsPerRow);
        const rowStartX = -((countInRow - 1) * dotSpacing) / 2;
        const dot = this.add.circle(rowStartX + col * dotSpacing, 10 + row * 26, 9, 0xea580c);
        container.add(dot);
      }
      return container;
    }

    if (visual.type === "color") {
      const graphics = this.add.graphics();
      graphics.fillStyle(visual.hex, 1);
      graphics.fillRoundedRect(-70, -60, 140, 100, 20);
      return graphics;
    }

    if (visual.type === "shape") {
      const graphics = this.add.graphics();
      drawShape(graphics, visual.value, 0, -10, 130, this.deck.themeColor);
      return graphics;
    }

    return this.add
      .text(0, -10, visual.value, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "48px",
        fontStyle: "bold",
        color: "#581c87",
      })
      .setOrigin(0.5);
  }

  private goNext(): void {
    if (this.index >= this.deck.cards.length - 1) {
      speak("Great job! You finished the deck!");
      this.scene.start("FlashCardHubScene");
      return;
    }
    this.index += 1;
    this.renderCard();
  }

  private goPrev(): void {
    this.index = Math.max(0, this.index - 1);
    this.renderCard();
  }
}
