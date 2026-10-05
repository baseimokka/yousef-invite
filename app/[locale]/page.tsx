import { notFound } from "next/navigation";
import Invitation from "@/components/Invitation";
import { isLocale, type Locale } from "@/lib/i18n";

/**
 * The invitation itself. The song comes from the language:
 *
 *   /en  ->  track "b"
 *   /ar  ->  track "a"
 */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  return <Invitation locale={locale} />;
}
