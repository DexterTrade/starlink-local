import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Wordmark({ size = "default" }: { size?: "default" | "lg" }) {
  const isLarge = size === "lg";

  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label={siteConfig.brand.name}>
      <span
        aria-hidden
        className={`relative inline-block shrink-0 ${isLarge ? "h-20 w-20" : "h-14 w-14"}`}
      >
        <Image
          src="/starlink-logo.svg"
          alt=""
          fill
          priority
          sizes={isLarge ? "80px" : "56px"}
          className="object-contain rounded-sm transition-transform duration-300 group-hover:scale-105"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif tracking-tight text-foreground transition-colors group-hover:text-primary ${
            isLarge ? "text-2xl" : "text-xl"
          }`}
        >
          {siteConfig.brand.short}
        </span>
        <span className="font-mono text-[0.6rem] tracking-[0.32em] text-muted-foreground uppercase mt-0.5">
          {siteConfig.brand.eyebrow}
        </span>
      </span>
    </Link>
  );
}
