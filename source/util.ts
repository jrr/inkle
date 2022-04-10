import itiriri from "itiriri";

export const spaceString = (s: string) => [...s].join(" ");

export function pickTwo<T>(items: T[]): T[] {
  return itiriri(items).shuffle().take(2).toArray();
}
