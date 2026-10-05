/* ============================================================================
 *  THE ONLY FILE YOU NEED TO EDIT
 * ----------------------------------------------------------------------------
 *  Every word, name, time, photo and song on the invitation comes from here.
 *  Each piece of text has an English (`en`) and an Arabic (`ar`) version.
 *
 *  The details below were read from your existing invitation page. The Arabic
 *  translations are my best attempt — please check them, especially the names.
 *
 *  To hide any section, set its `show` flag to false.
 * ========================================================================== */

/** A piece of text in both languages. */
export type L = { en: string; ar: string };

export type ScheduleItem = { time: string; label: L };
export type Photo = { src: string; alt: L };
export type GiftMethod = { label: L; value: string; qr?: string };

export const content = {
  /* -- Timing ------------------------------------------------------------- */

  /**
   * The single source of truth for the countdown, the heart on the calendar
   * and the "add to calendar" file. The offset (+03:00) is Cairo in October,
   * so every guest anywhere counts down to the same moment.
   */
  weddingDateISO: "2026-10-17T19:00:00+03:00",

  /** IANA timezone of the venue. Used to format dates consistently. */
  timezone: "Africa/Cairo",

  /** "24h" shows 19:00 · "12h" shows 7:00 PM */
  timeFormat: "12h" as "24h" | "12h",

  /* -- The couple --------------------------------------------------------- */

  couple: {
    groom: {
      full: { en: "Yousef Okka", ar: "يوسف عكة" },
      short: { en: "Yousef", ar: "يوسف" },
    },
    bride: {
      full: { en: "Mariam Sherif", ar: "مريم شريف" },
      short: { en: "Mariam", ar: "مريم" },
    },
  },

  /* -- Envelope (the screen guests see first) ----------------------------- */

  envelope: {
    greeting: { en: "Cordially Invites", ar: "يتشرفان بدعوتكم" },
    openButton: { en: "Open", ar: "افتح" },
  },

  /* -- Opening heading ---------------------------------------------------- */

  openingWords: {
    en: "Welcome To Our Engagement",
    ar: "أهلاً بكم في حفل خطوبتنا",
  },

  /* -- Families -----------------------------------------------------------
   *  Your invitation names the couple rather than their parents, so this is
   *  off. Turn it on and fill it in if you would like it shown.
   * ---------------------------------------------------------------------- */

  families: {
    show: false,
    heading: { en: "Engagement Ceremony Info", ar: "تفاصيل حفل الخطوبة" },
    /** "groom" puts the groom's family in the first column. */
    displayOrder: "groom" as "groom" | "bride",
    groom: {
      parentTitle: { en: "Mr. & Mrs.", ar: "السيد والسيدة" },
      father: { en: "", ar: "" },
      mother: { en: "", ar: "" },
    },
    bride: {
      parentTitle: { en: "Mr. & Mrs.", ar: "السيد والسيدة" },
      father: { en: "", ar: "" },
      mother: { en: "", ar: "" },
    },
  },

  /* -- Announcement ------------------------------------------------------- */

  announcement: {
    show: true,
    text: {
      en: "With great joy we invite you\nto share this special day with us",
      ar: "بكل الفرح ندعوكم\nلمشاركتنا هذا اليوم المميز",
    },
  },

  /* -- The ceremony ------------------------------------------------------- */

  events: {
    show: true,
    items: [
      {
        label: { en: "Engagement Ceremony", ar: "حفل الخطوبة" },
        venue: { en: "Al-Andalusia Halls", ar: "قاعات حفلات الاندلسية" },
        time: "19:00",
      },
    ],
  },

  /* -- Photo gallery ------------------------------------------------------ */

  gallery: {
    show: true,
    heading: { en: "Photo Gallery", ar: "معرض الصور" },

    /** The gallery advances on its own until a guest swipes or taps. */
    autoPlay: { enabled: true, intervalMs: 3200 },
    /** Your own photographs. Add more by dropping them in /public/photos/. */
    photos: [
      { src: "/photos/01.jpg", alt: { en: "Yousef and Mariam", ar: "يوسف ومريم" } },
      { src: "/photos/02.jpg", alt: { en: "Yousef and Mariam", ar: "يوسف ومريم" } },
      { src: "/photos/03.jpg", alt: { en: "Yousef and Mariam", ar: "يوسف ومريم" } },
      { src: "/photos/04.jpg", alt: { en: "Yousef and Mariam", ar: "يوسف ومريم" } },
    ] as Photo[],
  },

  /* -- Party info, countdown and calendar --------------------------------- */

  receptionInfo: {
    show: true,
    heading: { en: "Engagement Party Info", ar: "تفاصيل حفل الخطوبة" },
    subheading: {
      en: "The engagement party will take place at:",
      ar: "سيقام حفل الخطوبة في:",
    },
    /** The large time shown between the pillars. */
    time: "19:00",
    /** Your invitation shows a single time, so this pair is off. */
    welcomeAndReception: {
      show: false,
      welcomeLabel: { en: "Welcome", ar: "الترحيب" },
      welcomeTime: "18:30",
      receptionLabel: { en: "Reception", ar: "الاستقبال" },
      receptionTime: "19:00",
    },
    countdown: { show: true, heading: { en: "Countdown", ar: "العد التنازلي" } },
    calendar: { show: true },
  },

  /* -- RSVP --------------------------------------------------------------- */

  rsvp: {
    show: true,
    buttonLabel: { en: "Confirm Attendance", ar: "تأكيد الحضور" },
    title: { en: "Confirm your attendance", ar: "أكّد حضورك" },
    subtitle: {
      en: "Your presence would be an honor. Please RSVP so we can prepare the warmest welcome for you.",
      ar: "حضوركم شرف لنا. نرجو تأكيد الحضور حتى نتمكن من إعداد أحرّ استقبال لكم.",
    },
    /** "choose" lets guests enter a number · "limit" fixes it to `maxSeats`. */
    partySize: "choose" as "choose" | "limit",
    maxSeats: 2,
  },

  /* -- Venue and map ------------------------------------------------------ */

  venue: {
    show: true,
    heading: { en: "Engagement Party Venue", ar: "مكان حفل الخطوبة" },
    name: { en: "Al-Andalusia Halls", ar: "قاعات حفلات الاندلسية" },
    city: { en: "BellaRose, Cairo", ar: "بيلاروز، القاهرة" },

    /**
     * Exact pin, read from the Google Maps link you sent. Coordinates beat a
     * text search: the map can never land on a different place with a similar
     * name, and it still needs no API key.
     */
    lat: 30.0612723,
    lng: 31.2999311,

    /** Only used if lat/lng are removed. */
    mapQuery: "قاعه الاندلسيه",
  },

  /* -- Dress code ---------------------------------------------------------
   *  Removed from the invitation.
   * ---------------------------------------------------------------------- */

  dressCode: {
    show: false,
    heading: { en: "Dress Code", ar: "قواعد اللباس" },
    label: { en: "Party Attire", ar: "ملابس السهرة" },
    colors: ["#3B2A1D", "#6E5541", "#E7C6A6"],
  },

  /* -- Schedule -----------------------------------------------------------
   *  Not on your invitation, so it is off. Turn it on and list the evening's
   *  timings if you would like guests to follow along.
   * ---------------------------------------------------------------------- */

  schedule: {
    show: false,
    heading: { en: "Engagement Day Schedule", ar: "برنامج يوم الخطوبة" },
    items: [
      { time: "19:00", label: { en: "Guests arrive", ar: "وصول الضيوف" } },
      { time: "20:00", label: { en: "The ceremony", ar: "مراسم الخطوبة" } },
      { time: "21:00", label: { en: "Dinner is served", ar: "تقديم العشاء" } },
    ] as ScheduleItem[],
  },

  /* -- Guestbook ---------------------------------------------------------- */

  guestbook: {
    show: true,
    heading: { en: "Guestbook", ar: "سجل التهاني" },
  },

  /* -- Gift box -----------------------------------------------------------
   *  Removed from the invitation.
   * ---------------------------------------------------------------------- */

  giftBox: {
    show: false,
    heading: { en: "Gift Box", ar: "صندوق الهدايا" },
    tapToOpen: { en: "Tap to open", ar: "اضغط للفتح" },
    methods: [] as GiftMethod[],
    thankYou: {
      show: true,
      text: {
        en: "Your presence would be the greatest gift we could receive!",
        ar: "حضوركم هو أجمل هدية يمكن أن نتلقاها!",
      },
    },
  },

  /* -- Auto-scroll --------------------------------------------------------
   *  After the envelope opens, the page walks itself down so guests can just
   *  watch. It stops for good the moment they scroll, swipe or press a key.
   * ---------------------------------------------------------------------- */

  autoScroll: {
    enabled: true,
    /** Pixels per second. 30 is a slow read; 60 moves briskly. */
    speed: 38,
    /** Pause before it starts, in milliseconds. */
    startDelay: 1800,
  },

  /* -- Music --------------------------------------------------------------
   *  The language chooses the song.
   *
   *    /en  ->  track "b"
   *    /ar  ->  track "a"
   *
   *  So the two links you share are simply the English one and the Arabic
   *  one. Everything else on them is identical.
   *
   *  You can still force a specific song with /en/a, /en/b, /ar/a or /ar/b,
   *  which is useful if you want to send someone a particular version.
   *
   *  Put the files in /public/music/. MP3 is the safest format — Safari does
   *  not play OGG.
   * ---------------------------------------------------------------------- */

  music: {
    tracks: {
      a: { src: "/music/track-a.mp3", title: "Track A" },
      b: { src: "/music/track-b.mp3", title: "Track B" },
    },
    /** Which song each language plays by default. */
    byLocale: { en: "b", ar: "a" } as const,
  },

  /* -- Social share preview ----------------------------------------------- */

  share: {
    title: { en: "Yousef & Mariam", ar: "يوسف ومريم" },
    description: {
      en: "We invite you to the engagement of Yousef & Mariam",
      ar: "ندعوكم لحضور حفل خطوبة يوسف ومريم",
    },
  },
} as const;

export type Content = typeof content;
