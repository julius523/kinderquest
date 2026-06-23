import type { SkillName } from "../types/game";

export const SKILL_TREE: Partial<Record<SkillName, { levels: string[] }>> = {
  communication: {
    levels: [
      "tap_picture_to_request",
      "imitate_functional_phrase",
      "use_2_word_phrase",
      "use_3_to_5_word_phrase",
      "use_phrase_during_frustration",
      "choose_repair_phrase",
    ],
  },
  transitions: {
    levels: [
      "view_visual_schedule",
      "complete_first_then_with_preferred_then",
      "transition_after_visual_prompt",
      "transition_after_verbal_prompt",
      "choose_break_then_return",
      "complete_two_task_schedule",
    ],
  },
  letters: {
    levels: [
      "match_same_uppercase",
      "identify_high_interest_letters",
      "identify_uppercase_a_to_z",
      "match_upper_to_lower",
      "letter_sounds",
      "beginning_sounds",
    ],
  },
  counting: {
    levels: [
      "rote_count_to_5",
      "rote_count_to_10",
      "recognize_quantity_1_to_3",
      "count_objects_1_to_5",
      "identify_numbers_0_to_10",
      "compare_more_less",
      "count_objects_1_to_20",
    ],
  },
  prewriting: {
    levels: [
      "vertical_line",
      "horizontal_line",
      "circle",
      "cross",
      "diagonal_line",
      "x_shape",
      "zigzag",
      "curved_line",
      "name_tracing",
    ],
  },
  safe_behavior: {
    levels: [
      "identify_safe_hands",
      "choose_gentle_hands",
      "choose_stop_please",
      "request_break",
      "choose_safe_body_in_scenario",
      "return_to_activity_after_break",
    ],
  },
  social_skills: {
    levels: [
      "greeting",
      "my_turn_your_turn",
      "sharing",
      "waiting",
      "asking_to_play",
      "responding_to_stop",
      "helping_peer",
    ],
  },
};

export function getSkillLevels(skill: SkillName): string[] {
  return SKILL_TREE[skill]?.levels ?? [];
}
