"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Copy, Check, LogOut, Settings2, Package2, Plus } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wordmark } from "@/components/nav/wordmark";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  supabase,
  type Country,
  type FreightType,
  type Parcel,
  type ParcelStatus,
} from "@/lib/supabase";
import ReactFlagsSelect from "react-flags-select";
import ReactCountryFlag from "react-country-flag";
import { siteConfig } from "@/lib/site-config";
import { getCountryDisplayName } from "@/lib/countries";

const SELECT_CLS =
  "h-10 rounded-sm border border-border bg-input/40 px-3 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors";
const INPUT_CLS = SELECT_CLS + " w-full";

const EMPTY_COUNTRY = { country_name: "", rates: "", freight_type_id: "" };
const EMPTY_ORDER = {
  sender_name: "",
  sender_number: "",
  receiver_name: "",
  receiver_number: "",
  weight: "",
  status_id: "",
  freight_type_id: "",
  estimated_delivery: "",
  duty_added: false,
};

type Tab = "rates" | "orders";

function IdCell({
  id,
  copied,
  onCopy,
}: {
  id: string;
  copied: boolean;
  onCopy: () => void;
}) {
  const [open, setOpen] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => setOpen(true), 500);
  };
  const cancel = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  return (
    <div className="flex items-center gap-1.5">
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <span
            className="font-mono text-xs bg-muted/60 px-2 py-1 rounded-sm cursor-default select-all"
            onTouchStart={startLongPress}
            onTouchEnd={() => {
              cancel();
              if (open) setTimeout(() => setOpen(false), 1500);
            }}
            onTouchMove={cancel}
          >
            {id.slice(0, 8)}…
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="font-mono text-xs break-all max-w-xs">
          {id}
        </TooltipContent>
      </Tooltip>
      <button
        type="button"
        title="Copy"
        onClick={onCopy}
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-[color:var(--success)]" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}

export default function AdminPage() {
  // Auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("rates");

  // Rates
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const [showAddCountry, setShowAddCountry] = useState(false);
  const [newCountry, setNewCountry] = useState(EMPTY_COUNTRY);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_COUNTRY);

  // Orders
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [freightTypes, setFreightTypes] = useState<FreightType[]>([]);
  const [statuses, setStatuses] = useState<ParcelStatus[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [orderForm, setOrderForm] = useState(EMPTY_ORDER);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters
  const [filterName, setFilterName] = useState("");
  const [filterNumber, setFilterNumber] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFreight, setFilterFreight] = useState("");

  // Shared
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.country_name?.toLowerCase().includes(q));
  }, [countries, search]);

  const filteredParcels = useMemo(() => {
    return parcels.filter((p) => {
      if (filterName) {
        const n = filterName.toLowerCase();
        if (
          !p.sender_name.toLowerCase().includes(n) &&
          !p.receiver_name.toLowerCase().includes(n)
        )
          return false;
      }
      if (filterNumber) {
        const n = filterNumber.toLowerCase();
        if (
          !p.sender_number.toLowerCase().includes(n) &&
          !p.receiver_number.toLowerCase().includes(n)
        )
          return false;
      }
      if (filterStatus && String(p.status_id) !== filterStatus) return false;
      if (filterFreight && String(p.freight_type_id) !== filterFreight) return false;
      return true;
    });
  }, [parcels, filterName, filterNumber, filterStatus, filterFreight]);

  const hasActiveFilter = filterName || filterNumber || filterStatus || filterFreight;

  const clearFilters = () => {
    setFilterName("");
    setFilterNumber("");
    setFilterStatus("");
    setFilterFreight("");
  };

  // Session bootstrap
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setSessionLoading(false);
      if (s) void loadCountries();
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) {
        setCountries([]);
        setParcels([]);
        setFreightTypes([]);
        setStatuses([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Rates ops
  const loadCountries = async () => {
    setLoading(true);
    setError("");
    try {
      const [{ data, error: err }, { data: ft, error: ftErr }] = await Promise.all([
        supabase.from("countries").select("*, feight_type(*)").order("id"),
        supabase.from("feight_type").select("*").order("sort_order"),
      ]);
      if (err) throw new Error(err.message);
      if (ftErr) throw new Error(ftErr.message);
      setCountries((data ?? []) as Country[]);
      setFreightTypes((ft ?? []) as FreightType[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load countries");
    } finally {
      setLoading(false);
    }
  };

  const updateRate = (id: number, value: string) => {
    const parsed = parseFloat(value);
    setCountries((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, rates: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0 }
          : c,
      ),
    );
  };

  const saveAllRates = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const { error: err } = await supabase.from("countries").upsert(
        countries.map(({ id, country_name, rates, is_active, freight_type_id }) => ({
          id,
          country_name,
          rates,
          is_active,
          freight_type_id,
        })),
      );
      if (err) throw new Error(err.message);
      setMessage("Rates saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save rates");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number, v: boolean) => {
    setCountries((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: v } : c)));
    const { error: err } = await supabase
      .from("countries")
      .update({ is_active: v })
      .eq("id", id);
    if (err) setError(err.message);
  };

  const deleteCountry = async (id: number) => {
    if (!window.confirm("Delete this country?")) return;
    setLoading(true);
    try {
      const { error: err } = await supabase.from("countries").delete().eq("id", id);
      if (err) throw new Error(err.message);
      setCountries((prev) => prev.filter((c) => c.id !== id));
      setMessage("Country deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const addCountry = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("countries")
        .insert({
          country_name: newCountry.country_name.trim(),
          rates: parseFloat(newCountry.rates) || 0,
          is_active: true,
          freight_type_id: Number(newCountry.freight_type_id),
        })
        .select("*, feight_type(*)")
        .single();
      if (err) throw new Error(err.message);
      setCountries((prev) => [...prev, data as Country]);
      setNewCountry(EMPTY_COUNTRY);
      setShowAddCountry(false);
      setMessage("Country added.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setLoading(false);
    }
  };

  const openEditCountry = (c: Country) => {
    setEditingCountry(c);
    setEditForm({
      country_name: c.country_name ?? "",
      rates: String(c.rates ?? 0),
      freight_type_id: String(c.freight_type_id ?? ""),
    });
    setShowAddCountry(false);
    setError("");
  };

  const submitEditCountry = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingCountry) return;
    setLoading(true);
    try {
      const ftId = Number(editForm.freight_type_id);
      const { error: err } = await supabase
        .from("countries")
        .update({
          country_name: editForm.country_name,
          rates: parseFloat(editForm.rates) || 0,
          freight_type_id: ftId,
        })
        .eq("id", editingCountry.id);
      if (err) throw new Error(err.message);
      setCountries((prev) =>
        prev.map((c) =>
          c.id === editingCountry.id
            ? {
                ...c,
                country_name: editForm.country_name,
                rates: parseFloat(editForm.rates) || 0,
                freight_type_id: ftId,
                feight_type: freightTypes.find((ft) => ft.id === ftId),
              }
            : c,
        ),
      );
      setEditingCountry(null);
      setEditForm(EMPTY_COUNTRY);
      setMessage("Country updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  // Auth
  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) throw authError;
      if (data.session) {
        setSession(data.session);
        await loadCountries();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setEmail("");
    setPassword("");
    setCountries([]);
    setActiveTab("rates");
    setError("");
    setMessage("");
  };

  // Orders
  const loadOrders = async () => {
    setLoading(true);
    try {
      const [
        { data: ft, error: ftErr },
        { data: ps, error: psErr },
        { data: pd, error: pErr },
      ] = await Promise.all([
        supabase.from("feight_type").select("*").order("sort_order"),
        supabase.from("parcel_status").select("*").order("sort_order"),
        supabase
          .from("parcel")
          .select("*, parcel_status(*), feight_type(*)")
          .order("created_at", { ascending: false }),
      ]);
      if (ftErr) throw new Error(ftErr.message);
      if (psErr) throw new Error(psErr.message);
      if (pErr) throw new Error(pErr.message);
      setFreightTypes((ft ?? []) as FreightType[]);
      setStatuses((ps ?? []) as ParcelStatus[]);
      setParcels((pd ?? []) as Parcel[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session && activeTab === "orders" && parcels.length === 0 && statuses.length === 0) {
      void loadOrders();
    }
  }, [session, activeTab]);

  const openNewOrder = () => {
    setEditingId(null);
    setOrderForm(EMPTY_ORDER);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const openEditOrder = (p: Parcel) => {
    setEditingId(p.id);
    setOrderForm({
      sender_name: p.sender_name,
      sender_number: p.sender_number,
      receiver_name: p.receiver_name,
      receiver_number: p.receiver_number,
      weight: p.weight,
      status_id: String(p.status_id),
      freight_type_id: String(p.freight_type_id),
      estimated_delivery: p.estimated_delivery ? p.estimated_delivery.slice(0, 16) : "",
      duty_added: p.duty_added,
    });
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const submitOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        sender_name: orderForm.sender_name.trim(),
        sender_number: orderForm.sender_number.trim(),
        receiver_name: orderForm.receiver_name.trim(),
        receiver_number: orderForm.receiver_number.trim(),
        weight: orderForm.weight.trim(),
        status_id: Number(orderForm.status_id),
        freight_type_id: Number(orderForm.freight_type_id),
        estimated_delivery: orderForm.estimated_delivery || null,
        duty_added: orderForm.duty_added,
      };
      if (editingId) {
        const { error: err } = await supabase
          .from("parcel")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editingId);
        if (err) throw new Error(err.message);
        setMessage("Order updated.");
      } else {
        const { error: err } = await supabase.from("parcel").insert(payload);
        if (err) throw new Error(err.message);
        setMessage("Order created.");
      }
      setShowForm(false);
      setOrderForm(EMPTY_ORDER);
      setEditingId(null);
      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm("Delete this order?")) return;
    setLoading(true);
    try {
      const { error: err } = await supabase.from("parcel").delete().eq("id", id);
      if (err) throw new Error(err.message);
      setParcels((prev) => prev.filter((p) => p.id !== id));
      setMessage("Order deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, children: ReactNode) => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );

  // Render
  if (sessionLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Loading…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Slim admin header */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Wordmark />
          <p className="hidden md:block eyebrow">Admin · {siteConfig.brand.short}</p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors px-2"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <p className="eyebrow mb-2">Console</p>
        <h1 className="display-serif text-4xl md:text-5xl text-foreground leading-tight">
          The <em className="italic text-gold">ledger</em>.
        </h1>

        {!session ? (
          <form
            onSubmit={onLogin}
            className="mt-12 max-w-md space-y-5 glass rounded-sm p-8"
          >
            <p className="text-sm text-muted-foreground">
              Sign in with your Supabase admin credentials to manage rates and parcels.
            </p>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-pass">Password</Label>
              <Input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </form>
        ) : (
          <div className="mt-10">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-border/60 mb-8">
              {(
                [
                  { id: "rates", label: "Country Rates", icon: Settings2 },
                  { id: "orders", label: "Parcels", icon: Package2 },
                ] as { id: Tab; label: string; icon: typeof Settings2 }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setError("");
                    setMessage("");
                    setShowForm(false);
                  }}
                  className={`flex items-center gap-2 px-5 h-12 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground/60 hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Feedback */}
            {message && (
              <p className="mb-4 text-sm text-[color:var(--success)] font-mono uppercase tracking-widest">
                {message}
              </p>
            )}
            {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

            {/* Rates Tab */}
            {activeTab === "rates" && (
              <div>
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
                  <Input
                    placeholder="Search country…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="md:max-w-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="onyx"
                      onClick={() => {
                        setShowAddCountry((v) => !v);
                        setEditingCountry(null);
                        setError("");
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      {showAddCountry ? "Cancel" : "Add Country"}
                    </Button>
                    <Button onClick={saveAllRates} disabled={loading}>
                      {loading ? "Saving…" : "Save All Rates"}
                    </Button>
                  </div>
                </div>

                {showAddCountry && (
                  <form
                    onSubmit={addCountry}
                    className="grid grid-cols-1 md:grid-cols-[1fr_180px_160px_auto] gap-3 mb-6 p-5 border border-primary/20 rounded-sm bg-card/50"
                  >
                    <ReactFlagsSelect
                      selected={newCountry.country_name}
                      onSelect={(code) =>
                        setNewCountry((n) => ({ ...n, country_name: code }))
                      }
                      searchable
                      searchPlaceholder="Search country…"
                      placeholder="Select country"
                      className="[&_button]:h-10 [&_button]:rounded-sm [&_button]:border [&_button]:border-border [&_button]:bg-input/40 [&_button]:text-sm [&_button]:text-foreground"
                    />
                    <select
                      value={newCountry.freight_type_id}
                      onChange={(e) =>
                        setNewCountry((n) => ({ ...n, freight_type_id: e.target.value }))
                      }
                      className={SELECT_CLS}
                      required
                    >
                      <option value="">Freight type</option>
                      {freightTypes.map((ft) => (
                        <option key={ft.id} value={ft.id}>
                          {ft.lable}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      placeholder={`Rate / ${siteConfig.currency.perUnit}`}
                      min="0"
                      step="0.01"
                      value={newCountry.rates}
                      onChange={(e) =>
                        setNewCountry((n) => ({ ...n, rates: e.target.value }))
                      }
                      required
                    />
                    <Button
                      type="submit"
                      disabled={
                        loading || !newCountry.country_name || !newCountry.freight_type_id
                      }
                    >
                      Add
                    </Button>
                  </form>
                )}

                {editingCountry && !showAddCountry && (
                  <form
                    onSubmit={submitEditCountry}
                    className="grid grid-cols-1 md:grid-cols-[1fr_180px_160px_auto_auto] gap-3 mb-6 p-5 border border-primary/40 rounded-sm bg-card/50"
                  >
                    <ReactFlagsSelect
                      selected={editForm.country_name}
                      onSelect={(code) =>
                        setEditForm((f) => ({ ...f, country_name: code }))
                      }
                      searchable
                      searchPlaceholder="Search country…"
                      placeholder="Select country"
                      className="[&_button]:h-10 [&_button]:rounded-sm [&_button]:border [&_button]:border-border [&_button]:bg-input/40 [&_button]:text-sm [&_button]:text-foreground"
                    />
                    <select
                      value={editForm.freight_type_id}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, freight_type_id: e.target.value }))
                      }
                      className={SELECT_CLS}
                      required
                    >
                      <option value="">Freight type</option>
                      {freightTypes.map((ft) => (
                        <option key={ft.id} value={ft.id}>
                          {ft.lable}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      placeholder={`Rate / ${siteConfig.currency.perUnit}`}
                      min="0"
                      step="0.01"
                      value={editForm.rates}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, rates: e.target.value }))
                      }
                      required
                    />
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving…" : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setEditingCountry(null);
                        setEditForm(EMPTY_COUNTRY);
                      }}
                    >
                      Cancel
                    </Button>
                  </form>
                )}

                <div className="rounded-sm border border-border/60 overflow-hidden">
                  <div className="max-h-[65vh] overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-card sticky top-0">
                        <tr className="text-left text-xs font-mono uppercase tracking-widest text-muted-foreground">
                          <th className="px-4 py-3">Country</th>
                          <th className="px-4 py-3">Freight</th>
                          <th className="px-4 py-3">
                            Rate / {siteConfig.currency.perUnit}
                          </th>
                          <th className="px-4 py-3">Active</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCountries.map((c) => (
                          <tr
                            key={c.id}
                            className={`border-t border-border/60 transition-colors hover:bg-card/40 ${
                              editingCountry?.id === c.id ? "bg-primary/5" : ""
                            }`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3 font-medium">
                                {c.country_name && c.country_name.length === 2 ? (
                                  <ReactCountryFlag
                                    countryCode={c.country_name}
                                    svg
                                    style={{ width: "1.4em", height: "1.4em", borderRadius: "3px" }}
                                  />
                                ) : (
                                  <span className="text-base">🌍</span>
                                )}
                                {getCountryDisplayName(c.country_name ?? "")}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {c.feight_type?.lable ?? "—"}
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={c.rates ?? 0}
                                onChange={(e) => updateRate(c.id, e.target.value)}
                                className="w-32 h-9 rounded-sm border border-border bg-input/40 px-2 text-sm font-mono"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => void toggleActive(c.id, !c.is_active)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  c.is_active ? "bg-primary" : "bg-muted-foreground/30"
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 rounded-full bg-background transition-transform ${
                                    c.is_active ? "translate-x-6" : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditCountry(c)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => void deleteCountry(c.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredCountries.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-12 text-center text-muted-foreground text-sm font-mono uppercase tracking-widest"
                            >
                              {countries.length === 0 ? "No countries yet." : "No matches."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                {showForm ? (
                  <div className="glass rounded-sm p-8 mb-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
                      <h2 className="font-serif text-2xl">
                        {editingId ? "Edit Parcel" : "New Parcel"}
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingId(null);
                          setOrderForm(EMPTY_ORDER);
                        }}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                    <form
                      onSubmit={submitOrder}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {field(
                        "Sender Name *",
                        <Input
                          value={orderForm.sender_name}
                          onChange={(e) =>
                            setOrderForm((f) => ({ ...f, sender_name: e.target.value }))
                          }
                          required
                        />,
                      )}
                      {field(
                        "Sender Number *",
                        <Input
                          value={orderForm.sender_number}
                          onChange={(e) =>
                            setOrderForm((f) => ({ ...f, sender_number: e.target.value }))
                          }
                          required
                        />,
                      )}
                      {field(
                        "Receiver Name *",
                        <Input
                          value={orderForm.receiver_name}
                          onChange={(e) =>
                            setOrderForm((f) => ({ ...f, receiver_name: e.target.value }))
                          }
                          required
                        />,
                      )}
                      {field(
                        "Receiver Number *",
                        <Input
                          value={orderForm.receiver_number}
                          onChange={(e) =>
                            setOrderForm((f) => ({ ...f, receiver_number: e.target.value }))
                          }
                          required
                        />,
                      )}
                      {field(
                        "Weight *",
                        <Input
                          placeholder="e.g. 5kg"
                          value={orderForm.weight}
                          onChange={(e) =>
                            setOrderForm((f) => ({ ...f, weight: e.target.value }))
                          }
                          required
                        />,
                      )}
                      {field(
                        "Freight Type *",
                        <select
                          value={orderForm.freight_type_id}
                          onChange={(e) =>
                            setOrderForm((f) => ({ ...f, freight_type_id: e.target.value }))
                          }
                          className={INPUT_CLS}
                          required
                        >
                          <option value="">Select freight type</option>
                          {freightTypes.map((ft) => (
                            <option key={ft.id} value={ft.id}>
                              {ft.lable}
                            </option>
                          ))}
                        </select>,
                      )}
                      {field(
                        "Status *",
                        <select
                          value={orderForm.status_id}
                          onChange={(e) =>
                            setOrderForm((f) => ({ ...f, status_id: e.target.value }))
                          }
                          className={INPUT_CLS}
                          required
                        >
                          <option value="">Select status</option>
                          {statuses.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.lable}
                            </option>
                          ))}
                        </select>,
                      )}
                      {field(
                        "Estimated Delivery",
                        <Input
                          type="datetime-local"
                          value={orderForm.estimated_delivery}
                          onChange={(e) =>
                            setOrderForm((f) => ({
                              ...f,
                              estimated_delivery: e.target.value,
                            }))
                          }
                        />,
                      )}
                      <div className="md:col-span-2 flex items-center gap-3">
                        <input
                          id="duty-added"
                          type="checkbox"
                          checked={orderForm.duty_added}
                          onChange={(e) =>
                            setOrderForm((f) => ({ ...f, duty_added: e.target.checked }))
                          }
                          className="h-4 w-4 rounded-sm border-border accent-primary"
                        />
                        <label
                          htmlFor="duty-added"
                          className="text-sm font-mono uppercase tracking-widest text-muted-foreground"
                        >
                          Duty added
                        </label>
                      </div>
                      <div className="md:col-span-2">
                        <Button type="submit" size="lg" disabled={loading}>
                          {loading
                            ? "Saving…"
                            : editingId
                              ? "Update Parcel"
                              : "Create Parcel"}
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Input
                        placeholder="Filter by name…"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                      />
                      <Input
                        placeholder="Filter by number…"
                        value={filterNumber}
                        onChange={(e) => setFilterNumber(e.target.value)}
                      />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={INPUT_CLS}
                      >
                        <option value="">All statuses</option>
                        {statuses.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.lable}
                          </option>
                        ))}
                      </select>
                      <select
                        value={filterFreight}
                        onChange={(e) => setFilterFreight(e.target.value)}
                        className={INPUT_CLS}
                      >
                        <option value="">All freight</option>
                        {freightTypes.map((ft) => (
                          <option key={ft.id} value={ft.id}>
                            {ft.lable}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        <span>
                          {filteredParcels.length} of {parcels.length} parcels
                        </span>
                        {hasActiveFilter && (
                          <button
                            type="button"
                            onClick={clearFilters}
                            className="text-destructive hover:underline"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <Button onClick={openNewOrder}>
                        <Plus className="h-4 w-4" />
                        New Parcel
                      </Button>
                    </div>
                  </div>
                )}

                {loading && parcels.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-12 text-center font-mono uppercase tracking-widest">
                    Loading parcels…
                  </p>
                ) : parcels.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-12 text-center font-mono uppercase tracking-widest">
                    No parcels yet.
                  </p>
                ) : filteredParcels.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-12 text-center font-mono uppercase tracking-widest">
                    No parcels match the current filters.
                  </p>
                ) : (
                  <div className="rounded-sm border border-border/60 overflow-hidden">
                    <div className="overflow-auto max-h-[65vh]">
                      <table className="w-full text-sm">
                        <thead className="bg-card sticky top-0">
                          <tr className="text-left text-xs font-mono uppercase tracking-widest text-muted-foreground">
                            <th className="px-4 py-3 whitespace-nowrap">ID</th>
                            <th className="px-4 py-3 whitespace-nowrap">Sender</th>
                            <th className="px-4 py-3 whitespace-nowrap">Receiver</th>
                            <th className="px-4 py-3 whitespace-nowrap">Weight</th>
                            <th className="px-4 py-3 whitespace-nowrap">Freight</th>
                            <th className="px-4 py-3 whitespace-nowrap">Status</th>
                            <th className="px-4 py-3 whitespace-nowrap">Duty</th>
                            <th className="px-4 py-3 whitespace-nowrap">ETA</th>
                            <th className="px-4 py-3 whitespace-nowrap">Booked</th>
                            <th className="px-4 py-3" />
                          </tr>
                        </thead>
                        <tbody>
                          {filteredParcels.map((p) => (
                            <tr
                              key={p.id}
                              className="border-t border-border/60 hover:bg-card/40"
                            >
                              <td className="px-4 py-3 whitespace-nowrap">
                                <IdCell
                                  id={p.id}
                                  copied={copiedId === p.id}
                                  onCopy={() => {
                                    void navigator.clipboard.writeText(p.id).then(() => {
                                      setCopiedId(p.id);
                                      setTimeout(() => setCopiedId(null), 2000);
                                    });
                                  }}
                                />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="font-medium">{p.sender_name}</div>
                                <div className="text-xs font-mono text-muted-foreground">
                                  {p.sender_number}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="font-medium">{p.receiver_name}</div>
                                <div className="text-xs font-mono text-muted-foreground">
                                  {p.receiver_number}
                                </div>
                              </td>
                              <td className="px-4 py-3 font-mono">{p.weight}</td>
                              <td className="px-4 py-3">
                                {p.feight_type?.lable ?? p.freight_type_id}
                              </td>
                              <td className="px-4 py-3">
                                <Badge>{p.parcel_status?.lable ?? p.status_id}</Badge>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {p.duty_added ? "✓" : "—"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground font-mono text-xs">
                                {p.estimated_delivery
                                  ? new Date(p.estimated_delivery).toLocaleString()
                                  : "—"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground font-mono text-xs">
                                {new Date(p.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditOrder(p)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteOrder(p.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
