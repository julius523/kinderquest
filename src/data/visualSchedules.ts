export type ScheduleItem = {
  id: string;
  label: string;
  icon: string;
};

export const DEFAULT_SESSION_SCHEDULE: ScheduleItem[] = [
  { id: "hello", label: "Hello", icon: "hand" },
  { id: "first_mission", label: "First Mission", icon: "flag" },
  { id: "game_1", label: "Game", icon: "gamepad-2" },
  { id: "move", label: "Move", icon: "activity" },
  { id: "game_2", label: "Game", icon: "gamepad-2" },
  { id: "talk", label: "Talk", icon: "message-circle" },
  { id: "race", label: "Race", icon: "car" },
  { id: "goodbye", label: "Goodbye", icon: "home" },
];

export const TWO_PLAYER_SCHEDULE: ScheduleItem[] = [
  { id: "hello", label: "Hello", icon: "hand" },
  { id: "whose_turn", label: "Whose Turn", icon: "users" },
  { id: "game_1", label: "Game", icon: "gamepad-2" },
  { id: "cheer", label: "Cheer", icon: "party-popper" },
  { id: "goodbye", label: "Goodbye", icon: "home" },
];
