export function isPlaceholder(val: string | undefined | null): boolean {
  return !val || /SAMPLE|TO BE CONFIRMED|TBC/i.test(val);
}
