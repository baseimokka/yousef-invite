"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Every gradient and filter the ornaments paint with, rendered once per page.
 *
 * A bright stop drifts slowly across the gilt gradient, which reads as light
 * travelling over metal. It is driven by SVG's own animation rather than CSS
 * because gradient stops are not CSS-animatable — and it is left out of the
 * markup entirely when the visitor prefers reduced motion, so there is no
 * animation to pause rather than one running at zero duration.
 */
export default function GoldDefs() {
  const reduced = useReducedMotion();

  return (
    <svg
      width="0"
      height="0"
      aria-hidden
      focusable="false"
      style={{ position: "absolute" }}
    >
      <defs>
        {/* -- Gilding ----------------------------------------------------- */}
        <linearGradient id="gilt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B97D3E" />
          <stop offset="0.26" stopColor="#D8AE72" />
          <stop offset="0.5" stopColor="#F4E4C2">
            {!reduced && (
              <animate
                attributeName="offset"
                values="0.14;0.86;0.14"
                dur="11s"
                repeatCount="indefinite"
                calcMode="spline"
                keyTimes="0;0.5;1"
                keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
              />
            )}
          </stop>
          <stop offset="0.74" stopColor="#C99857" />
          <stop offset="1" stopColor="#9A6329" />
        </linearGradient>

        <linearGradient id="giltSoft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E3C08C" />
          <stop offset="50%" stopColor="#C08A4A" />
          <stop offset="100%" stopColor="#A26B2E" />
        </linearGradient>

        {/* A paler gilding for the fine, feathery filigree. */}
        <linearGradient id="giltPale" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E9CFA2" />
          <stop offset="48%" stopColor="#CFA169" />
          <stop offset="100%" stopColor="#B07E42" />
        </linearGradient>

        <linearGradient id="marble" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C8BAA3" />
          <stop offset="12%" stopColor="#EFE7DA" />
          <stop offset="34%" stopColor="#FCF9F3" />
          <stop offset="58%" stopColor="#F1E9DC" />
          <stop offset="82%" stopColor="#DDD1BE" />
          <stop offset="100%" stopColor="#BFB099" />
        </linearGradient>

        {/* -- Florals ------------------------------------------------------ */}
        {/* Petals are lit from the upper left, so each one runs from near
            white at the tip to a warm shadow where it meets the centre. */}
        <linearGradient id="petalFront" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#FBF6EC" />
          <stop offset="100%" stopColor="#EADCC6" />
        </linearGradient>

        <linearGradient id="petalBack" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#F7F1E6" />
          <stop offset="60%" stopColor="#EDE3D2" />
          <stop offset="100%" stopColor="#DCCCB1" />
        </linearGradient>

        <radialGradient id="flowerHeart" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="#F3D79A" />
          <stop offset="55%" stopColor="#D7A64F" />
          <stop offset="100%" stopColor="#A9741F" />
        </radialGradient>

        <linearGradient id="leafGrad" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#B6C29D" />
          <stop offset="45%" stopColor="#97A77E" />
          <stop offset="100%" stopColor="#71815B" />
        </linearGradient>

        <linearGradient id="leafGradLight" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#CBD4B6" />
          <stop offset="50%" stopColor="#AEBB93" />
          <stop offset="100%" stopColor="#8B9A71" />
        </linearGradient>

        <radialGradient id="berry" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0%" stopColor="#F6E3B4" />
          <stop offset="60%" stopColor="#DCB165" />
          <stop offset="100%" stopColor="#B4832F" />
        </radialGradient>

        {/* -- Gift box ------------------------------------------------------ */}
        <linearGradient id="giftBody" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#FFFDF9" />
          <stop offset="48%" stopColor="#F6EEDF" />
          <stop offset="100%" stopColor="#E2D3B8" />
        </linearGradient>

        <linearGradient id="giftSide" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#EFE4D0" />
          <stop offset="100%" stopColor="#D8C6A6" />
        </linearGradient>

        <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2DCB0" />
          <stop offset="40%" stopColor="#DCBB80" />
          <stop offset="100%" stopColor="#B78C47" />
        </linearGradient>

        {/* -- Depth --------------------------------------------------------- */}
        {/* A soft contact shadow. Watercolour artwork has no hard edges, so
            this is what keeps the vector stand-ins from looking like stickers. */}
        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0.6"
            dy="1.6"
            stdDeviation="1.8"
            floodColor="#8A6B45"
            floodOpacity="0.22"
          />
        </filter>

        <filter id="petalShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow
            dx="0.4"
            dy="1"
            stdDeviation="1.1"
            floodColor="#9A8158"
            floodOpacity="0.3"
          />
        </filter>
      </defs>
    </svg>
  );
}
