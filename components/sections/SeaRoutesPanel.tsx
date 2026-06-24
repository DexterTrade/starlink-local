import { Anchor, Container, Waves, Boxes } from "lucide-react";

const ROUTES = [
  {
    flag: "🇺🇸",
    title: "Karachi → Long Beach",
    transit: "32–38 days",
    note: "FCL · LCL · DDP optional",
  },
  {
    flag: "🇬🇧",
    title: "Karachi → Felixstowe",
    transit: "26–30 days",
    note: "Weekly sailings",
  },
  {
    flag: "🇦🇪",
    title: "Port Qasim → Jebel Ali",
    transit: "5–7 days",
    note: "Express LCL",
  },
  {
    flag: "🇸🇦",
    title: "Karachi → Dammam",
    transit: "7–10 days",
    note: "Direct vessel",
  },
];

const SPECS = [
  { icon: Container, label: "20ft / 40ft / 40HC" },
  { icon: Boxes, label: "Consolidated LCL" },
  { icon: Anchor, label: "Door · Port · Door" },
  { icon: Waves, label: "All-risk marine cover" },
];

export default function SeaRoutesPanel() {
  return (
    <section
      id="sea-cargo"
      className="relative py-24 md:py-32 overflow-hidden bg-[image:var(--grad-onyx)]"
    >
      {/* Decorative wave */}
      <svg
        aria-hidden
        className="absolute -bottom-12 left-0 right-0 w-full text-primary/10"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C300,90 600,-10 900,40 C1050,70 1150,30 1200,50 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Editorial copy */}
          <div>
            <p className="eyebrow mb-4">An intermission</p>
            <h2 className="display-serif text-5xl md:text-6xl text-foreground leading-[0.95]">
              And then, the
              <br />
              <em className="italic text-gold">slow ocean</em>.
            </h2>
            <p className="mt-8 text-lg text-foreground/75 leading-relaxed">
              For weighty consignments — commercial loads, household relocations, full container
              consolidations — we route by sea. The patient mode. The careful mode.
            </p>

            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4">
              {SPECS.map((s) => (
                <li key={s.label} className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-primary/30 bg-primary/10">
                    <s.icon className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm font-mono uppercase tracking-[0.14em] text-foreground/80">
                    {s.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Routes list */}
          <div className="space-y-4">
            {ROUTES.map((r, i) => (
              <div
                key={r.title}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 border border-border/50 bg-card/40 hover:bg-card hover:border-primary/40 transition-all p-6 rounded-sm"
              >
                <span className="text-3xl">{r.flag}</span>
                <div>
                  <p className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">
                    {r.title}
                  </p>
                  <p className="text-xs font-mono uppercase tracking-[0.16em] text-muted-foreground mt-1">
                    {r.note}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-primary">{r.transit}</p>
                  <p className="text-[0.65rem] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                    transit
                  </p>
                </div>
                <span className="chapter-number text-xs col-span-3 -mt-2 opacity-50">
                  Route {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
