import { NextResponse } from "next/server";
import { content } from "@/lib/content";

export const runtime = "nodejs";

/** iCalendar wants UTC stamps as YYYYMMDDTHHMMSSZ. */
function stamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Long lines must be folded at 75 octets, and commas escaped. */
function fold(line: string): string {
  const escaped = line.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;");
  if (escaped.length <= 75) return escaped;
  const parts = [escaped.slice(0, 75)];
  let rest = escaped.slice(75);
  while (rest.length > 74) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  if (rest) parts.push(` ${rest}`);
  return parts.join("\r\n");
}

export async function GET() {
  const start = new Date(content.weddingDateISO);
  const end = new Date(start.getTime() + 6 * 60 * 60 * 1000);

  const title = `${content.couple.groom.short.en} & ${content.couple.bride.short.en}`;
  const location = `${content.venue.name.en}, ${content.venue.city.en}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@wedding-invitation`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    fold(`SUMMARY:${title}`),
    fold(`LOCATION:${location}`),
    fold(`DESCRIPTION:${content.share.description.en}`),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="wedding.ics"',
    },
  });
}
