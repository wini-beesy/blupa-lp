import type { RefObject } from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { GradientBorderButton } from './GradientBorderButton'
import { scrollToSection } from '../lib/scroll-to-section'

const LOGO_SRC = '/Midia Blupa/logo.svg'
const LOGIN_URL = 'https://clube.blupa.com.br/member/login'

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
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
  )
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 7h14M5 12h14M5 17h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LogoLink({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <a
      href="#top"
      onClick={(e) => {
        e.preventDefault()
        onNavigate?.()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      className="relative z-10 flex w-fit min-w-0 max-w-full shrink-0 items-center no-underline transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 active:scale-[0.98]"
      aria-label="Blupa — início"
    >
      <img
        src={LOGO_SRC}
        alt="Blupa"
        className="h-9 w-auto max-h-11 max-w-[min(100%,10.5rem)] shrink-0 object-contain object-left sm:h-11 sm:max-w-none md:h-14"
        width={145}
        height={53}
        decoding="async"
      />
    </a>
  )
}

/** Barra + navegação central — apenas ≥ sm. */
function LandingHeaderDesktop() {
  return (
    <div className="relative hidden min-h-0 w-full min-w-0 flex-1 flex-row items-center justify-between gap-6 sm:flex">
      <div className="relative z-10 shrink-0">
        <LogoLink />
      </div>

      <div className="relative z-10 flex shrink-0 items-center gap-6">
        <GradientBorderButton
          innerClassName="whitespace-nowrap"
          className="h-[42px] shrink-0 cursor-pointer"
          onClick={() => scrollToSection('contato')}
        >
          Assinar
        </GradientBorderButton>
        <a
          href={LOGIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="blupa-gradient-ring box-border inline-flex h-[42px] shrink-0 items-stretch rounded-[24px] p-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84d0f5]"
        >
          <span className="blupa-glass-face blupa-glass-face--flat box-border flex h-full min-h-0 items-center justify-center whitespace-nowrap rounded-[22.5px] px-6 py-0 font-sans text-base font-light leading-none text-white">
            <span className="inline-block translate-y-0.5">Entrar</span>
          </span>
        </a>
      </div>
    </div>
  )
}

/** Logo + menu — apenas < sm. Painel em portal (viewport). */
function LandingHeaderMobile({
  open,
  onOpenChange,
  panelTopPx,
  barRef,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  panelTopPx: number
  barRef: RefObject<HTMLDivElement | null>
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const close = () => onOpenChange(false)

  const portal =
    mounted && open
      ? createPortal(
          <>
            <button
              type="button"
              className="fixed inset-0 z-[40] cursor-default bg-black/55 sm:hidden"
              aria-label="Fechar menu"
              tabIndex={-1}
              onClick={close}
            />
            <div
              id="landing-mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed left-0 right-0 z-[50] w-full min-w-0 border-b border-white/10 bg-[#1A141F] shadow-[0_12px_28px_rgba(0,0,0,0.35)] sm:hidden"
              style={{ top: panelTopPx }}
            >
              <div className="flex w-full flex-col gap-0.5 px-[clamp(1rem,4vw,1.5rem)] pb-4 pt-2">
                <button
                  type="button"
                  className="flex min-h-[48px] w-full items-center justify-between rounded-xl px-3 text-left font-sans text-base font-bold text-white/90 transition-colors hover:bg-white/[0.07] hover:text-white"
                  onClick={() => {
                    close()
                    scrollToSection('beneficios-blupa')
                  }}
                >
                  Benefícios
                  <ChevronDown className="shrink-0 text-[#84d0f5] opacity-90" />
                </button>
                <button
                  type="button"
                  className="flex min-h-[48px] w-full items-center justify-between rounded-xl px-3 text-left font-sans text-base font-bold text-white/90 transition-colors hover:bg-white/[0.07] hover:text-white"
                  onClick={() => {
                    close()
                    scrollToSection('parceiros')
                  }}
                >
                  Parceiros
                  <ChevronDown className="shrink-0 text-[#84d0f5] opacity-90" />
                </button>
                <div className="mt-2 flex w-full flex-col gap-3 border-t border-white/[0.08] pt-3">
                  <a
                    href={LOGIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    className="blupa-gradient-ring box-border flex h-[42px] w-full min-w-0 shrink-0 items-stretch rounded-[24px] p-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84d0f5]"
                  >
                    <span className="blupa-glass-face blupa-glass-face--flat box-border flex h-full min-h-0 w-full min-w-0 items-center justify-center whitespace-nowrap rounded-[22.5px] px-6 py-0 font-sans text-base font-light leading-none text-white">
                      <span className="inline-block translate-y-0.5">Entrar</span>
                    </span>
                  </a>
                  <GradientBorderButton
                    innerClassName="w-full min-w-0 justify-center whitespace-nowrap px-6 text-base"
                    className="flex h-[42px] w-full min-w-0 shrink-0"
                    onClick={() => {
                      close()
                      scrollToSection('contato')
                    }}
                  >
                    Inscrição
                  </GradientBorderButton>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )
      : null

  return (
    <>
      <div
        ref={barRef}
        className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 sm:hidden"
      >
        <LogoLink onNavigate={close} />
        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition-[background-color,color,transform] duration-200 ease-out hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84d0f5] active:scale-[0.97]"
          aria-expanded={open}
          aria-controls={open ? 'landing-mobile-nav' : undefined}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => onOpenChange(!open)}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>
      {portal}
    </>
  )
}

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [panelTopPx, setPanelTopPx] = useState(0)
  const mobileBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!mobileNavOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    const mq = window.matchMedia('(min-width: 640px)')
    const onMq = () => {
      if (mq.matches) setMobileNavOpen(false)
    }
    document.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
      document.body.style.overflow = prevOverflow
    }
  }, [mobileNavOpen])

  useLayoutEffect(() => {
    if (!mobileNavOpen) return
    const el = mobileBarRef.current
    const sync = () => {
      if (!el) return
      setPanelTopPx(el.getBoundingClientRect().bottom)
    }
    sync()
    const ro =
      typeof ResizeObserver !== 'undefined' && el
        ? new ResizeObserver(() => {
            sync()
          })
        : null
    if (ro && el) ro.observe(el)
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      ro?.disconnect()
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [mobileNavOpen, scrolled])

  return (
    <header
      className={`landing-header blupa-sticky-header relative flex w-full min-w-0 shrink-0 flex-col sm:flex-row sm:items-center sm:gap-6 ${scrolled || mobileNavOpen ? 'blupa-sticky-header--scrolled py-3 sm:py-4 lg:py-4' : 'pt-8 pb-6 sm:pt-10 sm:pb-8 lg:pt-12 lg:pb-10'}`}
    >
      <LandingHeaderMobile
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        panelTopPx={panelTopPx}
        barRef={mobileBarRef}
      />
      <LandingHeaderDesktop />
    </header>
  )
}
