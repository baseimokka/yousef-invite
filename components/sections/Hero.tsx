import { content } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n";
import { CartoucheFrame, FloralCluster } from "../Ornaments";
import AutoFitText from "../AutoFitText";
import Reveal from "../Reveal";

/** Welcome heading, the gilded frame with the names, and both families. */
export default function Hero({ locale }: { locale: Locale }) {
  const groom = t(content.couple.groom.short, locale).toUpperCase();
  const bride = t(content.couple.bride.short, locale).toUpperCase();

  const { families } = content;
  const first = families.displayOrder === "groom" ? families.groom : families.bride;
  const second = families.displayOrder === "groom" ? families.bride : families.groom;

  return (
    <section className="section hero">
      <FloralCluster className="ornament ornament-mirror hero-floral-tr" />
      <FloralCluster className="ornament ornament-mirror hero-floral-bl" />

      <Reveal>
        <p className="eyebrow hero-eyebrow">{t(content.openingWords, locale)}</p>
      </Reveal>

      <Reveal className="hero-frame-wrap">
        <CartoucheFrame className="hero-frame ornament-mirror" />
        <FloralCluster className="hero-frame-floral hffl ornament-mirror" />
        <FloralCluster className="hero-frame-floral hffbr ornament-mirror" />
        <div className="hero-names">
          <AutoFitText max={34} min={13} className="hero-name">
            {groom}
          </AutoFitText>
          <span className="hero-amp amp">&amp;</span>
          <AutoFitText max={34} min={13} className="hero-name">
            {bride}
          </AutoFitText>
        </div>
      </Reveal>

      {families.show && (
        <Reveal className="families">
          {t(families.heading, locale) && (
            <h2 className="heading families-heading">{t(families.heading, locale)}</h2>
          )}
          <div className="families-grid">
            <div className="family">
              <p className="family-title">{t(first.parentTitle, locale)}</p>
              <p className="family-name">{t(first.father, locale)}</p>
              <p className="family-name">{t(first.mother, locale)}</p>
            </div>
            <div className="family">
              <p className="family-title">{t(second.parentTitle, locale)}</p>
              <p className="family-name">{t(second.father, locale)}</p>
              <p className="family-name">{t(second.mother, locale)}</p>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
