/**
 * Checks the things that are easy to break and hard to notice:
 * horizontal overflow at every breakpoint, in both languages, and the two
 * links actually serving two different songs.
 *
 *   node scripts/verify.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3127";
const WIDTHS = [320, 360, 393, 430, 768, 1280];
const LOCALES = ["en", "ar"];

const browser = await chromium.launch();
let failures = 0;

function report(ok, label, detail = "") {
  if (!ok) failures++;
  console.log(`${ok ? "  PASS" : "  FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
}

/* -- 1. No horizontal overflow -------------------------------------------- */

console.log("\nHorizontal overflow (page must never scroll sideways):");

for (const locale of LOCALES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({
      viewport: { width, height: 852 },
      deviceScaleFactor: 2,
    });
  await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE}/${locale}`, { waitUntil: "domcontentloaded" });
    await page.locator(".envelope-open").click();
    await page.waitForTimeout(900);
    // (sections settle instantly under emulated reduced motion)
    await page.waitForTimeout(300);

    const { scrollW, clientW } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));

    report(scrollW <= clientW + 1, `${locale} @ ${width}px`, `scroll ${scrollW} vs client ${clientW}`);
    await page.close();
  }
}

/* -- 2. The language chooses the song ------------------------------------- */

console.log("\nSong follows the language:");

async function trackOf(path) {
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
  const src = await page.getAttribute("audio", "src");
  await page.close();
  return src;
}

const en = await trackOf("/en");
const ar = await trackOf("/ar");
const enA = await trackOf("/en/a");
const arB = await trackOf("/ar/b");

report(!!en && !!ar, "both languages have a song", `${en} / ${ar}`);
report(en !== ar, "the two languages play different songs");
report(/track-b/.test(en), "/en plays track B", en);
report(/track-a/.test(ar), "/ar plays track A", ar);
report(/track-a/.test(enA), "/en/a overrides to track A", enA);
report(/track-b/.test(arB), "/ar/b overrides to track B", arB);

// Kept for the language-switch check further down.
const b = arB;

/* -- 3. Direction is correct on first paint ------------------------------- */

console.log("\nDirection:");
for (const [locale, expected] of [["en", "ltr"], ["ar", "rtl"]]) {
  const page = await browser.newPage();
  await page.goto(`${BASE}/${locale}`, { waitUntil: "domcontentloaded" });
  const dir = await page.getAttribute("html", "dir");
  report(dir === expected, `${locale} is ${expected}`, `got ${dir}`);
  await page.close();
}

/* -- 4. The language switch keeps your place ------------------------------ */

console.log("\nLanguage switch preserves the music variant:");
{
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${BASE}/en/b`, { waitUntil: "domcontentloaded" });
  await page.locator(".envelope-open").click();
  await page.waitForTimeout(900);
  await page.click(".lang-switch");
  // Next navigates on the client, so there is no load event to wait for;
  // poll the address instead of waiting on a navigation that may already
  // have happened.
  let url = page.url();
  for (let i = 0; i < 25 && !url.endsWith("/ar/b"); i++) {
    await page.waitForTimeout(200);
    url = page.url();
  }
  report(url.endsWith("/ar/b"), "/en/b -> /ar/b", url);
  report(
    (await page.getAttribute("html", "dir")) === "rtl",
    "and switches to RTL"
  );
  report(
    (await page.getAttribute("audio", "src")) === b,
    "and keeps playing track B"
  );
  await page.close();
}

await browser.close();
console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
