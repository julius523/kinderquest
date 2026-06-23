import type { ActivityDefinition } from "../types/activity";
import { SIGHT_WORDS } from "./flashCardDecks";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function pickDistractors(letter: string, count: number): string[] {
  const pool = ALPHABET.filter((candidate) => candidate !== letter);
  const distractors: string[] = [];
  while (distractors.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    distractors.push(pool.splice(index, 1)[0]);
  }
  return distractors;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateLetterActivities(): ActivityDefinition[] {
  return ALPHABET.map((letter) => ({
    id: `letter_find_${letter.toLowerCase()}`,
    type: "letter_find",
    skill: "letters",
    level: "TK",
    theme: "race_track",
    instruction: `Find ${letter}.`,
    spokenInstruction: `Find the letter ${letter}.`,
    verbalHint: `Look for the letter that looks like this: ${letter}.`,
    choices: shuffle([letter, ...pickDistractors(letter, 2)]),
    correctAnswer: letter,
    interests: ["cars", "superhero"],
    supports: ["visual_prompt", "read_aloud", "parent_confirm"],
  }));
}

const COUNTABLE_OBJECT_TYPES = ["race_car", "boat", "wheel", "trophy"] as const;

export function createCountActivity(
  count: number,
  objectType: (typeof COUNTABLE_OBJECT_TYPES)[number],
): ActivityDefinition {
  const objectLabel = objectType.replace("_", " ");
  return {
    id: `count_${count}_${objectType}`,
    type: "count_objects",
    skill: "counting",
    level: count <= 10 ? "TK" : "K",
    theme: objectType,
    instruction: `Count ${count} ${objectLabel}${count === 1 ? "" : "s"}.`,
    spokenInstruction: `Touch and count ${count} ${objectLabel}${count === 1 ? "" : "s"}.`,
    targetCount: count,
    objectType,
    correctAnswer: count,
    interests: objectType === "boat" ? ["boats"] : ["cars"],
  };
}

export function generateCountingActivities(): ActivityDefinition[] {
  const activities: ActivityDefinition[] = [];
  for (let count = 1; count <= 20; count++) {
    for (const objectType of COUNTABLE_OBJECT_TYPES) {
      activities.push(createCountActivity(count, objectType));
    }
  }
  return activities;
}

const PREWRITING_FORMS = [
  "vertical_line",
  "horizontal_line",
  "circle",
  "cross",
  "diagonal_line",
  "x_shape",
  "zigzag",
  "curved_line",
  "name_tracing",
] as const;

const PREWRITING_LABELS: Record<(typeof PREWRITING_FORMS)[number], { instruction: string; spoken: string }> = {
  vertical_line: { instruction: "Trace the road down.", spoken: "Trace the road down." },
  horizontal_line: { instruction: "Trace the road across.", spoken: "Trace the road across." },
  circle: { instruction: "Trace the wheel.", spoken: "Trace the circle wheel." },
  cross: { instruction: "Trace the crossroad.", spoken: "Trace the crossing road." },
  diagonal_line: { instruction: "Trace the ramp.", spoken: "Trace the diagonal ramp." },
  x_shape: { instruction: "Trace the X roadblock.", spoken: "Trace the X roadblock." },
  zigzag: { instruction: "Trace the bumpy road.", spoken: "Trace the zigzag road." },
  curved_line: { instruction: "Trace the wave.", spoken: "Trace the boat's wave." },
  name_tracing: { instruction: "Trace your name.", spoken: "Trace your name." },
};

export function createPrewritingActivity(form: (typeof PREWRITING_FORMS)[number]): ActivityDefinition {
  const labels = PREWRITING_LABELS[form];
  return {
    id: `prewrite_${form}`,
    type: "prewriting_trace",
    skill: "prewriting",
    level: "TK",
    theme: "drawing_dock",
    instruction: labels.instruction,
    spokenInstruction: labels.spoken,
    targetForm: form,
    interests: ["cars", "drawing"],
    isNonPreferred: true,
  };
}

export function generatePrewritingActivities(): ActivityDefinition[] {
  return PREWRITING_FORMS.map((form) => createPrewritingActivity(form));
}

function pickWordDistractors(word: string, pool: string[], count: number): string[] {
  const candidates = pool.filter((candidate) => candidate !== word);
  const distractors: string[] = [];
  while (distractors.length < count && candidates.length > 0) {
    const index = Math.floor(Math.random() * candidates.length);
    distractors.push(candidates.splice(index, 1)[0]);
  }
  return distractors;
}

export function generateSightWordActivities(sightWords: string[]): ActivityDefinition[] {
  return sightWords.map((word) => ({
    id: `sight_word_find_${word}`,
    type: "sight_word_find",
    skill: "sight_words",
    level: "K",
    theme: "speedway",
    instruction: `Find the word: ${word}`,
    spokenInstruction: `Find the word ${word}.`,
    verbalHint: `Look for the word that says ${word}.`,
    choices: shuffle([word, ...pickWordDistractors(word, sightWords, 2)]),
    correctAnswer: word,
    interests: ["cars"],
  }));
}

const SEED_ACTIVITIES: ActivityDefinition[] = [
  {
    id: "letter_find_x_race_sign",
    type: "letter_find",
    skill: "letters",
    level: "TK",
    theme: "race_car",
    instruction: "Find the letter X.",
    spokenInstruction: "Find the letter X on the race sign.",
    choices: ["X", "O", "T"],
    correctAnswer: "X",
    interests: ["letter_x", "cars", "superhero"],
    supports: ["visual_prompt", "read_aloud", "parent_confirm"],
  },
  {
    id: "letter_find_z_super_racer",
    type: "letter_find",
    skill: "letters",
    level: "TK",
    instruction: "Find the letter Z.",
    spokenInstruction: "Find the letter Z.",
    choices: ["Z", "S", "N"],
    correctAnswer: "Z",
    interests: ["superhero", "name_letters"],
  },
  {
    id: "shape_circle_wheel",
    type: "shape_find",
    skill: "shapes",
    level: "TK",
    theme: "race_track",
    instruction: "Find the circle.",
    spokenInstruction: "Find the circle wheel.",
    choices: ["circle", "triangle", "square"],
    correctAnswer: "circle",
    interests: ["cars"],
  },
  {
    id: "shape_triangle_sail",
    type: "shape_find",
    skill: "shapes",
    level: "TK",
    theme: "shape_harbor",
    instruction: "Find the triangle.",
    spokenInstruction: "Put the triangle sail on the boat.",
    choices: ["triangle", "circle", "star"],
    correctAnswer: "triangle",
    interests: ["boats"],
  },
  {
    id: "color_red_car",
    type: "color_sort",
    skill: "colors",
    level: "TK",
    theme: "color_city",
    instruction: "Find the red car.",
    spokenInstruction: "Drive the red car to the red garage.",
    choices: ["red car", "blue car", "yellow car"],
    correctAnswer: "red car",
    targetColor: "red",
    interests: ["cars"],
  },
  {
    id: "color_blue_boat",
    type: "color_sort",
    skill: "colors",
    level: "TK",
    theme: "color_city",
    instruction: "Find the blue boat.",
    spokenInstruction: "Splash the blue boat.",
    choices: ["blue boat", "green boat", "orange boat"],
    correctAnswer: "blue boat",
    targetColor: "blue",
    interests: ["boats"],
  },
  {
    id: "listen_tap_car",
    type: "listening_direction",
    skill: "listening",
    level: "TK",
    instruction: "Tap the car.",
    spokenInstruction: "Tap the car.",
    objects: ["car", "boat"],
    sequence: ["car"],
    supports: ["repeat_button"],
  },
  {
    id: "listen_first_boat_then_car",
    type: "listening_direction",
    skill: "listening",
    level: "K",
    instruction: "First tap the boat. Then tap the car.",
    spokenInstruction: "First tap the boat. Then tap the car.",
    objects: ["boat", "car"],
    sequence: ["boat", "car"],
    interests: ["boats", "cars"],
    supports: ["repeat_button", "visual_prompt"],
  },
  {
    id: "speech_help_please",
    type: "speech_phrase",
    skill: "communication",
    level: "TK",
    instruction: "Say: help please.",
    spokenInstruction: "Say, help please.",
    targetPhrase: "help please",
    acceptedResponseModes: ["voice", "tap", "parent_confirmed"],
    interests: ["communication_board"],
  },
  {
    id: "speech_my_turn",
    type: "speech_phrase",
    skill: "communication",
    level: "TK",
    instruction: "Say: my turn.",
    spokenInstruction: "Say, my turn.",
    targetPhrase: "my turn",
    acceptedResponseModes: ["voice", "tap", "parent_confirmed"],
  },
  {
    id: "speech_i_want_red_car",
    type: "speech_phrase",
    skill: "communication",
    level: "K",
    instruction: "Say: I want the red car.",
    spokenInstruction: "Say, I want the red car.",
    targetPhrase: "I want the red car",
    acceptedResponseModes: ["voice", "tap", "parent_confirmed"],
  },
  {
    id: "comm_monster_took_wheel",
    type: "communication_scenario",
    skill: "communication",
    level: "K",
    instruction: "Monster Racer took the wheel. What can you say?",
    spokenInstruction: "Monster Racer took the wheel. What can you say?",
    acceptablePhrases: ["stop please", "my turn", "help please"],
    interests: ["monster_truck", "cars"],
  },
  {
    id: "comm_too_loud",
    type: "communication_scenario",
    skill: "communication",
    level: "K",
    instruction: "The game is too loud. What can you say?",
    spokenInstruction: "The game is too loud. What can you say?",
    acceptablePhrases: ["break please", "I need space"],
  },
  {
    id: "comm_dont_want_activity",
    type: "communication_scenario",
    skill: "communication",
    level: "K",
    instruction: "You don't want that activity. What can you say?",
    spokenInstruction: "You don't want that activity. What can you say?",
    acceptablePhrases: ["no thank you", "all done"],
  },
  {
    id: "safe_body_gentle_hands",
    type: "social_scenario",
    skill: "safe_behavior",
    level: "TK",
    instruction: "Choose safe hands.",
    spokenInstruction: "Choose safe hands.",
    choices: ["gentle hands", "throw toy", "kick"],
    correctAnswer: "gentle hands",
  },
  {
    id: "social_say_hi_king",
    type: "social_scenario",
    skill: "social_skills",
    level: "TK",
    instruction: "Say hi to King.",
    spokenInstruction: "Say hi to King.",
    partnerId: "king",
    targetPhrases: ["hi"],
  },
  {
    id: "social_give_halani_turn",
    type: "social_scenario",
    skill: "social_skills",
    level: "K",
    instruction: "Give Halani a turn.",
    spokenInstruction: "Give Halani a turn.",
    partnerId: "halani",
    targetPhrases: ["your turn"],
  },
  {
    id: "social_londyn_says_stop",
    type: "social_scenario",
    skill: "social_skills",
    level: "K",
    instruction: "Londyn says stop. What do you do?",
    spokenInstruction: "Londyn says stop. What do you do?",
    partnerId: "londyn",
    choices: ["stop right away", "keep going"],
    correctAnswer: "stop right away",
  },
  {
    id: "social_amahni_is_sad",
    type: "social_scenario",
    skill: "social_skills",
    level: "K",
    instruction: "Amahni is sad. What can Super Racer say?",
    spokenInstruction: "Amahni is sad. What can Super Racer say?",
    partnerId: "amahni",
    choices: ["are you okay?", "ignore her"],
    correctAnswer: "are you okay?",
  },
  {
    id: "movement_jump_5",
    type: "movement_break",
    skill: "movement",
    level: "TK",
    instruction: "Jump 5 times.",
    spokenInstruction: "Jump five times like Super Racer.",
    movement: "jump",
    count: 5,
    durationSeconds: 30,
  },
  {
    id: "calm_breathe_3",
    type: "calm_strategy",
    skill: "calm_body",
    level: "TK",
    instruction: "Take 3 breaths.",
    spokenInstruction: "Take three slow Super Racer breaths.",
    strategy: "breathing",
    count: 3,
    durationSeconds: 30,
  },
  {
    id: "turn_king",
    type: "turn_taking",
    skill: "turn_taking",
    level: "TK",
    instruction: "King's turn. Then your turn.",
    spokenInstruction: "King's turn. Then your turn.",
    partnerId: "king",
    targetPhrases: ["my turn", "your turn"],
  },
  {
    id: "turn_halani",
    type: "turn_taking",
    skill: "turn_taking",
    level: "TK",
    instruction: "Halani's turn. Then your turn.",
    spokenInstruction: "Halani's turn. Then your turn.",
    partnerId: "halani",
    targetPhrases: ["my turn", "your turn"],
  },
  {
    id: "story_super_racer_break",
    type: "story_page",
    skill: "story_time",
    level: "TK",
    instruction: "Super Racer asks for a break.",
    spokenInstruction: "Super Racer feels mad. He says, break please.",
    targetPhrase: "break please",
  },
];

export const ACTIVITY_LIBRARY: ActivityDefinition[] = [
  ...SEED_ACTIVITIES,
  ...generateLetterActivities(),
  ...generateCountingActivities(),
  ...generatePrewritingActivities(),
  ...generateSightWordActivities(SIGHT_WORDS),
];

export function getActivityById(id: string): ActivityDefinition | undefined {
  return ACTIVITY_LIBRARY.find((activity) => activity.id === id);
}

export function getActivitiesBySkill(skill: ActivityDefinition["skill"]): ActivityDefinition[] {
  return ACTIVITY_LIBRARY.filter((activity) => activity.skill === skill);
}

export function getActivitiesByType(type: ActivityDefinition["type"]): ActivityDefinition[] {
  return ACTIVITY_LIBRARY.filter((activity) => activity.type === type);
}

/** Picks a random activity for a skill. A placeholder for the adaptive
 * engine's personalized selection, which lands in a later phase. */
export function pickRandomActivity(skill: ActivityDefinition["skill"]): ActivityDefinition | undefined {
  const candidates = getActivitiesBySkill(skill);
  if (candidates.length === 0) return undefined;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
