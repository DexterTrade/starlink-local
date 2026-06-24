"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnnouncementBar } from "@/components/nav/announcement-bar";
import { Header } from "@/components/nav/header";
import { Footer } from "@/components/nav/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, MessageCircle, ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getCookie, sendMetaEvent } from "@/lib/meta-client";
import {
  CONTACT_FIRST_NAME_INPUT_ID,
  CONTACT_FORM_ID,
  buildContactLeadUrl,
  scrollToContactForm,
  updateContactLeadUrl,
} from "@/lib/scroll";

const SELECT_CLS =
  "w-full h-11 rounded-sm border border-border bg-input/40 px-3 text-sm text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors";

export default function ContactPage() {
  const { contact, whatsapp, address, brand } = siteConfig;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === `#${CONTACT_FORM_ID}`) {
      scrollToContactForm();
    }
  }, []);

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    updateContactLeadUrl("submitted");
    setSubmitted(true);

    try {
      await sendMetaEvent({
        event_name: "Lead",
        event_source_url: buildContactLeadUrl("submitted") || undefined,
        user_data: {
          email: form.email,
          phone: form.phone,
          first_name: form.firstName,
          last_name: form.lastName,
          fbp: getCookie("_fbp"),
          fbc: getCookie("_fbc"),
          external_id: form.email,
        },
        custom_data: {
          subject: form.subject || undefined,
          company: form.company || undefined,
        },
      });
    } finally {
      window.setTimeout(() => {
        updateContactLeadUrl();
        scrollToContactForm();
        setSubmitting(false);
      }, 100);
    }

    window.setTimeout(() => {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });
      setSubmitted(false);
    }, 3500);
  };

  const cards = [
    {
      icon: Phone,
      eyebrow: "Phone",
      primary: contact.phonePrimary,
      secondary: "Mon–Sat · 09:00–20:00 PKT",
      href: `tel:${contact.phonePrimary.replace(/\s+/g, "")}`,
    },
    {
      icon: MessageCircle,
      eyebrow: "WhatsApp",
      primary: contact.phoneSecondary,
      secondary: "Always reachable",
      href: `https://wa.me/${whatsapp.primary}`,
    },
    {
      icon: Mail,
      eyebrow: "Email",
      primary: contact.email,
      secondary: "Replied within an hour",
      href: `mailto:${contact.email}`,
    },
    {
      icon: Clock,
      eyebrow: "Response",
      primary: "Within 60 minutes",
      secondary: "Business hours · all timezones",
      href: undefined,
    },
  ];

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-20 pb-20 md:pt-28 md:pb-24">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <p className="eyebrow mb-6">Direct line</p>
            <h1 className="display-serif text-5xl sm:text-6xl lg:text-[6.5rem] text-foreground leading-[0.95] max-w-5xl">
              Tell us where
              <br />
              <em className="italic text-gold">it's going</em>.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-foreground/75 leading-relaxed">
              Pick the channel that suits you — every one of these reaches a human at the {brand.name} desk.
            </p>
          </div>
        </section>

        <div className="gold-divider" />

        {/* Contact cards */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 border border-border/40">
              {cards.map((c) => {
                const Inner = (
                  <>
                    <c.icon className="h-6 w-6 text-primary mb-6" />
                    <p className="eyebrow mb-2">{c.eyebrow}</p>
                    <p className="font-serif text-xl text-foreground group-hover:text-primary transition-colors break-words">
                      {c.primary}
                    </p>
                    <p className="text-xs font-mono uppercase tracking-[0.16em] text-muted-foreground mt-2">
                      {c.secondary}
                    </p>
                  </>
                );
                return c.href ? (
                  <a
                    key={c.eyebrow}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                    className="group bg-background hover:bg-card transition-colors p-8"
                  >
                    {Inner}
                  </a>
                ) : (
                  <div key={c.eyebrow} className="bg-background p-8 group">
                    {Inner}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Form + map */}
        <section className="py-16 md:py-24 bg-[image:var(--grad-onyx)]">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
              {/* Left — studio + map */}
              <div>
                <p className="eyebrow mb-4">Visit the studio</p>
                <h2 className="display-serif text-4xl md:text-5xl text-foreground leading-[0.95] mb-6">
                  In <em className="italic text-gold">Mughalpura</em>,
                  <br />
                  by appointment.
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-6">{address.full}</p>

                <div className="relative rounded-sm overflow-hidden border border-border/60 h-80">
                  <iframe
                    title={`${brand.name} location`}
                    src={`https://www.google.com/maps?q=${address.lat},${address.lng}&output=embed`}
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <a
                      href={`https://www.google.com/maps?q=${address.lat},${address.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="glass text-xs font-mono uppercase tracking-widest text-foreground px-3 py-1.5 rounded-sm hover:text-primary transition-colors inline-flex items-center gap-1.5"
                    >
                      <MapPin className="h-3 w-3" />
                      Open Map
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${address.lat},${address.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-primary/90 text-primary-foreground text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-sm hover:brightness-110 inline-flex items-center gap-1.5"
                    >
                      Directions
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right — form */}
              <div id={CONTACT_FORM_ID} className="glass rounded-sm p-8 md:p-10 scroll-mt-32">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/60">
                  <div>
                    <p className="eyebrow">Open a thread</p>
                    <p className="font-serif text-2xl text-foreground mt-1">Send us a note.</p>
                  </div>
                </div>

                {submitted ? (
                  <div className="rounded-sm border border-[color:var(--success)]/40 bg-[color:var(--success)]/10 p-6 text-center">
                    <p className="font-serif text-xl text-[color:var(--success)]">
                      Thank you — your note has reached us.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Someone from the desk will respond within an hour.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor={CONTACT_FIRST_NAME_INPUT_ID}>First name</Label>
                      <Input
                        id={CONTACT_FIRST_NAME_INPUT_ID}
                        name="firstName"
                        value={form.firstName}
                        onChange={change}
                        required
                        placeholder="Ahmed"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input
                        id="last-name"
                        name="lastName"
                        value={form.lastName}
                        onChange={change}
                        required
                        placeholder="Hassan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={change}
                        required
                        placeholder="you@studio.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={change}
                        placeholder="+92 …"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="company">Company (optional)</Label>
                      <Input
                        id="company"
                        name="company"
                        value={form.company}
                        onChange={change}
                        placeholder="Studio name or business"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="subject">Subject</Label>
                      <select
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={change}
                        required
                        className={SELECT_CLS}
                      >
                        <option value="">Pick a subject</option>
                        <option value="quote">Request a quote</option>
                        <option value="support">Customer support</option>
                        <option value="partnership">Partnership inquiry</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={form.message}
                        onChange={change}
                        required
                        rows={6}
                        placeholder="A few lines about what you'd like to ship — origin, destination, weight, timing."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                        {submitting ? "Sending…" : "Send the note"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
