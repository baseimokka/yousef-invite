"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { content } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

import GoldDefs from "./GoldDefs";
import { useAutoScroll } from "./useAutoScroll";
import Envelope from "./Envelope";
import AudioFab from "./AudioFab";
import LanguageSwitch from "./LanguageSwitch";

import Hero from "./sections/Hero";
import Names from "./sections/Names";
import Gallery from "./sections/Gallery";
import ReceptionInfo from "./sections/ReceptionInfo";
import MiniCalendar from "./sections/MiniCalendar";
import Rsvp from "./sections/Rsvp";
import Venue from "./sections/Venue";
import DressCode from "./sections/DressCode";
import Schedule from "./sections/Schedule";
import Guestbook from "./sections/Guestbook";
import GiftBox from "./sections/GiftBox";

/** Which song to play. Normally derived from the language. */
export type TrackKey = "a" | "b";

export default function Invitation({
  locale,
  variant,
}: {
  locale: Locale;
  /** Omit to use the language's default song; set to force one. */
  variant?: TrackKey;
}) {
  /**
   * The song is chosen once, here: the language decides it, unless the URL
   * names one explicitly. Nothing downstream can change it, so a link can
   * never end up playing the other language's song.
   */
  const trackKey: TrackKey = variant ?? content.music.byLocale[locale];
  const track = content.music.tracks[trackKey];

  const [opened, setOpened] = useState(false);
  const [closing, setClosing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [audioMissing, setAudioMissing] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Starts only once the envelope is out of the way.
  useAutoScroll(opened && content.autoScroll.enabled, {
    speed: content.autoScroll.speed,
    startDelay: content.autoScroll.startDelay,
  });

  /** Keep React's idea of "playing" in step with the element's real state. */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => {
      setPlaying(true);
      setNeedsGesture(false);
    };
    const onPause = () => setPlaying(false);
    // No file uploaded yet, or a bad URL: hide the control rather than
    // leaving a button that can never do anything.
    const onError = () => {
      setAudioMissing(true);
      setNeedsGesture(false);
      setPlaying(false);
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const handleOpen = useCallback(() => {
    const audio = audioRef.current;

    // Start playback synchronously, inside the click handler. Awaiting
    // anything first would spend the user gesture and iOS would refuse.
    if (audio) {
      audio.volume = 0.65;
      const attempt = audio.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(() => setNeedsGesture(true));
      }
    }

    setClosing(true);
    window.setTimeout(() => setOpened(true), 650);
  }, []);

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      const attempt = audio.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(() => setNeedsGesture(true));
      }
    } else {
      audio.pause();
    }
  }, []);

  /**
   * If autoplay was refused, retry on the guest's next tap anywhere, then
   * stop listening. The track never changes and never plays muted.
   */
  useEffect(() => {
    if (!needsGesture) return;
    const retry = () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.play().catch(() => {});
    };
    document.addEventListener("pointerdown", retry, { once: true });
    return () => document.removeEventListener("pointerdown", retry);
  }, [needsGesture]);

  return (
    <>
      <GoldDefs />

      <audio
        ref={audioRef}
        src={track.src}
        loop
        preload="none"
        playsInline
        aria-hidden
      />

      {!opened && (
        <Envelope locale={locale} closing={closing} onOpen={handleOpen} />
      )}

      <main className={`paper ${opened ? "is-revealed" : ""}`} aria-hidden={!opened}>
        <div className="section-gap" />

        <Hero locale={locale} />
        <div className="section-gap" />

        <Names locale={locale} />
        <div className="section-gap" />

        {content.gallery.show && (
          <>
            <Gallery locale={locale} />
            <div className="section-gap" />
          </>
        )}

        {content.receptionInfo.show && (
          <>
            <ReceptionInfo locale={locale} />
            <div className="section-gap" />
          </>
        )}

        {content.receptionInfo.calendar.show && (
          <>
            <MiniCalendar locale={locale} />
            <div className="section-gap" />
          </>
        )}

        {content.rsvp.show && (
          <>
            <Rsvp locale={locale} />
            <div className="section-gap" />
          </>
        )}

        {content.venue.show && (
          <>
            <Venue locale={locale} />
            <div className="section-gap" />
          </>
        )}

        {content.dressCode.show && (
          <>
            <DressCode locale={locale} />
            <div className="section-gap" />
          </>
        )}

        {content.schedule.show && (
          <>
            <Schedule locale={locale} />
            <div className="section-gap" />
          </>
        )}

        {content.guestbook.show && (
          <>
            <Guestbook locale={locale} />
            <div className="section-gap" />
          </>
        )}

        {content.giftBox.show && (
          <>
            <GiftBox locale={locale} />
            <div className="section-gap" />
          </>
        )}
      </main>

      {opened && (
        <>
          {!audioMissing && (
            <AudioFab
              locale={locale}
              playing={playing}
              needsGesture={needsGesture}
              onToggle={toggleAudio}
            />
          )}
          <LanguageSwitch locale={locale} />
        </>
      )}
    </>
  );
}
