"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n";
import Reveal from "../Reveal";

/** The closing gift section. Tapping the box reveals the gift methods. */
export default function GiftBox({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const gift = content.giftBox;
  const hasMethods = gift.methods.length > 0;

  return (
    <section className="section gift">
      <Reveal>
        <h2 className="heading">{t(gift.heading, locale)}</h2>

        <button
          type="button"
          className={`gift-box ${open ? "is-open" : ""}`}
          onClick={() => hasMethods && setOpen((v) => !v)}
          aria-expanded={hasMethods ? open : undefined}
          disabled={!hasMethods}
        >
          <svg viewBox="0 0 200 180" className="gift-illustration" aria-hidden>
            {/* Small gifts scattered around the main box, as in the reference */}
            {[
              { x: 30, y: 56, s: 0.52, c: "#C4594C", r: -14 },
              { x: 158, y: 50, s: 0.46, c: "#6E8C62", r: 12 },
              { x: 24, y: 112, s: 0.42, c: "#8E3B3B", r: 8 },
              { x: 172, y: 104, s: 0.4, c: "#4A5C86", r: -10 },
              { x: 46, y: 140, s: 0.44, c: "#D8CFC0", r: -6 },
              { x: 150, y: 142, s: 0.5, c: "#C46A3E", r: 10 },
            ].map((g, i) => (
              <g key={i} transform={`translate(${g.x} ${g.y}) rotate(${g.r}) scale(${g.s})`}>
                <rect x="-20" y="-14" width="40" height="30" rx="3" fill={g.c} />
                <rect x="-22" y="-20" width="44" height="9" rx="2.5" fill={g.c} opacity="0.85" />
                <rect x="-4" y="-20" width="8" height="36" fill="#FBF4E6" opacity="0.9" />
                <path d="M0,-20 C-9,-30 -20,-30 -20,-23 C-20,-18 -9,-18 0,-20 Z" fill="#FBF4E6" opacity="0.9" />
                <path d="M0,-20 C9,-30 20,-30 20,-23 C20,-18 9,-18 0,-20 Z" fill="#FBF4E6" opacity="0.9" />
              </g>
            ))}

            {/* Sparkles */}
            {[
              [60, 42, 5], [142, 70, 4], [96, 34, 3.4],
              [36, 88, 3.4], [170, 128, 3], [78, 156, 3],
            ].map(([x, y, r], i) => (
              <path
                key={`sp${i}`}
                d={`M${x},${y - r} Q${x},${y} ${x + r},${y} Q${x},${y} ${x},${y + r} Q${x},${y} ${x - r},${y} Q${x},${y} ${x},${y - r} Z`}
                fill="#E3BE78"
              />
            ))}

            <g filter="url(#softShadow)">
              {/* Closed box: two lit faces plus a top, so it reads as solid */}
              <path d="M58 86 L100 104 L100 158 L58 140 Z" fill="url(#giftSide)" />
              <path d="M142 86 L100 104 L100 158 L142 140 Z" fill="url(#giftBody)" />

              {/* Ribbon running down each visible face */}
              <path d="M88 80 L100 86 L100 152 L88 146 Z" fill="url(#ribbonGrad)" opacity="0.55" />
              <path d="M112 80 L100 86 L100 152 L112 146 Z" fill="url(#ribbonGrad)" opacity="0.75" />

              {/* Printed floral sprigs */}
              <g opacity="0.65">
                <path d="M70 114 C74 108 80 106 84 108" stroke="#A8B88C" strokeWidth="1.2" fill="none" />
                <circle cx="72" cy="116" r="2.5" fill="#E8DCC4" />
                <circle cx="80" cy="110" r="2.1" fill="#E8DCC4" />
                <path d="M130 114 C126 108 120 106 116 108" stroke="#A8B88C" strokeWidth="1.2" fill="none" />
                <circle cx="128" cy="116" r="2.5" fill="#E8DCC4" />
                <circle cx="120" cy="110" r="2.1" fill="#E8DCC4" />
              </g>

              {/* Lid */}
              <g className="gift-lid">
                <path d="M100 60 L148 82 L100 104 L52 82 Z" fill="#FFFDF8" />
                <path d="M52 82 L100 104 L100 112 L52 90 Z" fill="url(#giftSide)" />
                <path d="M148 82 L100 104 L100 112 L148 90 Z" fill="url(#giftBody)" />
                <path d="M100 60 L110 64 L100 104 L90 100 Z" fill="url(#ribbonGrad)" opacity="0.7" />
              </g>

              {/* Bow: two closed loops, a knot, and two tails */}
              <g className="gift-bow">
                <path d="M100 62 C92 44 72 38 62 46 C52 54 60 68 78 69 C88 69 96 66 100 62 Z" fill="url(#ribbonGrad)" />
                <path d="M100 62 C108 44 128 38 138 46 C148 54 140 68 122 69 C112 69 104 66 100 62 Z" fill="url(#ribbonGrad)" />
                <path d="M100 62 C92 54 80 50 70 52 C80 54 92 58 100 62 Z" fill="#A87E3C" opacity="0.4" />
                <path d="M100 62 C108 54 120 50 130 52 C120 54 108 58 100 62 Z" fill="#A87E3C" opacity="0.4" />
                <path d="M96 66 C90 78 84 86 76 92 C86 90 94 82 99 70 Z" fill="url(#ribbonGrad)" />
                <path d="M104 66 C110 78 116 86 124 92 C114 90 106 82 101 70 Z" fill="url(#ribbonGrad)" />
                <ellipse cx="100" cy="62" rx="8" ry="6.5" fill="url(#ribbonGrad)" />
                <ellipse cx="97.5" cy="59.5" rx="2.6" ry="1.9" fill="#FBF0D8" opacity="0.65" />
              </g>
            </g>
          </svg>

          {hasMethods && <span className="gift-tap">{t(gift.tapToOpen, locale)}</span>}
        </button>

        {open && hasMethods && (
          <ul className="gift-methods">
            {gift.methods.map((method, i) => (
              <li key={i} className="gift-method">
                <p className="gift-method-label">{t(method.label, locale)}</p>
                <p className="gift-method-value">{method.value}</p>
                {method.qr && (
                  <img className="gift-qr" src={method.qr} alt="" loading="lazy" />
                )}
              </li>
            ))}
          </ul>
        )}

        {gift.thankYou.show && (
          <p className="gift-thanks">{t(gift.thankYou.text, locale)}</p>
        )}
      </Reveal>
    </section>
  );
}
