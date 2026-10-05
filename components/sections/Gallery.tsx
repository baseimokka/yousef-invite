"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { content } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n";
import Reveal from "../Reveal";

/**
 * The 3D coverflow carousel.
 *
 * It advances on its own so guests can simply watch, and stops for good the
 * moment someone swipes or taps an arrow — taking control should not leave
 * the photos sliding out from under them. It also holds still while the
 * gallery is off screen, so it is not quietly cycling photos nobody is
 * looking at.
 *
 * Only the slides within two places of the centre are rendered as images;
 * anything further out is invisible anyway and just costs memory on cheaper
 * phones.
 */
export default function Gallery({ locale }: { locale: Locale }) {
  const photos = content.gallery.photos;
  const { autoPlay } = content.gallery;
  const reduced = useReducedMotion();

  const [index, setIndex] = useState(0);
  // Explicitly boolean: content.ts is `as const`, so `enabled` has the
  // literal type `true` and inference would forbid ever setting it false.
  const [playing, setPlaying] = useState<boolean>(autoPlay.enabled);
  const [inView, setInView] = useState(false);
  const touchStart = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const count = photos.length;
  const go = (next: number) => setIndex(((next % count) + count) % count);

  /** Any deliberate navigation hands control to the guest permanently. */
  const takeOver = (next: number) => {
    setPlaying(false);
    go(next);
  };

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") takeOver(index + 1);
      if (e.key === "ArrowLeft") takeOver(index - 1);
    };
    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  });

  /* Only run while the gallery is actually on screen. */
  useEffect(() => {
    const node = stageRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView || reduced || count < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      autoPlay.intervalMs
    );
    return () => window.clearInterval(id);
  }, [playing, inView, reduced, count, autoPlay.intervalMs]);

  if (!count) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(delta) < 40) return;
    // Swiping is physical, so it is not mirrored in Arabic.
    takeOver(delta < 0 ? index + 1 : index - 1);
  };

  return (
    <section className="section gallery">
      <Reveal>
        <h2 className="heading">{t(content.gallery.heading, locale)}</h2>
      </Reveal>

      <Reveal>
        <div
          ref={stageRef}
          className="coverflow"
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {photos.map((photo, i) => {
            let offset = i - index;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            const distance = Math.abs(offset);
            if (distance > 2) return null;

            const style: React.CSSProperties = {
              transform: `translateX(${offset * 52}%) translateZ(${
                -distance * 160
              }px) rotateY(${offset * -34}deg) scale(${1 - distance * 0.08})`,
              zIndex: 10 - distance,
              opacity: distance > 1 ? 0 : 1,
              pointerEvents: offset === 0 ? "auto" : "none",
            };

            return (
              <div key={photo.src} className="coverflow-slide" style={style}>
                <img
                  src={photo.src}
                  alt={offset === 0 ? t(photo.alt, locale) : ""}
                  loading={distance === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        <div className="coverflow-controls">
          <button
            type="button"
            className="coverflow-arrow"
            onClick={() => takeOver(index - 1)}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <p className="coverflow-counter">
            <bdi>{index + 1}</bdi> / <bdi>{count}</bdi>
          </p>
          <button
            type="button"
            className="coverflow-arrow"
            onClick={() => takeOver(index + 1)}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      </Reveal>
    </section>
  );
}
