import { NextRequest, NextResponse } from "next/server";
import { addWish, listWishes, rateLimit } from "@/lib/store";
import { cleanText, cleanMessage } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Wishes are public, so this is cached briefly to absorb bursts of traffic. */
export async function GET() {
  try {
    const wishes = await listWishes();
    return NextResponse.json(
      { wishes },
      { headers: { "Cache-Control": "public, max-age=10, s-maxage=10" } }
    );
  } catch {
    return NextResponse.json({ wishes: [] });
  }
}

export async function POST(req: NextRequest) {
  const allowed = await rateLimit("guestbook", clientIp(req), 3, 60);
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
  const message = cleanMessage(input.message, 500);

  if (!name) return NextResponse.json({ error: "name_required" }, { status: 400 });
  if (!message) {
    return NextResponse.json({ error: "message_required" }, { status: 400 });
  }

  try {
    const wish = await addWish({ name, message });
    return NextResponse.json({ ok: true, wish });
  } catch {
    return NextResponse.json({ error: "store_failed" }, { status: 500 });
  }
}
