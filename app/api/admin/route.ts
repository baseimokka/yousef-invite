import { NextRequest, NextResponse } from "next/server";
import { listRsvps, listWishes, isDurable } from "@/lib/store";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Private read-out of everything guests have submitted.
 *
 *   /api/admin?token=YOUR_TOKEN           -> JSON
 *   /api/admin?token=YOUR_TOKEN&csv=1     -> spreadsheet-ready CSV
 *
 * Set ADMIN_TOKEN in the environment. With no token configured the route
 * stays closed rather than defaulting to open.
 */
function authorised(req: NextRequest): boolean {
  const expected = process.env.ADMIN_TOKEN ?? "";
  if (!expected) return false;

  const supplied =
    req.nextUrl.searchParams.get("token") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";

  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  // Constant-time compare, so the token cannot be guessed byte by byte.
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Excel only reads UTF-8 CSV correctly when it starts with a byte-order mark. */
const BOM = String.fromCharCode(0xfeff);

export async function GET(req: NextRequest) {
  if (!authorised(req)) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  const [rsvps, wishes] = await Promise.all([listRsvps(), listWishes()]);

  const attending = rsvps.filter((r) => r.attending);
  const summary = {
    durableStorage: isDurable(),
    totalReplies: rsvps.length,
    attending: attending.length,
    declined: rsvps.length - attending.length,
    totalGuests: attending.reduce((sum, r) => sum + r.partySize, 0),
    wishes: wishes.length,
  };

  if (req.nextUrl.searchParams.get("csv")) {
    const rows = [
      ["type", "name", "attending", "party_size", "message", "created_at"],
      ...rsvps.map((r) => [
        "rsvp",
        r.name,
        r.attending ? "yes" : "no",
        r.partySize,
        "",
        r.createdAt,
      ]),
      ...wishes.map((w) => ["wish", w.name, "", "", w.message, w.createdAt]),
    ];

    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
    return new NextResponse(BOM + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="wedding-responses.csv"',
      },
    });
  }

  return NextResponse.json({ summary, rsvps, wishes });
}
