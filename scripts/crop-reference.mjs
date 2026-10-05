/**
 * Crops and magnifies regions of the Baroque Gold marketing sheet so the
 * design can be read precisely. The sheet is 1440x1920 with three narrow
 * columns; at thumbnail scale the detail is unreadable.
 *
 *   node scripts/crop-reference.mjs
 */
import { chromium } from "playwright";
import { mkdir, readFile } from "node:fs/promises";

const SRC = "reference/baroque_gold.7e37f580.webp";
const OUT = "screenshots/reference-crops";
const ZOOM = 2.6;

await mkdir(OUT, { recursive: true });
const data = await readFile(SRC);
const dataUrl = `data:image/webp;base64,${data.toString("base64")}`;

const browser = await chromium.launch();

/** x, y, w, h in the source image's own pixels. */
async function crop(name, x, y, w, h) {
  const page = await browser.newPage({
    viewport: { width: Math.round(w * ZOOM), height: Math.round(h * ZOOM) },
  });
  await page.setContent(`
    <style>
      html,body{margin:0;padding:0;background:#fff;overflow:hidden}
      .v{position:relative;width:${w * ZOOM}px;height:${h * ZOOM}px;overflow:hidden}
      img{position:absolute;left:${-x * ZOOM}px;top:${-y * ZOOM}px;
          width:${1440 * ZOOM}px;height:${1920 * ZOOM}px;
          image-rendering:auto}
    </style>
    <div class="v"><img src="${dataUrl}"></div>
  `);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`  ${name}.png  (${w}x${h} @${ZOOM}x)`);
  await page.close();
}

// Column bounds measured off the sheet.
const COLS = { a: 326, b: 600, c: 874 };
const W = 242;

console.log("Cropping reference sheet:");

// Column 1 — welcome, frame, families, names, ceremony, gallery
await crop("c1-1-frame", COLS.a, 364, W, 330);
await crop("c1-2-families", COLS.a, 690, W, 120);
await crop("c1-3-names", COLS.a, 800, W, 220);
await crop("c1-4-events", COLS.a, 1010, W, 310);
await crop("c1-5-gallery", COLS.a, 1310, W, 380);

// Column 2 — pillars, countdown, calendar, RSVP, venue, dress code
await crop("c2-1-pillars", COLS.b, 364, W, 420);
await crop("c2-2-calendar", COLS.b, 780, W, 290);
await crop("c2-3-rsvp-divider", COLS.b, 1060, W, 160);
await crop("c2-4-venue", COLS.b, 1170, W, 300);
await crop("c2-5-dresscode", COLS.b, 1460, W, 230);

// Column 3 — schedule, guestbook, gift box
await crop("c3-1-schedule", COLS.c, 364, W, 420);
await crop("c3-2-guestbook", COLS.c, 780, W, 330);
await crop("c3-3-wishes", COLS.c, 1050, W, 330);
await crop("c3-4-gift", COLS.c, 1370, W, 320);

await browser.close();
console.log(`\nWrote to ${OUT}`);
