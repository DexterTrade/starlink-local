"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "./wordmark";
import { getCookie, sendMetaEvent } from "@/lib/meta-client";
import { scrollToQuoteForm } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Chapters", hash: "#chapters", number: "01" },
  { label: "Manifesto", hash: "#manifesto", number: "02" },
  { label: "Atlas", hash: "#atlas", number: "03" },
  { label: "Voices", hash: "#voices", number: "04" },
  { label: "Inquiries", hash: "#inquiries", number: "05" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const href = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  const handleNavTrack = (label: string, hash: string) => {
    void sendMetaEvent({
      event_name: "ViewContent",
      user_data: { fbp: getCookie("_fbp"), fbc: getCookie("_fbc") },
      custom_data: { content_type: "section", content_name: label, content_id: hash },
    });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border/60" : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Wordmark />

          {/* Desktop nav — numbered links */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.hash}
                href={href(item.hash)}
                onClick={() => handleNavTrack(item.label, item.hash)}
                className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
              >
                <span className="font-mono text-[0.65rem] tracking-widest text-primary/60 group-hover:text-primary transition-colors">
                  {item.number}
                </span>
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              </a>
            ))}
            <Link
              href="/track"
              onClick={() => handleNavTrack("Track", "/track")}
              className="text-sm font-medium tracking-wide text-foreground/70 hover:text-primary transition-colors flex items-center gap-1"
            >
              Track Parcel
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <Button
              className="hidden sm:inline-flex"
              size="default"
              onClick={() => {
                void sendMetaEvent({
                  event_name: "Contact",
                  user_data: { fbp: getCookie("_fbp"), fbc: getCookie("_fbc") },
                  custom_data: { channel: "website_form", placement: "header", action: "scroll_to_quote" },
                });
                scrollToQuoteForm();
              }}
            >
              Request a Quote
            </Button>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border text-foreground/80 hover:border-primary/40 hover:text-primary"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden pb-6 pt-2">
            <div className="hairline mb-6" />
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.hash}
                  href={href(item.hash)}
                  onClick={() => {
                    handleNavTrack(item.label, item.hash);
                    setOpen(false);
                  }}
                  className="group flex items-baseline gap-4 py-3 border-b border-border/40 last:border-b-0"
                >
                  <span className="font-mono text-xs text-primary/60 w-8">{item.number}</span>
                  <span className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                </a>
              ))}
              <Link
                href="/track"
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 py-3"
              >
                <span className="font-mono text-xs text-primary/60 w-8">06</span>
                <span className="font-serif text-2xl text-foreground">Track Parcel</span>
              </Link>
            </div>
            <Button
              className="w-full mt-6"
              size="lg"
              onClick={() => {
                scrollToQuoteForm();
                setOpen(false);
              }}
            >
              Request a Quote
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
