import type { Metadata } from "next";
import { notFound } from "next/navigation";

import "../globals.css";
import "../sections.css";
import { content } from "@/lib/content";
import { LOCALES, isLocale, dirOf, t, type Locale } from "@/lib/i18n";

/**
 * Fonts are linked at runtime rather than bundled with next/font.
 *
 * next/font downloads the files during `next build`, which makes every build
 * depend on Google Fonts being reachable. Linking the stylesheet keeps builds
 * offline-safe and lets the browser cache the faces normally. See the README
 * if you would rather self-host them.
 */
const FONT_HREF =
  "https://fonts.googleapis.com/css2" +
  "?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600" +
  "&family=Amiri:ital,wght@0,400;0,700;1,400" +
  "&family=Inter:wght@400;500;600;700" +
  "&display=swap";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";

  const title = t(content.share.title, locale);
  const description = t(content.share.description, locale);

  return {
    // Open Graph needs absolute URLs. This lets the image below stay a simple
    // relative path and still resolve correctly once deployed.
    metadataBase: new URL(siteUrl()),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      images: [{ url: OG_IMAGE.url, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
    // An invitation is for invited guests, not for search engines. This does
    // not affect link previews — WhatsApp and the rest still read the card.
    robots: { index: false, follow: false },
  };
}

/** The card people see when the link is shared. */
const OG_IMAGE = { url: "/ogimage.jpg", width: 720, height: 376 };

/**
 * Where the site lives. Set NEXT_PUBLIC_SITE_URL in Vercel to your real
 * domain; without it the preview image would point at localhost and no
 * messaging app could fetch it.
 */
function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#B97D3E",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  return (
    <html lang={locale} dir={dirOf(locale)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONT_HREF} />
      </head>
      <body>{children}</body>
    </html>
  );
}
