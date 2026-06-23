import type { ApprovedYouTubeChannel } from "../types/youtube";

export const APPROVED_YOUTUBE_CHANNELS: ApprovedYouTubeChannel[] = [
  {
    name: "Ms Rachel - Toddler Learning Videos",
    handle: "@msrachel",
    channelId: "UCG2CL6EUjG8TVT1Tpl9nJdg",
    tags: ["speech", "first_words", "letters", "social_language"],
    enabledByDefault: true,
  },
  {
    name: "Gracie's Corner",
    handle: "@graciescorner",
    channelId: "UCQ2FzqIvWSE7ysvL1sLWQ5Q",
    tags: ["movement", "songs", "alphabet", "counting", "culture"],
    enabledByDefault: true,
  },
  {
    name: "Learning with Ms. Houston",
    handle: "@learningwithmshouston",
    channelId: "UCBRhVWJO0jPqyPBHKgGSnpA",
    tags: ["circle_time", "letters", "numbers", "school_readiness"],
    enabledByDefault: true,
  },
  {
    name: "Khan Academy Kids",
    handle: "@KhanAcademyKids",
    channelId: "UC2ri4rEb8abnNwXvTjg5ARw",
    tags: ["preschool", "kindergarten", "math", "literacy"],
    enabledByDefault: true,
  },
  {
    name: "PBS KIDS",
    handle: "@PBSKIDS",
    channelId: "UCrNnk0wFBnCS1awGjq_ijGQ",
    tags: ["social_emotional", "stories", "school_readiness"],
    enabledByDefault: true,
  },
  {
    name: "Sesame Street",
    handle: "@SesameStreet",
    channelId: "UCoookXUzPciGrEZEXmh4Jjg",
    tags: ["letters", "emotions", "friendship", "routines"],
    enabledByDefault: true,
  },
  {
    name: "Super Simple Songs - Kids Songs",
    handle: "@SuperSimpleSongs",
    channelId: "UCLsooMJoIpl_7ux2jvdPB-Q",
    tags: ["songs", "colors", "routines", "transitions"],
    enabledByDefault: true,
  },
  {
    name: "Super Simple ABCs",
    handle: "@SuperSimpleABCs",
    channelId: "UCp5Nhw2YMCMUemXC1oWTkkA",
    tags: ["alphabet", "phonics", "letters"],
    enabledByDefault: true,
  },
  {
    name: "The Singing Walrus - English Songs For Kids",
    handle: "@TheSingingWalrus",
    channelId: "UCe1VpF4wS_kdcjyTRSXBcnQ",
    tags: ["songs", "phonics", "colors", "calendar"],
    enabledByDefault: true,
  },
  {
    name: "Jack Hartmann Kids Music Channel",
    handle: "@JackHartmann",
    channelId: "UCVcQH8A634mauPrGbWs7QlQ",
    tags: ["movement", "letters", "numbers", "phonics"],
    enabledByDefault: true,
  },
  {
    name: "Numberblocks",
    handle: "@Numberblocks",
    channelId: "UCPlwvN0w4qFSP1FllALB92w",
    tags: ["counting", "number_sense", "math"],
    enabledByDefault: true,
  },
  {
    name: "Alphablocks",
    handle: "@officialalphablocks",
    channelId: "UC_qs3c0ehDvZkbiEbOj6Drg",
    tags: ["letters", "phonics", "reading"],
    enabledByDefault: true,
  },
  {
    name: "Scratch Garden",
    handle: "@ScratchGarden",
    channelId: "UC8NFs-VWUsyuq4zaYVVMgCQ",
    tags: ["songs", "behavior", "routines", "funny_learning"],
    enabledByDefault: true,
  },
  {
    name: "The Kiboomers - Kids Music Channel",
    handle: "@thekiboomers",
    channelId: "UCLy6-72NzYpFztbJ7jNEMkg",
    tags: ["movement", "freeze_dance", "transitions", "songs"],
    enabledByDefault: true,
  },
  {
    name: "Cosmic Kids Yoga",
    handle: "@CosmicKidsYoga",
    channelId: "UC5uIZ2KOZZeQDQo_Gsi_qbQ",
    tags: ["calm_body", "movement", "mindfulness", "breathing"],
    enabledByDefault: true,
  },
  {
    name: "GoNoodle",
    handle: "@GoNoodle",
    channelId: "UC2YBT7HYqCbbvzu3kKZ3wnw",
    tags: ["movement", "mindfulness", "energy_breaks"],
    enabledByDefault: true,
  },
  {
    name: "SciShow Kids",
    handle: "@SciShowKids",
    channelId: "UCRFIPG2u1DxKLNuE3y2SjHA",
    tags: ["science", "curiosity", "why_questions"],
    enabledByDefault: false,
  },
  {
    name: "Nat Geo Kids",
    handle: "@natgeokids",
    channelId: "UCXVCgDuD_QCkI7gTKU7-tpg",
    tags: ["animals", "science", "curiosity"],
    enabledByDefault: false,
  },
  {
    name: "StoryBots",
    handle: "@storybots",
    channelId: "UCUaBZqb_YRqN_-HbYd7_dgQ",
    tags: ["science", "questions", "songs"],
    enabledByDefault: false,
  },
  {
    name: "Pinkfong",
    handle: "@pinkfong",
    channelId: "UCcdwLMPsaU2ezNSJU1nFoBQ",
    tags: ["songs", "colors", "counting"],
    enabledByDefault: false,
  },
];

export const APPROVED_SEARCH_TERMS = [
  "preschool counting song",
  "letter sounds preschool",
  "colors and shapes preschool",
  "social emotional learning preschool",
];

export function getApprovedChannel(channelId: string): ApprovedYouTubeChannel | undefined {
  return APPROVED_YOUTUBE_CHANNELS.find((channel) => channel.channelId === channelId);
}
