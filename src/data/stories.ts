export type StoryQuestion = {
  prompt: string;
  spokenPrompt: string;
  choices: string[];
  correctAnswer?: string;
};

export type StoryPage = {
  imageKey: string;
  text: string;
  question?: StoryQuestion;
};

export type Story = {
  id: string;
  title: string;
  targetPhrase?: string;
  pages: StoryPage[];
};

export const STORIES: Story[] = [
  {
    id: "super_racer_break",
    title: "Super Racer Asks for a Break",
    targetPhrase: "break please",
    pages: [
      { imageKey: "super_racer_garage", text: "Super Racer was racing all day." },
      { imageKey: "super_racer_tired", text: "Super Racer felt tired and a little mad." },
      {
        imageKey: "super_racer_speaks",
        text: "Super Racer said, break please.",
        question: {
          prompt: "What did Super Racer say?",
          spokenPrompt: "What did Super Racer say?",
          choices: ["break please", "go fast", "no"],
          correctAnswer: "break please",
        },
      },
      { imageKey: "super_racer_rest", text: "Super Racer took a break and felt better." },
    ],
  },
  {
    id: "super_racer_waits_turn",
    title: "Super Racer Waits for His Turn",
    targetPhrase: "my turn",
    pages: [
      { imageKey: "track_two_cars", text: "Super Racer and King wanted to race." },
      { imageKey: "king_turn", text: "King went first. Super Racer waited." },
      {
        imageKey: "super_racer_turn",
        text: "Then Super Racer said, my turn!",
        question: {
          prompt: "Whose turn is it now?",
          spokenPrompt: "Whose turn is it now?",
          choices: ["Super Racer's turn", "King's turn"],
          correctAnswer: "Super Racer's turn",
        },
      },
      { imageKey: "both_race", text: "They both got a turn to race. That was fun!" },
    ],
  },
  {
    id: "monster_racer_gentle_hands",
    title: "Monster Racer Learns Gentle Hands",
    targetPhrase: "gentle hands",
    pages: [
      { imageKey: "monster_racer_oops", text: "Monster Racer bumped the track by accident." },
      { imageKey: "calm_car_helps", text: "Calm Car said, let's use gentle hands." },
      { imageKey: "monster_racer_tries", text: "Monster Racer used gentle hands to fix the track." },
      { imageKey: "monster_racer_happy", text: "Everyone cheered for Monster Racer's safe hands!" },
    ],
  },
  {
    id: "super_racer_no_thank_you",
    title: "Super Racer Says No Thank You",
    targetPhrase: "no thank you",
    pages: [
      { imageKey: "gearsy_offers", text: "Gearsy offered Super Racer a bumpy ride." },
      {
        imageKey: "super_racer_decides",
        text: "Super Racer didn't want it, so he said, no thank you.",
        question: {
          prompt: "What did Super Racer say?",
          spokenPrompt: "What did Super Racer say?",
          choices: ["no thank you", "yes please"],
          correctAnswer: "no thank you",
        },
      },
      { imageKey: "gearsy_understands", text: "Gearsy said, okay! and found something else fun." },
    ],
  },
  {
    id: "super_racer_school_day",
    title: "Super Racer Goes from Home to School",
    pages: [
      { imageKey: "home_morning", text: "Super Racer woke up and got ready." },
      { imageKey: "car_ride_school", text: "Super Racer rode to school." },
      { imageKey: "teacher_greets", text: "Teacher said hi to Super Racer." },
      { imageKey: "school_play", text: "Super Racer learned and played at school." },
    ],
  },
  {
    id: "super_racer_reads_with_dad",
    title: "Super Racer Reads with Dad",
    pages: [
      { imageKey: "dad_couch", text: "Dad and Super Racer sat together with a book." },
      { imageKey: "dad_reads", text: "Dad read the story in a silly voice." },
      { imageKey: "super_racer_points", text: "Super Racer pointed to the pictures." },
      { imageKey: "dad_hug", text: "They finished the book and gave a big hug." },
    ],
  },
];

export function getStory(id: string): Story | undefined {
  return STORIES.find((story) => story.id === id);
}
