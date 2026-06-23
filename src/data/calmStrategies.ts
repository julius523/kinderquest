export type CalmStrategy = {
  id: string;
  label: string;
  spokenInstruction: string;
  icon: string;
  durationSeconds: number;
};

export const CALM_STRATEGIES: CalmStrategy[] = [
  {
    id: "breathe_3",
    label: "Take 3 breaths",
    spokenInstruction: "Take three slow Super Racer breaths.",
    icon: "wind",
    durationSeconds: 30,
  },
  {
    id: "jump_5",
    label: "Jump 5 times",
    spokenInstruction: "Jump five times like Super Racer.",
    icon: "activity",
    durationSeconds: 30,
  },
  {
    id: "squeeze_hands",
    label: "Squeeze hands",
    spokenInstruction: "Squeeze the steering wheel tight, then let go.",
    icon: "hand",
    durationSeconds: 20,
  },
  {
    id: "push_wall",
    label: "Push the wall",
    spokenInstruction: "Push the pit stop wall with both hands.",
    icon: "square",
    durationSeconds: 20,
  },
  {
    id: "slow_race",
    label: "Slow race",
    spokenInstruction: "Drive your hands slowly like a slow race.",
    icon: "gauge",
    durationSeconds: 20,
  },
  {
    id: "boat_float_breathing",
    label: "Boat float breathing",
    spokenInstruction: "Float like Splash Rocket. Breathe in and out slowly.",
    icon: "waves",
    durationSeconds: 30,
  },
  {
    id: "ask_for_break",
    label: "Ask for break",
    spokenInstruction: "Say, break please.",
    icon: "pause-circle",
    durationSeconds: 10,
  },
  {
    id: "need_space",
    label: "I need space",
    spokenInstruction: "Say, I need space.",
    icon: "move",
    durationSeconds: 10,
  },
];

export function getCalmStrategy(id: string): CalmStrategy | undefined {
  return CALM_STRATEGIES.find((strategy) => strategy.id === id);
}
