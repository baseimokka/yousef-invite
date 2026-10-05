import { content } from "./content";
import type { Locale } from "./i18n";

/**
 * All date formatting is pinned to the venue's timezone, so a guest in another
 * country still sees the wedding day exactly as it will happen locally.
 *
 * Numerals stay Western ("06", not "٠٦") in Arabic too — that is the common
 * convention across the Gulf and the Levant, and it keeps the big date numeral
 * visually identical in both languages. Change `numberingSystem` below to
 * "arab" if you prefer Arabic-Indic digits.
 */
const NUMBERING = "latn";

function localeTag(locale: Locale): string {
  return locale === "ar" ? `ar-u-nu-${NUMBERING}` : "en-US";
}

export function weddingDate(): Date {
  return new Date(content.weddingDateISO);
}

/** "MONDAY" */
export function weekdayName(locale: Locale, date = weddingDate()): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    weekday: "long",
    timeZone: content.timezone,
  }).format(date);
}

/** "06" */
export function dayNumber(locale: Locale, date = weddingDate()): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "2-digit",
    timeZone: content.timezone,
  }).format(date);
}

/** "SEPTEMBER" */
export function monthName(locale: Locale, date = weddingDate()): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    month: "long",
    timeZone: content.timezone,
  }).format(date);
}

/** "2027" */
export function yearNumber(locale: Locale, date = weddingDate()): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    year: "numeric",
    timeZone: content.timezone,
  }).format(date);
}

/** "September 6, 2027" — used on the envelope. */
export function longDate(locale: Locale, date = weddingDate()): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: content.timezone,
  }).format(date);
}

/** "September 2027" — the mini calendar heading. */
export function monthAndYear(locale: Locale, date = weddingDate()): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    month: "long",
    year: "numeric",
    timeZone: content.timezone,
  }).format(date);
}

/**
 * Formats a stored "HH:mm" string for display, honouring the 24h/12h setting
 * in content.ts. Kept as a pure string transform so the value never drifts
 * across timezones.
 */
export function displayTime(hhmm: string, locale: Locale): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;

  if (content.timeFormat === "24h") {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(h)}:${pad(m)}`;
  }

  const base = new Date(Date.UTC(2000, 0, 1, h, m));
  return new Intl.DateTimeFormat(localeTag(locale), {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(base);
}

/** Short weekday initials for the mini calendar header, Monday first. */
export function weekdayInitials(locale: Locale): string[] {
  const fmt = new Intl.DateTimeFormat(localeTag(locale), {
    weekday: "short",
    timeZone: "UTC",
  });
  // 2024-01-01 was a Monday.
  return Array.from({ length: 7 }, (_, i) =>
    fmt.format(new Date(Date.UTC(2024, 0, 1 + i)))
  );
}

/**
 * Builds the calendar grid for the wedding month: a Monday-first matrix where
 * empty leading cells are null.
 */
export function calendarGrid(): (number | null)[] {
  const d = weddingDate();
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    timeZone: content.timezone,
  }).formatToParts(d);

  const year = Number(parts.find((p) => p.type === "year")!.value);
  const month = Number(parts.find((p) => p.type === "month")!.value) - 1;

  const first = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  // getUTCDay(): 0 = Sunday. Shift so Monday = 0.
  const lead = (first.getUTCDay() + 6) % 7;

  const cells: (number | null)[] = Array(lead).fill(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  return cells;
}

/** The wedding day-of-month, used to draw the heart in the calendar. */
export function weddingDayOfMonth(): number {
  return Number(dayNumber("en"));
}
