"use client";

import { Plane, Ship, Package, Globe, FileBadge, Warehouse } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";

const CHAPTERS = [
  {
    number: "01",
    icon: Plane,
    title: "Air Freight",
    subtitle: "When time decides the trade",
    description:
      "Bonded air corridors with chartered slots out of Lahore, Karachi, and Islamabad. Express handoff within 5–7 days, full chain-of-custody documentation, and parcel-grade insurance to the doorstep.",
    targetId: "atlas",
  },
  {
    number: "02",
    icon: Ship,
    title: "Sea Cargo",
    subtitle: "Volume, patiently moved",
    description:
      "FCL and LCL out of Karachi and Port Qasim. Specialist routings through Jebel Ali, Felixstowe, and Long Beach with consolidated container loading, lashing, and last-mile handover.",
    targetId: "sea-cargo",
  },
  {
    number: "03",
    icon: Package,
    title: "Personal Effects",
    subtitle: "The household, kept whole",
    description:
      "Door-to-door personal shipments — gifts, trousseau, electronics — packed with care, declared accurately, and delivered with the same parcel intact end to end.",
    targetId: "atlas",
  },
  {
    number: "04",
    icon: Globe,
    title: "Freight Forwarding",
    subtitle: "Orchestrated movement",
    description:
      "Multimodal routing, carrier negotiation, and customs choreography for commercial loads — one point of contact across the entire journey.",
    targetId: "manifesto",
  },
  {
    number: "05",
    icon: FileBadge,
    title: "DDP Concierge",
    subtitle: "Duties pre-handled",
    description:
      "Delivered Duty Paid clearance with all-inclusive pricing. Your recipient pays nothing — no customs holds, no surprise invoices, no broker calls.",
    targetId: "inquiries",
  },
  {
    number: "06",
    icon: Warehouse,
    title: "Customs & Clearance",
    subtitle: "Compliant, by design",
    description:
      "HS-code classification, COO documentation, FBR, ICEgate and CBP paperwork — handled by licensed brokers who don't improvise.",
    targetId: "inquiries",
  },
];

export default function ChaptersPanel() {
  return (
    <section id="chapters" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section header */}
        <div className="grid md:grid-cols-[1fr_2fr] gap-8 mb-20 items-end">
          <div>
            <p className="eyebrow mb-4">Chapter one</p>
            <h2 className="display-serif text-5xl md:text-6xl text-foreground">
              The <em className="italic text-gold">six</em> ways<br />we move cargo.
            </h2>
          </div>
          <div className="md:pt-10">
            <p className="text-lg text-foreground/75 leading-relaxed max-w-xl">
              Every shipment is a small story. Some arrive overnight, others ride patient ocean
              swells for a month. We've built our practice around six modes — each with its own
              cadence, paperwork, and pricing logic.
            </p>
          </div>
        </div>

        {/* Chapter grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 border-t border-l border-border/50">
          {CHAPTERS.map((ch) => (
            <button
              key={ch.number}
              onClick={() => scrollToSection(ch.targetId)}
              className="group relative text-left p-8 lg:p-10 border-r border-b border-border/50 bg-card/30 hover:bg-card/70 transition-colors"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="chapter-number text-5xl">{ch.number}</span>
                <ch.icon className="h-7 w-7 text-primary/70 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-1 group-hover:text-primary transition-colors">
                {ch.title}
              </h3>
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-primary/70 mb-4">
                {ch.subtitle}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{ch.description}</p>

              {/* Hover hairline */}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
