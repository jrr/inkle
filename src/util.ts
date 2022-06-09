export const spaceString = (s: string) => [...s].join(" ");

export function sample<T>(input: T[]): T {
  const pos = Math.floor(Math.random() * input.length);
  return input[pos];
}
