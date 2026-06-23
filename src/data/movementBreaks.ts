export type MovementBreak = {
  id: string;
  label: string;
  spokenInstruction: string;
  movementType: string;
  count?: number;
  durationSeconds: number;
};

export const MOVEMENT_BREAKS: MovementBreak[] = [
  {
    id: "jump_5",
    label: "Jump 5 times",
    spokenInstruction: "Jump five times like Super Racer.",
    movementType: "jump",
    count: 5,
    durationSeconds: 30,
  },
  {
    id: "pit_stop_stretch",
    label: "Super Racer Pit Stop",
    spokenInstruction: "Stretch your arms like Super Racer at the pit stop.",
    movementType: "stretch",
    durationSeconds: 45,
  },
  {
    id: "race_in_place",
    label: "Race in place",
    spokenInstruction: "Run in place like you're racing to the finish line.",
    movementType: "run",
    durationSeconds: 30,
  },
  {
    id: "wheel_spin",
    label: "Spin like a wheel",
    spokenInstruction: "Spin your arms around like race car wheels.",
    movementType: "spin",
    count: 10,
    durationSeconds: 20,
  },
  {
    id: "boat_rock",
    label: "Rock like a boat",
    spokenInstruction: "Rock side to side like Splash Rocket on the water.",
    movementType: "rock",
    durationSeconds: 30,
  },
];

export function getMovementBreak(id: string): MovementBreak | undefined {
  return MOVEMENT_BREAKS.find((breakItem) => breakItem.id === id);
}
