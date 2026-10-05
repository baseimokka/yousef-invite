/** Captures each section on its own, at the reference viewport width. */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.argv[2] ?? "http://localhost:3124";
const LOCALE = process.argv[3] ?? "en";
const OUT = "screenshots/sections";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
  await page.emulateMedia({ reducedMotion: "reduce" });

await page.goto(`${BASE}/${LOCALE}`, { waitUntil: "networkidle" });
await page.locator(".envelope-open").click();
await page.waitForTimeout(1000);
// (sections settle instantly under emulated reduced motion)
await page.waitForTimeout(500);

const targets = [
  [".hero", "hero"],
  [".names", "names"],
  [".gallery", "gallery"],
  [".reception", "reception"],
  [".calendar-section", "calendar"],
  [".venue", "venue"],
  [".dress-code", "dresscode"],
  [".schedule", "schedule"],
  [".guestbook", "guestbook"],
  [".gift", "gift"],
];

for (const [selector, name] of targets) {
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) {
    console.log(`  (missing) ${name}`);
    continue;
  }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await el.screenshot({ path: `${OUT}/${LOCALE}-${name}.png` });
  console.log(`  ${LOCALE}-${name}.png`);
}

// The RSVP dialog, open.
await page.locator(".rsvp .btn-gold").click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/${LOCALE}-rsvp-modal.png` });
console.log(`  ${LOCALE}-rsvp-modal.png`);

await browser.close();
