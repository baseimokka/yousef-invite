/**
 * Renders the invitation at the exact reference viewport and saves
 * screenshots to ./screenshots, so the result can be compared against the
 * originals in ./reference.
 *
 *   node scripts/shoot.mjs [baseUrl]
 *
 * The reference captures are 739 x 1600 of a 393 x 852 viewport at DPR 3,
 * so that is what is used here.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.argv[2] ?? "http://localhost:3124";
const OUT = "screenshots";

const VIEWPORT = { width: 393, height: 852 };
const DPR = 3;

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

async function shoot(path, name, { open = true, full = false } = {}) {
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: DPR,
    isMobile: true,
    hasTouch: true,
  });
  await page.emulateMedia({ reducedMotion: "reduce" });

  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });

  if (open) {
    // Step past the envelope into the invitation itself.
    await page.locator(".envelope-open").click();
    await page.waitForTimeout(1200);
    // Let every reveal animation finish before capturing.
    // (sections settle instantly under emulated reduced motion)
    await page.waitForTimeout(600);
  }

  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
  console.log(`  ${name}.png`);
  await page.close();
}

console.log("Capturing:");

// The envelope, before anything is tapped.
await shoot("/en", "01-envelope-en", { open: false });
await shoot("/ar", "02-envelope-ar", { open: false });

// The whole invitation, top to bottom.
await shoot("/en", "03-full-en", { full: true });
await shoot("/ar", "04-full-ar", { full: true });

// The second music link renders identically.
await shoot("/en/b", "05-full-en-b", { full: true });

await browser.close();
console.log(`\nDone. Compare ./${OUT} against ./reference`);
