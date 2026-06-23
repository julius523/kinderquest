import type { FlashCard, FlashCardDeck } from "../types/flashcards";

const LETTER_INFO: Record<string, { sound: string; word: string }> = {
  A: { sound: "ah", word: "Apple" },
  B: { sound: "buh", word: "Boat" },
  C: { sound: "kuh", word: "Car" },
  D: { sound: "duh", word: "Dog" },
  E: { sound: "eh", word: "Egg" },
  F: { sound: "fuh", word: "Fish" },
  G: { sound: "guh", word: "Garage" },
  H: { sound: "huh", word: "Hat" },
  I: { sound: "ih", word: "Igloo" },
  J: { sound: "juh", word: "Jump" },
  K: { sound: "kuh", word: "Kite" },
  L: { sound: "luh", word: "Lion" },
  M: { sound: "muh", word: "Monster" },
  N: { sound: "nuh", word: "Nest" },
  O: { sound: "oh", word: "Octopus" },
  P: { sound: "puh", word: "Pit stop" },
  Q: { sound: "kwuh", word: "Queen" },
  R: { sound: "ruh", word: "Race" },
  S: { sound: "suh", word: "Sun" },
  T: { sound: "tuh", word: "Turbo" },
  U: { sound: "uh", word: "Umbrella" },
  V: { sound: "vuh", word: "Van" },
  W: { sound: "wuh", word: "Wheel" },
  X: { sound: "ks", word: "X marks the spot" },
  Y: { sound: "yuh", word: "Yellow" },
  Z: { sound: "zuh", word: "Zoom" },
};

function buildAlphabetDeck(): FlashCardDeck {
  const cards: FlashCard[] = Object.entries(LETTER_INFO).map(([letter, info]) => ({
    id: `letter_${letter.toLowerCase()}`,
    label: `${letter}${letter.toLowerCase()}`,
    spokenText: `${letter}. ${letter} says ${info.sound}. ${letter} is for ${info.word}.`,
    visual: { type: "letter", value: letter },
  }));

  return {
    id: "alphabet",
    title: "Alphabet",
    spokenTitle: "Let's learn the alphabet!",
    themeColor: 0x0891b2,
    cards,
  };
}

const SHAPES: string[] = ["circle", "square", "triangle", "rectangle", "star", "heart", "oval", "diamond"];

function buildShapesDeck(): FlashCardDeck {
  const cards: FlashCard[] = SHAPES.map((shape) => ({
    id: `shape_${shape}`,
    label: shape,
    spokenText: `This is a ${shape}.`,
    visual: { type: "shape", value: shape },
  }));

  return {
    id: "shapes",
    title: "Shapes",
    spokenTitle: "Let's learn shapes!",
    themeColor: 0x16a34a,
    cards,
  };
}

const COLORS: { name: string; hex: number }[] = [
  { name: "red", hex: 0xef4444 },
  { name: "blue", hex: 0x3b82f6 },
  { name: "yellow", hex: 0xfacc15 },
  { name: "green", hex: 0x22c55e },
  { name: "orange", hex: 0xf97316 },
  { name: "purple", hex: 0xa855f7 },
  { name: "black", hex: 0x1f2937 },
  { name: "white", hex: 0xf8fafc },
  { name: "brown", hex: 0x92400e },
  { name: "pink", hex: 0xf472b6 },
];

function buildColorsDeck(): FlashCardDeck {
  const cards: FlashCard[] = COLORS.map((color) => ({
    id: `color_${color.name}`,
    label: color.name,
    spokenText: `This is ${color.name}.`,
    visual: { type: "color", value: color.name, hex: color.hex },
  }));

  return {
    id: "colors",
    title: "Colors",
    spokenTitle: "Let's learn colors!",
    themeColor: 0xa855f7,
    cards,
  };
}

function buildNumbersDeck(): FlashCardDeck {
  const cards: FlashCard[] = Array.from({ length: 21 }, (_, n) => ({
    id: `number_${n}`,
    label: String(n),
    spokenText: `The number ${n}.`,
    visual: { type: "number", value: n },
  }));

  return {
    id: "numbers",
    title: "Numbers",
    spokenTitle: "Let's learn numbers!",
    themeColor: 0xea580c,
    cards,
  };
}

// Dolch pre-primer sight words — the standard starting list for TK/K sight
// word recognition.
export const SIGHT_WORDS: string[] = [
  "a", "and", "away", "big", "blue", "can", "come", "down", "find", "for",
  "funny", "go", "help", "here", "I", "in", "is", "it", "jump", "little",
  "look", "make", "me", "my", "not", "one", "play", "red", "run", "said",
  "see", "the", "three", "to", "two", "up", "we", "where", "yellow", "you",
];

function buildSightWordsDeck(): FlashCardDeck {
  const cards: FlashCard[] = SIGHT_WORDS.map((word) => ({
    id: `sight_${word}`,
    label: word,
    spokenText: word,
    visual: { type: "word", value: word },
  }));

  return {
    id: "sight_words",
    title: "Sight Words",
    spokenTitle: "Let's learn sight words!",
    themeColor: 0xdb2777,
    cards,
  };
}

export const ALPHABET_DECK = buildAlphabetDeck();
export const SHAPES_DECK = buildShapesDeck();
export const COLORS_DECK = buildColorsDeck();
export const NUMBERS_DECK = buildNumbersDeck();
export const SIGHT_WORDS_DECK = buildSightWordsDeck();

export const FLASH_CARD_DECKS: FlashCardDeck[] = [
  ALPHABET_DECK,
  NUMBERS_DECK,
  SHAPES_DECK,
  COLORS_DECK,
  SIGHT_WORDS_DECK,
];

export function getFlashCardDeck(id: string): FlashCardDeck | undefined {
  return FLASH_CARD_DECKS.find((deck) => deck.id === id);
}
