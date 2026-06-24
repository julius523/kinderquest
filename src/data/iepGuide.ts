export type IEPStrategy = {
  id: string;
  title: string;
  why: string;
  how: string;
  inApp: string;
};

export const IEP_OVERVIEW =
  "Kinder Quest is built around evidence-aligned strategies used in early intervention and special education — visual supports, structured choice, the least amount of help needed (not the most), and motivation built from his own interests. None of this requires a diagnosis label to use; it works for any child who does better with predictability, clear communication options, and permission to move and take breaks.";

export const IEP_STRATEGIES: IEPStrategy[] = [
  {
    id: "visual_schedule",
    title: "Visual Schedule",
    why: "Knowing what's happening now and what's next reduces anxiety and resistance, especially for a child who finds transitions hard. Pictures carry the information even when spoken words are missed or hard to process in the moment.",
    how: "Before a non-preferred task, show (don't just tell) the steps in order. Let him check things off or point to what's done. Keep it short — 4 to 8 steps, not a full day plan.",
    inApp: "Every session opens with a row of icons (Hello → Mission → Game → Move → Talk → Race → Goodbye) that stays visible and gets marked complete as he goes.",
  },
  {
    id: "first_then",
    title: "First/Then",
    why: "Pairing a less-preferred task with something he wants right after makes the request concrete and time-limited, instead of an open-ended demand. It also teaches that following through gets him to the good part faster.",
    how: "Always state both halves out loud, simply: \"First trace the line, then race.\" Show the reward, not just describe it. Never move the goalposts once it's said — if you said \"then race,\" the race happens next, every time.",
    inApp: "Before a harder activity, a card shows the task on the left and the reward on the right, spoken as one sentence.",
  },
  {
    id: "prompt_hierarchy",
    title: "Least-to-Most Prompting",
    why: "Jumping straight to showing him the answer (or doing it for him) can create dependence on help he doesn't actually need. Starting with the smallest nudge and only adding more if he's still stuck builds real independence.",
    how: "Order of help, smallest first: (1) a visual cue (point, highlight), (2) a verbal hint, (3) a model (\"watch me, now you try\"), (4) bring in a grown-up. Don't skip steps even when it feels faster to just show him.",
    inApp: "Every game waits through a wrong tap with a visual highlight first, then a verbal hint, then models the answer, and only after that suggests a grown-up help — never hand-over-hand from the app itself.",
  },
  {
    id: "communication_board",
    title: "Functional Communication (AAC-style)",
    why: "When words are hard to find or hard to understand, frustration behavior often fills the gap. Giving him a reliable, faster way to say \"help,\" \"break,\" or \"no thank you\" gives the behavior somewhere better to go.",
    how: "Model the phrase yourself in the moment it's needed (\"You're mad — let's say 'I need a break'\"), then accept ANY attempt — a point, a sign, an unclear word — as communication that worked. Speech clarity is not the bar; getting the message across is.",
    inApp: "A 27-phrase picture board (help please, my turn, break please, I'm mad, and more) is always one tap away, and speech practice accepts a tap or a parent's \"he said it\" confirmation — the app never marks speech wrong just because it didn't hear it clearly.",
  },
  {
    id: "errorless_praise",
    title: "Errorless Learning & Specific Praise",
    why: "Shame and \"wrong\" language shut down trying. Praise that names exactly what he did right (\"you used your words!\") teaches the skill itself, not just that an adult is pleased.",
    how: "Avoid \"wrong,\" \"no, try again,\" or comparisons to what's easy. Instead, narrate the next clue and praise effort: \"good try — watch again,\" then specific praise the moment he gets it.",
    inApp: "The app never uses negative or shaming feedback anywhere. Every reward names the specific skill used (\"You counted the cars!\", \"You made a safe choice!\").",
  },
  {
    id: "regulation_breaks",
    title: "Movement & Calm Breaks",
    why: "Rapid, repeated tapping or check-out behavior is often a body needing to move or reset, not defiance. Building in breaks before he melts down keeps the whole session more successful than pushing through.",
    how: "Watch for speeding up, repeating the same action, or going quiet/distant. Offer a choice of break (jump, squeeze hands, breathe, ask for space) rather than insisting on one specific strategy — what works varies day to day.",
    inApp: "If the app detects rapid repeated taps it offers a movement break; if it detects frustration it offers a calm pit-stop with a choice of strategy, before the next learning task — automatically, not just when asked.",
  },
  {
    id: "interest_based",
    title: "Interest-Based Motivation",
    why: "A child who finds a topic genuinely motivating will tolerate more challenge and more repetition in that topic than in a neutral one. Leaning into strong interests isn't a distraction from learning — it's the fastest path into it.",
    how: "Notice what he chooses without prompting (cars, racing, specific characters) and fold it into harder tasks: count cars instead of blocks, trace a road instead of a plain line.",
    inApp: "The app tracks which themes (cars, boats, superheroes, monster trucks...) correlate with higher completion and accuracy, and gradually weights activity selection toward those interests.",
  },
  {
    id: "choice_making",
    title: "Choice-Making",
    why: "Offering a real choice between two acceptable options gives a sense of control without giving up the goal — he's far more likely to follow through on something he picked.",
    how: "Offer exactly two or three options, all acceptable to you (\"jump or squeeze hands?\" not \"do you want to calm down?\"). Honor whichever he picks immediately.",
    inApp: "Calm strategies, rewards, and which world to play next are all presented as a small set of tappable choices, never a single forced path.",
  },
];

export type StruggleSign = {
  sign: string;
  tryThis: string;
};

export const STRUGGLE_GUIDE: StruggleSign[] = [
  { sign: "Tapping fast and repeatedly, or seeming wound up", tryThis: "Offer a movement break before asking for one more try." },
  { sign: "Going quiet, looking away, or seeming to check out", tryThis: "Pause the task; offer a choice of calm strategy or a short break." },
  { sign: "Several misses in a row on the same activity", tryThis: "Drop to an easier version, or switch to his top interest theme for a quick win before returning." },
  { sign: "Pushing the device away or refusing to tap anything", tryThis: "Offer the communication board (\"all done\" or \"break please\" are both fine answers) rather than insisting." },
  { sign: "Crying, hitting, or other big behavior", tryThis: "Stop the activity entirely. Calm body comes before any learning goal — there is no task worth pushing through this for." },
];

export const HOME_PRACTICE_IDEAS: string[] = [
  "Use First/Then before cleanup: \"First clean up cars, then race one car.\"",
  "Count toy cars, steps, or bites of food out loud during ordinary play.",
  "Practice \"help please\" when opening snacks or toys he can't open himself.",
  "Practice \"no thank you\" as the replacement for pushing away or yelling.",
  "Draw roads, wheels, circles, and X roadblocks together with chalk or crayons.",
  "Take turns racing toy cars with a sibling, modeling \"my turn\" / \"your turn\" out loud.",
  "Read a short story using silly voices and pause to ask him to point at pictures.",
  "Offer movement (jump, spin, squeeze) before any sit-down task, not after a meltdown.",
];
