"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/lib/site-config";

const FAQS = [
  {
    q: "What does DDP actually mean?",
    a: "Delivered Duty Paid. We pre-pay all customs duties, taxes, and clearance fees at the destination so your recipient receives the parcel without a bill, a broker call, or a hold at customs.",
  },
  {
    q: "How do I track a parcel?",
    a: "Once a consignment is booked, you'll be issued a tracking ID. Enter it (or the sender/receiver phone number) on /track and the live shipment timeline appears.",
  },
  {
    q: "Do you offer both air and sea?",
    a: "Yes. Air for time-sensitive consignments (5–7 days), sea for volume and cost-sensitive routings (25–35 days). LCL and FCL options for sea cargo.",
  },
  {
    q: "How long does international delivery take?",
    a: "Air freight typically clears the destination within 5–7 working days. Sea cargo runs 25–35 days port-to-port plus inland delivery, depending on the routing.",
  },
  {
    q: "Is my cargo insured?",
    a: "Standard international consignments are not insured by default. On request, we underwrite third-party all-risk policies tailored to the consignment value.",
  },
  {
    q: "What happens if a parcel is lost?",
    a: "Loss is rare, but if it occurs, we issue a £70 credit note claimable against any future shipment — beyond any underlying carrier or insurance settlement.",
  },
];

export default function InquiriesPanel() {
  const { contact } = siteConfig;

  return (
    <section id="inquiries" className="relative py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-12 mb-16">
          <div>
            <p className="eyebrow mb-4">Chapter five</p>
            <h2 className="display-serif text-5xl md:text-6xl text-foreground leading-[0.95]">
              Quiet
              <br />
              <em className="italic text-gold">inquiries</em>.
            </h2>
          </div>
          <div className="md:pt-12">
            <p className="text-lg text-foreground/75 leading-relaxed">
              The questions our clients ask most, answered candidly. If something here isn't covered
              — write to <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a> and we'll respond personally.
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full border-t border-border/60">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-primary/70 tracking-widest shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{f.q}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <span className="block pl-10">{f.a}</span>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
