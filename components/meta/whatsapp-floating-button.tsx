"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getCookie, sendMetaEvent } from "@/lib/meta-client";

export default function WhatsAppFloatingButton() {
  const [open, setOpen] = useState(false);
  const { whatsapp, contact } = siteConfig;

  const onClick = (placement: string) => {
    void sendMetaEvent({
      event_name: "Contact",
      user_data: { fbp: getCookie("_fbp"), fbc: getCookie("_fbc") },
      custom_data: { channel: "whatsapp", placement },
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="glass rounded-sm p-4 w-72 shadow-2xl reveal">
          <div className="flex items-center justify-between mb-3">
            <p className="eyebrow">Reach via WhatsApp</p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            <a
              href={`https://wa.me/${whatsapp.primary}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => onClick("floating_pk")}
              className="flex items-center justify-between rounded-sm bg-card/60 px-3 py-2.5 hover:bg-primary/10 transition-colors group"
            >
              <span>
                <span className="block text-xs text-muted-foreground font-mono uppercase tracking-widest">Pakistan</span>
                <span className="block font-mono text-sm text-foreground group-hover:text-primary">{contact.phoneSecondary}</span>
              </span>
              <MessageCircle className="h-4 w-4 text-[color:var(--success)]" />
            </a>
            <a
              href={`https://wa.me/${whatsapp.uk}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => onClick("floating_uk")}
              className="flex items-center justify-between rounded-sm bg-card/60 px-3 py-2.5 hover:bg-primary/10 transition-colors group"
            >
              <span>
                <span className="block text-xs text-muted-foreground font-mono uppercase tracking-widest">United Kingdom</span>
                <span className="block font-mono text-sm text-foreground group-hover:text-primary">{contact.phoneUK}</span>
              </span>
              <MessageCircle className="h-4 w-4 text-[color:var(--success)]" />
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open WhatsApp"
        className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[image:var(--grad-gold)] text-primary-foreground shadow-[0_15px_40px_-10px_oklch(0.78_0.13_84/0.6)] hover:scale-105 transition-transform"
      >
        <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping group-hover:hidden" />
        <MessageCircle className="relative h-6 w-6" />
      </button>
    </div>
  );
}
