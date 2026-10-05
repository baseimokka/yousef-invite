# PROJECT ANALYSIS REPORT
## Premium Digital Wedding Invitation Platform — "Baroque Gold"

**Prepared:** 2026-10-05
**Status:** PRE-IMPLEMENTATION — awaiting explicit approval
**Code written so far:** none. No project files created, modified, or deleted. No dependencies installed.
**Reference images inspected:** 22 of 22 (100%)

---

## SECTION A — PROJECT UNDERSTANDING

### A.1 What we are building

A **multi-tenant SaaS platform for premium digital wedding invitations** — not a single wedding website.

The reference material is drawn from a live product at `chungdoi.com`. The architecture it implies, and which we must match, has three distinct layers:

| Layer | Purpose | Who sees it |
|---|---|---|
| **Template engine** | Reusable, data-driven invitation designs. "Baroque Gold" is template #1 of many. | Nobody directly |
| **Admin dashboard** | Dark-themed editor where a couple configures their invitation and toggles sections | Authenticated owner |
| **Public invitation** | The rendered, shareable invitation at a public URL | Wedding guests, unauthenticated |

Three pieces of evidence confirm this is a platform, not a one-off site:

1. The dashboard header contains a **"Change Template"** dropdown currently reading "Baroque - Gold" — templates are swappable against the same invitation data.
2. The marketing sheet (`baroque_gold.7e37f580.webp`) is titled **"BAROQUE - GOLD / ONLINE WEDDING INVITATION"** and footer-branded `chungdoi.com` — it is a catalogue entry for one template among a set.
3. Every content field in the dashboard is generic (`Groom's Full Name`, `e.g. John Smith`) with **zero hardcoded couple data**.

**Direct architectural consequence:** the Baroque Gold template must be a pure rendering function of an invitation data object. No couple name, date, venue, photo, or family name may ever appear inside a template component. This is demanded by the brief (Part 10) and independently confirmed by the references.

### A.2 How it works end to end

1. An authenticated owner creates an invitation and picks a template.
2. They fill in content through the dashboard's collapsible section cards, toggling each section `Show` / `Hide`.
3. They upload photos, configure music, set the venue (which auto-derives a map pin), and write a greeting.
4. They press **Publish**.
5. A guest opens a public link and first sees a closed **envelope**; tapping **Open** reveals the invitation and starts the music.
6. The guest scrolls the invitation and can **RSVP**, **sign the guestbook**, and **open the gift box**.
7. The owner reads RSVPs and guestbook entries back in the dashboard.

### A.3 The two things the reference product does NOT do

The brief asks for two capabilities with **no counterpart anywhere in the 22 references**. These are net-new and the highest-risk parts of the project:

- **Two public URLs per invitation with different default music.** The dashboard shows exactly one Background Music control ("No music selected" / "Select Music"). Two tracks require a dashboard UI we must design ourselves.
- **Arabic / RTL support.** Every reference is English (with one Vietnamese string leaking through — see B.3). There is no Arabic reference, no RTL layout, and no language switcher anywhere.

Both are addressed in Sections F and G; both carry open questions in Section K.

---

## SECTION B — REFERENCE INVENTORY

