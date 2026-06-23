export const pronunciationMap: Record<string, string> = {
  Halani: "huh lawn ee",
  Amahni: "uh mon ee",
  NuNu: "new new",
  Londyn: "London",
};

export function applyPronunciation(text: string): string {
  let result = text;
  for (const [name, pronunciation] of Object.entries(pronunciationMap)) {
    result = result.split(name).join(pronunciation);
  }
  return result;
}
