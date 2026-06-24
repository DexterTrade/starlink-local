import React, { Suspense } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import MetaPageEvents from "@/components/meta/page-events";
import WhatsAppFloatingButton from "@/components/meta/whatsapp-floating-button";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig, getSiteUrl } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteConfig.brand.name} — ${siteConfig.brand.tagline}`,
    template: `%s · ${siteConfig.brand.name}`,
  },
  description: siteConfig.brand.description,
  applicationName: siteConfig.brand.name,
  authors: [{ name: siteConfig.brand.name }],
  keywords: [
    "logistics",
    "cargo",
    "freight forwarding",
    "DDP shipping",
    "international shipping",
    "Pakistan logistics",
    siteConfig.brand.name,
  ],
  openGraph: {
    title: siteConfig.brand.name,
    description: siteConfig.brand.description,
    url: getSiteUrl(),
    siteName: siteConfig.brand.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.brand.name,
    description: siteConfig.brand.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        {pixelId && (
          <>
            <Script id="meta-pixel-base" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )}

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          themes={["dark", "light"]}
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <MetaPageEvents />
          </Suspense>

          {children}

          <WhatsAppFloatingButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
