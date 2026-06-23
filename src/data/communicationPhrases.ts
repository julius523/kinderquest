export type CommunicationCategory =
  | "request"
  | "protest"
  | "turn_taking"
  | "regulation"
  | "emotion"
  | "completion"
  | "safety"
  | "transition"
  | "response";

export type CommunicationPhrase = {
  id: string;
  text: string;
  icon: string;
  category: CommunicationCategory;
};

export const COMMUNICATION_PHRASES: CommunicationPhrase[] = [
  { id: "help_please", text: "help please", icon: "help-circle", category: "request" },
  { id: "more_please", text: "more please", icon: "plus", category: "request" },
  { id: "no_thank_you", text: "no thank you", icon: "x-circle", category: "protest" },
  { id: "my_turn", text: "my turn", icon: "user", category: "turn_taking" },
  { id: "your_turn", text: "your turn", icon: "users", category: "turn_taking" },
  { id: "break_please", text: "break please", icon: "pause-circle", category: "regulation" },
  { id: "im_mad", text: "I'm mad", icon: "frown", category: "emotion" },
  { id: "im_sad", text: "I'm sad", icon: "cloud-rain", category: "emotion" },
  { id: "all_done", text: "all done", icon: "check-circle", category: "completion" },
  { id: "i_want", text: "I want ___", icon: "hand", category: "request" },
  { id: "stop_please", text: "stop please", icon: "octagon", category: "safety" },
  { id: "need_space", text: "I need space", icon: "move", category: "regulation" },
  { id: "need_help", text: "I need help", icon: "life-buoy", category: "request" },
  { id: "dont_like", text: "I don't like that", icon: "thumbs-down", category: "protest" },
  { id: "want_cars", text: "I want cars", icon: "car", category: "request" },
  { id: "want_boat", text: "I want boat", icon: "sailboat", category: "request" },
  { id: "want_race", text: "I want race", icon: "flag", category: "request" },
  { id: "want_story", text: "I want story", icon: "book-open", category: "request" },
  { id: "want_draw", text: "I want draw", icon: "pencil", category: "request" },
  { id: "want_music", text: "I want music", icon: "music", category: "request" },
  { id: "need_calm_break", text: "I need a calm break", icon: "wind", category: "regulation" },
  { id: "im_ready", text: "I'm ready", icon: "circle-dot", category: "transition" },
  { id: "go_again", text: "go again", icon: "repeat", category: "request" },
  { id: "yes_please", text: "yes please", icon: "check", category: "response" },
  { id: "no", text: "no", icon: "x", category: "response" },
  { id: "wait", text: "wait", icon: "clock", category: "transition" },
  { id: "gentle_hands", text: "gentle hands", icon: "hand", category: "safety" },
  { id: "safe_body", text: "safe body", icon: "shield", category: "safety" },
];

export function getCommunicationPhrase(id: string): CommunicationPhrase | undefined {
  return COMMUNICATION_PHRASES.find((phrase) => phrase.id === id);
}
