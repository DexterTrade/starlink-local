import { ShieldCheck, Clock, Eye, Award, HeartHandshake, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Delivered, Duty Paid",
    body: "Every DDP route is pre-cleared, pre-priced, pre-paid. The recipient sees zero invoice on arrival.",
  },
  {
    icon: Clock,
    title: "On time, on the hour",
    body: "We commit to delivery windows in writing — and we honor them. Real-time tracking to the doorstep.",
  },
  {
    icon: Eye,
    title: "Transparent paperwork",
    body: "Every commercial invoice, packing list, AWB, and BoL routed through a single client folder.",
  },
  {
    icon: HeartHandshake,
    title: "One named handler",
    body: "Your shipment isn't shuffled between desks. A single coordinator owns it from pickup to receipt.",
  },
  {
    icon: Award,
    title: "Insured, end to end",
    body: "Full all-risk cover available on every consignment. Third-party policies underwritten on request.",
  },
  {
    icon: Sparkles,
    title: "Quoted with calm",
    body: "No hidden fees, no fuel surcharges in the fine print, no mid-transit re-pricing. You see what you pay.",
  },
];

export default function ManifestoPanel() {
  return (
    <section id="manifesto" className="relative py-24 md:py-32 bg-[image:var(--grad-onyx)]">
      <div className="absolute top-0 inset-x-0 gold-divider" />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Two-column intro */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <p className="eyebrow mb-4">Chapter two</p>
            <h2 className="display-serif text-5xl md:text-6xl text-foreground leading-[0.95]">
              A manifesto for
              <br />
              <em className="italic text-gold">careful</em> freight.
            </h2>
          </div>
          <div className="md:pt-12">
            <p className="text-lg text-foreground/75 leading-relaxed">
              {siteConfig.brand.short} is built on the belief that logistics ought to feel less
              like a transaction and more like a quiet promise — kept without fuss, repeated without
              improvisation, and priced without surprise.
            </p>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              These six principles are how we earn the trust of every consignment placed in our care.
            </p>
          </div>
        </div>

        {/* Principles list — magazine column */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
          {PRINCIPLES.map((p, i) => (
            <article key={p.title} className="group">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-xs text-primary/70 tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="hairline flex-1" />
              </div>
              <p.icon className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-serif text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
