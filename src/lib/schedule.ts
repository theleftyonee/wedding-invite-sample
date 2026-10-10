import { isPlaceholder } from "./placeholder";

export function parseInstant(value: string | undefined | null): Date | null {
  if (isPlaceholder(value)) return null;
  const parsed = new Date(value as string);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export interface RemainingTime {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly arrived: boolean;
}

export function formatClock(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h12",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export function eventTimeRange(startsAt: string, durationHours: number, writtenTime: string): string {
  const start = parseInstant(startsAt);
  if (!start || durationHours <= 0) return writtenTime;
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  return `${writtenTime} until ${formatClock(end)}`;
}

export function remainingUntil(target: Date, now = Date.now()): RemainingTime | null {
  const diff = target.getTime() - now;
  if (diff <= 0) {
    const since = now - target.getTime();
    if (since > 36 * 60 * 60 * 1000) return null;
    return { days: 0, hours: 0, minutes: 0, seconds: 0, arrived: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    arrived: false,
  };
}

function icsStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export interface CalendarEntry {
  readonly uid: string;
  readonly title: string;
  readonly startsAt: string;
  readonly durationHours?: number;
  readonly details?: string;
  readonly location?: string;
}

export function buildCalendarFile(entries: readonly CalendarEntry[]): string | null {
  const events = entries.flatMap((entry) => {
    const start = parseInstant(entry.startsAt);
    if (!start) return [];
    const hours = entry.durationHours && entry.durationHours > 0 ? entry.durationHours : 3;
    const end = new Date(start.getTime() + hours * 60 * 60 * 1000);
    const location = entry.location && !isPlaceholder(entry.location) ? entry.location : "";
    const lines = [
      "BEGIN:VEVENT",
      `UID:${icsText(entry.uid)}`,
      `DTSTAMP:${icsStamp(new Date())}`,
      `DTSTART:${icsStamp(start)}`,
      `DTEND:${icsStamp(end)}`,
      `SUMMARY:${icsText(entry.title)}`,
    ];
    if (entry.details) lines.push(`DESCRIPTION:${icsText(entry.details)}`);
    if (location) lines.push(`LOCATION:${icsText(location)}`);
    lines.push("END:VEVENT");
    return [lines.join("\r\n")];
  });

  if (events.length === 0) return null;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    events.join("\r\n"),
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function downloadCalendar(filename: string, entries: readonly CalendarEntry[]): boolean {
  const file = buildCalendarFile(entries);
  if (!file) return false;

  const blob = new Blob([file], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return true;
}
