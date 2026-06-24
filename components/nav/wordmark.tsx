import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Wordmark({ size = "default" }: { size?: "default" | "lg" }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3">
      {/* Geometric monogram — minimalist letter "M" in a gold diamond */}
      <span
        aria-hidden
        className={
          size === "lg"
            ? "relative inline-block h-11 w-11"
            : "relative inline-block h-9 w-9"
        }
      >
        <svg
          viewBox="0 0 40 40"
          className="absolute inset-0 h-full w-full"
          fill="none"
          stroke="currentColor"
        >
          <rect
            x="3"
            y="3"
            width="34"
            height="34"
            transform="rotate(45 20 20)"
            className="text-primary/60"
            strokeWidth="1.2"
          />
          <path
            d="M13 25 L13 15 L20 22 L27 15 L27 25"
            className="text-primary"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif tracking-tight text-foreground transition-colors group-hover:text-primary ${
            size === "lg" ? "text-2xl" : "text-xl"
          }`}
        >
          {siteConfig.brand.short}
        </span>
        <span className="font-mono text-[0.6rem] tracking-[0.32em] text-muted-foreground uppercase mt-0.5">
          Logistics
        </span>
      </span>
    </Link>
  );
}
