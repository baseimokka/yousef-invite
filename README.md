# Wedding Invitation — Baroque Gold

A single digital wedding invitation, in **Arabic and English**, with **two shareable links that each play a different song**, live **RSVP** and **guestbook** collection, and a **countdown**, **map**, **gallery** and **calendar**.

Built as a small Next.js app so it can receive RSVPs. Deploys to Vercel's free tier.

---

## 1. Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. It redirects to `/en`.

| URL | Language | Music |
|---|---|---|
| `/en` | English | Track A |
| `/en/b` | English | Track B |
| `/ar` | Arabic (RTL) | Track A |
| `/ar/b` | Arabic (RTL) | Track B |

---

## 2. Put in your details

**Everything lives in one file: [`lib/content.ts`](lib/content.ts).** Nothing else needs editing.

Every piece of text has an English and an Arabic version:

```ts
groom: {
  full:  { en: "Yousef Ahmed", ar: "يوسف أحمد" },
  short: { en: "Yousef",       ar: "يوسف" },
},
```

The placeholder content is copied from the reference screenshots on purpose, so you can see the design working before you swap anything in.

### The date

```ts
weddingDateISO: "2027-09-06T17:30:00-05:00",
timezone: "America/Bogota",
```

Always include the UTC offset. The countdown, the heart on the calendar and the "Add to Calendar" file all come from this one value, so every guest anywhere in the world counts down to the same moment.

### Hiding a section

Set its `show` flag to `false`:

```ts
dressCode: { show: false, ... }
```

---

## 3. Your photos

Drop them into `public/photos/` and list them in `lib/content.ts`:

```ts
photos: [
  { src: "/photos/01.jpg", alt: { en: "The couple", ar: "العروسان" } },
]
```

Portrait images around **3:4** match the layout best. There are eight placeholder images in there now — delete them once you add your own.

---

## 4. The two music links

This is the part that makes the two links different.

1. Put two MP3 files in `public/music/`.
2. Point `lib/content.ts` at them:

```ts
music: {
  a: { src: "/music/track-a.mp3", title: "First song" },
  b: { src: "/music/track-b.mp3", title: "Second song" },
},
```

Now `/en` plays the first song and `/en/b` plays the second. Everything else on the two links is identical.

**Use MP3.** Safari will not play OGG. Keep each file under about 4 MB so it starts quickly on mobile data.

### How the music starts

Phone browsers refuse to play sound until the guest taps something. That is exactly what the envelope's **Open** button is for — playback starts inside that tap. If a browser still blocks it, the floating music button pulses to invite a tap. It never falls back to the other track and never plays silently.

If you add no music files at all, the music button simply doesn't appear.

---

## 5. Deploying to Vercel

### 5.1 Push the project

```bash
git init
git add .
git commit -m "Wedding invitation"
git remote add origin <your-repo-url>
git push -u origin main
```

