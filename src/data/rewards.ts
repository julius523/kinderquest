import type { Reward } from "../types/rewards";
import type { SkillName } from "../types/game";

export const REWARDS: Reward[] = [
  {
    id: "red_rocket_car",
    name: "Red Rocket Car",
    category: "car",
    rarity: "common",
    unlockSkill: "letters",
    praiseText: "You found the letter. You unlocked the Red Rocket Car!",
  },
  {
    id: "splash_boat",
    name: "Splash Boat",
    category: "boat",
    rarity: "common",
    unlockSkill: "counting",
    praiseText: "You counted carefully. You unlocked Splash Boat!",
  },
  {
    id: "super_cape_blue",
    name: "Blue Super Cape",
    category: "super_suit",
    rarity: "common",
    unlockSkill: "communication",
    praiseText: "You used your words. You unlocked a Super Cape!",
  },
  {
    id: "gentle_hands_trophy",
    name: "Gentle Hands Trophy",
    category: "trophy",
    rarity: "special",
    unlockSkill: "safe_behavior",
    praiseText: "You made a safe choice. You earned the Gentle Hands Trophy!",
  },
  {
    id: "turn_taking_badge",
    name: "Turn Taking Badge",
    category: "badge",
    rarity: "special",
    unlockSkill: "turn_taking",
    praiseText: "You waited for your turn. You earned the Turn Taking Badge!",
  },
  {
    id: "shape_shield",
    name: "Shape Shield",
    category: "track_piece",
    rarity: "common",
    unlockSkill: "shapes",
    praiseText: "You found the shape. You built a Shape Shield!",
  },
  {
    id: "rainbow_wheels",
    name: "Rainbow Wheels",
    category: "track_piece",
    rarity: "common",
    unlockSkill: "colors",
    praiseText: "You matched the color. You unlocked Rainbow Wheels!",
  },
  {
    id: "listening_horn",
    name: "Listening Horn",
    category: "sound",
    rarity: "common",
    unlockSkill: "listening",
    praiseText: "Great listening! You unlocked a new horn sound!",
  },
  {
    id: "steady_hand_trophy",
    name: "Steady Hand Trophy",
    category: "trophy",
    rarity: "uncommon",
    unlockSkill: "prewriting",
    praiseText: "Your hand is getting stronger. You earned the Steady Hand Trophy!",
  },
  {
    id: "calm_pit_crew_badge",
    name: "Calm Pit Crew Badge",
    category: "badge",
    rarity: "special",
    unlockSkill: "calm_body",
    praiseText: "You calmed your body. You earned the Calm Pit Crew Badge!",
  },
  {
    id: "story_cove_compass",
    name: "Story Cove Compass",
    category: "track_piece",
    rarity: "common",
    unlockSkill: "story_time",
    praiseText: "You listened to the whole story! You found the Story Cove Compass!",
  },
  {
    id: "friendship_flag",
    name: "Friendship Flag",
    category: "track_piece",
    rarity: "common",
    unlockSkill: "social_skills",
    praiseText: "You made a kind choice. You earned the Friendship Flag!",
  },
];

export const PRAISE_BANK: Record<string, string[]> = {
  communication: ["You used your words!", "You asked for help!", "You told me what you wanted!"],
  transitions: ["You checked the schedule!", "You did first, then!", "You moved to the next mission!"],
  letters: ["You found the letter!", "Letter mission complete!", "You fixed the alphabet track!"],
  counting: ["You counted the cars!", "Number mission complete!", "You counted carefully!"],
  prewriting: ["You traced the road!", "You made the line!", "Your hand is getting stronger!"],
  safe_behavior: ["You made a safe choice!", "Gentle hands!", "Safe body!"],
  shapes: ["You found the shape!", "Shape mission complete!"],
  colors: ["You matched the color!", "Color mission complete!"],
  listening: ["Great listening!", "You followed the directions!"],
  social_skills: ["You shared!", "You waited so nicely!", "Kind choice!"],
  story_time: ["You listened to the whole story!", "Great listening, Super Racer!"],
  calm_body: ["Nice calming!", "Your body feels safe now!"],
  turn_taking: ["You waited for your turn!", "You shared the race!"],
  speech_sounds: ["You tried the word!", "Nice clear words!"],
  movement: ["You moved your body!", "Great energy, Super Racer!"],
  effort: ["Good trying!", "You tried again!", "Super Racer keeps going!"],
};

export function getSpecificPraise(skill: SkillName | "effort"): string {
  const bank = PRAISE_BANK[skill] ?? PRAISE_BANK.effort;
  return bank[Math.floor(Math.random() * bank.length)];
}

export function getReward(id: string): Reward | undefined {
  return REWARDS.find((reward) => reward.id === id);
}

export function getRewardsForSkill(skill: SkillName): Reward[] {
  return REWARDS.filter((reward) => reward.unlockSkill === skill);
}
