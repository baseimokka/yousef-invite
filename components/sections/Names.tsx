import { content } from "@/lib/content";
import { strings, t, type Locale } from "@/lib/i18n";
import {
  dayNumber,
  displayTime,
  monthName,
  weekdayName,
  yearNumber,
} from "@/lib/datetime";
import { FiligreeSwirl } from "../Ornaments";
import Reveal from "../Reveal";

/**
 * The wedding date rendered as MONDAY │ 06 │ SEPTEMBER over 2027.
 *
 * `tone` exists because the reference colours this differently in the two
 * places it appears: gold under each ceremony, olive between the pillars.
 */
export function DateRow({
  locale,
  tone = "gold",
}: {
  locale: Locale;
  tone?: "gold" | "olive";
}) {
  return (
    <div className={`date-block ${tone === "olive" ? "is-olive" : ""}`}>
      <div className="date-row">
        <span className="date-side">{weekdayName(locale, undefined).toUpperCase()}</span>
        <span className="date-rule" aria-hidden />
        <span className="date-day">{dayNumber(locale)}</span>
        <span className="date-rule" aria-hidden />
        <span className="date-side">{monthName(locale).toUpperCase()}</span>
      </div>
      <p className="date-year">{yearNumber(locale)}</p>
    </div>
  );
}

/** Announcement, both full names, and the ceremony / reception details. */
export default function Names({ locale }: { locale: Locale }) {
  const s = strings(locale);

  return (
    <section className="section names">
      <FiligreeSwirl className="ornament ornament-mirror names-swirl-tr" />
      <FiligreeSwirl className="ornament ornament-mirror names-swirl-bl" />

      {content.announcement.show && (
        <Reveal>
          <p className="announcement">
            {t(content.announcement.text, locale)
              .split("\n")
              .map((line, i) => (
                <span key={i} className="announcement-line">
                  {line}
                </span>
              ))}
          </p>
        </Reveal>
      )}

      <Reveal className="full-names">
        <p className="full-name">{t(content.couple.groom.full, locale)}</p>
        <p className="full-names-amp amp">&amp;</p>
        <p className="full-name">{t(content.couple.bride.full, locale)}</p>
      </Reveal>

      {content.events.show &&
        content.events.items.map((event, i) => (
          <Reveal key={i} className="event">
            <h2 className="event-label">{t(event.label, locale)}</h2>
            <p className="event-venue">{t(event.venue, locale)}</p>
            <p className="event-at">{s.at}</p>
            <p className="event-time">{displayTime(event.time, locale)}</p>
            <DateRow locale={locale} />
          </Reveal>
        ))}
    </section>
  );
}
