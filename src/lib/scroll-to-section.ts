/** Scroll até ao elemento com `id`; respeita `prefers-reduced-motion`. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";

  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior });
}
