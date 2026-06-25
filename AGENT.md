# AGENT.md

Guidance for any AI agent working with the **Starlink Courier & Cargo Service** repo.

---

## Project Overview

**Starlink Courier & Cargo Service** — a courier and cargo website with a dark, editorial, gold-accented design language. The public site markets air/sea/land freight and DDP delivery; the admin panel manages parcels and per-country rates against a Supabase backend; customers track parcels by UUID or phone number.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 · TailwindCSS v4 · shadcn/ui (new-york) · Supabase · Framer Motion

---

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run start      # Serve production build
```

---

## Routes

| Route | Type | Purpose |
|---|---|---|
| `/` | Server | Editorial home — assembles all panel components |
| `/about` | Server | The studio story — values, ethos, numbers |
| `/services` | Server | Air, sea, land, customs — full chapter breakdown |
| `/contact` | Client | Contact form + map + Meta Lead event |
| `/contact/whatsapp` | Server | WhatsApp redirect bridge |
| `/track` | Client | Parcel tracking — UUID or phone-number lookup |
| `/admin/rates` | Client | Auth-gated rates + parcels admin |
| `/api/meta/conversions` | Route | Server-side Meta Conversions API proxy |
| `/robots.txt` · `/sitemap.xml` | Generated | SEO basics |

---

## Brand & Theme

All brand details — name, tagline, contact, phones, address, WhatsApp number, promo strip text, currency, map coordinates — are read from `NEXT_PUBLIC_*` env vars via `lib/site-config.ts`. To re-skin the site for a new operator, edit `.env.local` only.

The visual identity:

- **Palette:** deep onyx, ivory, brushed gold, champagne accent, jade success
- **Typography:** Cormorant Garamond (display) + Inter (body) + JetBrains Mono (mono, for tracking IDs and numbers)
- **Layout:** magazine-style, asymmetric, numbered chapters, hairline gold dividers
- **Motion:** subtle parallax + scroll-triggered reveals via Framer Motion

CSS variables live in `app/globals.css` using the `oklch` color space.

---

## Supabase Schema

Provide a fresh Supabase project via the env vars in `.env.example`. The required schema mirrors the legacy table shapes — same column names, same casing (including the `feight_type` / `lable` quirks documented below).

### Tables

| Table | Public read | Auth write |
|---|---|---|
| `countries` | ✅ | ✅ |
| `parcel` | ✅ | ✅ |
| `parcel_status` | ✅ | — |
| `feight_type` | ✅ | — |

**`countries`** — destination rows surfaced in the Atlas section.
- `country_name` stores ISO 2-letter codes (e.g. `GB`), not full names.
- Display name resolved via `new Intl.DisplayNames(['en'], { type: 'region' }).of(code)`.
- `is_active: false` hides the row from the public Atlas.

**`parcel`** — shipping orders.
- `id` (UUID) is the customer-facing tracking ID.
- `status_id` → `parcel_status(id)` · `freight_type_id` → `feight_type(id)`.

**`parcel_status`** — lookup. `sort_order` defines the visual progression order on `/track`.

**`feight_type`** — lookup. `sort_order` controls dropdown order. (Yes, "feight" is the schema spelling — keep it.)

### Admin auth

`/admin/rates` uses **Supabase Auth** (`signInWithPassword`). Sessions persist in localStorage. Create a user in the Supabase dashboard to grant access.

---

## Environment Variables

See `.env.example` for the full annotated list. Summary:

- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BRAND_*`, `NEXT_PUBLIC_PROMO_TEXT` — branding
- `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_PHONE_*`, `NEXT_PUBLIC_WHATSAPP_NUMBER*` — contact
- `NEXT_PUBLIC_ADDRESS*`, `NEXT_PUBLIC_MAP_LAT`, `NEXT_PUBLIC_MAP_LNG` — location
- `NEXT_PUBLIC_CURRENCY_SYMBOL`, `NEXT_PUBLIC_CURRENCY_PER_UNIT` — display formatting
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — backend
- `NEXT_PUBLIC_META_PIXEL_ID`, `META_PIXEL_ID`, `META_ACCESS_TOKEN`, `META_GRAPH_VERSION`, `META_TEST_EVENT_CODE` — Meta pixel + Conversions API

---

## Key Architectural Notes

- **`lib/site-config.ts`** is the only place brand/contact details are resolved. Always import from there — never hard-code an email, phone number, or address in a component.
- **Section/panel components** (`components/sections/`) are mostly server-rendered. The home page composes them.
- **Navigation hash links** detect `usePathname()`: on `/` they stay as `#chapter`, elsewhere they become `/#chapter`.
- **Meta tracking** — `lib/meta-client.ts` sends both the browser-side `fbq()` event and a POST to `/api/meta/conversions` which forwards to Facebook with PII hashed (SHA-256). Both share an `event_id` so Meta de-duplicates.
- **`feight_type` and `lable` typos** in the DB schema are intentional. Match them exactly.

---

## Known Gotchas

- `next.config.mjs` sets `images: { unoptimized: true }` and `typescript: { ignoreBuildErrors: true }`.
- `country_name` stores ISO codes despite its name.
- The `/track` page fetches `parcel_status` on mount to build the timeline — reordering that table affects the public UI immediately.
