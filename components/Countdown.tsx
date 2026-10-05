"use client";

import { useEffect, useState } from "react";
import { strings, type Locale } from "@/lib/i18n";
import { weddingDate } from "@/lib/datetime";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function remaining(target: number): Parts | null {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/**
 * Counts down to the exact instant in content.weddingDateISO.
 *
 * Rendered only after mount: the server and the client are in different
 * timezones and would disagree on the first paint, which React reports as a
 * hydration error.
 *
 * Each number and its unit is its own element. In Arabic a single
 * concatenated string of digits and words gets reordered by the bidirectional
 * algorithm and comes out scrambled — separate spans keep it correct.
 */
export default function Countdown({ locale }: { locale: Locale }) {
  const target = weddingDate().getTime();
  const [parts, setParts] = useState<Parts | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setParts(remaining(target));
    const id = window.setInterval(() => setParts(remaining(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (!mounted) return <p className="countdown-value">&nbsp;</p>;

  const s = strings(locale);
  if (!parts) return <p className="countdown-value">{s.hasBegun}</p>;

  const units: [number, string][] = [
    [parts.days, s.days],
    [parts.hours, s.hours],
    [parts.minutes, s.minutes],
    [parts.seconds, s.seconds],
  ];

  return (
    <p className="countdown-value" aria-live="off">
      {units.map(([value, label], i) => (
        <span className="countdown-unit" key={label}>
          <bdi className="countdown-number">{value}</bdi>{" "}
          <span className="countdown-label">{label}</span>
          {i < units.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
