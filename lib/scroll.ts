export const QUOTE_FORM_ID = "quote-form";
export const QUOTE_NAME_INPUT_ID = "quote-name";

export const CONTACT_FORM_ID = "contact-form";
export const CONTACT_FIRST_NAME_INPUT_ID = "contact-first-name";

const focusAfterScroll = (id: string) => {
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    el?.focus();
  }, 400);
};

export const scrollToQuoteForm = () => {
  if (typeof document === "undefined") return;
  const target = document.getElementById(QUOTE_FORM_ID);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  focusAfterScroll(QUOTE_NAME_INPUT_ID);
};

export const buildContactLeadUrl = (leadStatus?: string) => {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  url.hash = CONTACT_FORM_ID;
  if (leadStatus) url.searchParams.set("lead", leadStatus);
  else url.searchParams.delete("lead");
  return url.toString();
};

export const updateContactLeadUrl = (leadStatus?: string) => {
  if (typeof window === "undefined") return;
  const nextUrl = buildContactLeadUrl(leadStatus);
  if (!nextUrl) return;
  window.history.replaceState(null, "", nextUrl);
};

export const scrollToContactForm = () => {
  if (typeof document === "undefined") return;
  const target = document.getElementById(CONTACT_FORM_ID);
  if (!target) return;
  updateContactLeadUrl();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  focusAfterScroll(CONTACT_FIRST_NAME_INPUT_ID);
};

export const scrollToSection = (id: string) => {
  if (typeof document === "undefined") return;
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
};
