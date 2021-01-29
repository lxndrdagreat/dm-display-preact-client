/**
 * Returns a random whole number
 * @param min - Inclusive lower end of the range
 * @param max - Exclusive upper end of the range
 */
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
