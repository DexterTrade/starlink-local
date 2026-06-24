"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, MapPin } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { siteConfig } from "@/lib/site-config";
import { getCookie, sendMetaEvent } from "@/lib/meta-client";
import { buildInternalWhatsAppRedirectUrl } from "@/lib/whatsapp";
import { QUOTE_FORM_ID, QUOTE_NAME_INPUT_ID } from "@/lib/scroll";

const NAME_REGEX = /^[A-Za-z\s.'-]+$/;

const SELECT_CLS =
  "w-full h-11 rounded-sm border border-border bg-input/40 px-3 text-sm text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors";

export default function QuotePanel() {
  const router = useRouter();
  const { brand, address } = siteConfig;

  const [name, setName] = useState("");
  const [whatsApp, setWhatsApp] = useState("");
  const [fromCountry, setFromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [cargo, setCargo] = useState("air");
  const [shipmentType, setShipmentType] = useState("Commercial");
  const [nameError, setNameError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const trimmedName = name.trim();
    const trimmedWa = whatsApp.trim();
    let invalid = false;

    if (!NAME_REGEX.test(trimmedName)) {
      setNameError("Name can include letters, spaces, and . ' - characters only.");
      invalid = true;
    } else setNameError("");

    if (fromCountry && toCountry && fromCountry === toCountry) {
      setCountryError("Origin and destination cannot be the same.");
      invalid = true;
    } else setCountryError("");

    if (invalid) return;

    setSubmitting(true);

    const message =
      `Hello ${brand.name}! I'd like a freight quote.` +
      `\n\nName: ${trimmedName}` +
      `\nWhatsApp: ${trimmedWa}` +
      `\nFrom: ${fromCountry}` +
      `\nTo: ${toCountry}` +
      `\nWeight: ${weight} ${weightUnit}` +
      `\nMode: ${cargo}` +
      `\nType: ${shipmentType}`;

    try {
      await sendMetaEvent({
        event_name: "Lead",
        user_data: {
          fbp: getCookie("_fbp"),
          fbc: getCookie("_fbc"),
          phone: trimmedWa,
          first_name: trimmedName,
        },
        custom_data: {
          channel: "whatsapp",
          placement: "quote_panel",
          from_country: fromCountry,
          destination_country: toCountry,
          shipment_weight: weight,
          shipment_weight_unit: weightUnit,
          cargo_type: cargo,
          shipment_type: shipmentType,
        },
      });
    } finally {
      setSubmitting(false);
    }

    router.push(buildInternalWhatsAppRedirectUrl(message, "quote_panel"));
  };

  return (
    <section id="quote" className="relative py-24 md:py-32 bg-[image:var(--grad-onyx)]">
      <div className="absolute top-0 inset-x-0 gold-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          {/* Left — address card */}
          <div>
            <p className="eyebrow mb-4">Place the order</p>
            <h2 className="display-serif text-5xl md:text-6xl text-foreground leading-[0.95] mb-8">
              Tell us the
              <br />
              <em className="italic text-gold">two cities</em>.
            </h2>
            <p className="text-base text-foreground/75 leading-relaxed max-w-md">
              Origin, destination, and an approximate weight is all we need. We'll come back inside
              the hour with a written, all-inclusive quote — no estimates, no fuel surcharges in
              fine print.
            </p>

            <div className="mt-10 glass rounded-sm p-6">
              <p className="eyebrow mb-3">Studio</p>
              <p className="font-serif text-xl text-foreground mb-2">{address.short}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{address.full}</p>
              <a
                href={`https://www.google.com/maps?q=${address.lat},${address.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors"
              >
                <MapPin className="h-4 w-4" />
                Open on Maps
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div
            id={QUOTE_FORM_ID}
            className="glass rounded-sm p-8 md:p-10 shadow-[0_30px_80px_-40px_oklch(0_0_0/0.9)]"
          >
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/60">
              <div>
                <p className="eyebrow">Quote request</p>
                <p className="font-serif text-2xl text-foreground mt-1">Begin the consignment.</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground hidden sm:inline">
                vol.001 · q
              </span>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor={QUOTE_NAME_INPUT_ID}>Name</Label>
                <Input
                  id={QUOTE_NAME_INPUT_ID}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  placeholder="Your name"
                  required
                />
                {nameError && <p className="text-xs text-destructive">{nameError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote-whatsapp">WhatsApp number</Label>
                <Input
                  id="quote-whatsapp"
                  value={whatsApp}
                  onChange={(e) => setWhatsApp(e.target.value)}
                  placeholder="+92 …"
                  inputMode="tel"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quote-from">Origin</Label>
                <select
                  id="quote-from"
                  value={fromCountry}
                  onChange={(e) => {
                    setFromCountry(e.target.value);
                    if (countryError) setCountryError("");
                  }}
                  className={SELECT_CLS}
                  required
                >
                  <option value="" disabled>Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={`from-${c}`} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote-to">Destination</Label>
                <select
                  id="quote-to"
                  value={toCountry}
                  onChange={(e) => {
                    setToCountry(e.target.value);
                    if (countryError) setCountryError("");
                  }}
                  className={SELECT_CLS}
                  required
                >
                  <option value="" disabled>Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={`to-${c}`} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quote-weight">Weight</Label>
                <Input
                  id="quote-weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 25"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote-unit">Unit</Label>
                <select
                  id="quote-unit"
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                  className={SELECT_CLS}
                  required
                >
                  <option value="kg">kilograms</option>
                  <option value="pounds">pounds</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quote-mode">Mode</Label>
                <select
                  id="quote-mode"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  className={SELECT_CLS}
                  required
                >
                  <option value="air">Air</option>
                  <option value="sea">Sea</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote-type">Shipment type</Label>
                <select
                  id="quote-type"
                  value={shipmentType}
                  onChange={(e) => setShipmentType(e.target.value)}
                  className={SELECT_CLS}
                  required
                >
                  <option value="Commercial">Commercial</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              {countryError && (
                <p className="md:col-span-2 text-xs text-destructive">{countryError}</p>
              )}

              <div className="md:col-span-2 mt-4">
                <Button type="submit" size="xl" className="w-full" disabled={submitting}>
                  {submitting ? "Routing…" : "Send via WhatsApp"}
                </Button>
                <p className="mt-3 text-xs font-mono uppercase tracking-[0.16em] text-muted-foreground text-center">
                  Your details open a pre-filled WhatsApp conversation.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
