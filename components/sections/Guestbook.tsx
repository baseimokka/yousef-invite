"use client";

import { useEffect, useState } from "react";
import { content } from "@/lib/content";
import { strings, t, type Locale } from "@/lib/i18n";
import { FloralCluster } from "../Ornaments";
import Reveal from "../Reveal";

type Wish = { id: string; name: string; message: string; createdAt: string };

/** Ready-made wishes behind the wand button, for guests lost for words. */
const SUGGESTIONS: Record<Locale, string[]> = {
  en: [
    "Wishing you both a home full of light and a table that is always too small.",
    "To many more years of the two of you finishing each other's stories.",
    "Congratulations. May the love in this room follow you home.",
    "May your life together be as beautiful as this day.",
    "Here is to a lifetime of small joys and quiet mornings.",
  ],
  ar: [
    "نتمنى لكما بيتاً مليئاً بالنور ومائدة لا تتسع للأحبة أبداً.",
    "إلى سنوات طويلة تكملان فيها حكايات بعضكما البعض.",
    "مبروك. عسى أن يرافقكما هذا الحب إلى بيتكما.",
    "أتمنى أن تكون حياتكما معاً جميلة كجمال هذا اليوم.",
    "نخب عمر مليء بالأفراح الصغيرة والصباحات الهادئة.",
  ],
};

export default function Guestbook({ locale }: { locale: Locale }) {
  const s = strings(locale);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/guestbook")
      .then((r) => (r.ok ? r.json() : { wishes: [] }))
      .then((data) => {
        if (!cancelled) setWishes(data.wishes ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  function suggest() {
    const options = SUGGESTIONS[locale];
    const pick = options[Math.floor(Math.random() * options.length)];
    setMessage(pick);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError(s.errorName);
    if (!message.trim()) return setError(s.errorMessage);

    setError("");
    setState("sending");

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });

      if (res.status === 429) {
        setState("error");
        return setError(s.errorTooMany);
      }
      if (!res.ok) throw new Error("request failed");

      const data = await res.json();
      if (data.wish) setWishes((prev) => [data.wish, ...prev]);
      setName("");
      setMessage("");
      setState("done");
    } catch {
      setState("error");
      setError(s.errorGeneric);
    }
  }

  const formatted = (iso: string) =>
    new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en-US", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(new Date(iso));

  return (
    <section className="section guestbook">
      <FloralCluster className="ornament ornament-mirror guestbook-floral" />

      <Reveal>
        <h2 className="heading">{t(content.guestbook.heading, locale)}</h2>
      </Reveal>

      <Reveal>
        <form className="guestbook-form" onSubmit={submit}>
          <input
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={s.enterYourNameRequired}
            maxLength={80}
            aria-label={s.enterYourNameRequired}
          />
          <textarea
            className="field guestbook-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={s.enterYourWishes}
            maxLength={500}
            rows={4}
            aria-label={s.enterYourWishes}
          />

          <div className="guestbook-actions">
            <button
              type="button"
              className="guestbook-wand"
              onClick={suggest}
              aria-label={s.suggestWish}
              title={s.suggestWish}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path
                  d="M4 20L14 10M16.5 3.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5L13 7l2.5-1z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button type="submit" className="btn-gold" disabled={state === "sending"}>
              {state === "sending" ? s.sending : s.sendWishes}
            </button>
          </div>

          {error && <p className="guestbook-error">{error}</p>}
          {state === "done" && !error && (
            <p className="guestbook-thanks">{s.wishesThanks}</p>
          )}
        </form>
      </Reveal>

      <Reveal>
        <div className="wishes">
          {wishes.length === 0 ? (
            <p className="wishes-empty">{s.noWishesYet}</p>
          ) : (
            wishes.map((wish) => (
              <article key={wish.id} className="wish">
                <header className="wish-head">
                  <h3 className="wish-name">{wish.name}</h3>
                  <time className="wish-time" dateTime={wish.createdAt}>
                    {formatted(wish.createdAt)}
                  </time>
                </header>
                <p className="wish-message">{wish.message}</p>
              </article>
            ))
          )}
        </div>
      </Reveal>
    </section>
  );
}
