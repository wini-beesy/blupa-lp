import type {
  ButtonHTMLAttributes,
  ImgHTMLAttributes,
  ReactNode,
  SVGProps,
} from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import { Link } from "react-router-dom";
import { BlupaSignupFormCard } from "./components/BlupaSignupFormCard";
import { LandingHeader } from "./components/LandingHeader";
import { scrollToSection } from "./lib/scroll-to-section";
import { prefetchLandingMediaUrls } from "./prefetchLandingMedia";

function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  );
}

const LOGO_SRC = "/Midia Blupa/logo.svg";

const HERO_SLIDES = [
  "Property 1=Home - cinema.avif",
  "Property 1=Home - automovel.avif",
  "Property 1=Home - marketplace.avif",
  "Property 1=Home - lazer.avif",
  "Property 1=Home - pet.avif",
  "Property 1=Home - mercado.avif",
].map((f) => encodeURI(`/Midia Blupa/video/${f}`));

const sectionAsset = (file: string) =>
  encodeURI(`/Midia Blupa/Primeira seção/${file}`);

const SECTION_TODO_DIA_IMG_TOP = sectionAsset("compras-blupa.jpeg");
const SECTION_TODO_DIA_IMG_COUPLE = sectionAsset("pessoasviajando.jpeg");
const SECTION_TODO_DIA_IMG_KEYS = sectionAsset("pessoacomprando.jpeg");

const section2Asset = (file: string) =>
  encodeURI(`/Midia Blupa/Segunda seção/${file}`);

const SECTION_BRANDS_BANNER = encodeURI(
  "/Midia Blupa/Terceira seção- banner/E108FGI5 1.avif",
);

const quartaAsset = (file: string) =>
  encodeURI(`/Midia Blupa/Quarta seção/${file}`);

const quintaAsset = (file: string) =>
  encodeURI(`/Midia Blupa/Quinta seção/${file}`);

const sextaAsset = (file: string) =>
  encodeURI(`/Midia Blupa/Sexta seção/${file}`);

const sétimaAsset = (file: string) =>
  encodeURI(`/Midia Blupa/Sétima seção/${file}`);

const FAQ_ITEMS = [
  {
    question: "O Blupa tem custo adicional?",
    answer:
      "Não. O Blupa é um benefício incluído no seu plano sem nenhum custo extra. Basta ativar o seu cadastro e começar a aproveitar.",
  },
  {
    question: "Posso usar quantas vezes quiser?",
    answer:
      "Sim! Não há limite de uso. Você pode acessar os benefícios e estabelecimentos parceiros sempre que precisar.",
  },
  {
    question: "Preciso baixar aplicativo?",
    answer:
      "Não é necessário. O Blupa funciona diretamente pelo navegador do seu celular ou computador, sem precisar instalar nada.",
  },
];

const TIMELINE_STEPS = [
  {
    title: "1. Assine",
    description:
      "Faça sua assinatura em poucos minutos. É simples, rápido e online.",
    image: quintaAsset("Group 1.avif"),
    accent: "#FFCD00",
  },
  {
    title: "2. Explore os benefícios",
    description:
      "Acesse o clube e conheça todas as vantagens exclusivas disponíveis em um só lugar.",
    image: quintaAsset("Group 2.avif"),
    accent: "#8C4091",
  },
  {
    title: "3. Use no seu tempo",
    description:
      "Aproveite descontos e vantagens quando fizer sentido para você, no seu ritmo e sem pressa.",
    image: quintaAsset("Group 3.avif"),
    accent: "#EA5045",
  },
] as const;

const PARTNER_CATEGORIES: readonly { label: string; image: string }[] = [
  {
    label: "Automotivo",
    image: quartaAsset(
      "hand-holding-car-keys-selective-focus-woman-buyi-2026-03-19-07-09-09-utc.avif",
    ),
  },
  {
    label: "Beleza e Moda",
    image: quartaAsset(
      "flat-lay-with-woman-fashion-accessories-in-yellow-2026-03-23-23-04-18-utc.avif",
    ),
  },
  {
    label: "Casa e Decor",
    image: quartaAsset(
      "a-fragment-of-a-home-interior-a-light-chair-a-pict-2026-03-17-20-10-25-utc.avif",
    ),
  },
  {
    label: "Educação",
    image: quartaAsset(
      "graduation-girl-holding-her-diploma-with-pride-2026-01-09-14-53-49-utc.avif",
    ),
  },
  {
    label: "Entretenimento",
    image: quartaAsset(
      "stylish-man-in-black-jacket-piggybacking-happy-gir-2026-01-09-12-37-46-utc.avif",
    ),
  },
  {
    label: "Farmácia e Saúde",
    image: quartaAsset(
      "female-doctors-perform-disease-tests-and-provide-m-2026-03-16-06-05-07-utc.avif",
    ),
  },
  {
    label: "Gastronomia",
    image: quartaAsset(
      "bowl-with-chicken-pieces-rice-tomatoes-peppers-2026-03-25-09-50-04-utc.avif",
    ),
  },
  {
    label: "Lazer e Viagem",
    image: quartaAsset("airplane-wing-in-the-sky-2026-03-17-08-12-22-utc.avif"),
  },
  {
    label: "Petshop",
    image: quartaAsset(
      "cute-jack-russell-dog-sitting-in-shower-ready-for-2026-01-05-23-29-11-utc.avif",
    ),
  },
  {
    label: "Serviços",
    image: quartaAsset(
      "woman-relaxing-from-a-spa-treatment-2026-03-18-09-56-49-utc.avif",
    ),
  },
];

type BenefitId = "acesso" | "organizado" | "condicoes" | "uso" | "clube";

const BENEFIT_QUEUE_INITIAL: BenefitId[] = [
  "acesso",
  "organizado",
  "condicoes",
  "uso",
  "clube",
];

const BENEFIT_BY_ID: Record<
  BenefitId,
  { label: string; title: string; description: string; image: string }
