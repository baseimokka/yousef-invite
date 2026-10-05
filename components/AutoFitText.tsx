"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shrinks text until it fits its container on a single line.
 *
 * The names inside the gilded frame have a fixed box to live in, and the brief
 * requires that they never wrap, never overflow and never touch the frame.
 * Long names — and Arabic, which sets to a very different width from Latin —
 * make a fixed font size impossible, so the size is measured rather than
 * guessed.
 *
 * Runs after the webfont has loaded, otherwise it would measure the fallback
 * font and settle on the wrong size.
 */
export default function AutoFitText({
  children,
  max,
  min = 12,
  className = "",
  /** Fraction of the container the text may occupy. */
  safeWidth = 0.88,
}: {
  children: string;
  max: number;
  min?: number;
  className?: string;
  safeWidth?: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState(max);

  const fit = useCallback(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;

    const available = box.clientWidth * safeWidth;
    if (available <= 0) return;

    let lo = min;
    let hi = max;
    let best = min;

    // 7 iterations resolve a 12-60px range to well under a pixel.
    for (let i = 0; i < 7; i++) {
      const mid = (lo + hi) / 2;
      text.style.fontSize = `${mid}px`;
      if (text.scrollWidth <= available) {
        best = mid;
        lo = mid;
      } else {
        hi = mid;
      }
    }

    text.style.fontSize = "";
    setSize(best);
  }, [max, min, safeWidth]);

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (!cancelled) fit();
    };

    run();

    // Re-measure once the real font is in place.
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(run).catch(() => {});
    }

    const box = boxRef.current;
    let observer: ResizeObserver | undefined;
    if (box && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(run);
      observer.observe(box);
    }
    window.addEventListener("resize", run);

    return () => {
      cancelled = true;
      observer?.disconnect();
      window.removeEventListener("resize", run);
    };
  }, [fit, children]);

  return (
    <div ref={boxRef} className={className} style={{ width: "100%" }}>
      <span
        ref={textRef}
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          fontSize: `${size}px`,
          lineHeight: 1.1,
        }}
      >
        {children}
      </span>
    </div>
  );
}