**Folder:** `C:\Users\Basse\yousef invitation\` (flat — verified no subdirectories exist)
**Total files:** 22 — 21 × JPEG phone screenshots + 1 × WebP marketing sheet
**Total inspected:** 22 / 22

### B.1 Technical properties

- All 21 JPEGs are exactly **739 × 1600 px**, a uniform WhatsApp downscale of an iPhone 15/16 Pro capture (1179 × 2556 @3x).
- **Design baseline is therefore 393 × 852 CSS px.** Screenshot pixels convert to CSS px by dividing by **1.8804**. Every measurement in Section C is derived with this factor and marked approximate.
- The WebP is **1440 × 1920** — a desktop-rendered marketing asset, not a screen capture.
- Status-bar clocks run 4:25 → 4:28, so the capture session went **dashboard first (4:25–4:26), then public invitation (4:27–4:28)**. Filename ordering is misleading; chronological order is the true narrative.

### B.2 Public invitation screenshots (9)

| # | Filename | Represents | Key visual details |
|---|---|---|---|
| 1 | `...4.46.44 AM.jpeg` | **Envelope — clean** | Full-bleed gold-bronze field w/ tone-on-tone damask medallion; centred ivory card ≈313 CSS px wide (79.6%), radius ≈13px, soft shadow; gold circular badge w/ white heart ≈53px dia; "Santiago" / script "&" / "Isabella"; hairline divider w/ centre floral glyph; "September 6, 2027" olive; "Cordially Invites" olive; gold pill **Open** button; white-magnolia + sage floral clusters overlapping the card's top-left and bottom-right corners |
| 2 | `...4.46.44 AM (1).jpeg` | **Envelope — animated state** | Same frame plus a **light sheen sweeping across the Open button** and faint sparkle particles in the damask field → shimmer + particle animations are live. Also shows a pink chat-widget bubble (third-party support widget — **not** part of the template) |
| 3 | `...4.46.43 AM (4).jpeg` | **Hero: welcome + gilded frame + ceremony info** | "WELCOME TO OUR WEDDING" gold caps, heavy tracking; the **ornate gilded cartouche frame** w/ scrollwork + flowers clustered upper-left & lower-right; "SANTIAGO / & / ISABELLA" gold caps inside; large floral spray bleeding off the page top-right, another bottom-left; "CEREMONY INFO" gold caps bold; two-column family block split by a thin vertical rule, "Mr. & Mrs." olive above gold-bold parent names; floating gold audio FAB bottom-right w/ equalizer bars |
| 4 | `...4.46.43 AM (3).jpeg` | **Invitation text + ceremony/reception details** | "With great joy we invite you / to share this special day with us" gold, 2 lines; **full names "Santiago Restrepo" / "Isabella Gutiérrez" in large olive serif** (note: olive, whereas the frame names are gold) w/ gold swash "&"; huge gold filigree ornaments bleeding off the right and left edges; "NUPTIAL MASS / Iglesia de Santo Toribio / AT / 17:30"; date row `MONDAY │ 06 │ SEPTEMBER` w/ thin olive rules and an oversized "06"; "2027"; then "RECEPTION / Sofitel Legend Santa Clara / AT / 19:00" |
| 5 | `...4.46.43 AM (1).jpeg` | **Reception info + countdown + mini calendar** | **Two ornate gilded Corinthian pillars** flanking the block, bleeding off both screen edges, carved acanthus capitals; "RECEPTION INFO" + "THE RECEPTION WILL TAKE PLACE AT:" gold caps bold; "17:30" large olive; date row; "WELCOME 16:30" / "RECEPTION 19:00" two-column, olive caps labels + gold times; "COUNTDOWN" + live "336 days 9 hours 2 min 24 sec"; **mini calendar** — ivory panel, hairline gold border, large ornate gold flourishes at all four corners, "September 2027" olive, `Mo Tu We Th Fr Sa Su` olive caps, gold rule beneath, **the 6th rendered as a filled gold HEART with a white numeral**; "Add to Calendar" below |
| 6 | `...4.46.43 AM (2).jpeg` | **Photo gallery** | "PHOTO GALLERY" gold caps bold; **3D coverflow carousel** — centre photo large, radius ≈16px, flanking photos rotated in perspective, scaled down, clipped by the viewport; counter "1 / 8" olive |
| 7 | `...4.46.41 AM.jpeg` | **Venue, map, dress code** | Symmetrical horizontal gold filigree flourish as section divider; "WEDDING RECEPTION VENUE" gold caps bold; "Sofitel Legend Santa Clara / Cartagena, Colombia" olive; hairline rule; embedded **Google Map**, radius ≈12px, w/ "Open in Maps ↗" overlay chip; "Get directions" olive w/ navigation-arrow icon; "DRESS CODE" gold caps bold; "Party Attire" muted tan; **three colour swatch circles** — dark brown, mid brown, blush |
| 8 | `...4.46.39 AM.jpeg` | **Wedding day schedule** | "WEDDING DAY SCHEDULE" gold caps bold; **vertical gold timeline** — centred hairline rail, times left in gold serif, filled gold dots w/ ivory ring on the rail, event text right in olive serif; 8 entries 17:00 → 00:30; two gold filigree swirls decorating the left margin; floral cluster top-right. One dot (18:45) renders larger — likely an in-view/active state |
| 9 | `...4.46.37 AM.jpeg` | **Guestbook** | "GUESTBOOK" gold caps bold; form card w/ hairline tan border, radius ≈16px: "Enter your name*" input, "Enter your wishes*" textarea, a **small square magic-wand button** (AI wish generator — see K.12), gold pill "SEND WISHES"; floral cluster bleeding off the left edge; below, a **fixed-height scrollable list** (visible scrollbar track) of wish cards — gold-bold name left, tan timestamp right, olive message body |

### B.3 Marketing sheet (1) — the single most valuable reference

| # | Filename | Represents | Key visual details |
|---|---|---|---|
| 10 | `baroque_gold.7e37f580.webp` | **Official full-template marketing sheet, 1440×1920** | Blush/sand gradient ground; title "BAROQUE - GOLD" in a high-contrast Didone serif w/ wide tracking; subtitle "ONLINE WEDDING INVITATION"; **the complete invitation laid out top-to-bottom across three narrow columns**; footer `chungdoi.com` logo (pink rounded-square, white lotus mark) |

**Why it matters:** the nine phone screenshots are disjoint fragments with unknown gaps between them. This sheet shows the invitation **continuously and in order**, and it exposes three things no screenshot did:

1. **A gold "CONFIRM ATTENDANCE" pill button** sits inline between the calendar and the venue section. This is the RSVP trigger in its native baroque styling — and it directly contradicts the generic modal in reference #11 (see K.1).
2. **A "GIFT BOX" section** closes the invitation: an ornate illustrated gift with ribbon, the caption "Tap to open", and the thank-you line "Your presence would be the greatest gift we could receive!" — matching the dashboard's Gift Box + Thank You Note cards.
3. **The string "Chỉ đường"** appears where the phone screenshot reads "Get directions" — Vietnamese. This confirms the reference platform is Vietnamese-built with a working i18n layer, and that the English we see is itself a translation. Useful precedent: the layout already tolerates variable string lengths.

### B.4 Admin dashboard screenshots (12)

All share the same chrome: near-black ground, warm-dark cards (radius ≈16px, 1px subtle border), a top bar with back arrow + ivory "Change Template / **Baroque - Gold** ⌄" chip + outlined hot-pink **Publish**, and a bottom bar with an `Edit | Preview` segmented control + circular gear. Hot pink is the sole accent.

| # | Filename | Card(s) shown | Key controls |
|---|---|---|---|
| 11 | `...4.46.43 AM.jpeg` | **RSVP modal (public, not dashboard)** | Dark scrim; white card radius ≈20px; **modern sans-serif throughout** — "Confirm your attendance" bold near-black, grey subtitle; "Your name" + input; "Will you attend?"; two bordered option rows w/ grey circular check / × icons; full-width blush "Confirm" button in a disabled state; grey circular × top-right |
| 12 | `...4.46.45 AM (3).jpeg` | **Basic Information** | "Opening words" + Default toggle (off) + orange-lightbulb hint "Using the template's wording: *Welcome To Our Wedding*"; Groom's / Bride's **Full Name** (2-col, `e.g. John Smith`); Groom's / Bride's **Short Name** (w/ inline ↺ reset icon); Groom / Bride **Birth Order**; `DISPLAY ORDER` segmented **Groom's family first ∕ Bride's family first** + helper |
| 13 | `...4.46.45 AM (2).jpeg` | **Family Information** (top) | Show toggle; *Groom's Family* — Parent Title (`Mr. & Mrs.`), Father / Mother 2-col (`e.g. Robert Smith` / `e.g. Mary Smith`), Family Address textarea |
| 14 | `...4.46.45 AM (1).jpeg` | **Family Information** (bottom) + **Announcement** | *Bride's Family* — same field set (`e.g. James Doe` / `e.g. Sarah Doe`); Announcement: Show toggle + "Custom message (leave empty to hide)" textarea containing "WE JOYFULLY ANNOUNCE / THE WEDDING OF OUR CHILDREN" |
| 15 | `...4.46.45 AM.jpeg` | **Announcement** + **Ceremony** | Ceremony: "Section heading" input = `CEREMONY INFO` + helper "The heading printed above this block on your card. Leave it empty to remove it."; orange-lightbulb hint "Do you have a ceremony at home?"; outlined **+ Add Ceremony** → ceremonies are a repeatable list |
| 16 | `...4.46.44 AM (8).jpeg` | **Photo Gallery** + **Wedding Reception** (top) | `LAYOUT` segmented w/ icons — **Grid ∕ Collage ∕ 3D**; "Photo Gallery 0 photos"; dashed **+ Add Photo** tile; helper "Supported formats: JPG, PNG, GIF, WebP, HEIC. Max 20 at a time." |
| 17 | `...4.46.44 AM (7).jpeg` | **Wedding Reception** | Tabs **Wedding Reception ∕ Celebration Party ∕ Engagement Party**; Event Date; Event time + helper "The main time shown large on the card, used for the countdown and add-to-calendar."; `Time format` segmented **24-hour ∕ AM/PM**; nested "Welcome & reception times" sub-card w/ Hide toggle; "Countdown" row w/ Show toggle; Address textarea |
| 18 | `...4.46.44 AM (6).jpeg` | **Wedding Reception** (bottom) + **RSVP** | Map Show toggle + box "The map is automatically shown based on the reception address. Only change this if the map location is incorrect." + pink **Change**; RSVP: blue-ⓘ box "Guests can confirm attendance directly on the invitation / View the confirmed list in Guest Management"; `DISPLAY STYLE` segmented **Button ∕ Inline** + helper "Guests tap the button to open the confirmation form in a popup"; `PEOPLE PER INVITATION` segmented **Guest chooses ∕ Set a limit** |
| 19 | `...4.46.44 AM (5).jpeg` | **Dress Code**, **Schedule**, **Guestbook**, **Gift Box** | Dress Code — Hide (off) + orange-tag hint; Wedding day schedule — Hide (off) + orange-clock hint; Guestbook — Show (on) + drill-in row "**0 wishes** / View and manage ›"; Gift Box — Show (on) + empty dashed state. **Proves section visibility is per-invitation and these two default to hidden.** |
| 20 | `...4.46.44 AM (4).jpeg` | **Gift Box** + **Thank You Note** | Gift Box title carries an inline **pencil** (rename the section); "No gift methods yet. Tap the button below to add one."; outlined **+ Add gift method**; Thank You Note — Show + textarea "Your presence would be the greatest gift we could receive!" |
| 21 | `...4.46.44 AM (3).jpeg` | **Background Music** + **Envelope** | Music: circular ♪ placeholder, "No music selected", solid pink **♪ Select Music** → opens a picker (never shown). Envelope: "Greeting" input = `Cordially Invites` + helper "**Applies to all guests. To customize per guest, edit in Guest Management.**" |
| 22 | `...4.46.44 AM (2).jpeg` | **Social share preview** | "The image shown when you send the invitation link on social networks."; segmented **Envelope ∕ Your photo**; helper "Your invitation's envelope. **On personalized links it shows the guest's name.**"; `PREVIEW` OG card — image + `CHUNGDOI.COM` + "Groom & Bride" + "We invite you to the wedding of Groom & Bride"; caching note + pink "see the guide here." |

### B.5 Two inferences that change the architecture

References #21 and #22 both mention **Guest Management** and **personalized links** — a per-guest token in the URL that injects the guest's name into the greeting and into the OG share image. No screenshot of that screen exists, but the feature is confirmed twice independently.

**This collides with the two-music-link requirement.** A personalized guest link already carries one identity parameter; music adds a second dimension. Section F resolves this with an orthogonal scheme; **K.15** flags the decision.

---

## SECTION C — DESIGN ANALYSIS: THE BAROQUE GOLD VISUAL IDENTITY

### C.1 Colour system

Brief-mandated anchors, plus values sampled from the references:

| Token | Value | Usage |
|---|---|---|
| `--gold-bronze` | **`#B97D3E`** *(mandated)* | Section headings, "06" date numeral, times, envelope names, buttons, timeline rail + dots, calendar heart, guestbook author names |
| `--olive` | **`#8D8F58`** *(mandated)* | Full couple names, body copy, event descriptions, weekday labels, countdown text, dates, venue lines |
| `--ivory-paper` | `#FBF7EF` | Invitation page ground and all card fills |
| `--ivory-sunk` | `#F6F0E4` | Damask pattern low tone (tone-on-tone, very low contrast) |
| `--bronze-deep` | `#A3682E` | Heading weight emphasis, button hover |
| `--tan-hairline` | `#DEC7A6` | 1px card borders, input borders, dividers |
| `--tan-muted` | `#C2AE8C` | Placeholder text, guestbook timestamps, "Party Attire" |
| `--envelope-ground` | `#C08A4A` | Envelope full-bleed backdrop (damask medallion overlaid) |
| `--dress-1 / 2 / 3` | `#3B2A1D` / `#6E5541` / `#E7C6A6` | Dress-code swatches — **invitation-configurable, not fixed tokens** |

