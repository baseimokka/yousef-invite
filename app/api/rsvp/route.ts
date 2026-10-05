import { NextRequest, NextResponse } from "next/server";
import { addRsvp, rateLimit } from "@/lib/store";
import { cleanText } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const allowed = await rateLimit("rsvp", clientIp(req), 5, 60);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = cleanText(input.name, 80);
  const attending = input.attending === true;
  const rawSize = Number(input.partySize);
  const partySize = attending
    ? Math.max(1, Math.min(20, Number.isFinite(rawSize) ? Math.floor(rawSize) : 1))
    : 0;

  if (!name) {
    return NextResponse.json({ error: "name_required" }, { status: 400 });
  }

  try {
    const rsvp = await addRsvp({ name, attending, partySize });
    return NextResponse.json({ ok: true, id: rsvp.id });
  } catch {
    return NextResponse.json({ error: "store_failed" }, { status: 500 });
  }
}
