import { content } from "@/lib/content";
import { strings, t, type Locale } from "@/lib/i18n";
import { FiligreeDivider } from "../Ornaments";
import Reveal from "../Reveal";

/** Venue name, the embedded map, and directions. */
export default function Venue({ locale }: { locale: Locale }) {
  const s = strings(locale);
  // An exact pin when we have coordinates, a name search otherwise.
  const { lat, lng } = content.venue;
  const target =
    typeof lat === "number" && typeof lng === "number"
      ? `${lat},${lng}`
      : content.venue.mapQuery;
  const q = encodeURIComponent(target);

  // The keyless embed endpoint needs no API key and no billing account, which
  // is the right trade for a single invitation.
  const embed = `https://maps.google.com/maps?q=${q}&z=16&hl=${locale}&output=embed`;
  const open = `https://www.google.com/maps/search/?api=1&query=${q}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

  return (
    <section className="section venue">
      <Reveal>
        <FiligreeDivider className="venue-divider" />
        <h2 className="heading">{t(content.venue.heading, locale)}</h2>
        <p className="venue-name">{t(content.venue.name, locale)}</p>
        <p className="venue-city">{t(content.venue.city, locale)}</p>
        <div className="venue-hairline" aria-hidden />

        <div className="map-wrap">
          <iframe
            className="map-frame"
            src={embed}
            title={t(content.venue.name, locale)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a
            className="map-open"
            href={open}
            target="_blank"
            rel="noopener noreferrer"
          >
            {s.openInMaps}
            <span aria-hidden> ↗</span>
          </a>
        </div>

        <p className="venue-directions">
          <a href={directions} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
              <path
                d="M3 11L21 3l-8 18-2-7-8-3z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            {s.getDirections}
          </a>
        </p>
      </Reveal>
    </section>
  );
}