> = {
  acesso: {
    label: "Acesso imediato a descontos",
    title: "Acesso imediato a descontos",
    description:
      "Ao entrar no Blupa, você passa a ter acesso a descontos e condições especiais com nossas marcas parceiras.",
    image: section2Asset(
      "business-woman-laptop-and-celebration-with-excite-2026-01-09-10-42-05-utc.avif",
    ),
  },
  organizado: {
    label: "Tudo organizado em um só lugar",
    title: "Tudo organizado em um só lugar",
    description:
      "Nada de procurar cupom, lembrar campanha ou esperar promoção. No Blupa, as vantagens ficam centralizadas, organizadas e fáceis de consultar sempre que você precisar.",
    image: section2Asset(
      "group-of-young-people-using-laptop-and-credit-card-2026-01-07-05-52-01-utc.avif",
    ),
  },
  condicoes: {
    label: "Exclusivo para assinantes",
    title: "Exclusivo para assinantes",
    description:
      "As ofertas do Blupa não são abertas ao público geral. São vantagens exclusivas para quem faz parte do clube, criadas a partir de parcerias estratégicas.",
    image: section2Asset(
      "multi-cultural-group-of-friends-with-laptop-and-cr-2026-01-05-23-00-01-utc.avif",
    ),
  },
  uso: {
    label: "Uso livre e recorrente",
    title: "Uso livre e recorrente",
    description:
      "Você pode acessar e aproveitar os benefícios sempre que quiser, de forma prática, respeitando as regras e condições específicas de cada parceiro.",
    image: section2Asset(
      "smiling-man-working-late-at-night-in-the-office-2026-03-26-10-23-12-utc.avif",
    ),
  },
  clube: {
    label: "Clube sempre atualizado",
    title: "Clube sempre atualizado",
    description:
      "Novas marcas, novas ofertas e novas vantagens entram constantemente. O Blupa evolui junto com a rotina e com as necessidades dos membros.",
    image: section2Asset(
      "smiling-student-videocalling-computer-at-evening-w-2026-03-11-01-01-15-utc.avif",
    ),
  },
};

const LANDING_MEDIA_URLS: string[] = (() => {
  const set = new Set<string>();
  const add = (u: string) => {
    if (u) set.add(u);
  };
  add(LOGO_SRC);
  HERO_SLIDES.forEach(add);
  add(SECTION_TODO_DIA_IMG_TOP);
  add(SECTION_TODO_DIA_IMG_COUPLE);
  add(SECTION_TODO_DIA_IMG_KEYS);
  add(SECTION_BRANDS_BANNER);
  PARTNER_CATEGORIES.forEach((c) => add(c.image));
  TIMELINE_STEPS.forEach((t) => add(t.image));
  (Object.values(BENEFIT_BY_ID) as { image: string }[]).forEach((b) =>
    add(b.image),
  );
  add(sextaAsset("envato-labs-image-edit (2) 1.avif"));
  add(encodeURI("/Midia Blupa/form.avif"));
  add(
    sétimaAsset(
      "website-header-of-cheerful-young-woman-in-sportswe-2026-01-09-01-22-27-utc 1.avif",
    ),
  );
  return [...set];
})();

/** Frame Figma do hero (Ativo 4) — proporção e hint de dimensão intrínseca */
const HERO_INTRINSIC_W = 1041;
const HERO_INTRINSIC_H = 919;

/** Desktop/H2 — Brand linear (Figma inspect) */
const HERO_BRAND_TEXT_GRADIENT =
  "linear-gradient(90.02deg, #FFCD00 0.87%, #EA5045 11.28%, #BA5B9E 24.36%, #8C4091 36.86%, #1D3B6E 48.63%, #2581C4 59.62%, #84D0F5 68.15%, #08B0A0 82.36%, #95C25D 94.29%)";

/** Alinha com Figma (~100px em 1920px): padding horizontal fluido, sem caixa centrada */
const SHELL_X =
  "px-[clamp(1.25rem,5vw,6.25rem)] sm:px-[clamp(1.5rem,5.5vw,6.25rem)]";

/** Troca de fundo sem “flash”: mantém a imagem anterior visível até a nova carregar e faz crossfade. */
function BenefitsFeaturedCrossfadeBg({ imageSrc }: { imageSrc: string }) {
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const [top, setTop] = useState<0 | 1>(0);
  const [urls, setUrls] = useState<[string, string]>(() => [
    imageSrc,
    imageSrc,
  ]);
  const topRef = useRef(top);
  const urlsRef = useRef(urls);
  const pendingBack = useRef<number | null>(null);

  useLayoutEffect(() => {
    topRef.current = top;
    urlsRef.current = urls;
  }, [top, urls]);

  useEffect(() => {
    queueMicrotask(() => {
      if (reduceMotion) {
        setUrls([imageSrc, imageSrc]);
        setTop(0);
        pendingBack.current = null;
        return;
      }

      const t = topRef.current;
      const u = urlsRef.current;
      const shown = u[t];
      if (imageSrc === shown) return;

      const back = (1 - t) as 0 | 1;
      if (u[back] === imageSrc) {
        pendingBack.current = null;
        setTop(back);
        return;
      }

      pendingBack.current = back;
      setUrls((prev) => {
        const next: [string, string] = [...prev];
        next[back] = imageSrc;
        return next;
      });
    });
  }, [imageSrc, reduceMotion]);

  const onLayerLoad = (slot: 0 | 1) => {
    if (reduceMotion) return;
    if (pendingBack.current !== slot) return;
    pendingBack.current = null;
    setTop(slot);
  };

  const layerClass =
    "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

  return (
    <>
      <img
        src={urls[0]}
        alt=""
        className={`${layerClass} ${top === 0 ? "z-[1] opacity-100" : "z-0 opacity-0"}`}
        loading="lazy"
        decoding="async"
        onLoad={() => onLayerLoad(0)}
      />
      <img
        src={urls[1]}
        alt=""
        className={`${layerClass} ${top === 1 ? "z-[1] opacity-100" : "z-0 opacity-0"}`}
        loading="lazy"
        decoding="async"
        onLoad={() => onLayerLoad(1)}
      />
    </>
  );
}

/** Acumula índices já liberados para download: ativo + vizinhos no anel. */
function useAccumulatedRingIndices(active: number, length: number) {
  const [loaded, setLoaded] = useState(
    () => new Set<number>(length > 0 ? [0] : []),
  );
  useEffect(() => {
    if (length <= 0) return;
    queueMicrotask(() => {
      setLoaded((prev) => {
        const next = new Set(prev);
        next.add(active);
        next.add((active + 1) % length);
        next.add((active - 1 + length) % length);
        return next;
      });
    });
  }, [active, length]);
  return loaded;
}