Dashboard palette (entirely separate system):

| Token | Value | Usage |
|---|---|---|
| `--dash-bg` | `#0B0B0C` | Page ground |
| `--dash-card` | `#181513` | Section cards (warm-tinted dark, not neutral) |
| `--dash-border` | `#2A2522` | 1px card borders |
| `--dash-accent` | `#FF2D78` | Toggles-on, Publish, primary buttons, links |
| `--dash-hint` | `#E08A2E` | Lightbulb / tag / clock hint icons |
| `--dash-info` | `#3B82F6` | ⓘ informational boxes |

**Critical contrast finding:** `--olive #8D8F58` on `--ivory-paper #FBF7EF` yields roughly **3.1:1**. That **fails WCAG AA (4.5:1) for body text**, and olive is the primary body colour throughout the template. `--gold-bronze #B97D3E` on ivory is ≈**3.6:1** — also failing for body, passing only for large text. See **K.16** for the proposed resolution; this needs your decision because fixing it changes the palette the brief mandated.

### C.2 Typography

Exact families are not recoverable from JPEGs. Based on letterform analysis — high stroke contrast, small x-height, humanist axis, distinctive swash ampersand — these are the proposed matches, all open-licence (SIL OFL), all self-hostable:

| Role | Proposed family | Evidence |
|---|---|---|
| Couple names, envelope names, body serif | **Cormorant Garamond** | Narrow, high-contrast, small x-height; the "S" and "g" in "Santiago" match closely |
| Caps section headings (`CEREMONY INFO`, `GUESTBOOK`) | **Cormorant Garamond 600/700**, tracking ≈ `0.14em` | Heavier axis than body, strongly letterspaced |
| The `&` glyph | **Cormorant Garamond Italic** swash ampersand | Distinctive calligraphic form visible at every occurrence |
| Marketing title "BAROQUE - GOLD" | **Playfair Display** or similar Didone | Marketing asset only — not needed in the product |
| Dashboard + RSVP modal | **Inter** | Standard geometric-humanist UI sans |
| **Arabic display** (net-new) | **Amiri** | Naskh with calligraphic contrast; the closest Arabic analogue to Garamond's voice |
| **Arabic UI** (net-new) | **IBM Plex Sans Arabic** | Pairs cleanly with Inter; excellent hinting at small sizes |

**Derived type scale** (screenshot px ÷ 1.8804, ±1px, to be calibrated in Phase 1):

| Element | ≈CSS px | Weight / tracking |
|---|---|---|
| Framed names `SANTIAGO` | 30 | 400, caps, `0.08em` |
| Full names `Santiago Restrepo` | 29 | 400, olive |
| Section headings | 19–20 | 700, caps, `0.14em` |
| `WELCOME TO OUR WEDDING` | 14 | 500, caps, `0.22em` |
| Large date numeral `06` | 27 | 400 |
| Time `17:30` | 21 | 400 |
| Body / event text | 15–16 | 400, line-height ≈1.55 |
| Small caps labels (`WELCOME`, `Mo Tu We`) | 11–12 | 500, caps, `0.12em` |
| Countdown, timestamps | 12–13 | 400 |

### C.3 Decorative asset inventory

This is the make-or-break part of the project. Nine distinct ornament assets are required, each needed as a **crisp SVG or high-DPI transparent PNG**:

| # | Asset | Where used | Notes |
|---|---|---|---|
| 1 | **Ornate gilded cartouche frame** | Hero, around the names | Asymmetric baroque scrollwork; flowers integrated at upper-left + lower-right. The single most complex asset. |
| 2 | **Gilded Corinthian pillar pair** | Reception info | Mirrored L/R, bleed off both screen edges, carved acanthus capitals |
| 3 | **Calendar corner flourishes** | Mini calendar | Four corners, mirrored from one source |
| 4 | **Large filigree swirl** | Names section (edge-bleed), schedule left margin | Reused at multiple scales and rotations |
| 5 | **Symmetrical horizontal flourish** | Section divider above venue | Centred, mirrored about its vertical axis |
| 6 | **Floral cluster — magnolia + sage + gold berries** | Envelope card corners, hero page corners, schedule, guestbook | At least 3 size/crop variants; the most-reused asset |
| 7 | **Damask seamless tile (ivory)** | Invitation page ground | Tone-on-tone, extremely low contrast |
| 8 | **Damask medallion (gold)** | Envelope backdrop | Larger scale, radial |
| 9 | **Ornate gift-box illustration** | Gift Box section | Full-colour raster illustration w/ ribbon |

**These are copyrighted artwork belonging to the reference product.** We cannot extract them from the screenshots — and they are only 739px wide, far below usable resolution. Three lawful routes exist; this needs your decision (**K.7**):

- **(a)** Licence equivalent baroque ornament/floral sets from a stock vendor (Creative Market, Envato, Freepik Premium). ~$50–200 total, 1–2 days.
- **(b)** Commission an illustrator for originals. ~$800–2,500, 2–4 weeks, fully owned.
- **(c)** Generate with an image model + manual vectorisation. Cheapest, least consistent, needs heavy cleanup.

**Recommendation: (a) for Phase 1–3 to unblock layout work, then (b) in parallel if this template is commercially central.** Implementation is not blocked meanwhile: every ornament will be a swappable `<Ornament name="..."/>` component backed by a sprite manifest, so final art drops in without touching layout code.

### C.4 Layout system

