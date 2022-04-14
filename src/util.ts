export const spaceString = (s: string) => [...s].join(" ");

// https://stackoverflow.com/a/46700791
export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}
