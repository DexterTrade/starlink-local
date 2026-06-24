import { createClient } from "@supabase/supabase-js";
import { codeToEmoji, getCountryDisplayName } from "@/lib/countries";
import { siteConfig } from "@/lib/site-config";
import type { Country } from "@/lib/supabase";

async function fetchCountries(): Promise<Country[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const client = createClient(url, key);
    const { data } = await client
      .from("countries")
      .select("*, feight_type(*)")
      .eq("is_active", true)
      .order("id");
    return (data ?? []) as Country[];
  } catch {
    return [];
  }
}

const FALLBACK_DESTINATIONS = [
  { code: "GB", label: "United Kingdom", note: "Air · DDP" },
  { code: "US", label: "United States", note: "Air · DDP" },
  { code: "AE", label: "United Arab Emirates", note: "Air · Sea" },
  { code: "SA", label: "Saudi Arabia", note: "Air · Sea" },
  { code: "CA", label: "Canada", note: "Air" },
  { code: "FR", label: "France", note: "Air · DDP" },
  { code: "DE", label: "Germany", note: "Air · DDP" },
  { code: "AU", label: "Australia", note: "Sea" },
];

export default async function AtlasPanel() {
  const countries = await fetchCountries();
  const useFallback = countries.length === 0;
  const { currency } = siteConfig;

  return (
    <section id="atlas" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-12 mb-16">
          <div>
            <p className="eyebrow mb-4">Chapter three</p>
            <h2 className="display-serif text-5xl md:text-6xl text-foreground">
              An <em className="italic text-gold">atlas</em><br />of routings.
            </h2>
          </div>
          <p className="md:pt-12 text-lg text-foreground/75 leading-relaxed">
            From Lahore to the Levant, Lagos to London — these are the corridors we run most often.
            Rates are quoted per {currency.perUnit}, all-inclusive of DDP where shown.
          </p>
        </div>

        {/* Destinations */}
        {useFallback ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-border/40 border border-border/40">
            {FALLBACK_DESTINATIONS.map((d, i) => (
              <div
                key={d.code}
                className="group bg-background hover:bg-card transition-colors p-8 relative"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="chapter-number text-3xl">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-3xl leading-none">{codeToEmoji(d.code)}</span>
                </div>
                <p className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">
                  {d.label}
                </p>
                <p className="mt-2 text-xs font-mono uppercase tracking-[0.16em] text-muted-foreground">
                  {d.note}
                </p>
                <p className="mt-1 text-xs font-mono text-primary/80">— rate on request</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-border/40 border border-border/40">
            {countries.map((c, i) => {
              const code = c.country_name ?? "";
              const isCode = code.length === 2;
              return (
                <div
                  key={c.id}
                  className="group bg-background hover:bg-card transition-colors p-8 relative"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="chapter-number text-3xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-3xl leading-none">
                      {isCode ? codeToEmoji(code) : "🌍"}
                    </span>
                  </div>
                  <p className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">
                    {isCode ? getCountryDisplayName(code) : code}
                  </p>
                  {c.feight_type?.lable && (
                    <p className="mt-2 text-xs font-mono uppercase tracking-[0.16em] text-muted-foreground">
                      {c.feight_type.lable}
                    </p>
                  )}
                  <p className="mt-1 font-mono text-sm text-primary">
                    {currency.symbol}
                    {(c.rates ?? 0).toLocaleString()} / {currency.perUnit}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Marquee strip of all flags */}
        <div className="mt-16 overflow-hidden border-y border-border/40 py-6">
          <div className="flex marquee-track gap-12 w-max">
            {[...FALLBACK_DESTINATIONS, ...FALLBACK_DESTINATIONS, ...FALLBACK_DESTINATIONS].map(
              (d, i) => (
                <div key={`${d.code}-${i}`} className="flex items-center gap-3 shrink-0">
                  <span className="text-2xl">{codeToEmoji(d.code)}</span>
                  <span className="font-serif italic text-xl text-foreground/70">{d.label}</span>
                  <span className="text-primary/40">·</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
