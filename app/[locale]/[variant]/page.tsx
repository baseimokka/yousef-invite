import { notFound } from "next/navigation";
import Invitation, { type TrackKey } from "@/components/Invitation";
import { isLocale, type Locale } from "@/lib/i18n";

const TRACKS: TrackKey[] = ["a", "b"];

/**
 * Forces a particular song regardless of language:
 *
 *   /en/a  /en/b  /ar/a  /ar/b
 *
 * Anything else 404s rather than quietly falling back, so a mistyped link
 * can never serve the wrong song.
 */
export function generateStaticParams() {
  return TRACKS.map((variant) => ({ variant }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; variant: string }>;
}) {
  const { locale: raw, variant } = await params;
  if (!isLocale(raw)) notFound();
  if (!TRACKS.includes(variant as TrackKey)) notFound();

  const locale: Locale = raw;
  return <Invitation locale={locale} variant={variant as TrackKey} />;
}
