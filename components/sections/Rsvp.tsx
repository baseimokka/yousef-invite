"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { content } from "@/lib/content";
import { strings, t, type Locale } from "@/lib/i18n";
import Reveal from "../Reveal";

type Choice = "yes" | "no" | null;

/**
 * The gold "Confirm Attendance" button and the dialog it opens.
 *
 * The dialog deliberately matches the reference screenshot — a plain white
 * sans-serif card rather than a baroque one. See README "Restyling the RSVP
 * dialog" to switch it to match the rest of the invitation.
 */
export default function Rsvp({ locale }: { locale: Locale }) {
  const s = strings(locale);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [choice, setChoice] = useState<Choice>(null);
  const [seats, setSeats] = useState(1);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  // Each section is its own stacking context, so a dialog rendered inside one
  // would be painted under the sections that follow it — the map iframe in
  // particular punches straight through. Portalling to <body> escapes that.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Close on Escape, trap focus loosely, and restore the page scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      openerRef.current?.focus();
    };
  }, [open]);

  async function submit() {
    if (!name.trim()) return setError(s.errorName);
    if (choice === null) return setError(s.errorChoice);

    setError("");
    setState("sending");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          attending: choice === "yes",
          partySize: choice === "yes" ? seats : 0,
        }),
      });

      if (res.status === 429) {
        setState("error");
        return setError(s.errorTooMany);
      }
      if (!res.ok) throw new Error("request failed");
      setState("done");
    } catch {
      setState("error");
      setError(s.errorGeneric);
    }
  }

  const maxSeats = content.rsvp.partySize === "limit" ? content.rsvp.maxSeats : 10;

  return (
    <section className="section rsvp">
      <Reveal>
        <button
          ref={openerRef}
          type="button"
          className="btn-gold"
          onClick={() => setOpen(true)}
        >
          {t(content.rsvp.buttonLabel, locale)}
        </button>
      </Reveal>

      {open &&
        mounted &&
        createPortal(
          <div
            className="modal-scrim"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
          <div
            ref={dialogRef}
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rsvp-title"
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setOpen(false)}
              aria-label={s.close}
            >
              ×
            </button>

            {state === "done" ? (
              <div className="modal-done">
                <div className="modal-done-mark" aria-hidden>
                  ✓
                </div>
                <p>{choice === "yes" ? s.rsvpThanks : s.rsvpThanksDecline}</p>
                <button
                  type="button"
                  className="modal-confirm is-ready"
                  onClick={() => setOpen(false)}
                >
                  {s.close}
                </button>
              </div>
            ) : (
              <>
                <h2 id="rsvp-title" className="modal-title">
                  {t(content.rsvp.title, locale)}
                </h2>
                <p className="modal-subtitle">{t(content.rsvp.subtitle, locale)}</p>

                <label className="modal-label" htmlFor="rsvp-name">
                  {s.yourName}
                </label>
                <input
                  id="rsvp-name"
                  className="modal-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={s.enterYourName}
                  maxLength={80}
                  autoComplete="name"
                />

                <p className="modal-label">{s.willYouAttend}</p>
                <div className="modal-options">
                  <button
                    type="button"
                    className={`modal-option ${choice === "yes" ? "is-selected" : ""}`}
                    onClick={() => setChoice("yes")}
                    aria-pressed={choice === "yes"}
                  >
                    <span className="modal-option-icon">✓</span>
                    {s.willAttend}
                  </button>
                  <button
                    type="button"
                    className={`modal-option ${choice === "no" ? "is-selected" : ""}`}
                    onClick={() => setChoice("no")}
                    aria-pressed={choice === "no"}
                  >
                    <span className="modal-option-icon">×</span>
                    {s.cannotAttend}
                  </button>
                </div>

                {choice === "yes" && content.rsvp.partySize === "choose" && (
                  <>
                    <label className="modal-label" htmlFor="rsvp-seats">
                      {s.howManyPeople}
                    </label>
                    <input
                      id="rsvp-seats"
                      className="modal-input"
                      type="number"
                      min={1}
                      max={maxSeats}
                      value={seats}
                      onChange={(e) =>
                        setSeats(
                          Math.max(1, Math.min(maxSeats, Number(e.target.value) || 1))
                        )
                      }
                      inputMode="numeric"
                    />
                  </>
                )}

                {error && <p className="modal-error">{error}</p>}

                <button
                  type="button"
                  className={`modal-confirm ${
                    name.trim() && choice !== null ? "is-ready" : ""
                  }`}
                  onClick={submit}
                  disabled={state === "sending" || !name.trim() || choice === null}
                >
                  {state === "sending" ? s.sending : s.confirm}
                </button>
              </>
            )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