- **Content column:** ≈345 CSS px inside a 393px viewport → **24px horizontal page padding**.
- **Vertical section rhythm:** ≈56–72 CSS px between sections; headings sit ≈28px above their content.
- **Radii:** cards 16px · envelope card 13px · inputs 12px · map 12px · gallery photos 16px · buttons fully rounded (`9999px`).
- **Hairlines:** uniform 1px `--tan-hairline`.
- **Shadows:** a single soft token — roughly `0 8px 32px rgba(90,60,25,0.10)`. No hard or multi-layer shadows anywhere.
- **Decorative overflow is intentional and structural.** Ornaments deliberately bleed past the content column and off the viewport edge. Sections therefore need `position: relative; overflow: clip` with absolutely-positioned ornament layers at `z-index: 0` and content at `z-index: 1`. **`overflow: clip` on the Y axis, never `overflow: hidden` on the page root** — otherwise scroll breaks.

### C.5 Animation inventory

| Animation | Where | Approach |
|---|---|---|
| Button sheen sweep | Envelope "Open" (**confirmed by ref #2**) | CSS gradient translate on a loop |
| Sparkle particles | Envelope backdrop (**confirmed by ref #2**) | ~12–20 absolutely positioned dots, staggered opacity/translate |
| Envelope open transition | Envelope → invitation | GSAP timeline: card lift + scale, flap rotate, cross-fade to content. **This is also the user gesture that unlocks audio — see F.4.** |
| Scroll reveals | Every section | GSAP ScrollTrigger, fade + 24px rise, `once: true` |
| Timeline dot activation | Schedule (one dot is enlarged in ref #8) | ScrollTrigger per item, scale dot 1 → 1.25 |
| Countdown tick | Reception info | 1s interval, `requestAnimationFrame`-guarded |
| 3D coverflow | Gallery | `perspective` + `rotateY`/`translateZ`/`scale` per slide offset |
| Audio FAB equalizer | Floating button | 3–4 animated bars; frozen when paused |
| Gift box open | Gift section ("Tap to open") | Scale/rotate reveal of gift methods |

**All animation must be wrapped in `gsap.matchMedia()` with a `prefers-reduced-motion: reduce` branch** that disables transforms and shows content in its final state. Scroll reveals in particular must never leave content invisible if an animation fails to fire.

### C.6 Responsive behaviour

The references are **100% mobile**. There is no desktop reference for either the invitation or the dashboard — the marketing sheet's three narrow columns are a print-style composition, not a desktop layout.

Proposed (requires approval, **K.4**): the invitation stays a **centred paper column capped at ~480px** on tablet and desktop, set on an extended damask field with larger ornaments in the margins. This is the convention for this product category and the only interpretation the references support. Scaling the mobile design up to full-width desktop would break every edge-bleed ornament.

---

## SECTION D — INVITATION STRUCTURE

Order is taken from the marketing sheet (`baroque_gold.7e37f580.webp`), which shows the invitation continuously — the phone screenshots alone cannot establish ordering.

| # | Section | Appearance | Functionality | Default |
|---|---|---|---|---|
| 0 | **Envelope** | Full-bleed gold damask; centred ivory card; heart badge; short names + script `&`; date; greeting; gold **Open** pill; floral corners | Gatekeeper screen. Tap **Open** → animate away, reveal invitation, **start audio inside the click handler**. Greeting is per-invitation and overridable per guest. | Always on |
| 1 | **Welcome / Opening words** | `WELCOME TO OUR WEDDING`, gold caps, wide tracking | Static. Template default unless the owner overrides it (dashboard "Opening words" toggle) | On |
| 2 | **Couple names in gilded frame** | Ornate cartouche; `SANTIAGO` / `&` / `ISABELLA` gold caps | **Auto-fit text required** — see D.1 | On |
| 3 | **Ceremony info / families** | Heading (owner-editable, blank = hidden); two columns split by a vertical rule; "Mr. & Mrs." olive over gold-bold parent names | Column order follows the `DISPLAY ORDER` setting | On |
| 4 | **Announcement** | "With great joy we invite you / to share this special day with us", gold, centred | Free text; empty = section hidden | On |
| 5 | **Full couple names** | Large **olive** serif full names w/ gold swash `&`; large filigree bleeding off both edges | Static | On |
| 6 | **Nuptial mass** | `NUPTIAL MASS` / venue / `AT` / time / `MONDAY │ 06 │ SEPTEMBER` / year | A "ceremony" record; repeatable via **+ Add Ceremony** | On |
| 7 | **Reception** | Same block structure, reception venue + time | Second event record | On |
| 8 | **Photo gallery** | `PHOTO GALLERY` + 3D coverflow + `1 / 8` counter | Three layouts: **Grid ∕ Collage ∕ 3D**. Swipe + lazy-load | On |
| 9 | **Reception info + countdown** | **Gilded pillars** flanking; time; date row; `WELCOME` / `RECEPTION` two-column; `COUNTDOWN` + live ticker | Countdown independently toggleable; welcome/reception times default hidden | On |
| 10 | **Mini calendar** | Ivory panel, hairline gold border, ornate corner flourishes, month heading, weekday row, gold rule, **wedding day as a gold heart** | `Add to Calendar` → `.ics` download + Google Calendar link | On |
| 11 | **RSVP — "CONFIRM ATTENDANCE"** | Gold pill button (marketing sheet) → opens modal | Two display styles: **Button** (modal) ∕ **Inline**. Party size: **Guest chooses** ∕ **Set a limit** | On |
| 12 | **Filigree divider** | Symmetrical horizontal flourish | Decorative | On |
| 13 | **Venue + map** | Heading; venue name + city; hairline; Google Map w/ "Open in Maps"; "Get directions" | Map auto-derived from the address, manually overridable | On |
| 14 | **Dress code** | Heading; "Party Attire"; three swatch circles | Configurable label + colours | **Off** |
| 15 | **Wedding day schedule** | Vertical gold timeline, 8 entries, filigree margin decoration | Repeatable time/label list | **Off** |
| 16 | **Guestbook** | Heading; form card (name, wishes, magic-wand, `SEND WISHES`); scrollable wish list | Public writes → moderation queue (**K.11**) | On |
| 17 | **Gift box** | Ornate illustrated gift, "Tap to open", thank-you line | Tap reveals gift methods — **bank details and/or QR code** | On |
| 18 | **Footer** | `© chungdoi.com` | Platform branding | On |
| — | **Audio FAB** | Floating gold circle, animated equalizer, bottom-right | Persistent across all sections; play/pause | On |

### D.1 The auto-fitting framed name — an explicit brief requirement

Part 4 requires that names inside the gilded frame resize automatically, stay on one line, never overflow, never touch the frame, and stay balanced. The frame's usable interior is a **fixed-aspect box**, so this must be measured, not guessed.

**Approach:** `ResizeObserver` on the frame + a binary search over `font-size` between a floor and ceiling, fitting the text to a safe inset (≈88% of interior width) with `white-space: nowrap`. Runs after `document.fonts.ready` to avoid measuring a fallback font. Below the floor, apply a small `scaleX` compression rather than wrapping.

This matters more for Arabic, where the same name can be dramatically wider or narrower than its Latin form.

---

## SECTION E — DASHBOARD ANALYSIS

### E.1 Shell

- **Top bar:** back arrow · ivory gradient template chip ("Change Template" label + "Baroque - Gold" + chevron) · outlined hot-pink **Publish**. The chip is translucent over a blurred preview of the invitation hero.
- **Body:** a single vertical scroll of collapsible section cards. No sidebar — this is a **mobile-first editor**.
- **Bottom bar:** `Edit | Preview` segmented control + circular gear.

### E.2 Section card anatomy (uniform across all cards)

`[chevron ⌄] [icon] [Title] [optional pencil] ......... [Show|Hide label] [toggle]`

Inside: form fields, segmented controls, nested sub-cards, hint boxes (orange lightbulb/tag/clock), info boxes (blue ⓘ), empty states (dashed border), and drill-in rows (`›`).

### E.3 Cards confirmed by screenshots (15)

Basic Information · Family Information · Announcement · Ceremony · Photo Gallery · Wedding Reception · RSVP · Dress Code · Wedding day schedule · Guestbook · Gift Box · Thank You Note · Background Music · Envelope · Social share preview

Full control inventories are in the B.4 table.

### E.4 Reusable control primitives to build

`Toggle` (pink/grey) · `SegmentedControl` (2–3 options, icon variant) · `TextField` (+ inline action icon) · `TextArea` · `DateField` · `TimeField` · `HintBox` (3 icon colours) · `InfoBox` · `EmptyState` · `DrillInRow` · `PhotoGrid` + uploader · `OutlinedAddButton` · `TabBar` · `CollapsibleCard`

### E.5 Screens that must exist but have NO reference

These are required by the brief or implied by on-screen text, with no screenshot to copy. **All need design approval before building (K.5):**

| Screen | Evidence it exists | Status |
|---|---|---|
| Login / authentication | Required by Part 10 | Must design |
| Invitation list / dashboard home | Back arrow implies a parent | Must design |
| Template picker | "Change Template" chip | Must design |
| **Guest Management** | Named twice (refs #18, #21) | Must design |
| **Music picker** | "Select Music" button | Must design — **and it must hold TWO tracks (Section F)** |
| Guestbook moderation | "View and manage ›" drill-in | Must design |
| Gift method editor | "+ Add gift method" | Must design |
| Ceremony editor | "+ Add Ceremony" | Must design |
| Schedule item editor | Schedule card is collapsed in all refs | Must design |
| Dress code editor | Card is collapsed in all refs | Must design |
| Map location override | Pink "Change" link | Must design |
| Settings | Gear icon | Must design |
| **Language switcher** | Required by Part 7 | **No precedent at all** |
| **Two-link management** | Required by Part 6 | **No precedent at all** |

All proposed new screens will reuse the primitives in E.4 so they are visually indistinguishable from the referenced ones.

---

## SECTION F — TWO-LINK MUSIC SYSTEM

### F.1 Requirement restated

One invitation record. Two public URLs. Identical in every respect except the default music track. No cross-contamination, no duplicated records, no visible track-switcher for guests.

### F.2 URL design

**Recommended — path segment:**

```
/{locale}/i/{slug}          → variant a  (canonical, Track 1)
/{locale}/i/{slug}/b        → variant b  (Track 2)
```

**Also supported — query alias** (the form the brief illustrated), 308-redirected to canonical:

```
/{locale}/i/{slug}?music=1  →  /{locale}/i/{slug}
/{locale}/i/{slug}?music=2  →  /{locale}/i/{slug}/b
```

Path segments are preferred over a bare query param because they give each variant **a distinct cache key, a distinct OG image, and a link that survives messaging apps that strip query strings** — a real failure mode when invitations are shared over WhatsApp.

### F.3 Composing with personalised guest links (B.5)

The two concerns are kept **orthogonal** — music in the path, guest identity in a query token:

```
/en/i/sara-and-yousef/b?g=K7xQ2mPd
```

Music variant and guest token resolve independently, so the matrix of (2 variants × N guests) needs no extra records.

### F.4 Correctness guarantees

| Requirement | Mechanism |
|---|---|
| Track 1 never plays on link 2 | Variant resolves **once, server-side**, into a single `resolvedTrack`. Exactly **one** `<audio>` element is ever mounted, with one `src`. The other track's URL is never sent to the client. |
| Survives refresh | The variant lives in the URL path — refresh is inherently correct. A `sessionStorage` echo keyed by invitation id guards client-side navigation. |
| Invalid / missing parameter | Parsed through a strict enum (`'a' \| 'b'`). Anything else → **canonical variant a**, never a silent swap. Unknown values 308-redirect to canonical rather than 404. |
| Missing track config | If variant b has no track, fall back to **silence plus a disabled FAB** — never to track 1. Surfaced as a publish-time warning in the dashboard. |
| No visible switcher | The FAB is play/pause only. No track list is rendered. |

### F.5 Autoplay — solved by the envelope

Browser autoplay policy (Safari iOS, Chrome Android) blocks unmuted audio without a user gesture. Muted autoplay is useless for music.

**The envelope solves this structurally.** The guest must tap **Open** to view the invitation, and that tap is a qualifying gesture. So:

1. Mount `<audio preload="none">` on the envelope screen with the resolved track.
2. In the **Open** click handler, synchronously call `audio.play()` — *before* any `await`, since the gesture token is lost across an await boundary.
3. Then run the open animation.

Fallback chain if `play()` still rejects (deep link past the envelope, Low Power Mode, iOS silent switch):
- FAB enters a **pulsing "tap to play"** state styled as part of the design, not a browser error.
- A `pointerdown` listener on the document retries once, then removes itself.
- Audio never silently switches tracks and never plays muted.

### F.6 Hosting and format

- **MP3** (universal) as primary; optional AAC/M4A. **Not** OGG-only — Safari lacks support.
- Served from the same S3-compatible origin as photos, behind the CDN, with `Accept-Ranges: bytes` so iOS can seek. iOS Safari **requires** HTTP range support or playback stalls.
- Target ≤4 MB per track, 128 kbps mono-to-stereo; loop seamlessly.
- `preload="none"` until the gesture, then `preload="auto"`.
- **Licensing is a real constraint:** commercial wedding invitations need licensed music. Recommend a royalty-free library (Epidemic Sound, Artlist) or owner-uploaded tracks with an explicit rights attestation at upload. Flagged in **K.17**.

### F.7 Data model

```
MusicTrack
  id, invitationId, variant ('a' | 'b'), title,
  sourceType ('upload' | 'library'), url, durationSec, createdAt
  UNIQUE (invitationId, variant)
```

One invitation, at most two rows. The unique constraint makes a third variant structurally impossible and makes "which track for which link" a single indexed lookup.

---

## SECTION G — MULTILINGUAL SYSTEM (ARABIC / ENGLISH)

**There is no Arabic reference material.** Everything here is a proposal requiring approval.

### G.1 Two separate translation problems

These are routinely conflated and must not be:

1. **UI chrome** — labels, buttons, validation, dashboard. Static strings in message catalogues, translated once by us.
2. **Invitation content** — couple names, venue names, schedule labels, announcement text. **Per-invitation, authored by the owner**, and bilingual only if that owner chooses.

The second is the harder one and it shapes the schema.

### G.2 Content model

Localised content fields are stored as JSON maps rather than parallel columns:

```json
{ "en": "Sofitel Legend Santa Clara", "ar": "سوفيتيل ليجند سانتا كلارا" }
```

Resolution order: **requested locale → invitation default locale → first non-empty value**. A missing Arabic translation degrades to English rather than rendering blank. The dashboard shows a per-field language tab with an "untranslated" badge.

Non-localised by nature: dates, times, photos, map coordinates, colours, music.

### G.3 RTL implementation

- `<html lang="ar" dir="rtl">` set server-side from the route locale — never flipped client-side (avoids a visible mirror flash).
- **Logical CSS properties everywhere**: `margin-inline-start`, `padding-inline`, `inset-inline-start`, `border-inline-end`, `text-align: start`. Tailwind's `ps-*` / `pe-*` / `ms-*` / `me-*` handle this natively. **No `left`/`right` in component styles** — enforced by an ESLint rule.
- **Selective ornament mirroring.** This is the subtle part:
  - Asymmetric ornaments (corner flourishes, the cartouche, edge-bleed filigree) **must mirror** → `.rtl-mirror { transform: scaleX(-1) }` under `[dir="rtl"]`.
  - Symmetric ornaments (the horizontal divider, pillars as a pair) **must not** — mirroring is a no-op at best, and wrong at worst.
  - **Photographs, the map, and the gift illustration must never mirror.**
  - Implementation: ornaments declare `mirrorInRtl: true|false` in the sprite manifest. It is a data property, not a styling afterthought.
- **Timeline** keeps its centred rail; times and labels swap sides automatically via flex + logical properties.
- **Icons:** directional ones (back arrow, drill-in `›`, "get directions" arrow) mirror; non-directional ones (heart, music note, clock) do not.

### G.4 Numerals, dates, and mixed text

- **Numerals:** Arabic locales may use Western (`٠١٢٣` vs `0123`) — regional preference, not a language rule. Gulf usage commonly prefers Western. Implement via `Intl.NumberFormat(locale, { numberingSystem })`, **default `latn`**, per-invitation override. **K.9** asks you to confirm.
- **Dates:** `Intl.DateTimeFormat` with Gregorian default; Hijri (`islamic-umalqura`) as an optional per-invitation display. **K.9.**
- **Mixed text:** a Latin venue name inside an Arabic sentence needs isolation or the bidi algorithm reorders punctuation. Wrap foreign-script runs in `<bdi>` and use `&#x2068;`/`&#x2069;` isolates in interpolated strings.
- **The countdown is the highest-risk bidi string** — it mixes numbers and unit words in one line. Build it from discrete `<span>`s with explicit isolation, never from a concatenated template string.

### G.5 Routing and switching

```
/en/i/{slug}      /ar/i/{slug}
/en/admin/...     /ar/admin/...
```

- `next-intl` with locale-prefixed routing and server-side message loading.
- Switching locale **preserves the current path and all query parameters** — including the music variant and guest token. It is a pure path-prefix swap. No data is re-fetched destructively and no form state is lost (confirmed requirement in Part 7).
- Guest-facing switcher: a small, discreet `AR / EN` control that does not disturb the baroque composition. **Needs design approval — K.3.**

### G.6 Font loading

Arabic and Latin faces are loaded as **separate `@font-face` declarations with `unicode-range`**, so an English guest never downloads Amiri and vice versa. `font-display: swap` plus preloading the two critical faces only.

---

## SECTION H — MOBILE-FIRST STRATEGY

### H.1 Baseline

**393 × 852 CSS px** (iPhone 15/16 Pro), derived in B.1. All reference measurements convert at `÷1.8804`. Every component is authored at this width first; larger breakpoints are additive `min-width` layers only.

### H.2 Fidelity method

Matching "closely enough" by eye will not satisfy Part 2. The process:

1. Build the section at 393px.
2. Screenshot it with Playwright at exactly 393×852, DPR 3.
3. **Overlay the reference at 50% opacity** and diff spacing, size, and colour.
4. Iterate until deltas are within ±2px.
5. Lock the result as a visual-regression baseline.

This turns "visually accurate" from a judgement call into a measurable pass/fail, and makes regressions impossible to merge silently.

### H.3 Breakpoints

| Range | Behaviour |
|---|---|
| 320–392 | Compressed: page padding 24→16px, type scaled ~0.94×. Must work on iPhone SE. |
| **393–479** | **Reference baseline — exact match required** |
| 480–767 | Paper column caps at 440px, centred |
| 768–1023 | Column caps at 480px; ornaments scale up into the margins |
| 1024+ | Column stays 480px on an extended damask field; larger margin ornaments |

### H.4 Mobile-specific hazards and mitigations

| Hazard | Mitigation |
|---|---|
| Edge-bleed ornaments causing horizontal scroll | `overflow-x: clip` on section wrappers; automated test asserting `scrollWidth === clientWidth` at every breakpoint |
| 100vh under mobile browser chrome | `100dvh` with a `100vh` fallback |
| Long names breaking the frame | Auto-fit algorithm (D.1) |
| Arabic text wider/narrower than English | Both locales tested at every breakpoint in CI |
| Gallery memory on low-end Android | Virtualise beyond ±2 slides; `loading="lazy"`; AVIF/WebP via `next/image` |
| Touch targets | Minimum 44×44 px, including the audio FAB and calendar cells |
| iOS silent switch killing audio | Documented fallback (F.5) |
| Heavy ornaments on 3G | SVG preferred; inline critical ornaments; lazy-load below-fold ones |
| Safe-area insets | `env(safe-area-inset-*)` on the FAB and bottom bar |

### H.5 Performance budget (mobile, 4G)

LCP < 2.5s · CLS < 0.1 · INP < 200ms · initial JS ≤ 180 KB gzip · ornament payload ≤ 150 KB · first photo ≤ 80 KB.

---

## SECTION I — TECHNICAL ARCHITECTURE

### I.1 Existing project state

The directory contains **only the 22 reference images**. There is no `package.json`, no source, no git repository, no configuration. Verified toolchain: **Node v24.15.0**, **npm 11.12.1**, **git 2.54.0**. No pnpm, no Docker, no Python.

This is greenfield. No existing stack constrains the choice, and nothing can be reused.

### I.2 Recommended stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 15, App Router, TypeScript** | SSR is non-negotiable: per-link OG images, correct `dir`/`lang` on first paint, and SEO for shared links. Route groups map cleanly onto `[locale]/i/[slug]/[variant]`. |
| Styling | **Tailwind CSS v4** | Logical properties built in (`ps-*`/`pe-*`) — the single biggest RTL accelerator. Design tokens as CSS variables. |
| Animation | **GSAP + ScrollTrigger** | Timeline sequencing for the envelope, scroll reveals, and `gsap.matchMedia()` for reduced-motion and per-breakpoint variants in one API. |
| Database | **PostgreSQL** | Relational data with JSONB for localised fields and section settings — exactly the hybrid shape this needs. |
| ORM | **Prisma** | Typed client, good migration ergonomics. *(Drizzle is a lighter alternative if you prefer SQL-first.)* |
| Auth | **Auth.js v5** | Credentials + email magic link; owner-scoped sessions. |
| Storage | **Cloudflare R2** (S3-compatible) | Zero egress fees — material for image- and audio-heavy pages. Presigned direct uploads. |
| Images | **`next/image`** + `sharp` | AVIF/WebP, responsive srcsets, blur placeholders. |
| i18n | **`next-intl`** | Locale-prefixed routing, server-side messages, correct `dir` at SSR. |
| Validation | **Zod** | One schema shared by client form, API route, and DB layer. |
| Maps | **Google Maps Embed API** | Matches the reference exactly, including the "Open in Maps" chip. |
| Hosting | **Vercel** + **Neon** Postgres + **R2** | *(Alternative: single VPS + Docker Compose if you need data residency — see K.18.)* |

### I.3 Data model

```
User            id, email, passwordHash?, name, role, createdAt
Template        id, slug, name, previewUrl, capabilities(jsonb)
Invitation      id, ownerId, templateId, slug UNIQUE, status(draft|published),
                defaultLocale, supportedLocales[], timezone, publishedAt
InvitationContent  invitationId, key, value(jsonb)   -- localised maps
Couple          invitationId, groomFullName(jsonb), brideFullName(jsonb),
                groomShortName, brideShortName, displayOrder
Family          id, invitationId, side(groom|bride), parentTitle(jsonb),
                fatherName(jsonb), motherName(jsonb), address(jsonb)
Event           id, invitationId, type(ceremony|reception|celebration|engagement),
                heading(jsonb), venueName(jsonb), address(jsonb), lat, lng,
                placeId, startsAt, welcomeAt?, receptionAt?, timeFormat, order
ScheduleItem    id, invitationId, time, label(jsonb), order
Photo           id, invitationId, url, width, height, blurDataUrl, order
MusicTrack      id, invitationId, variant('a'|'b'), title, sourceType, url
                UNIQUE (invitationId, variant)
Guest           id, invitationId, name(jsonb), token UNIQUE, greetingOverride(jsonb),
                maxSeats?, createdAt
Rsvp            id, invitationId, guestId?, name, attending, partySize,
                message?, ipHash, createdAt
GuestbookEntry  id, invitationId, name, message, status(pending|approved|rejected),
                ipHash, createdAt
GiftMethod      id, invitationId, type(bank|qr|link), label(jsonb),
                details(jsonb), qrImageUrl, order
SectionConfig   invitationId, sectionKey, visible, order, settings(jsonb)
                PRIMARY KEY (invitationId, sectionKey)
```

**`SectionConfig` is the backbone of the whole editor.** Every `Show`/`Hide` toggle, every segmented control, and every section heading in the dashboard writes here. The template reads it to decide what to render and in what order. This is what makes templates swappable without migrating content.

### I.4 Rendering engine separation

```
src/
  templates/
    registry.ts                 -- slug → template module
    baroque-gold/
      index.tsx                 -- composes sections from SectionConfig
      tokens.css                -- palette, type scale, radii
      sections/                 -- Envelope, Hero, Families, Gallery, ...
      ornaments/                -- SVG components + manifest (incl. mirrorInRtl)
  components/invitation/        -- template-agnostic: Countdown, Calendar, Rsvp...
  components/dashboard/         -- Toggle, SegmentedControl, HintBox, ...
```

A template receives one typed `InvitationViewModel` and renders. **It performs no data fetching and contains no couple-specific literals.** A second template later means a new folder and a registry entry — nothing else changes.

### I.5 Security

| Area | Control |
|---|---|
| Admin routes | Middleware-enforced session; every query scoped by `ownerId` — **no object reference is trusted from the client** |
| Input | Zod on every boundary; HTML-escape all guest text; no `dangerouslySetInnerHTML` |
| Guestbook / RSVP | Rate limit per IP (e.g. 5/min, 30/hour); hCaptcha/Turnstile on repeat submissions; hashed IPs only |
| Uploads | Presigned, short-TTL URLs; **server-side magic-byte sniffing, never trusting `Content-Type` or extension**; size caps (8 MB image / 10 MB audio); re-encode through `sharp` to strip EXIF (incl. GPS) |
| Guest tokens | ≥128-bit random, unguessable, revocable |
| Private data | RSVP and guest lists never exposed on public routes; guestbook returns only approved entries with no IPs |
| Secrets | Server-side env only; nothing in `NEXT_PUBLIC_*` except the Maps **embed** key, which is HTTP-referrer-restricted |
| Headers | CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy` |

### I.6 Public API surface

```
GET  /api/invitations/:slug?locale&variant   -- published view model (cached)
POST /api/invitations/:slug/rsvp             -- rate-limited
POST /api/invitations/:slug/guestbook        -- rate-limited, moderated
GET  /api/invitations/:slug/calendar.ics
GET  /api/og/:slug?variant&g                 -- dynamic OG image
```

Admin routes live under `/api/admin/*` behind session middleware.

---

## SECTION J — IMPLEMENTATION ROADMAP

| Phase | Deliverable | Depends on |
|---|---|---|
| **0 — Approval & assets** | This report signed off; K.1–K.18 answered; ornament route chosen (C.3); fonts confirmed | **You** |
| **1 — Foundations** | Next.js + TS + Tailwind v4; design tokens; `next-intl` with `en`/`ar`; Playwright visual-diff harness; token calibration against references | 0 |
| **2 — Template engine** | `InvitationViewModel` type; template registry; `SectionConfig`-driven composition; ornament component + manifest | 1 |
| **3 — Baroque Gold static fidelity** | Sections 1–10 and 12–18 built to ±2px against references, English, mobile | 2, assets |
| **4 — Interactive layer** | Envelope + open animation; **two-link music (Section F)**; countdown; calendar + `.ics`; 3D gallery; map; scroll reveals; reduced-motion | 3 |
| **5 — Backend** | Postgres + Prisma; full schema; Auth.js; R2 uploads; public read API | 1 |
| **6 — Guest writes** | RSVP (both display styles), guestbook + moderation, rate limiting, gift box | 4, 5 |
| **7 — Dashboard** | Shell + all 15 referenced cards; then the E.5 new screens **after design approval** | 5 |
| **8 — Arabic / RTL** | Catalogues; Arabic fonts; mirroring pass; bidi countdown; both locales green at every breakpoint | 3, 7 |
| **9 — Hardening** | Perf budgets; OG images per variant and per guest; SEO; a11y; cross-browser matrix | 4–8 |
| **10 — Deploy** | Vercel + Neon + R2; env/secrets; backups; monitoring; runbook | 9 |

**Critical path:** 0 → 1 → 2 → 3 → 4. Phase 5 can run in parallel with 3–4. **Phase 3 is gated on ornament assets (C.3) — that is the single most likely schedule risk.**

---

## SECTION K — RISKS, UNCERTAINTIES, AND DECISIONS NEEDED

### Blocking — I need your answer before building

**K.1 — The RSVP modal contradicts the template.** The marketing sheet shows a gold baroque "CONFIRM ATTENDANCE" button, but the modal it opens (ref #11) is generic sans-serif with a blush button and no ornamentation. This is the sharpest inconsistency in the entire reference set. Part 2 says reproduce the references; Part 2 also says do not redesign. Both readings cannot hold.
→ **Options: (a) reproduce the generic modal exactly; (b) restyle it in baroque gold. I recommend (b)** — the generic modal looks like an unfinished part of the reference product, and a sans-serif popup inside a baroque invitation undercuts the premium feel the brief prioritises. **Your call.**

**K.2 — Two-track music has no dashboard reference.** I will design a new card ("Background Music" split into Link A / Link B, each with its own picker, plus a copy-link row per variant) using the E.4 primitives. **Approve the approach, or supply a reference.**

**K.3 — No Arabic reference exists.** Arabic typography, ornament mirroring, and the language switcher's placement are all original design work. **Approve Amiri + IBM Plex Sans Arabic, and the discreet `AR / EN` switcher placement.**

**K.4 — No desktop reference.** I propose a centred ≤480px paper column on an extended damask field (C.6, H.3). **Confirm, or supply desktop references.**

**K.5 — 14 dashboard screens have no reference** (table in E.5), including Guest Management, the music picker, and login. **Approve designing these from the established primitives.**

**K.6 — Arabic is required but all content is Spanish/Colombian** (Santiago & Isabella, Cartagena). Is the real first invitation an Arabic/Gulf wedding? That changes default locale, default numerals, calendar defaults, and whether Hijri matters.

**K.7 — Ornament asset acquisition** (C.3). The nine decorative assets are the reference product's copyrighted artwork and are unusable at 739px. **Choose: licence stock (~$50–200, fast), commission originals (~$800–2,500, owned), or AI-generate + vectorise.** My recommendation: licence now to unblock Phase 3, commission in parallel if this template is commercially central.

**K.16 — The mandated palette fails WCAG AA for body text.** Olive `#8D8F58` on ivory is ≈3.1:1; gold `#B97D3E` is ≈3.6:1 (C.1). Both are below the 4.5:1 required for normal-size text.
→ **Options: (a) keep the reference colours exactly and accept the failure; (b) keep them for large/decorative text but darken body text to ~`#6E7043` olive / ~`#8A5B28` gold, which preserves the look at normal reading sizes and passes AA.** **I recommend (b).** This is the one place where I would deviate from pixel-matching, and only because it is a legal/accessibility exposure rather than a taste question — so it is explicitly your decision, not mine.

### Non-blocking — reasonable defaults assumed, tell me if wrong

- **K.8 — Exact fonts unknown.** Proceeding with Cormorant Garamond + Inter (C.2), calibrated against references in Phase 1.
- **K.9 — Arabic numerals and Hijri.** Defaulting to Western numerals and Gregorian, both per-invitation configurable.
- **K.10 — Countdown timezone.** Using the invitation's stored timezone, not the guest's, so everyone sees the same number. (The reference shows "336 days" — consistent with a fixed event instant.)
- **K.11 — Guestbook moderation.** Defaulting to **moderated** (pending → owner approves). The reference shows no moderation UI beyond "View and manage", but auto-publishing public text on a wedding site invites spam and abuse.
- **K.12 — The magic-wand button** in the guestbook (ref #9) is almost certainly an AI wish generator. Assuming yes, implemented server-side via the Claude API with a strict per-IP quota. **Confirm, and confirm whether you want it in v1.**
- **K.13 — Celebration Party / Engagement Party tabs** (ref #17) — building all three event types since the schema cost is zero.
- **K.14 — "Unlimited photos" (Part 5) vs "Max 20 at a time" (ref #16).** Reading these as compatible: unlimited total, 20 per upload batch. Will add a soft cap (~100) for page weight.
- **K.15 — Personalised guest links × music variants.** Resolved orthogonally in F.3. Confirm that per-guest links are in v1 scope, or I will build the schema and defer the UI.
- **K.17 — Music licensing.** Commercial invitations need licensed tracks. Recommending a royalty-free library plus a rights attestation on owner uploads.
- **K.18 — Hosting and data residency.** Defaulting to Vercel + Neon + R2. If guest data must stay in a specific region (plausible for a Gulf client), say so now — it changes Phase 10 materially.

### Technical risks being actively managed

| Risk | Severity | Mitigation |
|---|---|---|
| Ornament assets block Phase 3 | **High** | Swappable `<Ornament>` components + placeholder sprites so layout proceeds in parallel |
| Pixel fidelity is subjective | **High** | Playwright overlay diffs at ±2px (H.2) — makes it objective |
| iOS audio autoplay | Medium | Gesture captured by the envelope tap (F.5) + designed fallback |
| RTL ornament mirroring errors | Medium | `mirrorInRtl` as manifest data + both-locale visual regression in CI |
| 3D coverflow perf on low-end Android | Medium | Virtualise beyond ±2 slides; GPU-only transforms |
| Reference gaps between screenshots | Medium | Marketing sheet fills most; remainder listed here |
| Google Maps quota/billing | Low | Embed API + referrer restriction; static fallback image |

---

## SECTION L — FINAL REQUIREMENTS CHECKLIST

### Visual fidelity
- [ ] Envelope matches ref #1 within ±2px at 393px
- [ ] Button sheen + sparkle particles present (ref #2)
- [ ] Gilded cartouche frame reproduced, not simplified
- [ ] Framed names auto-fit: one line, no overflow, no frame contact (D.1)
- [ ] Gilded Corinthian pillars reproduced with edge bleed
- [ ] Ivory damask ground at correct tone-on-tone contrast
- [ ] `#B97D3E` and `#8D8F58` applied per C.1 (subject to K.16)
- [ ] Mini calendar: ornate corners, gold rule, **wedding day as gold heart**
- [ ] Timeline: centred rail, gold dots, correct side placement
- [ ] 3D coverflow with perspective + `n / total` counter
- [ ] Guestbook form + scrollable wish list
- [ ] Gift box illustration + "Tap to open"
- [ ] Floral clusters at all referenced positions with intentional bleed
- [ ] Audio FAB with animated equalizer
- [ ] All 9 ornament assets at production resolution
- [ ] Type scale matches C.2
- [ ] No horizontal overflow at any breakpoint, either direction

### Invitation functionality
- [ ] All 18 sections (D) in correct order
- [ ] Per-section Show/Hide driven by `SectionConfig`
- [ ] Envelope open animation → invitation
- [ ] Live countdown in the invitation's timezone
- [ ] Add to Calendar (`.ics` + Google)
- [ ] Gallery: Grid / Collage / 3D layouts
- [ ] Google Map + Open in Maps + directions
- [ ] RSVP: Button and Inline styles; Guest chooses / Set a limit
- [ ] Guestbook submit + moderated display
- [ ] Gift box with bank details and/or QR
- [ ] Dress code swatches
- [ ] Repeatable ceremonies and schedule items

### Two-link music
- [ ] Two public URLs resolve to **one** invitation record
- [ ] Both render byte-identical content apart from the track
- [ ] Only the resolved track is ever sent to the client
- [ ] Track 1 cannot play on link 2, and vice versa
- [ ] Variant survives refresh
- [ ] Invalid/missing parameter → canonical variant, never a swap
- [ ] Missing track → silence + disabled FAB, never the other track
- [ ] No track switcher visible to guests
- [ ] Autoplay via the envelope gesture; designed fallback if blocked
- [ ] Works on iOS Safari and Android Chrome
- [ ] Composes correctly with personalised guest links (F.3)
- [ ] Both tracks configurable in the dashboard

### Bilingual
- [ ] Full UI translated, both locales
- [ ] Validation and error messages translated
- [ ] Invitation content supports per-locale values with fallback
- [ ] `dir`/`lang` correct at SSR, no mirror flash
- [ ] Logical CSS properties throughout; no `left`/`right` in components
- [ ] Asymmetric ornaments mirror; photos/map/gift do not
- [ ] Directional icons mirror; others do not
- [ ] Bidi-safe countdown and mixed-script text
- [ ] Language switch preserves path, query, variant, guest token, and form state
- [ ] Arabic fonts render correctly at all sizes
- [ ] `unicode-range` splitting so each locale loads only its faces

### Responsive
- [ ] 393px is an exact match to references
- [ ] Works 320px → 1920px
- [ ] Touch targets ≥44px
- [ ] `100dvh` handling
- [ ] Safe-area insets respected
- [ ] Both locales verified at every breakpoint

### Dashboard
- [ ] All 15 referenced cards reproduced
- [ ] Shell: template chip, Publish, Edit/Preview, gear
- [ ] All toggles, segmented controls, hint/info boxes, empty states
- [ ] 14 new screens designed and approved (E.5)
- [ ] Two-track music configuration
- [ ] Guest management + personalised links
- [ ] RSVP and guestbook management
- [ ] Both invitation links copyable

### Technical
- [ ] Template engine fully decoupled from invitation data
- [ ] Zero couple-specific literals in template code
- [ ] Multiple invitations, multiple templates supported
- [ ] Admin routes protected; all queries owner-scoped
- [ ] Zod validation at every boundary
- [ ] Rate limiting on public writes
- [ ] Upload magic-byte validation + EXIF stripping
- [ ] No secrets client-side
- [ ] LCP <2.5s, CLS <0.1, INP <200ms on mobile 4G
- [ ] Lazy loading, AVIF/WebP, optimised SVG
- [ ] Per-variant and per-guest OG images
- [ ] `prefers-reduced-motion` honoured everywhere
- [ ] Visual regression suite green

---

## APPENDIX — WHAT I COULD NOT DETERMINE

1. Exact font families (JPEG artefacts prevent certainty) — K.8
2. Any desktop or tablet layout — K.4
3. Anything Arabic or RTL — K.3
4. Login, invitation list, template picker, Guest Management, music picker, settings — K.5
5. The envelope's open animation (only start and end states exist)
6. The gallery's Grid and Collage layouts (only 3D is shown)
7. The expanded Dress Code and Schedule editor cards (collapsed in all references)
8. The gift method editor and QR presentation
9. Guestbook moderation UI beyond the drill-in row
10. Exact easing curves and durations for every animation
11. Whether the enlarged 18:45 timeline dot is an active state or a rendering artefact
12. The magic-wand button's exact behaviour — K.12
13. Scroll behaviour between sections (snap vs free) — assuming free scroll

---

**END OF REPORT — awaiting approval before any implementation begins.**
