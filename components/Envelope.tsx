"use client";

import { content } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n";
import { longDate } from "@/lib/datetime";
import { FloralCluster, EnvelopeRule } from "./Ornaments";

/**
 * The screen every guest sees first.
 *
 * Tapping "Open" is also what unlocks audio: mobile browsers refuse to play
 * sound without a user gesture, so the envelope is not just decoration — it
 * is what makes the music work at all.
 */
export default function Envelope({
  locale,
  closing,
  onOpen,
}: {
  locale: Locale;
  closing: boolean;
  onOpen: () => void;
}) {
  const groom = t(content.couple.groom.short, locale);
  const bride = t(content.couple.bride.short, locale);

  return (
    <div className={`envelope ${closing ? "is-closing" : ""}`}>
      <div className="envelope-sparkles" aria-hidden>
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} className={`sparkle sparkle-${i % 7}`} />
        ))}
      </div>

      <div className="envelope-card">
        <FloralCluster className="envelope-floral envelope-floral-tl" />
        <FloralCluster className="envelope-floral envelope-floral-br" />

        <div className="envelope-badge" aria-hidden>
          <svg viewBox="0 0 32 30" width="26" height="24">
            <path
              d="M16 28 C16 28 2 19.5 2 10.5 C2 5.5 5.8 2 10.2 2 C12.9 2 15.1 3.5 16 5.6
                 C16.9 3.5 19.1 2 21.8 2 C26.2 2 30 5.5 30 10.5 C30 19.5 16 28 16 28 Z"
              fill="#fff"
            />
          </svg>
        </div>

        <p className="envelope-name">{groom}</p>
        <p className="envelope-amp amp">&amp;</p>
        <p className="envelope-name">{bride}</p>

        <EnvelopeRule className="envelope-rule" />

        <p className="envelope-date">{longDate(locale)}</p>
        <p className="envelope-greeting">{t(content.envelope.greeting, locale)}</p>

        <button type="button" className="btn-gold envelope-open" onClick={onOpen}>
          <span className="envelope-open-sheen" aria-hidden />
          {t(content.envelope.openButton, locale)}
        </button>
      </div>
    </div>
  );
}
