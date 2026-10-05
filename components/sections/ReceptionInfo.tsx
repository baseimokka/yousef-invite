import { content } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n";
import { displayTime } from "@/lib/datetime";
import { Pillar } from "../Ornaments";
import Countdown from "../Countdown";
import Reveal from "../Reveal";
import { DateRow } from "./Names";

/** Reception details framed by the two gilded pillars, plus the countdown. */
export default function ReceptionInfo({ locale }: { locale: Locale }) {
  const info = content.receptionInfo;
  const wr = info.welcomeAndReception;

  return (
    <section className="section reception">
      {/* The pillars are a mirrored pair, so they are symmetrical overall and
          must not flip again in Arabic. */}
      <Pillar className="ornament pillar pillar-start" />
      <Pillar className="ornament pillar pillar-end" />

      <Reveal className="reception-inner">
        <h2 className="heading">{t(info.heading, locale)}</h2>
        <h3 className="heading reception-subheading">{t(info.subheading, locale)}</h3>

        <p className="reception-time">{displayTime(info.time, locale)}</p>

        <DateRow locale={locale} tone="olive" />

        {wr.show && (
          <div className="welcome-reception">
            <div className="wr-col">
              <p className="label-caps">{t(wr.welcomeLabel, locale)}</p>
              <p className="wr-time">{displayTime(wr.welcomeTime, locale)}</p>
            </div>
            <div className="wr-col">
              <p className="label-caps">{t(wr.receptionLabel, locale)}</p>
              <p className="wr-time">{displayTime(wr.receptionTime, locale)}</p>
            </div>
          </div>
        )}

        {info.countdown.show && (
          <div className="countdown">
            <h3 className="heading">{t(info.countdown.heading, locale)}</h3>
            <Countdown locale={locale} />
          </div>
        )}
      </Reveal>
    </section>
  );
}
