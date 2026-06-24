"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, Globe2, Plane, Ship, Truck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getCookie, sendMetaEvent } from "@/lib/meta-client";
import { scrollToQuoteForm, scrollToSection } from "@/lib/scroll";

const STATS = [
  { value: "150+", label: "Destinations" },
  { value: "7 Day", label: "Air Transit" },
  { value: "DDP", label: "All Inclusive" },
];

export default function HeroPanel() {
  const { brand } = siteConfig;

  return (
    <section id="home" className="relative isolate overflow-hidden">
      {/* Background — layered radial gradients + grain via globals */}
      <div className="absolute inset-0 -z-10">
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 30%, oklch(0.3 0.06 70 / 0.6), transparent 70%), radial-gradient(40% 40% at 80% 70%, oklch(0.25 0.04 60 / 0.7), transparent 70%)",
          }}
        />
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" className="text-primary" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-12 lg:pt-24 pb-32">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-start">
          {/* Left — editorial copy */}
          <div className="reveal">
            <p className="eyebrow mb-6 inline-flex items-center gap-2">
              <span className="h-px w-8 bg-primary/60" />
              Founded for global trade
            </p>

            <h1 className="display-serif text-5xl sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] text-foreground">
              The art of <em className="italic shimmer-gold not-italic">moving cargo</em>,
              <br className="hidden sm:block" />
              refined by every continent.
            </h1>

            <p className="mt-8 max-w-xl text-base sm:text-lg text-foreground/75 leading-relaxed">
              {brand.name} is a quiet kind of freight house — the kind where every parcel is
              accounted for, every duty pre-handled, and every promise of timing is met without
              improvisation.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => {
                  void sendMetaEvent({
                    event_name: "Contact",
                    user_data: { fbp: getCookie("_fbp"), fbc: getCookie("_fbc") },
                    custom_data: { channel: "website_form", placement: "hero", action: "scroll_to_quote" },
                  });
                  scrollToQuoteForm();
                }}
              >
                Request a Quote
              </Button>
              <Button
                size="lg"
                variant="onyx"
                onClick={() => scrollToSection("chapters")}
                className="group"
              >
                Read the Chapters
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </Button>
            </div>

            {/* Stat row */}
            <div className="mt-16 grid grid-cols-3 max-w-lg gap-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="border-l border-primary/30 pl-4">
                  <p className="font-serif text-3xl text-primary">{stat.value}</p>
                  <p className="mt-1 text-xs font-mono uppercase tracking-[0.16em] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — orbital cargo composition */}
          <div className="relative reveal reveal-delay-2">
            <div className="relative aspect-[4/5] glass rounded-sm p-8 overflow-hidden">
              {/* Title strip */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
                <span className="eyebrow">Mode of carriage</span>
                <span className="font-mono text-xs text-muted-foreground">vol.001</span>
              </div>

              {/* Three carriage modes */}
              <div className="space-y-5">
                {[
                  { icon: Plane, name: "Air", lane: "Express · 5–7 days", weight: "1–500kg" },
                  { icon: Ship, name: "Sea", lane: "Container · 25–35 days", weight: "FCL · LCL" },
                  { icon: Truck, name: "Land", lane: "Domestic · regional", weight: "Bulk" },
                ].map((mode, i) => (
                  <div
                    key={mode.name}
                    className="flex items-center gap-4 group cursor-default"
                    style={{ animationDelay: `${(i + 1) * 0.1}s` }}
                  >
                    <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-sm bg-primary/10 border border-primary/30 group-hover:bg-primary/20 transition-colors">
                      <mode.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 border-b border-border/40 pb-4 group-hover:border-primary/40 transition-colors">
                      <div className="flex items-baseline justify-between">
                        <p className="font-serif text-xl text-foreground">{mode.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">{mode.weight}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{mode.lane}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footnote */}
              <div className="absolute bottom-8 left-8 right-8 flex items-center gap-2 text-xs text-muted-foreground">
                <Globe2 className="h-3.5 w-3.5 text-primary/70" />
                <span className="font-mono uppercase tracking-widest">Routed to 150+ ports</span>
              </div>
            </div>

            {/* Floating ledger card */}
            <div className="absolute -bottom-6 -left-6 hidden md:block glass rounded-sm px-5 py-4 max-w-[14rem] shadow-2xl reveal reveal-delay-4">
              <p className="eyebrow text-[0.6rem]">Today’s ledger</p>
              <p className="mt-2 font-serif text-2xl text-primary">12,408 kg</p>
              <p className="text-xs text-muted-foreground mt-1">across 38 active shipments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gold hairline divider */}
      <div className="gold-divider" />
    </section>
  );
}
