import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/nav/announcement-bar";
import { Header } from "@/components/nav/header";
import { Footer } from "@/components/nav/footer";
import { siteConfig } from "@/lib/site-config";
import { Compass, Telescope, Scale, Feather } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${siteConfig.brand.name} — our practice, our principles, and the team that handles every consignment.`,
  alternates: { canonical: "/about" },
};

const NUMBERS = [
  { value: "12y+", label: "In practice" },
  { value: "150+", label: "Ports served" },
  { value: "38k", label: "Consignments cleared" },
  { value: "99.6%", label: "On-time rate" },
];

const VALUES = [
  {
    icon: Compass,
    title: "Discretion",
    body: "We treat every shipment as if its contents were our own. Whether it's a wedding trousseau or a manufacturing pallet — same restraint, same care.",
  },
  {
    icon: Telescope,
    title: "Foresight",
    body: "We track each consignment proactively. If a route shifts, a customs queue lengthens, or a vessel slips — you hear from us first.",
  },
  {
    icon: Scale,
    title: "Fairness",
    body: "We quote what we mean. There is no fuel surcharge buried in the fine print, no peak-season adjustment after pickup, no broker fee 'discovered' at clearance.",
  },
  {
    icon: Feather,
    title: "Restraint",
    body: "We do six things, and we do them properly. No third-party drop-shipping. No reseller layers. No middle-men diluting accountability.",
  },
];

const TEAM = [
  { name: "Studio Office", role: "Lahore, Pakistan", note: "Operations & customs" },
  { name: "London Desk", role: "Heathrow", note: "Last-mile · UK" },
  { name: "Dubai Liaison", role: "Jebel Ali", note: "Middle East routing" },
  { name: "Karachi Port", role: "Port Qasim", note: "Sea cargo origination" },
];

export default function AboutPage() {
  const { brand } = siteConfig;

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-20 pb-24 md:pt-32 md:pb-32">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <p className="eyebrow mb-6">The studio</p>
            <h1 className="display-serif text-5xl sm:text-6xl lg:text-[7rem] text-foreground leading-[0.95] max-w-5xl">
              A small house,
              <br />
              <em className="italic text-gold">precisely</em> built for freight.
            </h1>
            <p className="mt-10 max-w-2xl text-lg text-foreground/75 leading-relaxed">
              {brand.name} was founded on the conviction that international shipping ought to feel
              less like a transaction and more like a quiet, dependable promise. We work with
              households, manufacturers, e-commerce operators, and freight-forwarders — but always
              one consignment at a time.
            </p>
          </div>
        </section>

        <div className="gold-divider" />

        {/* Numbers */}
        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {NUMBERS.map((n, i) => (
                <div
                  key={n.label}
                  className={`p-8 ${i < NUMBERS.length - 1 ? "md:border-r" : ""} ${
                    i < 2 ? "border-b md:border-b-0" : ""
                  } border-border/40`}
                >
                  <p className="display-serif text-5xl md:text-6xl text-primary leading-none">
                    {n.value}
                  </p>
                  <p className="mt-3 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    {n.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="gold-divider" />

        {/* The story */}
        <section className="py-24 md:py-32 bg-[image:var(--grad-onyx)]">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
            <p className="eyebrow mb-4">Our story</p>
            <h2 className="display-serif text-4xl md:text-5xl text-foreground mb-10 leading-tight">
              We started by counting boxes
              <br />
              <em className="italic text-gold">one at a time</em>.
            </h2>
            <div className="space-y-6 text-lg text-foreground/75 leading-relaxed font-serif">
              <p>
                Our practice began in a single office in Mughalpura, Lahore — a handful of
                households moving belongings to family in the United Kingdom. Word of mouth
                travelled faster than any of us anticipated.
              </p>
              <p>
                Within a year we were routing trousseau parcels to Dubai, e-commerce orders to New
                Jersey, and FCL containers to Felixstowe. Each new corridor was studied first,
                quoted second, ran third. We refused to grow faster than our paperwork could keep
                up.
              </p>
              <p>
                Today we are a quiet, fully-licensed freight-forwarder operating out of Pakistan,
                with named desks in London, Dubai, and Karachi. We still treat every consignment
                the way we treated the first one — like it mattered to the person sending it.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid md:grid-cols-[1fr_1.6fr] gap-12 mb-16">
              <div>
                <p className="eyebrow mb-4">What we hold</p>
                <h2 className="display-serif text-5xl text-foreground leading-[0.95]">
                  Four <em className="italic text-gold">values</em>,<br />honestly held.
                </h2>
              </div>
              <p className="md:pt-10 text-lg text-foreground/75 leading-relaxed max-w-2xl">
                We don't post slogans on the wall. But if you asked us why a consignment was handled
                a particular way, you'd hear some version of these four words.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {VALUES.map((v, i) => (
                <article key={v.title} className="group">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="chapter-number text-2xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="hairline flex-1" />
                  </div>
                  <v.icon className="h-7 w-7 text-primary mb-4" />
                  <h3 className="font-serif text-3xl text-foreground mb-3 group-hover:text-primary transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-md">{v.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* The team / desks */}
        <section className="py-24 md:py-32 bg-[image:var(--grad-onyx)]">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <p className="eyebrow mb-4">The desks</p>
            <h2 className="display-serif text-5xl text-foreground mb-12 leading-[0.95] max-w-3xl">
              Where the <em className="italic text-gold">paperwork</em> lives.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 border border-border/40">
              {TEAM.map((t, i) => (
                <div key={t.name} className="bg-background hover:bg-card transition-colors p-8">
                  <span className="chapter-number text-2xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-serif text-2xl text-foreground mt-4">{t.name}</p>
                  <p className="mt-1 text-xs font-mono uppercase tracking-[0.16em] text-primary/70">
                    {t.role}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{t.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
