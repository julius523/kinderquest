export type FlashCardVisual =
  | { type: "letter"; value: string }
  | { type: "shape"; value: string }
  | { type: "color"; value: string; hex: number }
  | { type: "number"; value: number }
  | { type: "word"; value: string };

export type FlashCard = {
  id: string;
  label: string;
  spokenText: string;
  visual: FlashCardVisual;
};

export type FlashCardDeck = {
  id: string;
  title: string;
  spokenTitle: string;
  themeColor: number;
  cards: FlashCard[];
};
