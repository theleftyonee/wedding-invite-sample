export function isPlaceholder(val: string | undefined | null): boolean {
  return !val || /SAMPLE|TO BE CONFIRMED|TBC/i.test(val);
}

export function directionsHref(venue: string | undefined | null, mapUrl?: string | null): string {
  if (mapUrl && !isPlaceholder(mapUrl)) return mapUrl;
  if (isPlaceholder(venue)) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue as string)}`;
}
