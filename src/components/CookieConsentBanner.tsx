import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getStoredCookieConsent,
  setStoredCookieConsent,
  type CookieConsentChoice,
} from "../lib/cookieConsent";

export function CookieConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(getStoredCookieConsent() === null);
  }, []);

  const choose = (choice: CookieConsentChoice) => {
    setStoredCookieConsent(choice);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <section
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-[280] border-t border-white/10 bg-[#1A141F] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_32px_rgba(0,0,0,0.35)] sm:px-6 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pt-5"
      role="dialog"
    >
      <div className="mx-auto flex w-full max-w-[1096px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="min-w-0 flex-1">
          <h2
            id="cookie-consent-title"
            className="m-0 font-sans text-base font-bold leading-snug text-white sm:text-[17px]"
          >
            Cookies e privacidade
          </h2>
          <p className="mt-2 font-sans text-sm font-light leading-[160%] text-white/85">
            Utilizamos cookies e tecnologias semelhantes para o funcionamento do
            site, memorizar preferências e, com o seu consentimento, analisar o
            tráfego. "Apenas necessários" mantém só o estritamente indispensável.
            Saiba mais na{" "}
            <Link
              to="/politica-de-privacidade"
              className="cursor-pointer font-medium text-[#84d0f5] underline underline-offset-2 hover:opacity-90"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="order-2 cursor-pointer rounded-[12px] border border-white/25 bg-transparent px-4 py-3 font-sans text-sm font-medium leading-none text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84d0f5] sm:order-1 sm:px-5"
          >
            Apenas necessários
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="order-1 cursor-pointer rounded-[12px] bg-[#1D3B6E] px-4 py-3 font-sans text-sm font-bold leading-none text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84d0f5] sm:order-2 sm:px-6"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </section>
  );
}
