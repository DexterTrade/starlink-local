import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementBar } from "@/components/nav/announcement-bar";
import { Header } from "@/components/nav/header";
import { Footer } from "@/components/nav/footer";
import { Button } from "@/components/ui/button";
import { Plane, Ship, Truck, FileBadge, ArrowUpRight, Warehouse } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services",
  description: `Air, sea, and land freight with full DDP clearance via ${siteConfig.brand.name}.`,
  alternates: { canonical: "/services" },
};

const SERVICES = [
  {
    id: "air",
    number: "01",
    icon: Plane,
    title: "Air Freight",
    description:
      "Chartered air corridors out of Lahore, Karachi, and Islamabad with 5–7 day express handoff.",
    features: [
      "Express delivery within 5–7 working days",
      "Bonded chain-of-custody tracking",
      "Insurance underwritten on request",
      "Customs clearance at destination",
      "Door-to-door routing",
      "Bulk-rate pricing for repeat shippers",
    ],
    benefit: "Best for time-sensitive consignments, perishables, and high-value parcels.",
  },
  {
    id: "sea",
    number: "02",
    icon: Ship,
    title: "Sea Cargo",
    description:
      "FCL and LCL routings from Port Qasim and Karachi via Jebel Ali, Felixstowe, and Long Beach.",
    features: [
      "Full Container Load (FCL) — 20', 40', 40HC",
      "Less than Container Load (LCL) consolidation",
      "Marine cover available",
      "Port-to-port and door-to-door",
      "Comprehensive paperwork",
      "Weekly sailing schedule",
    ],
    benefit: "Ideal for volume freight, household relocations, and cost-sensitive corridors.",
  },
  {
    id: "land",
    number: "03",
    icon: Truck,
    title: "Land Transit",
    description: "Domestic trucking and cross-border land routing with live GPS visibility.",
    features: [
      "Domestic & cross-border trucking",
      "Modern fleet with GPS tracking",
      "Climate-controlled options",
      "Flexible scheduling",
      "Dedicated or shared loads",
      "Last-mile delivery",
    ],
    benefit: "Best for regional connections, last-mile, and time-critical inland legs.",
  },
  {
    id: "ddp",
    number: "04",
    icon: FileBadge,
    title: "DDP Concierge",
    description:
      "Delivered Duty Paid — duties pre-handled, no surprise invoices for your recipient.",
    features: [
      "Customs duty pre-paid at origin",
      "Single all-inclusive quote",
      "No customs hold at destination",
      "Recipient receives clean parcel",
      "Available on UK, USA, EU corridors",
      "Brokerage handled in-house",
    ],
    benefit: "The cleanest shipping experience for your customer — exactly zero invoices.",
  },
  {
    id: "warehouse",
    number: "05",
    icon: Warehouse,
    title: "Warehousing",
    description: "Secure climate-controlled storage with inventory management.",
    features: [
      "Climate-controlled bays",
      "Inventory management system",
      "Pick & pack services",
      "Cross-docking",
      "24/7 monitoring",
      "Flexible lease terms",
    ],
    benefit: "Optimise the supply chain with our origin and destination storage facilities.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-20 pb-24 md:pt-32 md:pb-32">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <p className="eyebrow mb-6">The catalogue</p>
            <h1 className="display-serif text-5xl sm:text-6xl lg:text-[7rem] text-foreground leading-[0.95] max-w-5xl">
              Five <em className="italic text-gold">disciplines</em>,
              <br />
              one practice.
            </h1>
            <p className="mt-10 max-w-2xl text-lg text-foreground/75 leading-relaxed">
              We resist the urge to do everything. These are the five disciplines we know
              intimately. Each has its own paperwork, its own pricing logic, its own pace.
            </p>
          </div>
        </section>

        <div className="gold-divider" />

        {/* Services list */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 space-y-32">
            {SERVICES.map((s, i) => (
              <article
                key={s.id}
                id={s.id}
                className={`scroll-mt-32 grid md:grid-cols-2 gap-12 items-start ${
                  i % 2 === 1 ? "md:grid-flow-dense" : ""
                }`}
              >
                {/* Copy column */}
                <div className={i % 2 === 1 ? "md:col-start-2" : ""}>
                  <span className="chapter-number text-6xl">{s.number}</span>
                  <div className="mt-4 flex items-center gap-3">
                    <s.icon className="h-7 w-7 text-primary" />
                    <h2 className="font-serif text-4xl md:text-5xl text-foreground">{s.title}</h2>
                  </div>
                  <p className="mt-6 text-lg text-foreground/75 leading-relaxed">{s.description}</p>

                  <ul className="mt-8 space-y-3">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-foreground/85">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-8 italic text-muted-foreground border-l-2 border-primary/60 pl-4">
                    {s.benefit}
                  </p>

                  <Button asChild className="mt-8" variant="outline" size="lg">
                    <Link href="/contact">
                      Quote for {s.title}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Visual column — large iconography on glass */}
                <div className={`${i % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}`}>
                  <div className="relative aspect-[5/6] glass rounded-sm overflow-hidden">
                    {/* Decorative pattern */}
                    <svg
                      aria-hidden
                      className="absolute inset-0 h-full w-full opacity-[0.06]"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern
                          id={`p-${s.id}`}
                          width="24"
                          height="24"
                          patternUnits="userSpaceOnUse"
                        >
                          <circle cx="2" cy="2" r="1" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#p-${s.id})`}
                        className="text-primary"
                      />
                    </svg>

                    {/* Centerpiece */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <s.icon className="h-32 w-32 text-primary/40" strokeWidth={0.6} />
                      <p className="mt-6 chapter-number text-3xl">{s.title}</p>
                    </div>

                    {/* Corner labels */}
                    <p className="absolute top-6 left-6 eyebrow">{s.number} · disc.</p>
                    <p className="absolute bottom-6 right-6 eyebrow">{s.id}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-24 md:py-32 bg-[image:var(--grad-onyx)] border-t border-border/60">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
            <p className="eyebrow mb-4">An exit</p>
            <h2 className="display-serif text-4xl md:text-6xl text-foreground leading-[0.95] mb-8">
              Have something
              <br />
              <em className="italic text-gold">specific</em> in mind?
            </h2>
            <p className="text-lg text-foreground/75 mb-10">
              Tell us the two cities. We'll write back with the routing, the timeline, and a fixed
              all-inclusive quote.
            </p>
            <Button asChild size="xl">
              <Link href="/contact">Begin the conversation</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
