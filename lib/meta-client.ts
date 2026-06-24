"use client";

export type MetaEventPayload = {
  event_name: string;
  event_time?: number;
  event_id?: string;
  event_source_url?: string;
  action_source?: string;
  user_data?: Record<string, string | undefined>;
  custom_data?: Record<string, unknown>;
};

export const getCookie = (name: string) => {
  if (typeof document === "undefined") return undefined;
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
  return value ? decodeURIComponent(value) : undefined;
};

export const createEventId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const sendMetaEvent = async (payload: MetaEventPayload) => {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const params = url.searchParams;
  const defaultCustomData: Record<string, unknown> = {
    page_path: url.pathname,
    page_title: document.title || undefined,
    referrer: document.referrer || undefined,
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    utm_term: params.get("utm_term") || undefined,
    utm_content: params.get("utm_content") || undefined,
    gclid: params.get("gclid") || undefined,
    fbclid: params.get("fbclid") || undefined,
    screen: `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const eventId = payload.event_id ?? createEventId(payload.event_name.toLowerCase());
  const eventPayload: MetaEventPayload = {
    ...payload,
    event_id: eventId,
    event_time: payload.event_time ?? Math.floor(Date.now() / 1000),
    event_source_url: payload.event_source_url ?? window.location.href,
    action_source: payload.action_source ?? "website",
    custom_data: {
      ...defaultCustomData,
      ...(payload.custom_data ?? {}),
    },
  };

  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq === "function") {
    fbq("track", eventPayload.event_name, eventPayload.custom_data ?? {}, { eventID: eventId });
  }

  try {
    await fetch("/api/meta/conversions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventPayload),
    });
  } catch (error) {
    console.error("Meta conversions API error", error);
  }
};
