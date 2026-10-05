"use client";

import { strings, type Locale } from "@/lib/i18n";

/**
 * The floating music button.
 *
 * `needsGesture` is true when the browser refused to autoplay. The button then
 * pulses to invite a tap, rather than showing a browser error. It never offers
 * a choice of track: which song plays is decided entirely by which of the two
 * links the guest opened.
 */
export default function AudioFab({
  locale,
  playing,
  needsGesture,
  onToggle,
}: {
  locale: Locale;
  playing: boolean;
  needsGesture: boolean;
  onToggle: () => void;
}) {
  const s = strings(locale);

  return (
    <button
      type="button"
      className={`audio-fab ${playing ? "is-playing" : ""} ${
        needsGesture ? "needs-gesture" : ""
      }`}
      onClick={onToggle}
      aria-label={playing ? s.pauseMusic : s.playMusic}
      aria-pressed={playing}
    >
      <span className="eq" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
