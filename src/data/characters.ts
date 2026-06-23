export type CharacterType =
  | "hero"
  | "mentor"
  | "boat_friend"
  | "helper"
  | "teacher_voice"
  | "silly_challenger"
  | "regulation_helper"
  | "letter_helper"
  | "number_helper";

export type VoiceStyle = "warm_excited" | "coach" | "playful" | "goofy" | "calm" | "gentle_teacher";

export type Character = {
  id: string;
  name: string;
  type: CharacterType;
  description: string;
  voiceStyle: VoiceStyle;
  catchphrases: string[];
};

export const CHARACTERS: Character[] = [
  {
    id: "super_racer",
    name: "Super Racer",
    type: "hero",
    description: "The child's superhero racer avatar.",
    voiceStyle: "warm_excited",
    catchphrases: [
      "Ready, set, learn!",
      "Super Racer tries again!",
      "First we learn, then we race!",
    ],
  },
  {
    id: "captain_turbo",
    name: "Captain Turbo",
    type: "mentor",
    description: "Friendly red talking race car coach.",
    voiceStyle: "coach",
    catchphrases: ["Nice safe choice!", "You used your words!", "Let's look at the schedule."],
  },
  {
    id: "splash_rocket",
    name: "Splash Rocket",
    type: "boat_friend",
    description: "Fast talking boat friend for water levels.",
    voiceStyle: "playful",
    catchphrases: ["Splash and count!", "Ride the wave!", "First the boat, then the trophy!"],
  },
  {
    id: "gearsy",
    name: "Gearsy",
    type: "helper",
    description: "Silly original tow-truck-style helper who fixes the track.",
    voiceStyle: "goofy",
    catchphrases: ["Gearsy can fix that!", "Let's roll!", "Oops, time for a tune-up!"],
  },
  {
    id: "coach_zoom",
    name: "Coach Zoom",
    type: "teacher_voice",
    description: "Calm adult teacher voice who introduces missions.",
    voiceStyle: "gentle_teacher",
    catchphrases: ["Let's learn together.", "Great effort, Super Racer.", "Ready for the next mission?"],
  },
  {
    id: "monster_racer",
    name: "Monster Racer",
    type: "silly_challenger",
    description: "Silly monster truck who mixes up learning tasks. Never scary or violent.",
    voiceStyle: "goofy",
    catchphrases: ["Oops, I mixed it up!", "Can Super Racer fix my track?", "Uh oh, I need help please!"],
  },
  {
    id: "calm_car",
    name: "Calm Car",
    type: "regulation_helper",
    description: "Gentle car who teaches breathing and safe body.",
    voiceStyle: "calm",
    catchphrases: ["Pit stop. Breathe with me.", "Safe hands. Calm body.", "Ask for a break."],
  },
  {
    id: "letter_lightning",
    name: "Letter Lightning",
    type: "letter_helper",
    description: "Original alphabet helper who lights up letters on the track.",
    voiceStyle: "playful",
    catchphrases: ["Letters light the way!", "Find the letter with me!"],
  },
  {
    id: "number_nitro",
    name: "Number Nitro",
    type: "number_helper",
    description: "Original counting helper who boosts Super Racer's number power.",
    voiceStyle: "playful",
    catchphrases: ["Count with nitro power!", "Numbers make us fast!"],
  },
];

export function getCharacter(id: string): Character | undefined {
  return CHARACTERS.find((character) => character.id === id);
}
