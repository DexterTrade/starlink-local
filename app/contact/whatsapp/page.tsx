import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const pickFirst = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function WhatsAppRedirect({ searchParams }: Props) {
  const resolved = searchParams ? await searchParams : {};
  const message =
    pickFirst(resolved.text) ??
    `Hello ${siteConfig.brand.name}! I'd like a freight quote.`;
  const url = buildWhatsAppUrl(message);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[image:var(--grad-onyx)]">
      <div className="text-center max-w-xl">
        <p className="eyebrow mb-4">Routing to WhatsApp</p>
        <h1 className="display-serif text-4xl md:text-5xl text-foreground mb-6">
          Opening the <em className="italic text-gold">conversation</em>…
        </h1>
        <p className="text-muted-foreground mb-10">
          If WhatsApp doesn't open automatically, use the link below.
        </p>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace(${JSON.stringify(url)});`,
          }}
        />
        <Link
          href={url}
          className="inline-flex items-center justify-center h-12 px-7 rounded-sm bg-[image:var(--grad-gold)] text-primary-foreground font-medium tracking-wider"
        >
          Open WhatsApp
        </Link>
      </div>
    </main>
  );
}
