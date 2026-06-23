import { describe, expect, it } from "vitest";
import {
  ALPHABET_DECK,
  SHAPES_DECK,
  COLORS_DECK,
  NUMBERS_DECK,
  SIGHT_WORDS_DECK,
  SIGHT_WORDS,
  FLASH_CARD_DECKS,
  getFlashCardDeck,
} from "../data/flashCardDecks";

describe("ALPHABET_DECK", () => {
  it("has all 26 letters, each with a unique id and a spoken sound + example word", () => {
    expect(ALPHABET_DECK.cards).toHaveLength(26);
    const ids = ALPHABET_DECK.cards.map((c) => c.id);
    expect(new Set(ids).size).toBe(26);

    for (const card of ALPHABET_DECK.cards) {
      expect(card.visual.type).toBe("letter");
      expect(card.spokenText).toMatch(/says/);
      expect(card.spokenText).toMatch(/is for/);
    }
  });
});

describe("SHAPES_DECK", () => {
  it("covers all 8 core shapes", () => {
    expect(SHAPES_DECK.cards).toHaveLength(8);
    const shapeNames = SHAPES_DECK.cards.map((c) => c.label);
    expect(shapeNames).toEqual(
      expect.arrayContaining(["circle", "square", "triangle", "rectangle", "star", "heart", "oval", "diamond"]),
    );
  });
});

describe("COLORS_DECK", () => {
  it("covers all 10 required colors with a valid hex value", () => {
    expect(COLORS_DECK.cards).toHaveLength(10);
    for (const card of COLORS_DECK.cards) {
      expect(card.visual.type).toBe("color");
      if (card.visual.type === "color") {
        expect(card.visual.hex).toBeGreaterThanOrEqual(0);
        expect(card.visual.hex).toBeLessThanOrEqual(0xffffff);
      }
    }
  });
});

describe("NUMBERS_DECK", () => {
  it("covers 0 through 20 inclusive", () => {
    expect(NUMBERS_DECK.cards).toHaveLength(21);
    const values = NUMBERS_DECK.cards.map((c) => (c.visual.type === "number" ? c.visual.value : -1));
    expect(values).toEqual(Array.from({ length: 21 }, (_, i) => i));
  });
});

describe("SIGHT_WORDS_DECK", () => {
  it("matches the exported SIGHT_WORDS list 1:1", () => {
    expect(SIGHT_WORDS_DECK.cards).toHaveLength(SIGHT_WORDS.length);
    expect(SIGHT_WORDS.length).toBeGreaterThanOrEqual(30);
  });

  it("has no duplicate words", () => {
    expect(new Set(SIGHT_WORDS).size).toBe(SIGHT_WORDS.length);
  });
});

describe("getFlashCardDeck", () => {
  it("finds every deck registered in FLASH_CARD_DECKS by id", () => {
    for (const deck of FLASH_CARD_DECKS) {
      expect(getFlashCardDeck(deck.id)?.id).toBe(deck.id);
    }
  });

  it("returns undefined for an unknown deck id", () => {
    expect(getFlashCardDeck("nonexistent")).toBeUndefined();
  });
});
