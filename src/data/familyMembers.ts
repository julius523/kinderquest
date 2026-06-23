export type FamilyRole = "parent" | "sibling" | "grandparent" | "family" | "teacher" | "custom";

export type FamilyMember = {
  id: string;
  displayName: string;
  pronunciation: string;
  role: FamilyRole;
};

export const FAMILY_MEMBERS: FamilyMember[] = [
  { id: "mom", displayName: "Mom", pronunciation: "Mom", role: "parent" },
  { id: "dad", displayName: "Dad", pronunciation: "Dad", role: "parent" },
  { id: "king", displayName: "King", pronunciation: "King", role: "sibling" },
  { id: "halani", displayName: "Halani", pronunciation: "huh lawn ee", role: "sibling" },
  { id: "londyn", displayName: "Londyn", pronunciation: "London", role: "sibling" },
  { id: "amahni", displayName: "Amahni", pronunciation: "uh mon ee", role: "sibling" },
  {
    id: "grandma_nunu",
    displayName: "Grandma NuNu",
    pronunciation: "Grandma new new",
    role: "grandparent",
  },
  { id: "tt", displayName: "TT", pronunciation: "tee tee", role: "family" },
  { id: "yaya", displayName: "YaYa", pronunciation: "yah yah", role: "grandparent" },
  { id: "big_daddy", displayName: "Big Daddy", pronunciation: "Big Daddy", role: "grandparent" },
  { id: "teacher_male", displayName: "Teacher", pronunciation: "Teacher", role: "teacher" },
  { id: "teacher_female", displayName: "Teacher", pronunciation: "Teacher", role: "teacher" },
];

export function getFamilyMember(id: string): FamilyMember | undefined {
  return FAMILY_MEMBERS.find((member) => member.id === id);
}
