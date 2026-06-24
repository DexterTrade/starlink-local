import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "node:crypto";

type ClientEventPayload = {
  event_name: string;
  event_time?: number;
  event_id?: string;
  event_source_url?: string;
  action_source?: string;
  user_data?: {
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    fbp?: string;
    fbc?: string;
    external_id?: string;
  };
  custom_data?: Record<string, unknown>;
};

const normalize = (value: string) => value.trim().toLowerCase();

const hashValue = (value: string) =>
  crypto.createHash("sha256").update(normalize(value)).digest("hex");

const normalizePhone = (value: string) => value.replace(/[^\d+]/g, "");

const buildUserData = (
  userData: ClientEventPayload["user_data"],
  ipAddress: string,
  userAgent: string,
) => {
  const base: Record<string, string> = {
    client_ip_address: ipAddress,
    client_user_agent: userAgent,
  };
  if (!userData) return base;
  if (userData.email) base.em = hashValue(userData.email);
  if (userData.phone) base.ph = hashValue(normalizePhone(userData.phone));
  if (userData.first_name) base.fn = hashValue(userData.first_name);
  if (userData.last_name) base.ln = hashValue(userData.last_name);
  if (userData.external_id) base.external_id = hashValue(userData.external_id);
  if (userData.fbp) base.fbp = userData.fbp;
  if (userData.fbc) base.fbc = userData.fbc;
  return base;
};

const pickHeader = (req: NextRequest, keys: string[]) => {
  for (const k of keys) {
    const v = req.headers.get(k);
    if (v) return v;
  }
  return undefined;
};

const buildGeo = (req: NextRequest) => {
  const geo: Record<string, string> = {};
  const country = pickHeader(req, ["x-vercel-ip-country", "cf-ipcountry"]);
  const region = pickHeader(req, ["x-vercel-ip-country-region", "cf-region"]);
  const city = pickHeader(req, ["x-vercel-ip-city", "cf-city"]);
  const lat = pickHeader(req, ["x-vercel-ip-latitude", "cf-iplatitude"]);
  const lng = pickHeader(req, ["x-vercel-ip-longitude", "cf-iplongitude"]);
  if (country) geo.country = country;
  if (region) geo.region = region;
  if (city) geo.city = city;
  if (lat) geo.latitude = lat;
  if (lng) geo.longitude = lng;
  return geo;
};

export async function POST(req: NextRequest) {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const graphVersion = process.env.META_GRAPH_VERSION ?? "v20.0";
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  if (!accessToken || !pixelId) {
    return NextResponse.json(
      { ok: false, error: "Missing META_ACCESS_TOKEN or META_PIXEL_ID" },
      { status: 500 },
    );
  }

  let payload: ClientEventPayload | null = null;
  try {
    payload = (await req.json()) as ClientEventPayload;
  } catch {
    payload = null;
  }

  if (!payload?.event_name) {
    return NextResponse.json({ ok: false, error: "Missing event_name" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "";
  const ua = req.headers.get("user-agent") ?? "";

  const eventPayload = {
    event_name: payload.event_name,
    event_time: payload.event_time ?? Math.floor(Date.now() / 1000),
    event_id: payload.event_id,
    event_source_url: payload.event_source_url,
    action_source: payload.action_source ?? "website",
    user_data: buildUserData(payload.user_data, ip, ua),
    custom_data: (() => {
      const geo = buildGeo(req);
      const cd = { ...(payload.custom_data ?? {}) } as Record<string, unknown>;
      if (Object.keys(geo).length > 0 && !("geo" in cd)) cd.geo = geo;
      return cd;
    })(),
  };

  const response = await fetch(
    `https://graph.facebook.com/${graphVersion}/${pixelId}/events?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [eventPayload],
        ...(testEventCode ? { test_event_code: testEventCode } : {}),
      }),
    },
  );

  const body = await response.json().catch(() => ({}));
  return NextResponse.json(
    { ok: response.ok, meta: body },
    { status: response.ok ? 200 : 502 },
  );
}
