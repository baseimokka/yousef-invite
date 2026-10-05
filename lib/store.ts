import { Redis } from "@upstash/redis";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/* ============================================================================
 *  Storage for RSVPs and guestbook wishes.
 *
 *  On Vercel this talks to Upstash Redis (free tier, one click from the Vercel
 *  marketplace — it injects the env vars for you). With no env vars set it
 *  falls back to a JSON file under .data/ so `npm run dev` works offline and
 *  nothing crashes before the database is connected.
 * ========================================================================== */

export type Rsvp = {
  id: string;
  name: string;
  attending: boolean;
  partySize: number;
  createdAt: string;
};

export type Wish = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

const RSVP_KEY = "wedding:rsvps";
const WISH_KEY = "wedding:wishes";
const MAX_WISHES_RETURNED = 200;

/* -- Backend selection ---------------------------------------------------- */

function redisClient(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? "";

  if (!url || !token) return null;
  return new Redis({ url, token });
}

const FILE_DIR = path.join(process.cwd(), ".data");

async function readFileList<T>(key: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(FILE_DIR, `${key}.json`), "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeFileList<T>(key: string, items: T[]): Promise<void> {
  await fs.mkdir(FILE_DIR, { recursive: true });
  await fs.writeFile(
    path.join(FILE_DIR, `${key}.json`),
    JSON.stringify(items, null, 2),
    "utf8"
  );
}

/** True when submissions are being persisted somewhere durable. */
export function isDurable(): boolean {
  return redisClient() !== null;
}

/* -- Generic list helpers -------------------------------------------------- */

async function push<T>(key: string, item: T): Promise<void> {
  const redis = redisClient();
  if (redis) {
    await redis.lpush(key, JSON.stringify(item));
    return;
  }
  const items = await readFileList<T>(key);
  items.unshift(item);
  await writeFileList(key, items);
}

async function list<T>(key: string, limit = MAX_WISHES_RETURNED): Promise<T[]> {
  const redis = redisClient();
  if (redis) {
    const raw = await redis.lrange<string | T>(key, 0, limit - 1);
    // Upstash may hand back already-parsed objects depending on the stored
    // value, so handle both shapes rather than assuming one.
    return raw.map((entry) =>
      typeof entry === "string" ? (JSON.parse(entry) as T) : (entry as T)
    );
  }
  return (await readFileList<T>(key)).slice(0, limit);
}

/* -- Public API ------------------------------------------------------------ */

export async function addRsvp(
  input: Omit<Rsvp, "id" | "createdAt">
): Promise<Rsvp> {
  const entry: Rsvp = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await push(RSVP_KEY, entry);
  return entry;
}

export function listRsvps(): Promise<Rsvp[]> {
  return list<Rsvp>(RSVP_KEY, 1000);
}

export async function addWish(
  input: Omit<Wish, "id" | "createdAt">
): Promise<Wish> {
  const entry: Wish = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await push(WISH_KEY, entry);
  return entry;
}

export function listWishes(): Promise<Wish[]> {
  return list<Wish>(WISH_KEY);
}

/* -- Rate limiting --------------------------------------------------------- */

const memoryHits = new Map<string, { count: number; resetAt: number }>();

/**
 * Allows `limit` writes per `windowSec` per client, per `scope`.
 *
 * The scope matters: without it the RSVP and guestbook endpoints would share
 * a single counter, so sending a few wishes would lock a guest out of
 * replying to the invitation. Each endpoint gets its own budget.
 *
 * Uses Redis when available so the limit holds across serverless instances;
 * otherwise it is best-effort in memory, which is fine for one wedding.
 */
export async function rateLimit(
  scope: string,
  clientKey: string,
  limit = 5,
  windowSec = 60
): Promise<boolean> {
  const key = `wedding:rate:${scope}:${hashClient(clientKey)}`;
  const redis = redisClient();

  if (redis) {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSec);
    return count <= limit;
  }

  const now = Date.now();
  const hit = memoryHits.get(key);
  if (!hit || hit.resetAt < now) {
    memoryHits.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return true;
  }
  hit.count += 1;
  return hit.count <= limit;
}

/** Never store a raw IP — a salted hash is enough to rate limit. */
export function hashClient(value: string): string {
  const salt = process.env.RATE_LIMIT_SALT ?? "wedding-invitation";
  return crypto
    .createHash("sha256")
    .update(`${salt}:${value}`)
    .digest("hex")
    .slice(0, 32);
}