function LazyInViewImg({
  rootMargin = "100px",
  wrapperClassName = "",
  className = "",
  placeholderClassName = "block min-h-[1px] w-full bg-neutral-200/10",
  ...imgProps
}: ImgHTMLAttributes<HTMLImageElement> & {
  rootMargin?: string;
  wrapperClassName?: string;
  placeholderClassName?: string;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);
  return (
    <span ref={wrapRef} className={wrapperClassName}>
      {visible ? (
        <img {...imgProps} className={className} alt={imgProps.alt ?? ""} />
      ) : (
        <span className={placeholderClassName} aria-hidden />
      )}
    </span>
  );
}

/** Hero CTA — anel colorido `blupa-gradient-ring` + interior `blupa-glass-face` (Figma Grayscale/Glass no escuro). */
function HeroGlassButton({
  children,
  className = "",
  innerClassName = "",
  variant = "dark",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "dark" | "light";
  innerClassName?: string;
}) {
  const innerSkin =
    variant === "light"
      ? `font-bold text-[#1A141F] ${innerClassName || "bg-white/10"}`
      : `blupa-glass-face font-light text-white${innerClassName ? ` ${innerClassName}` : ""}`;
  const lightLayout =
    variant === "light"
      ? "h-[56px] w-[271px] shrink-0 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
      : "h-[56px] w-full max-w-[16.9375rem] shrink-0";
  return (
    <button
      type="button"
      className={`blupa-gradient-ring box-border flex cursor-pointer items-stretch rounded-[24px] border-none p-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84d0f5] ${lightLayout} ${className}`}
      {...props}
    >
      <span
        className={`box-border flex h-full min-h-0 w-full items-center justify-center whitespace-nowrap rounded-[22.5px] px-6 py-0 font-sans text-base leading-none ${innerSkin}`}
      >
        <span className="inline-block translate-y-0.5">{children}</span>
      </span>
    </button>
  );
}

function TimelineAccordionChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-5 w-5 text-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${expanded ? "rotate-180" : "-rotate-90"}`}
      width="20"
      height="20"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PartnerFlipCard({
  label,
  image,
  objectPosition = "center",
}: {
  label: string;
  image: string;
  objectPosition?: string;
}) {
  return (
    <div
      className="partner-flip-card mx-auto h-[358px] w-full max-w-[15.1rem] cursor-pointer rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2581c4]"
      tabIndex={0}
      role="button"
      aria-label={`${label}. Passe o rato ou o foco para ver a imagem da categoria.`}
    >
      <div className="partner-flip-inner">
        <div className="partner-flip-face partner-flip-face--front">
          <div className="blupa-gradient-ring box-border flex h-full w-full flex-col rounded-2xl p-[1.5px]">
            <div className="flex h-full min-h-0 w-full items-center justify-center rounded-[calc(1rem-1.5px)] bg-white px-6 py-12">
              <span className="text-center font-sans text-[22px] font-light leading-[144%] text-[#1A141F]">
                {label}
              </span>
            </div>
          </div>
        </div>
        <div className="partner-flip-face partner-flip-face--back overflow-hidden">
          <LazyInViewImg
            wrapperClassName="absolute inset-0 block"
            className="absolute inset-0 h-full w-full object-cover"
            placeholderClassName="absolute inset-0 bg-[#1A141F]/35"
            style={{ objectPosition }}
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/45" aria-hidden />
          <span className="absolute inset-0 z-[1] flex items-center justify-center px-6 text-center font-sans text-[22px] font-light leading-[144%] text-white">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

function rotateBenefitQueue(
  prev: BenefitId[],
  clickedSlotIndex: number,
): BenefitId[] {
  const clicked = prev[clickedSlotIndex + 1];
  const previousFeatured = prev[0];
  const before = prev.slice(1, clickedSlotIndex + 1);
  const after = prev.slice(clickedSlotIndex + 2);
  return [clicked, ...before, ...after, previousFeatured];
}

export default function App() {
  const [heroSlide, setHeroSlide] = useState(0);
  const benefitsSectionRef = useRef<HTMLElement>(null);
  const [benefitsInView, setBenefitsInView] = useState(false);
  const [benefitQueue, setBenefitQueue] = useState<BenefitId[]>(
    BENEFIT_QUEUE_INITIAL,
  );
  const [timelineStep, setTimelineStep] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const comoFuncionaRef = useRef<HTMLDivElement>(null);
  const timelineRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const marcasBannerRef = useRef<HTMLElement>(null);
  const [marcasBannerBgOn, setMarcasBannerBgOn] = useState(false);

  const timelineSlidesLoaded = useAccumulatedRingIndices(
    timelineStep,
    TIMELINE_STEPS.length,
  );

  const featuredId = benefitQueue[0];
  const cardIds = benefitQueue.slice(1);
  const featured = BENEFIT_BY_ID[featuredId];

  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    prefetchLandingMediaUrls(LANDING_MEDIA_URLS);
  }, []);

  const startAutoRotate = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    autoRotateRef.current = setInterval(() => {
      setBenefitQueue((q) => rotateBenefitQueue(q, 0));
    }, 4000);
  }, []);

  const startTimelineAutoRotate = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (timelineRotateRef.current) clearInterval(timelineRotateRef.current);
    timelineRotateRef.current = setInterval(() => {
      setTimelineStep((s) => (s + 1) % TIMELINE_STEPS.length);
    }, 4500);
  }, []);

  const onBenefitCardClick = (slotIndex: number) => {
    setBenefitQueue((q) => rotateBenefitQueue(q, slotIndex));
    startAutoRotate();
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBenefitsInView(true);
      return;
    }
    const el = benefitsSectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBenefitsInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = comoFuncionaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTimelineAutoRotate();
        } else if (timelineRotateRef.current) {
          clearInterval(timelineRotateRef.current);
          timelineRotateRef.current = null;
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timelineRotateRef.current) {
        clearInterval(timelineRotateRef.current);
        timelineRotateRef.current = null;
      }
    };
  }, [startTimelineAutoRotate]);

  useEffect(() => {
    if (!benefitsInView) return;
    startAutoRotate();
    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
        autoRotateRef.current = null;
      }
    };
  }, [benefitsInView, startAutoRotate]);

  useEffect(() => {
    const el = marcasBannerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMarcasBannerBgOn(true);
          obs.disconnect();
        }
      },
      { rootMargin: "160px 0px", threshold: 0.01 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(
      () => setHeroSlide((i) => (i + 1) % HERO_SLIDES.length),
      3000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      id="top"
      className="landing landing-grain relative flex min-h-svh w-full min-w-0 flex-1 flex-col bg-[#120e16] text-white"
    >
      {/* Fundo com vaga tonalidade (Figma) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_120%_80%_at_70%_20%,rgba(37,129,196,0.12),transparent_50%),radial-gradient(ellipse_90%_60%_at_10%_80%,rgba(140,64,145,0.1),transparent_45%)]"
        aria-hidden
      />

      <div className="relative z-10 flex w-full min-w-0 flex-1 flex-col">
        <div
          className={`flex min-h-svh w-full min-w-0 flex-shrink-0 flex-col bg-[#1A141F] ${SHELL_X}`}
        >
          <LandingHeader />

          <main className="isolate flex w-full min-w-0 flex-1 flex-col items-stretch gap-10 overflow-x-clip pb-16 pt-6 sm:gap-12 sm:pt-6 md:gap-14 md:pb-20 md:pt-8 lg:min-h-0 lg:grid lg:grid-cols-[minmax(0,min(100%,42.5rem))_minmax(0,1fr)] lg:items-start lg:gap-x-6 lg:gap-y-0 lg:overflow-x-visible lg:overflow-y-visible lg:pb-28 lg:pt-8 xl:gap-x-10">
            {/*
            Mobile: coluna (texto + ilustração). Desktop: grelha — texto ~680px + coluna da ilustração,
            sem position:absolute no main (evita bloco de posicionamento errado e clipping estranho).
          */}
            <div className="relative z-30 flex w-full min-w-0 max-w-full flex-col items-start gap-8 text-left sm:gap-10 lg:max-w-none lg:gap-11 lg:self-start lg:pr-4 xl:pr-8">
              <h1 className="landing-title landing-rise landing-rise-delay-1 max-w-[22ch] font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:max-w-[min(100%,42rem)]">
                Um clube de vantagens feito para o seu dia a dia.
              </h1>

              <p
                className="landing-rise landing-rise-delay-2 max-w-full font-sans text-[clamp(1.125rem,2.2vw,1.875rem)] font-bold leading-[120%] tracking-[-0.01em]"
                style={{
                  backgroundImage: HERO_BRAND_TEXT_GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Benefícios que acompanham a sua vida.
              </p>

              <p className="landing-rise landing-rise-delay-3 max-w-[65ch] font-sans text-[clamp(1rem,2vw,1.375rem)] font-light leading-[1.55] text-white/88">
                O Blupa reúne descontos, vantagens e ofertas exclusivas: tudo em
                um só lugar, de forma simples, digital e acessível.
              </p>

              <div className="landing-rise landing-rise-delay-4 relative z-40 flex flex-row flex-wrap items-center gap-5">
                <HeroGlassButton
                  type="button"
                  onClick={() => scrollToSection("contato")}
                >
                  Quero fazer parte do Blupa
                </HeroGlassButton>
              </div>
            </div>

            <div className="relative z-0 flex min-h-[220px] min-w-0 flex-1 items-center justify-center overflow-hidden sm:min-h-[280px] lg:pointer-events-none lg:col-start-2 lg:row-start-1 lg:flex lg:h-full lg:min-h-0 lg:items-center lg:justify-end lg:overflow-visible lg:pb-2">
              <div
                className="relative mb-10 w-full max-h-[min(70.65vh,463px)] max-w-[min(100%,573px)] sm:max-h-[min(74.97vh,529px)] sm:max-w-[min(100%,662px)] lg:mb-0 lg:max-h-[min(50.72rem,79.38svh)] lg:max-w-full overflow-hidden"
                style={{
                  aspectRatio: `${HERO_INTRINSIC_W}/${HERO_INTRINSIC_H}`,
                }}
              >
                {/* Spacer image establishes intrinsic height when aspect-ratio alone is insufficient */}
                <img
                  src={HERO_SLIDES[0]}
                  alt=""
                  width={HERO_INTRINSIC_W}
                  height={HERO_INTRINSIC_H}
                  aria-hidden
                  className="block w-full h-auto pointer-events-none select-none"
                  style={{ visibility: "hidden" }}
                  fetchPriority="high"
                />
                {HERO_SLIDES.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    width={HERO_INTRINSIC_W}
                    height={HERO_INTRINSIC_H}
                    className="absolute inset-0 h-full w-full object-contain object-center"
                    style={{
                      opacity: i === heroSlide ? 1 : 0,
                      transition: "opacity 700ms ease-in-out",
                    }}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                ))}
              </div>
            </div>
          </main>

          <div className="flex justify-center pb-6 pt-0">
            <button
              type="button"
              aria-label="Rolar para baixo"
              onClick={() => scrollToSection("todo-dia")}
              className="group flex flex-col items-center gap-0 text-white/40 transition-colors duration-200 hover:text-white/70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 animate-[scrollBounce_1.4s_ease-in-out_infinite]"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 -mt-3 animate-[scrollBounce_1.4s_ease-in-out_0.2s_infinite]"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>

        <section
          id="todo-dia"
          className="relative z-20 w-full flex-shrink-0 bg-white text-[#1F1E17]"
          aria-labelledby="todo-dia-heading"
        >
          <div
            className={`mx-auto flex w-full max-w-[1235px] flex-col items-stretch gap-12 py-14 sm:py-16 md:gap-14 md:py-20 lg:flex-row lg:items-start lg:justify-between lg:gap-[clamp(2.5rem,8vw,6.25rem)] xl:gap-[100px] ${SHELL_X}`}
          >
            <div className="flex w-full max-w-[539px] flex-col items-start gap-10 self-start sm:gap-14 lg:max-w-none lg:flex-1 lg:gap-[60px]">
              <h2
                id="todo-dia-heading"
                className="m-0 font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[128%] text-[#1F1E17] lg:text-[44px]"
              >
                Todo dia tem vantagem
              </h2>
              <div className="flex w-full max-w-[498px] flex-col gap-5 font-sans text-lg font-light leading-[132%] text-[#878680]">
                <p>
                  Quem faz parte do Blupa não espera ganhar desconto depois da
                  compra. O desconto já está lá, disponível, antes da decisão. A
                  vantagem faz parte do clube e acompanha você nas escolhas do
                  dia a dia.
                </p>
                <p>
                  Sempre que você for comprar algo, contratar um serviço ou
                  aproveitar um momento de lazer, vale conferir o Blupa. As
                  ofertas já estão ativas, prontas para usar, em marcas que você
                  já conhece.
                </p>
              </div>
              <div className="flex flex-row flex-wrap items-center gap-6">
                <HeroGlassButton
                  type="button"
                  variant="light"
                  innerClassName="bg-[#F3F7F9]"
                  onClick={() => scrollToSection("contato")}
                >
                  Quero fazer parte do Blupa
                </HeroGlassButton>
              </div>
            </div>

            <div className="flex w-full max-w-[596px] shrink-0 flex-row items-start justify-center gap-3 self-center sm:gap-3 lg:max-w-none lg:flex-1 lg:justify-end lg:gap-4">
              <div className="relative h-[min(544px,78vw)] w-[min(100%,298px)] shrink-0 sm:h-[480px] sm:w-[270px] md:h-[520px] md:w-[285px] lg:h-[544px] lg:w-[298px]">
                <img
                  src={SECTION_TODO_DIA_IMG_TOP}
                  alt="Pessoa a comprar online no site Blupa, com cartão e portátil."
                  width={1536}
                  height={1024}
                  className="absolute inset-x-[10px] top-0 h-[min(68%,375px)] rounded-tl-[70px] object-cover object-center sm:h-[63%]"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src={SECTION_TODO_DIA_IMG_COUPLE}
                  alt="Casal jovem feliz a tirar uma selfie dentro de um avião, com chapéus de palha."
                  width={1600}
                  height={1067}
                  className="absolute inset-x-[10px] top-[66%] h-[34%] rounded-bl-[70px] object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="relative h-[min(544px,78vw)] w-[min(100%,298px)] shrink-0 sm:h-[480px] sm:w-[270px] md:h-[520px] md:w-[285px] lg:h-[544px] lg:w-[298px]">
                <img
                  src={SECTION_TODO_DIA_IMG_KEYS}
                  alt="Mulher sorridente com sacos de compras num centro comercial."
                  width={1066}
                  height={1600}
                  className="absolute inset-x-[10px] inset-y-0 h-full rounded-r-[70px] object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          ref={benefitsSectionRef}
          id="beneficios-blupa"
          className={`w-full bg-white text-[#1A141F] transition-[opacity,transform] duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-0 ${
            benefitsInView
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
          }`}
          aria-labelledby="beneficios-blupa-heading"
        >
          <div
            className={`mx-auto flex w-full max-w-[1240px] flex-col items-start gap-6 pb-16 pt-6 sm:pb-20 sm:pt-8 ${SHELL_X}`}
          >
            <h2
              id="beneficios-blupa-heading"
              className="m-0 font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[128%] text-[#1A141F] lg:text-[44px]"
            >
              Benefícios do Blupa
            </h2>

            <div className="blupa-gradient-ring w-full rounded-[24px] p-0">
              <div
                className="relative isolate min-h-[min(360px,72vw)] w-full overflow-hidden rounded-[22.5px] bg-[#1a141f] sm:min-h-[420px] lg:h-[500px] lg:max-h-[500px]"
                role="region"
                aria-live="polite"
                aria-label={featured.title}
              >
                <BenefitsFeaturedCrossfadeBg imageSrc={featured.image} />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[62%] bg-gradient-to-t from-black/80 via-black/45 to-transparent"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-8 -left-14 z-[1] h-[182px] w-[min(846px,130%)] rounded-full bg-neutral-500/[0.12] blur-[32px]"
                  aria-hidden
                />

                <div className="relative z-[2] flex min-h-[min(360px,72vw)] flex-col justify-end sm:min-h-[420px] lg:min-h-0 lg:h-full lg:justify-end">
                  <div className="benefits-feature-text flex flex-col gap-3 px-6 pb-10 pt-16 sm:gap-4 sm:px-10 sm:pb-10 lg:pb-12">
                    <h3 className="m-0 max-w-[28rem] font-sans text-[clamp(1.25rem,2.5vw,1.875rem)] font-bold leading-[120%] text-white lg:text-[30px] lg:leading-[120%]">
                      {featured.title}
                    </h3>
                    <p className="m-0 max-w-[730px] font-sans text-base font-light leading-[148%] text-white">
                      {featured.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
              aria-label="Outros benefícios"
            >
              {cardIds.map((id, slotIndex) => {
                const b = BENEFIT_BY_ID[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onBenefitCardClick(slotIndex)}
                    className="benefits-card-enter group relative isolate box-border flex min-h-[270px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#9D9D9C] bg-white px-6 py-12 text-center transition-[border-color,background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#1A141F]/25 hover:bg-[#f7f7f6] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2581c4]"
                  >
                    <span className="m-0 max-w-[244px] font-sans text-[clamp(1.125rem,2vw,1.375rem)] font-bold leading-[124%] text-[#9D9D9C] transition-colors duration-300 group-hover:text-[#1A141F] lg:text-[22px]">
                      {b.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section
          ref={marcasBannerRef}
          className="relative isolate w-full overflow-hidden lg:min-h-[852px]"
          aria-labelledby="marcas-beneficios-heading"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[#ebeae8] bg-center bg-no-repeat [transform:scaleX(-1)]"
            style={
              marcasBannerBgOn
                ? {
                    backgroundImage: `url(${SECTION_BRANDS_BANNER})`,
                    /* Menor que cover = mais campo visível (menos zoom). Ajuste o % se precisares. */
                    backgroundSize: "100%",
                  }
                : undefined
            }
            aria-hidden
          />
          <div className="relative z-[1] flex min-h-[min(520px,88svh)] w-full flex-col justify-start lg:min-h-[852px]">
            <div
              className={`mx-auto flex w-full max-w-[1920px] flex-col items-start gap-[27px] px-[clamp(1.25rem,5vw,6.75rem)] pt-10 pb-14 sm:px-[clamp(1.5rem,5.5vw,6.75rem)] lg:pb-24 lg:pl-[108px] lg:pr-12 lg:pt-[7.25rem]`}
            >
              <h2
                id="marcas-beneficios-heading"
                className="m-0 max-w-[521px] font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[128%] text-[#1A141F] lg:text-[44px]"
              >
                Descontos nas marcas que fazem parte da sua vida
              </h2>
              <p className="m-0 max-w-[434px] font-sans text-base font-light leading-[148%] text-[#1A141F]">
                No Blupa, essas marcas se transformam em benefícios prontos para
                usar quando fizer sentido para você.
              </p>
              <HeroGlassButton
                type="button"
                variant="light"
                onClick={() => scrollToSection("contato")}
              >
                Quero fazer parte do Blupa
              </HeroGlassButton>
            </div>
          </div>
        </section>

        <section
          id="parceiros"
          className="relative isolate w-full bg-white text-[#1A141F]"
          aria-labelledby="parceiros-heading"
        >
          <div
            className={`mx-auto flex w-full max-w-[1440px] flex-col items-center gap-12 pt-[100px] pb-16 md:pb-24 ${SHELL_X}`}
          >
            <h2
              id="parceiros-heading"
              className="m-0 w-full max-w-[1262px] text-center font-sans text-[clamp(2rem,5vw,2.75rem)] font-bold leading-[128%] lg:text-[44px] lg:leading-[128%]"
            >
              Parceiros
            </h2>
            <p className="m-0 w-full max-w-[1262px] text-center font-sans text-[clamp(1.125rem,2.5vw,1.375rem)] font-bold leading-[124%] lg:text-[22px] lg:leading-[27px]">
              O Blupa reúne parceiros que fazem sentido na vida real:
            </p>
            <div className="flex w-full max-w-[1240px] flex-col gap-4">
              <div className="grid w-full grid-cols-2 justify-items-center gap-x-2 gap-y-4 sm:grid-cols-3 md:grid-cols-5">
                {PARTNER_CATEGORIES.map((c) => (
                  <PartnerFlipCard
                    key={c.label}
                    label={c.label}
                    image={c.image}
                    objectPosition={
                      c.label === "Automotivo" ? "25% center" : "center"
                    }
                  />
                ))}
              </div>
            </div>
            <p className="m-0 w-full max-w-[1262px] text-center font-sans text-[clamp(1.125rem,2.5vw,1.375rem)] font-light leading-[144%] lg:text-[22px]">
              Novos parceiros são adicionados constantemente para ampliar suas
              vantagens.
            </p>
          </div>
        </section>

        <section
          className="relative isolate w-full bg-white text-[#1F1E17]"
          aria-labelledby="como-funciona-heading"
        >
          {/* Faixa escura: ~38% da largura — a coluna da imagem tem 46%, criando sobreposição natural */}
          <div
            className="pointer-events-none absolute left-0 top-1/2 z-0 hidden h-[754px] w-[604px] -translate-y-1/2 bg-[#1A141F] lg:block"
            aria-hidden
          />

          <div
            ref={comoFuncionaRef}
            className="relative z-[1] mx-auto flex w-full max-w-[1920px] flex-col lg:flex-row lg:items-center"
          >
            <div className="relative z-[1] flex w-full items-center justify-center bg-[#1A141F] px-6 py-16 sm:py-20 lg:w-[46%] lg:justify-end lg:bg-transparent lg:px-0 lg:py-[clamp(5rem,10vw,8.5rem)]">
              <div className="timeline-image-glow relative w-full max-w-[min(683.71px,90vw)] shrink-0">
                {timelineSlidesLoaded.has(timelineStep) ? (
                  <img
                    key={TIMELINE_STEPS[timelineStep].image}
                    src={TIMELINE_STEPS[timelineStep].image}
                    alt=""
                    className="timeline-img-enter mx-auto block h-auto w-full max-w-full object-contain object-center"
                    width={684}
                    height={604}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div
                    className="mx-auto aspect-[684/604] w-full max-w-full bg-[#1A141F]"
                    aria-hidden
                  />
                )}
              </div>
            </div>

            <div className="relative z-[2] flex w-full flex-col justify-center bg-white px-6 py-14 sm:py-16 lg:flex-1 lg:py-[clamp(5rem,10vw,8.5rem)] lg:pl-[clamp(2rem,5vw,5.3125rem)] lg:pr-[clamp(1.5rem,4vw,2.5rem)]">
              <div className="w-full max-w-[599.98px]">
                <h2
                  id="como-funciona-heading"
                  className="m-0 max-w-[509.84px] font-sans text-[clamp(2rem,5vw,2.75rem)] font-bold leading-[128%] text-[#1F1E17] lg:mb-[33px] lg:text-[44px] lg:leading-[128%]"
                >
                  Como funciona
                </h2>

                <div className="flex flex-col gap-[19px] lg:min-h-[390px]">
                  {TIMELINE_STEPS.map((step, index) => {
                    const isOpen = timelineStep === index;
                    const panelId = `timeline-panel-${index}`;
                    const headingId = `timeline-heading-${index}`;
                    const accent = TIMELINE_STEPS[timelineStep].accent;

                    return (
                      <div
                        key={step.title}
                        className="flex w-full max-w-[599.98px] flex-col gap-[22px]"
                      >
                        <button
                          type="button"
                          id={headingId}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => {
                            setTimelineStep(index);
                            startTimelineAutoRotate();
                          }}
                          className="relative flex h-20 w-full min-h-[80px] cursor-pointer items-center rounded-[10px] bg-[#F8F7F0] py-0 pl-[38px] pr-[10px] text-left shadow-[0px_15px_30px_rgb(19_40_77/0.1)] transition-[background-color] duration-200 hover:bg-[#f0efe6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2581c4] motion-reduce:transition-none"
                        >
                          <span className="min-w-0 flex-1 pr-[76px] font-sans text-[clamp(1rem,2.5vw,1.375rem)] font-bold leading-[124%] text-[#1F1E17] lg:text-[22px] lg:leading-[27px]">
                            {step.title}
                          </span>
                          <span
                            className="absolute right-[10px] top-1/2 flex h-[60px] w-[60px] shrink-0 -translate-y-1/2 items-center justify-center rounded-[10px] transition-colors duration-300 motion-reduce:transition-none"
                            style={{ backgroundColor: accent }}
                            aria-hidden
                          >
                            <TimelineAccordionChevron expanded={isOpen} />
                          </span>
                        </button>
                        <div
                          id={panelId}
                          role="region"
                          aria-labelledby={headingId}
                          aria-hidden={!isOpen}
                          className={`timeline-panel ${isOpen ? "timeline-panel--open" : ""}`}
                        >
                          <p className="m-0 w-full max-w-[600px] font-sans text-[clamp(1rem,2.2vw,1.125rem)] font-light leading-[132%] text-[#1A141F] lg:text-[18px] lg:leading-[132%]">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Sexta seção: Clientes do Grupo Paco ─────────────────────────── */}
        <section
          className="relative w-full bg-white"
          aria-labelledby="clientes-heading"
        >
          {/* Container de posicionamento: relative + min-height para os cards absolutos */}
          <div className="relative mx-auto w-full max-w-[1920px] lg:min-h-[1092px]">
            {/* Flex: imagem + conteúdo (sem cards no desktop) */}
            <div className="flex w-full flex-col lg:flex-row lg:items-start">
              {/* Imagem — centrada verticalmente no desktop (top 120px = 11% de 1092px) */}
              <div className="flex w-full shrink-0 items-center justify-end lg:w-[48.3%] lg:pt-[120px]">
                <img
                  src={sextaAsset("envato-labs-image-edit (2) 1.avif")}
                  alt=""
                  className="block w-full max-w-full object-cover object-center lg:h-[852px] lg:w-[615px] lg:max-w-[615px]"
                  width={615}
                  height={852}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Coluna de conteúdo (título / desc / contador) */}
              <div className="flex flex-1 flex-col px-6 pb-10 pt-14 sm:pb-14 lg:pb-0 lg:pl-[clamp(2.5rem,6vw,6.625rem)] lg:pr-[clamp(1.5rem,4vw,4.75rem)] lg:pt-[167px]">
                <h2
                  id="clientes-heading"
                  className="m-0 mb-4 max-w-[490px] font-sans text-[clamp(2rem,4vw,3.125rem)] font-semibold leading-[120%] text-[#04000B] lg:mb-[25px] lg:text-[50px]"
                >
                  Para quem é o Blupa?
                </h2>

                <p className="m-0 mb-8 max-w-[502px] font-sans text-[clamp(1rem,1.8vw,1.125rem)] font-light leading-[132%] text-[#666666] lg:mb-10 lg:text-[18px]">
                  Para todo mundo que ama economizar e aproveitar benefícios de
                  verdade. Um clube completo, com vantagens pensadas pra
                  facilitar sua rotina, reduzir gastos e trazer mais praticidade
                  pro seu dia a dia.
                </p>

                {/* Contador */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span
                    className="font-sans font-medium leading-none text-[#CC3159]"
                    style={{ fontSize: "clamp(3.5rem, 8vw, 6.25rem)" }}
                  >
                    +40mil
                  </span>
                  <span className="max-w-[251px] text-balance font-sans text-[clamp(0.875rem,1.2vw,1rem)] font-bold leading-[170%] text-[#04000B] lg:text-[16px]">
                    estabelecimentos em todo o Brasil
                  </span>
                </div>
              </div>
            </div>

            {/* ── Cards: absolute no desktop, sobrepoem a imagem ────────── */}
            {/* Figma: left 850px / bottom 178px / right 312px em 1920×1092 */}
            <div
              className="mx-6 mt-2 flex flex-col gap-5 pb-10 sm:mx-0 sm:flex-row sm:px-6 lg:absolute lg:mx-0 lg:translate-y-[28px] lg:flex-row lg:gap-[clamp(15px,1.6vw,30px)] lg:pb-0"
              style={{
                bottom: "16.27%" /* 177.72/1092 */,
                left: "44.29%" /* 850.38/1920 */,
                right: "16.25%" /* 312/1920    */,
              }}
            >
              {/* Card 1 — Clientes Grupo Paco */}
              <div className="flex flex-1 flex-col justify-start bg-[#0067AB] px-[50px] pb-[30px] pt-[35px]">
                <p className="m-0 mb-3 font-sans text-[clamp(1.125rem,2vw,1.5rem)] font-bold leading-[120%] text-white lg:text-[24px]">
                  Clientes Paco
                </p>
                <p className="m-0 font-sans text-[clamp(0.875rem,1.5vw,1rem)] font-light leading-[160%] text-white/80 lg:text-[16px]">
                  Seu benefício agora vai além. Além dos produtos que você já
                  assina, você passa a ter gratuitamente acesso a um clube
                  completo de benefícios.
                </p>
                <a
                  href="https://grupo-paco.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex flex-row items-center gap-2 font-sans text-[clamp(0.875rem,1.5vw,1rem)] font-bold leading-none text-white no-underline outline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-white/50 lg:text-[16px]"
                >
                  Ver produtos Paco
                  <ArrowRightIcon
                    className="h-[1em] w-[1em] shrink-0 text-white"
                    aria-hidden
                  />
                </a>
                <div className="landing-rise landing-rise-delay-4 relative z-40 flex flex-row flex-wrap items-center gap-5 mt-8">
                  <HeroGlassButton
                    type="button"
                    onClick={() => scrollToSection("contato")}
                  >
                    Ativar meu Blupa
                  </HeroGlassButton>
                </div>{" "}
              </div>

              {/* Card 2 — Não é cliente Grupo Paco */}
              <div className="flex flex-1 flex-col justify-start bg-[#9FC031] px-[50px] pb-[50px] pt-[50px]">
                <p className="m-0 mb-3 font-sans text-[clamp(1.125rem,2vw,1.5rem)] font-bold leading-[120%] text-white lg:text-[24px]">
                  Não assina produto Paco?
                </p>
                <p className="m-0 font-sans text-[clamp(0.875rem,1.5vw,1rem)] font-light leading-[160%] text-white/90 lg:text-[16px]">
                  Sem problema!
                  <br />
                  Você também pode aproveitar tudo isso por apenas{" "}
                  <strong className="font-bold text-white">R$19,90/mês</strong>
                </p>
                <div className="landing-rise landing-rise-delay-4 relative z-40 flex flex-row flex-wrap items-center gap-5 mt-10">
                  <HeroGlassButton
                    type="button"
                    innerClassName="blupa-glass-face--flat"
                    onClick={() => scrollToSection("contato")}
                  >
                    Assinar o Blupa
                  </HeroGlassButton>
                </div>{" "}
              </div>
            </div>
          </div>
        </section>

        {/* ── Sétima seção: Faça parte do Blupa (formulário) ───────────────── */}
        <section
          id="contato"
          className="relative w-full overflow-hidden bg-[#1D3B6E]"
          aria-labelledby="contato-heading"
        >
          {/* Imagem de fundo — lado direito (45% → 100%) */}
          <div
            className="absolute inset-y-0 right-0 hidden w-[55%] lg:block"
            aria-hidden
          >
            <img
              src={encodeURI("/Midia Blupa/form.avif")}
              alt=""
              className="block h-full w-full object-cover object-right"
              loading="lazy"
              decoding="async"
            />
          </div>

          <BlupaSignupFormCard />

          {/* Imagem mobile (abaixo do formulário) */}
          <div className="mt-0 h-64 w-full lg:hidden">
            <img
              src={sétimaAsset(
                "website-header-of-cheerful-young-woman-in-sportswe-2026-01-09-01-22-27-utc 1.avif",
              )}
              alt=""
              className="block h-full w-full object-cover object-top"
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="w-full bg-white" aria-labelledby="faq-heading">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-16 sm:py-20 lg:flex-row lg:items-start lg:justify-between lg:gap-[160px] lg:px-10 lg:py-[100px]">
            {/* Coluna esquerda: título + CTA */}
            <div className="flex shrink-0 flex-col items-start gap-6 lg:w-[414px] lg:items-center">
              <h2
                id="faq-heading"
                className="m-0 w-full max-w-[339px] font-sans text-[clamp(1.5rem,3vw,1.875rem)] font-bold leading-[120%] text-[#1A141F] lg:text-[30px]"
              >
                Perguntas frequentes sobre o Blupa
              </h2>

              {/* Borda em gradiente + miolo sólido (sem glass); p-0 = colado ao anel */}
              <div className="blupa-gradient-ring box-border inline-flex max-w-full rounded-[24px] p-0 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                <button
                  type="button"
                  onClick={() => scrollToSection("contato")}
                  className="box-border flex h-[56px] min-h-0 min-w-0 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-[22.5px] border-none bg-[#1A141F] px-6 font-sans text-[16px] font-bold leading-none text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A141F]"
                >
                  <span className="inline-block translate-y-0.5">
                    Quero fazer parte do Blupa
                  </span>
                </button>
              </div>
            </div>

            {/* Coluna direita: acordeão */}
            <div className="flex w-full flex-col gap-4 lg:max-w-[701px] lg:gap-[16px]">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = faqOpen === index;
                const panelId = `faq-panel-${index}`;
                const headingId = `faq-heading-${index}`;
                return (
                  <div
                    key={item.question}
                    className="w-full rounded-[8px] bg-white shadow-[0px_15px_30px_rgba(19,40,77,0.09)]"
                  >
                    <button
                      type="button"
                      id={headingId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setFaqOpen(isOpen ? null : index)}
                      className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-[8px] px-6 py-6 text-left transition-colors duration-150 hover:bg-[#fafafa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1A141F] motion-reduce:transition-none"
                    >
                      <span className="font-sans text-[clamp(1rem,1.8vw,1.125rem)] font-light leading-[132%] text-[#1A141F] opacity-[0.88] lg:text-[18px]">
                        {item.question}
                      </span>
                      {/* Chevron */}
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                        className={`shrink-0 text-[#1C1B1F] transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                      >
                        <path
                          d="M7 10l5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headingId}
                      aria-hidden={!isOpen}
                      className={`faq-panel ${isOpen ? "faq-panel--open" : ""}`}
                    >
                      <div className="faq-panel__inner">
                        <p className="m-0 px-6 pb-6 font-sans text-[clamp(0.875rem,1.6vw,1rem)] font-light leading-[160%] text-[#1A141F] opacity-75 lg:text-[16px]">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="w-full bg-[#1A141F] px-6 py-16 sm:px-10 lg:px-6 lg:py-[64px]">
          <div className="mx-auto flex w-full max-w-[1096px] flex-col gap-[42px]">
            {/* Linha principal: logo+tagline + links rápidos à esquerda, com gap */}
            <div className="flex flex-col gap-16 sm:flex-row sm:items-start sm:gap-16 lg:gap-24">
              {/* Coluna: logo + tagline */}
              <div className="flex shrink-0 flex-col gap-16 lg:w-[408px]">
                <img
                  src={LOGO_SRC}
                  alt="Blupa"
                  width={274}
                  height={100}
                  className="h-[100px] w-[274px] object-contain object-left"
                  decoding="async"
                />
                <div className="flex flex-col gap-6">
                  <p className="m-0 font-sans text-[18px] font-bold leading-[132%] text-white">
                    Blupa é o clube de benefícios do Grupo Paco
                  </p>
                  <p className="m-0 font-sans text-[18px] font-light leading-[132%] text-white">
                    Economia com benefícios de verdade.
                  </p>
                </div>
              </div>

              <nav aria-label="Links rápidos" className="shrink-0">
                <div className="flex flex-col gap-6 sm:min-w-[158px] lg:w-[158px]">
                  <p className="m-0 font-sans text-[18px] font-bold leading-[132%] text-white">
                    Links rápidos
                  </p>
                  {[
                    { label: "Home", href: "#top" },
                    { label: "Benefícios", href: "#beneficios-blupa" },
                    { label: "Parceiros", href: "#parceiros" },
                    { label: "Inscrição", href: "#contato" },
                    {
                      label: "Políticas de privacidade",
                      href: "/politica-de-privacidade",
                    },
                    { label: "Termos de uso", href: "/termos-de-uso" },
                  ].map(({ label, href }) =>
                    href.startsWith("/") ? (
                      <Link
                        key={label}
                        to={href}
                        className="font-sans text-[16px] font-light leading-[148%] text-white no-underline opacity-80 transition-opacity duration-200 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        key={label}
                        href={href}
                        onClick={(e) => {
                          e.preventDefault();
                          if (href === "#top") {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          } else {
                            scrollToSection(href.slice(1));
                          }
                        }}
                        className="font-sans text-[16px] font-light leading-[148%] text-white no-underline opacity-80 transition-opacity duration-200 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        {label}
                      </a>
                    ),
                  )}
                </div>
              </nav>
            </div>

            {/* Copyright */}
            <div className="flex w-full items-center justify-center border-t border-white/10 pt-8">
              <p className="m-0 text-center font-sans text-[12px] font-normal leading-[140%] text-white">
                © 2026 Blupa. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
