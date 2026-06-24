import { siteConfig } from "./site-config";

export const WHATSAPP_REDIRECT_PATH = "/contact/whatsapp";

export const buildWhatsAppUrl = (message: string, number?: string) =>
  `https://wa.me/${number ?? siteConfig.whatsapp.primary}?text=${encodeURIComponent(message)}`;

export const buildInternalWhatsAppRedirectUrl = (message: string, source?: string) => {
  const params = new URLSearchParams({ text: message });
  if (source) params.set("source", source);
  return `${WHATSAPP_REDIRECT_PATH}?${params.toString()}`;
};