Then on [vercel.com](https://vercel.com): **Add New → Project → import the repo → Deploy.** No settings to change; Vercel detects Next.js.

### 5.2 Turn on storage, so RSVPs are saved

Without this the site works but **submissions are not kept**.

1. In your Vercel project: **Storage → Create Database → Upstash Redis** (free tier).
2. Connect it to the project. Vercel adds the environment variables for you.
3. **Redeploy.**

To confirm it worked, open `/api/admin?token=...` and check that `durableStorage` says `true`.

### 5.3 Set your admin token

In **Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `ADMIN_TOKEN` | a long random string you invent |
| `RATE_LIMIT_SALT` | any other random string |

Without `ADMIN_TOKEN` the admin endpoint stays locked rather than open.

---

## 6. Reading your RSVPs

| What | Where |
|---|---|
| Everything, as JSON | `/api/admin?token=YOUR_TOKEN` |
| A spreadsheet file | `/api/admin?token=YOUR_TOKEN&csv=1` |

The CSV opens directly in Excel or Google Sheets and contains every RSVP and every guestbook wish. The JSON view also gives you a summary: how many replied, how many are coming, and the total head count.

Guests' IP addresses are never stored — only a salted hash, used to stop one person flooding the guestbook.

---

## 7. Swapping in real artwork

The gold filigree, the frame around your names, the calendar corners, the pillars and the dividers are all **hand-drawn SVG** in [`components/Ornaments.tsx`](components/Ornaments.tsx). They stay sharp at any size and recolour from the palette.

The **flowers** and the **gift box** are stylised SVG stand-ins for the watercolour artwork in the reference screenshots. That artwork belongs to another product and could not be reused, so if you want photographic florals you will need to licence or commission them.

To swap one in, replace the component's contents with an image — the layout does not change:

```tsx
export function FloralCluster({ className, style }: OrnamentProps) {
  return <img src="/ornaments/floral.png" className={className} style={style} alt="" />;
}
```

---

## 8. Arabic and English

Switching language is a small pill button in the bottom corner. It swaps only the language part of the address, so a guest reading `/en/b` moves to `/ar/b` — **same song, same place on the page.**

A few things that are handled for you:

- The page is served with `lang` and `dir` already correct, so there is no flicker into the wrong direction.
- Decorative flourishes mirror in Arabic; **photographs, the map and the gift box do not.**
- The countdown is built from separate pieces rather than one sentence, because Arabic would otherwise scramble the order of the numbers.
- Numbers stay Western (`06`, not `٠٦`), which is the usual preference across the Gulf and Levant. To change that, set `NUMBERING` to `"arab"` in [`lib/datetime.ts`](lib/datetime.ts).

---

## 9. Notes and things you may want to change

**The RSVP dialog looks different from the rest.** It is a plain white sans-serif popup, because that is exactly what the reference screenshots show. Everything else is baroque. To make it match the invitation, edit the `.modal*` rules in [`app/sections.css`](app/sections.css) — swap `--font-ui` for `--font-serif`, the white background for `--ivory-card`, and add a `--tan-line` border.

**Colour contrast.** The olive and gold from the reference are gentle on ivory and sit below the WCAG AA threshold for small text. They were kept because matching the screenshots was the priority. If you would rather meet the standard, darken `--olive` to `#6F7245` and `--gold` to `#8A5B28` in [`app/globals.css`](app/globals.css); the design still reads the same.

**Fonts** load from Google Fonts at runtime (Cormorant Garamond for Latin, Amiri for Arabic). To self-host instead, download the `.woff2` files into `public/fonts/`, add `@font-face` rules to `globals.css`, and delete the `<link>` tags in `app/[locale]/layout.tsx`.

**Guestbook wishes publish immediately.** There is no approval step. Rate limiting allows three wishes a minute per person. If you would rather approve them first, add a `status` field in `lib/store.ts` and filter the `GET` in `app/api/guestbook/route.ts`.

**The invitation is set to `noindex`** so it will not turn up in search results. It is private by link only.

---

## 10. Project layout

```
lib/content.ts            <- all your wedding details (edit this)
lib/i18n.ts               <- interface text in both languages
lib/datetime.ts           <- date, time and calendar formatting
lib/store.ts              <- saving RSVPs and wishes
lib/sanitize.ts           <- cleaning guest-submitted text

app/[locale]/             <- /en and /ar
app/[locale]/[variant]/   <- /en/b and /ar/b  (the second music link)
app/api/rsvp/             <- receives RSVPs
app/api/guestbook/        <- receives and serves wishes
app/api/admin/            <- your private read-out
app/api/calendar.ics/     <- the add-to-calendar file
app/globals.css           <- colours, fonts, spacing
app/sections.css          <- every section's layout

components/Ornaments.tsx  <- all the gold decoration, as SVG
components/sections/      <- one file per section of the invitation

public/photos/            <- your photos
public/music/             <- your two songs
reference/                <- the original screenshots, for comparison
```
