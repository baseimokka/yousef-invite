/**
 * Guest-supplied text is never trusted.
 *
 * Control characters are filtered by code point rather than by a regular
 * expression: the escape sequences for them are easy to get subtly wrong, and
 * this version is impossible to misread. Tab and newline are kept so a wish
 * written over several lines survives.
 */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";

  let out = "";
  for (const char of value) {
    const code = char.codePointAt(0);
    if (code === undefined) continue;

    const isC0 = code < 32 && code !== 9 && code !== 10;
    const isC1 = code >= 127 && code <= 159;
    if (isC0 || isC1) continue;

    out += char;
  }

  return out.trim().slice(0, max);
}

/** Collapses runs of blank lines so one guest cannot stretch the page. */
export function cleanMessage(value: unknown, max: number): string {
  return cleanText(value, max).replace(/\n{3,}/g, "\n\n");
}
