import { Quote } from "lucide-react";

const VOICES = [
  {
    quote:
      "A shipment of personal effects to London that arrived intact, on the day promised, with zero customs friction. That's not luck — that's craft.",
    name: "Ahmed Hassan",
    title: "Import & Export",
    place: "Lahore → London",
  },
  {
    quote:
      "We move 40+ parcels a month to the United States. Marth is the only forwarder we've worked with that volunteered status before we asked.",
    name: "Fatima Khan",
    title: "E-commerce Founder",
    place: "Karachi → New Jersey",
  },
  {
    quote:
      "DDP done properly. No invoices for the recipient, no broker calls. They simply received the box. That's the entire pitch, executed.",
    name: "Muhammad Ali",
    title: "Manufacturing",
    place: "Sialkot → Dubai",
  },
];

export default function VoicesPanel() {
  return (
    <section id="voices" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="grid md:grid-cols-[1fr_1.6fr] gap-12 mb-16 items-end">
          <div>
            <p className="eyebrow mb-4">Chapter four</p>
            <h2 className="display-serif text-5xl md:text-6xl text-foreground leading-[0.95]">
              In their <em className="italic text-gold">own</em> words.
            </h2>
          </div>
          <p className="md:pb-2 text-lg text-foreground/75 leading-relaxed max-w-xl">
            We don't publish star ratings. We publish sentences — from clients who came back, again
            and again.
          </p>
        </div>

        {/* Voices grid — staggered cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {VOICES.map((v, i) => (
            <figure
              key={v.name}
              className={`relative bg-card/50 border border-border/50 rounded-sm p-8 group hover:border-primary/40 transition-colors ${
                i === 1 ? "md:mt-12" : ""
              }`}
            >
              <Quote
                className="absolute top-6 right-6 h-8 w-8 text-primary/20"
                aria-hidden
              />
              <p className="chapter-number text-2xl mb-6">{String(i + 1).padStart(2, "0")}</p>
              <blockquote className="font-serif text-xl leading-snug text-foreground">
                "{v.quote}"
              </blockquote>
              <figcaption className="mt-8 pt-6 border-t border-border/50">
                <p className="text-sm font-semibold text-foreground">{v.name}</p>
                <p className="text-xs font-mono uppercase tracking-[0.14em] text-primary/70 mt-1">
                  {v.title}
                </p>
                <p className="text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground mt-1">
                  {v.place}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
