export type SkillName =
  | "communication"
  | "transitions"
  | "letters"
  | "counting"
  | "prewriting"
  | "safe_behavior"
  | "shapes"
  | "colors"
  | "listening"
  | "social_skills"
  | "story_time"
  | "calm_body"
  | "turn_taking"
  | "speech_sounds"
  | "movement";

export type PromptLevel =
  | "independent"
  | "visual"
  | "verbal"
  | "model"
  | "gesture"
  | "caregiver";

export type ResponseMode = "tap" | "voice" | "parent_confirmed" | "gesture" | "mixed";

export type RegulationState =
  | "focused"
  | "playful_high_energy"
  | "bored"
  | "frustrated"
  | "dysregulated"
  | "ready_for_challenge"
  | "needs_transition_support"
  | "needs_movement"
  | "needs_caregiver_prompt";

export type ActivityType =
  | "letter_find"
  | "letter_match"
  | "letter_sound"
  | "count_objects"
  | "number_find"
  | "quantity_match"
  | "shape_find"
  | "shape_build"
  | "color_sort"
  | "listening_direction"
  | "speech_phrase"
  | "communication_scenario"
  | "calm_strategy"
  | "movement_break"
  | "prewriting_trace"
  | "story_page"
  | "social_scenario"
  | "turn_taking"
  | "reward_race";

export type ActivityLevel = "TK" | "K" | "Grade1";

export type InterestTag =
  | "cars"
  | "boats"
  | "superhero"
  | "monster_truck"
  | "songs"
  | "drawing"
  | "stories"
  | "racing"
  | "trains"
  | "family_characters"
  | "movement_games"
  | "letter_x"
  | "name_letters"
  | "communication_board";

export type DeviceType = "phone" | "laptop" | "desktop" | "tablet";

export type WorldId =
  | "welcome_garage"
  | "super_racer_training"
  | "letter_lagoon"
  | "number_speedway"
  | "shape_harbor"
  | "color_city"
  | "listening_lane"
  | "speech_sound_garage"
  | "story_cove"
  | "calm_body_pit_stop"
  | "friendship_track"
  | "drawing_dock"
  | "monster_racer_challenge"
  | "trophy_celebration"
  | "parent_review";
