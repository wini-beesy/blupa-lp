export type CookieConsentChoice = "all" | "essential";

export type StoredCookieConsent = {
  choice: CookieConsentChoice;
  updatedAt: string;
};

const STORAGE_KEY = "blupa_cookie_consent_v1";
const COOKIE_NAME = "blupa_consent";

export function getStoredCookieConsent(): StoredCookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCookieConsent;
    if (parsed.choice !== "all" && parsed.choice !== "essential") return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Persiste a escolha em `localStorage` e define um cookie HTTP de primeira parte
 * (`blupa_consent`) para servidores ou futuros scripts condicionais.
 */
export function setStoredCookieConsent(choice: CookieConsentChoice): void {
  const value: StoredCookieConsent = {
    choice,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));

  const maxAge = 60 * 60 * 24 * 365;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${COOKIE_NAME}=${choice}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

/** Útil para futuros scripts de analytics / marketing (só carregar se `all`). */
export function hasAcceptedAllCookies(): boolean {
  return getStoredCookieConsent()?.choice === "all";
}
