"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { strings, type Locale } from "@/lib/i18n";

/**
 * Swaps the locale prefix on the current path and nothing else.
 *
 * That matters: the music variant lives in the path ("/en/b"), so switching
 * language must preserve it. Going from /en/b to /ar/b keeps the guest on the
 * same track — only the words change.
 */
export default function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`;
  const other: Locale = locale === "en" ? "ar" : "en";

  const segments = pathname.split("/").filter(Boolean);
  segments[0] = other;
  const href = `/${segments.join("/")}`;

  return (
    <Link href={href} className="lang-switch" hrefLang={other} prefetch={false}>
      {strings(locale).switchLanguage}
    </Link>
  );
}
