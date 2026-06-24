export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/nav/announcement-bar";
import { Header } from "@/components/nav/header";
import { Footer } from "@/components/nav/footer";
import HeroPanel from "@/components/sections/HeroPanel";
import ChaptersPanel from "@/components/sections/ChaptersPanel";
import ManifestoPanel from "@/components/sections/ManifestoPanel";
import AtlasPanel from "@/components/sections/AtlasPanel";
import SeaRoutesPanel from "@/components/sections/SeaRoutesPanel";
import VoicesPanel from "@/components/sections/VoicesPanel";
import QuotePanel from "@/components/sections/QuotePanel";
import InquiriesPanel from "@/components/sections/InquiriesPanel";
import { siteConfig, getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${siteConfig.brand.name} — ${siteConfig.brand.tagline}`,
  description: siteConfig.brand.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.brand.name,
    description: siteConfig.brand.description,
    url: getSiteUrl(),
    siteName: siteConfig.brand.name,
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <HeroPanel />
        <ChaptersPanel />
        <ManifestoPanel />
        <AtlasPanel />
        <SeaRoutesPanel />
        <VoicesPanel />
        <QuotePanel />
        <InquiriesPanel />
      </main>
      <Footer />
    </>
  );
}
