"use client";

import { FormEvent, useEffect, useState } from "react";
import { Search, Package, Truck, Clock, CheckCircle, Circle } from "lucide-react";
import { AnnouncementBar } from "@/components/nav/announcement-bar";
import { Header } from "@/components/nav/header";
import { Footer } from "@/components/nav/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase, type Parcel, type ParcelStatus } from "@/lib/supabase";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function Timeline({
  steps,
  currentStatusId,
}: {
  steps: ParcelStatus[];
  currentStatusId: number;
}) {
  if (steps.length === 0) return null;
  const currentIndex = steps.findIndex((s) => s.id === currentStatusId);
  const total = steps.length - 1;
  return (
    <div className="mt-8">
      <p className="eyebrow mb-6">Progress</p>
      <div className="relative flex items-start justify-between">
        <div className="absolute left-0 right-0 top-4 h-px bg-border" />
        <div
          className="absolute left-0 top-4 h-px bg-primary transition-all duration-500"
          style={{ width: total > 0 ? `${(currentIndex / total) * 100}%` : "0%" }}
        />
        {steps.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 w-16">
              <div
                className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center border ${
                  done
                    ? "bg-primary border-primary"
                    : active
                      ? "bg-background border-primary"
                      : "bg-background border-border"
                }`}
              >
                {done ? (
                  <CheckCircle className="h-4 w-4 text-primary-foreground" />
                ) : active ? (
                  <Circle className="h-3.5 w-3.5 text-primary fill-primary" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <span
                className={`text-[0.62rem] font-mono uppercase tracking-[0.16em] text-center leading-tight min-h-[2rem] ${
                  active ? "text-primary" : done ? "text-foreground/70" : "text-muted-foreground"
                }`}
              >
                {step.lable}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ParcelCard({
  parcel,
  steps,
}: {
  parcel: Parcel;
  steps: ParcelStatus[];
}) {
  const statusLabel = parcel.parcel_status?.lable ?? String(parcel.status_id);
  const freightLabel = parcel.feight_type?.lable ?? String(parcel.freight_type_id);

  return (
    <article className="glass rounded-sm overflow-hidden">
      {/* Header */}
      <header className="border-b border-border/60 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="eyebrow text-[0.6rem]">Tracking ID</p>
            <p className="font-mono text-sm mt-1">{parcel.id}</p>
          </div>
        </div>
        <Badge>
          <Truck className="h-3.5 w-3.5" />
          {statusLabel}
        </Badge>
      </header>

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-sm border border-border/60 px-4 py-3 bg-background/40">
            <p className="eyebrow text-[0.6rem] mb-1">Sender</p>
            <p className="font-medium">{parcel.sender_name}</p>
            <p className="text-xs font-mono text-muted-foreground mt-1">{parcel.sender_number}</p>
          </div>
          <div className="rounded-sm border border-border/60 px-4 py-3 bg-background/40">
            <p className="eyebrow text-[0.6rem] mb-1">Receiver</p>
            <p className="font-medium">{parcel.receiver_name}</p>
            <p className="text-xs font-mono text-muted-foreground mt-1">{parcel.receiver_number}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="eyebrow text-[0.6rem]">Weight</p>
            <p className="font-medium mt-1">{parcel.weight}</p>
          </div>
          <div>
            <p className="eyebrow text-[0.6rem]">Freight</p>
            <p className="font-medium mt-1">{freightLabel}</p>
          </div>
          <div>
            <p className="eyebrow text-[0.6rem]">Duty</p>
            <p className="font-medium mt-1">{parcel.duty_added ? "Added" : "—"}</p>
          </div>
          <div>
            <p className="eyebrow text-[0.6rem]">Booked</p>
            <p className="font-medium mt-1 font-mono">
              {new Date(parcel.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {parcel.estimated_delivery && (
          <div className="flex items-center gap-2 text-sm rounded-sm border border-primary/30 bg-primary/5 px-4 py-3">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <span className="text-muted-foreground">Estimated delivery</span>
            <span className="font-mono ml-auto">
              {new Date(parcel.estimated_delivery).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        <Timeline steps={steps} currentStatusId={parcel.status_id} />
      </div>
    </article>
  );
}

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [steps, setSteps] = useState<ParcelStatus[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("parcel_status")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setSteps(data as ParcelStatus[]);
      });
  }, []);

  const search = async (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setParcels([]);
    setSearched(false);
    try {
      let qb = supabase.from("parcel").select("*, parcel_status(*), feight_type(*)");
      if (UUID_RE.test(q)) {
        qb = qb.eq("id", q);
      } else {
        qb = qb.or(`sender_number.ilike.%${q}%,receiver_number.ilike.%${q}%`);
      }
      const { data, error: err } = await qb.order("created_at", { ascending: false });
      if (err) throw new Error(err.message);
      setParcels((data ?? []) as Parcel[]);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 bg-[image:var(--grad-onyx)]">
          <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
            <p className="eyebrow mb-6">Live ledger</p>
            <h1 className="display-serif text-5xl md:text-6xl text-foreground leading-[0.95] mb-8">
              Where is your
              <br />
              <em className="italic text-gold">parcel</em>?
            </h1>
            <p className="text-muted-foreground mb-10">
              Enter your tracking ID or the sender / receiver phone number.
            </p>

            <form onSubmit={search} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tracking ID or phone number"
                className="h-12 text-base flex-1"
                required
              />
              <Button type="submit" size="lg" disabled={loading} className="px-8">
                <Search className="h-4 w-4" />
                {loading ? "Searching" : "Track"}
              </Button>
            </form>
          </div>
        </section>

        <div className="gold-divider" />

        {/* Results */}
        <section className="py-16 md:py-20 min-h-[40vh]">
          <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6">
            {error && (
              <p className="text-center text-destructive text-sm">{error}</p>
            )}

            {searched && !loading && parcels.length === 0 && (
              <div className="text-center py-20">
                <Package className="h-12 w-12 text-primary/40 mx-auto mb-4" />
                <p className="font-serif text-2xl text-foreground">No parcel found.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Check the tracking ID or phone number, then try again.
                </p>
              </div>
            )}

            {parcels.length > 0 && (
              <div className="space-y-6">
                {parcels.length > 1 && (
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    {parcels.length} parcels found
                  </p>
                )}
                {parcels.map((p) => (
                  <ParcelCard key={p.id} parcel={p} steps={steps} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
