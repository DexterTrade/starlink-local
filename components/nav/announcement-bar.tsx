"use client";

import { siteConfig } from "@/lib/site-config";
import { getCookie, sendMetaEvent } from "@/lib/meta-client";
import { Sparkles, MessageCircle } from "lucide-react";

function track(placement: string) {
  void sendMetaEvent({
    event_name: "Contact",
    user_data: { fbp: getCookie("_fbp"), fbc: getCookie("_fbc") },
    custom_data: { channel: "whatsapp", placement },
  });
}

export function AnnouncementBar() {
  const { promo, contact, whatsapp } = siteConfig;
  const primaryWa = `https://wa.me/${whatsapp.primary}`;
  const ukWa = `https://wa.me/${whatsapp.uk}`;

  return (
    <div className="relative w-full overflow-hidden border-b border-primary/15 bg-[image:var(--grad-bar)]">
      <div className="absolute inset-x-0 top-0 hairline" />
      <div className="absolute inset-x-0 bottom-0 hairline" />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-4 py-2.5 text-xs">
        <a
          href={primaryWa}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("announcement_left")}
          className="hidden md:inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-mono"
        >
          <MessageCircle className="h-3.5 w-3.5 text-[color:var(--success)]" />
          <span className="tracking-widest">{contact.phonePrimary}</span>
        </a>

        <p className="flex-1 text-center text-foreground/90 inline-flex items-center justify-center gap-2 text-[0.78rem]">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">{promo.text}</span>
          <span className="sm:hidden font-mono uppercase tracking-widest text-[0.66rem]">
            DDP shipping live — UK · USA · EU
          </span>
        </p>

        <a
          href={ukWa}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("announcement_right")}
          className="hidden md:inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-mono"
        >
          <MessageCircle className="h-3.5 w-3.5 text-[color:var(--success)]" />
          <span className="tracking-widest">{contact.phoneUK}</span>
        </a>
      </div>
    </div>
  );
}
