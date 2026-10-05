import type { L } from "./content";

export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Pick one language out of a bilingual value, falling back to English. */
export function t(value: L, locale: Locale): string {
  return value[locale]?.trim() || value.en;
}

/* -- Interface strings (everything not supplied by content.ts) ------------ */

export const ui = {
  en: {
    addToCalendar: "Add to Calendar",
    getDirections: "Get directions",
    openInMaps: "Open in Maps",
    at: "at",
    days: "days",
    hours: "hours",
    minutes: "min",
    seconds: "sec",
    hasBegun: "Today is the day",

    yourName: "Your name",
    enterYourName: "Enter your name",
    willYouAttend: "Will you attend?",
    willAttend: "I will attend",
    cannotAttend: "Sorry, I can't make it",
    howManyPeople: "How many people are coming?",
    confirm: "Confirm",
    close: "Close",
    rsvpThanks: "Thank you — your reply has been saved.",
    rsvpThanksDecline: "Thank you for letting us know. You will be missed.",

    enterYourNameRequired: "Enter your name*",
    enterYourWishes: "Enter your wishes*",
    sendWishes: "Send Wishes",
    wishesThanks: "Thank you for your kind words.",
    noWishesYet: "Be the first to leave a wish.",
    suggestWish: "Suggest a wish",

    sending: "Sending…",
    errorGeneric: "Something went wrong. Please try again.",
    errorName: "Please enter your name.",
    errorMessage: "Please write a message.",
    errorChoice: "Please choose an option.",
    errorTooMany: "Too many attempts. Please wait a moment.",

    playMusic: "Play music",
    pauseMusic: "Pause music",
    switchLanguage: "العربية",
  },

  ar: {
    addToCalendar: "أضف إلى التقويم",
    getDirections: "الاتجاهات",
    openInMaps: "افتح في الخرائط",
    at: "في",
    days: "يوم",
    hours: "ساعة",
    minutes: "دقيقة",
    seconds: "ثانية",
    hasBegun: "اليوم هو الموعد",

    yourName: "اسمك",
    enterYourName: "أدخل اسمك",
    willYouAttend: "هل ستحضر؟",
    willAttend: "سأحضر",
    cannotAttend: "عذراً، لن أتمكن من الحضور",
    howManyPeople: "كم عدد الحاضرين؟",
    confirm: "تأكيد",
    close: "إغلاق",
    rsvpThanks: "شكراً لك — تم حفظ ردك.",
    rsvpThanksDecline: "شكراً لإخبارنا. سنفتقدك.",

    enterYourNameRequired: "أدخل اسمك*",
    enterYourWishes: "اكتب تهنئتك*",
    sendWishes: "أرسل التهنئة",
    wishesThanks: "شكراً على كلماتك الطيبة.",
    noWishesYet: "كن أول من يترك تهنئة.",
    suggestWish: "اقترح تهنئة",

    sending: "جارٍ الإرسال…",
    errorGeneric: "حدث خطأ ما. حاول مرة أخرى.",
    errorName: "الرجاء إدخال اسمك.",
    errorMessage: "الرجاء كتابة رسالة.",
    errorChoice: "الرجاء اختيار أحد الخيارين.",
    errorTooMany: "محاولات كثيرة. انتظر قليلاً من فضلك.",

    playMusic: "تشغيل الموسيقى",
    pauseMusic: "إيقاف الموسيقى",
    switchLanguage: "English",
  },
} as const;

export type UIStrings = (typeof ui)["en"];

export function strings(locale: Locale): UIStrings {
  return ui[locale] as UIStrings;
}
