import { content } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n";
import Reveal from "../Reveal";

/** Suggested attire plus the colour palette swatches. */
export default function DressCode({ locale }: { locale: Locale }) {
  return (
    <section className="section dress-code">
      <Reveal>
        <h2 className="heading">{t(content.dressCode.heading, locale)}</h2>
        <p className="dress-label">{t(content.dressCode.label, locale)}</p>
        <div className="dress-swatches">
          {content.dressCode.colors.map((color) => (
            <span
              key={color}
              className="dress-swatch"
              style={{ background: color }}
              title={color}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
