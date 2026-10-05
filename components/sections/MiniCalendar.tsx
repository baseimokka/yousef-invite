import { content } from "@/lib/content";
import { strings, type Locale } from "@/lib/i18n";
import {
  calendarGrid,
  monthAndYear,
  weekdayInitials,
  weddingDayOfMonth,
} from "@/lib/datetime";
import { CalendarCorner, HeartShape } from "../Ornaments";
import Reveal from "../Reveal";

/** The gold-framed mini calendar, with the wedding day marked by a heart. */
export default function MiniCalendar({ locale }: { locale: Locale }) {
  const cells = calendarGrid();
  const weekdays = weekdayInitials(locale);
  const weddingDay = weddingDayOfMonth();
  const s = strings(locale);

  return (
    <section className="section calendar-section">
      <Reveal>
        <div className="calendar">
          {/* One corner drawing, rotated into each corner. */}
          <CalendarCorner className="calendar-corner cc-tl" />
          <CalendarCorner className="calendar-corner cc-tr" />
          <CalendarCorner className="calendar-corner cc-bl" />
          <CalendarCorner className="calendar-corner cc-br" />

          <p className="calendar-month">{monthAndYear(locale)}</p>

          <div className="calendar-weekdays">
            {weekdays.map((day, i) => (
              <span key={i} className="calendar-weekday">
                {day}
              </span>
            ))}
          </div>

          <div className="calendar-rule" aria-hidden />

          <div className="calendar-grid">
            {cells.map((day, i) =>
              day === null ? (
                <span key={`e${i}`} className="calendar-cell is-empty" />
              ) : day === weddingDay ? (
                <span key={day} className="calendar-cell is-wedding">
                  <HeartShape className="calendar-heart" />
                  <b>{day}</b>
                </span>
              ) : (
                <span key={day} className="calendar-cell">
                  {day}
                </span>
              )
            )}
          </div>
        </div>

        <p className="calendar-add">
          <a href="/api/calendar.ics" download="wedding.ics">
            {s.addToCalendar}
          </a>
        </p>
      </Reveal>
    </section>
  );
}
