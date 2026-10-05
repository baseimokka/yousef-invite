import { content } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n";
import { displayTime } from "@/lib/datetime";
import { FiligreeSwirl, FloralCluster } from "../Ornaments";
import Reveal from "../Reveal";

/** The wedding-day timeline. */
export default function Schedule({ locale }: { locale: Locale }) {
  return (
    <section className="section schedule">
      <FiligreeSwirl className="ornament ornament-mirror schedule-swirl-1" />
      <FiligreeSwirl className="ornament ornament-mirror schedule-swirl-2" />
      <FloralCluster className="ornament ornament-mirror schedule-floral" />

      <Reveal>
        <h2 className="heading">{t(content.schedule.heading, locale)}</h2>
      </Reveal>

      <ol className="timeline">
        <span className="timeline-rail" aria-hidden />
        {content.schedule.items.map((item, i) => (
          <Reveal as="li" key={i} className="timeline-item" delay={i * 8}>
            <span className="timeline-time">{displayTime(item.time, locale)}</span>
            <span className="timeline-dot" aria-hidden />
            <span className="timeline-label">{t(item.label, locale)}</span>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
