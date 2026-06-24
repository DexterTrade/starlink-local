"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getCookie, sendMetaEvent } from "@/lib/meta-client";
import { Wordmark } from "./wordmark";

const FOOTER_SECTIONS = [
  {
    title: "Navigate",
    links: [
      { label: "The Studio", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Track Parcel", href: "/track" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Chapters",
    links: [
      { label: "Air Freight", href: "/services#air" },
      { label: "Sea Cargo", href: "/services#sea" },
      { label: "Land Transit", href: "/services#land" },
      { label: "DDP Concierge", href: "/services#ddp" },
    ],
  },
];

function track(channel: string, placement: string) {
  void sendMetaEvent({
    event_name: "Contact",
    user_data: { fbp: getCookie("_fbp"), fbc: getCookie("_fbc") },
    custom_data: { channel, placement },
  });
}

export function Footer() {
  const { brand, contact, whatsapp, address } = siteConfig;

  return (
    <footer id="footer" className="relative mt-24 border-t border-border/60 bg-[image:var(--grad-onyx)]">
      <div className="absolute top-0 left-0 right-0 hairline" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        {/* Top band — wordmark + tagline + CTA */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 pb-16 border-b border-border/40">
          <div>
            <Wordmark size="lg" />
            <p className="mt-6 max-w-md font-serif text-3xl leading-tight text-foreground">
              {brand.tagline}
            </p>
            <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
              {brand.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end lg:justify-end">
            <Link
              href="/contact"
              onClick={() => track("website_form", "footer_cta")}
              className="group inline-flex items-center gap-2 font-serif text-2xl text-primary hover:text-accent transition-colors"
            >
              Start a Conversation
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <p className="text-xs font-mono uppercase tracking-[0.22em] text-muted-foreground">
              We typically respond within an hour.
            </p>
          </div>
        </div>

        {/* Middle grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="eyebrow mb-5">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/75 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="eyebrow mb-5">Reach</h4>
            <ul className="space-y-3 text-sm text-foreground/75">
              <li className="flex items-start gap-2">
                <Phone className="h-3.5 w-3.5 mt-1 text-primary/70 shrink-0" />
                <span className="font-mono tracking-wide">{contact.phonePrimary}</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="h-3.5 w-3.5 mt-1 text-[color:var(--success)] shrink-0" />
                <a
                  href={`https://wa.me/${whatsapp.primary}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("whatsapp", "footer_primary")}
                  className="font-mono tracking-wide hover:text-primary transition-colors"
                >
                  {contact.phoneSecondary}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="h-3.5 w-3.5 mt-1 text-[color:var(--success)] shrink-0" />
                <a
                  href={`https://wa.me/${whatsapp.uk}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("whatsapp", "footer_uk")}
                  className="font-mono tracking-wide hover:text-primary transition-colors"
                >
                  {contact.phoneUK}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-3.5 w-3.5 mt-1 text-primary/70 shrink-0" />
                <a
                  href={`mailto:${contact.email}`}
                  onClick={() => track("email", "footer")}
                  className="hover:text-primary transition-colors break-all"
                >
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-5">Studio</h4>
            <p className="text-sm text-foreground/75 leading-relaxed flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 mt-1 text-primary/70 shrink-0" />
              <span>{address.full}</span>
            </p>
          </div>
        </div>

        {/* Bottom band */}
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="font-mono tracking-wider uppercase">
            © {new Date().getFullYear()} {brand.name} · All rights reserved
          </p>
          <div className="flex items-center gap-6 font-mono tracking-wider uppercase">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
