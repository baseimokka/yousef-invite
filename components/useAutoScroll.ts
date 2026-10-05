"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Walks the page down on its own once the envelope is open, so a guest can
 * simply watch the invitation rather than scroll it.
 *
 * Three rules keep it from becoming annoying:
 *
 *  - Any sign that the guest wants to scroll themselves — a wheel, a swipe,
 *    an arrow key — stops it permanently. It never fights for the scroll
 *    position, which is what makes most auto-scrollers unbearable.
 *  - It pauses while a dialog has the page locked, so opening the RSVP form
 *    does not leave the page creeping underneath it.
 *  - It does not run at all when the visitor prefers reduced motion.
 */
export function useAutoScroll(
  active: boolean,
  { speed, startDelay }: { speed: number; startDelay: number }
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || reduced || speed <= 0) return;

    let raf = 0;
    let timer = 0;
    let last = 0;
    let stopped = false;

    // Tracked as a float. Reading window.scrollY back each frame would round
    // to whole pixels, and at this speed a frame moves well under one pixel,
    // so the position would never advance.
    let position = window.scrollY;

    const stop = () => {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      for (const name of SCROLL_INTENT) {
        window.removeEventListener(name, stop);
      }
    };

    const step = (now: number) => {
      if (stopped) return;
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, 0.05); // ignore long tab-away gaps
      last = now;

      // A dialog locks the body; hold position until it closes.
      if (document.body.style.overflow !== "hidden") {
        const max =
          document.documentElement.scrollHeight - window.innerHeight;

        position += speed * dt;

        if (position >= max) {
          window.scrollTo({ top: max, behavior: "instant" as ScrollBehavior });
          stop();
          return;
        }

        // The page sets `scroll-behavior: smooth`, which would animate every
        // one of these and fight the loop. "instant" overrides it.
        window.scrollTo({ top: position, behavior: "instant" as ScrollBehavior });
      } else {
        position = window.scrollY;
      }

      raf = requestAnimationFrame(step);
    };

    for (const name of SCROLL_INTENT) {
      window.addEventListener(name, stop, { passive: true });
    }

    timer = window.setTimeout(() => {
      position = window.scrollY;
      raf = requestAnimationFrame(step);
    }, startDelay);

    return stop;
  }, [active, reduced, speed, startDelay]);
}

/**
 * Only unambiguous scrolling gestures. Deliberately not `pointerdown`, so
 * tapping the music button or a photo does not cancel the ride.
 */
const SCROLL_INTENT = ["wheel", "touchmove", "keydown"] as const;
