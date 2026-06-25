const pick = (value: string | undefined, fallback: string) =>
  value && value.trim().length > 0 ? value.trim() : fallback;

const stripSlash = (url: string) => url.replace(/\/+$/, "");

export const siteConfig = {
  url: stripSlash(pick(process.env.NEXT_PUBLIC_SITE_URL, "https://www.starlinkcourier.com")),

  brand: {
    name: pick(process.env.NEXT_PUBLIC_BRAND_NAME, "Starlink Courier & Cargo Service"),
    short: pick(process.env.NEXT_PUBLIC_BRAND_SHORT, "Starlink"),
    eyebrow: pick(process.env.NEXT_PUBLIC_BRAND_EYEBROW, "Courier & Cargo"),
    tagline: pick(
      process.env.NEXT_PUBLIC_BRAND_TAGLINE,
      "Reliable courier and cargo, delivered worldwide.",
    ),
    description: pick(
      process.env.NEXT_PUBLIC_BRAND_DESCRIPTION,
      "Trusted courier and cargo service connecting Pakistan to the world — air freight, sea cargo, DDP delivery, and door-to-door parcel handling without surprises.",
    ),
  },

  contact: {
    email: pick(process.env.NEXT_PUBLIC_EMAIL, "hello@starlinkcourier.com"),
    phonePrimary: pick(process.env.NEXT_PUBLIC_PHONE_PRIMARY, "+92 332 6135002"),
    phoneSecondary: pick(process.env.NEXT_PUBLIC_PHONE_SECONDARY, "+92 332 8884396"),
    phoneUK: pick(process.env.NEXT_PUBLIC_PHONE_UK, "+44 7404 654725"),
  },

  whatsapp: {
    primary: pick(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER, "923326135002"),
    uk: pick(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_UK, "447404654725"),
  },

  address: {
    full: pick(
      process.env.NEXT_PUBLIC_ADDRESS,
      "Office 64, opposite DMO Office, Workshop Road, Mughalpura, Lahore, Pakistan",
    ),
    short: pick(process.env.NEXT_PUBLIC_ADDRESS_SHORT, "Lahore, Pakistan"),
    lat: pick(process.env.NEXT_PUBLIC_MAP_LAT, "31.5666561"),
    lng: pick(process.env.NEXT_PUBLIC_MAP_LNG, "74.3654366"),
  },

  promo: {
    text: pick(
      process.env.NEXT_PUBLIC_PROMO_TEXT,
      "Introducing DDP shipping to the UK, USA & Europe — duty handled, no surprises.",
    ),
  },

  currency: {
    symbol: pick(process.env.NEXT_PUBLIC_CURRENCY_SYMBOL, "₨"),
    perUnit: pick(process.env.NEXT_PUBLIC_CURRENCY_PER_UNIT, "kg"),
  },
} as const;

export const getSiteUrl = () => siteConfig.url;

export type SiteConfig = typeof siteConfig;
