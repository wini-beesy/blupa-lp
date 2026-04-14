import { useState } from 'react'

const inputClass =
  'box-border h-[51px] w-full rounded-[4px] bg-[#F3F7F9] px-5 py-0 font-sans text-[14px] font-light leading-[51px] text-[#04000B] placeholder-[#9D9D9C] [font-variant-ligatures:none] outline-none transition-shadow duration-200 focus:ring-2 focus:ring-[#1D3B6E]/30'

const inputFlexClass =
  'box-border h-[51px] flex-1 rounded-[4px] bg-[#F3F7F9] px-5 py-0 font-sans text-[14px] font-light leading-[51px] text-[#04000B] placeholder-[#9D9D9C] [font-variant-ligatures:none] outline-none transition-shadow duration-200 focus:ring-2 focus:ring-[#1D3B6E]/30'

/**
 * Cartão branco + formulário da secção “Desbloqueie os benefícios” (#contato).
 */
export function BlupaSignupFormCard() {
  const [commEmail, setCommEmail] = useState(true)
  const [commSms, setCommSms] = useState(true)
  const [commWhatsapp, setCommWhatsapp] = useState(true)
  const [termsAccepted, setTermsAccepted] = useState(false)

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1920px] px-4 py-12 sm:py-16 lg:py-[60px] lg:pl-[312px] lg:pr-0">
      <div className="w-full max-w-[992px] bg-white px-6 py-10 sm:px-12 sm:py-12 lg:px-[100px] lg:py-[60px]">
        <form
          className="flex w-full flex-col items-start gap-[48px]"
          noValidate
          onSubmit={(e) => e.preventDefault()}
        >
          <h2
            id="contato-heading"
            className="m-0 w-full font-sans text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-[128%] text-[#1A141F] lg:text-[44px]"
          >
            Desbloqueie os benefícios do Blupa
          </h2>

          <div className="flex w-full flex-col gap-4">
            <input type="text" placeholder="Nome completo" className={inputClass} />
            <div className="flex gap-4">
              <input type="text" placeholder="CPF" className={inputFlexClass} />
              <input type="tel" placeholder="Celular" className={inputFlexClass} />
            </div>
            <div className="flex gap-4">
              <input type="email" placeholder="E-mail" className={inputFlexClass} />
              <input
                type="email"
                placeholder="Confirmar e-mail"
                className={inputFlexClass}
              />
            </div>
            <div className="flex gap-4">
              <input type="password" placeholder="Senha" className={inputFlexClass} />
              <input
                type="password"
                placeholder="Confirmar senha"
                className={inputFlexClass}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-wrap items-center justify-between gap-4 border-y border-[#F3F7F9] py-4">
              <div className="flex min-h-8 min-w-0 max-w-full shrink-0 items-center">
                <span className="font-sans text-[14px] font-light leading-none text-[#1A141F]">
                  <span className="inline-block translate-y-0.5">
                    Deseja receber nossas comunicações?
                  </span>
                </span>
              </div>
              <div className="flex min-h-8 shrink-0 items-center gap-4">
                {(
                  [
                    { label: 'E-mail', value: commEmail, set: setCommEmail },
                    { label: 'SMS', value: commSms, set: setCommSms },
                    { label: 'WhatsApp', value: commWhatsapp, set: setCommWhatsapp },
                  ] as const
                ).map(({ label, value, set }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="inline-flex h-8 items-center font-sans text-[14px] font-light leading-none text-[#1A141F]">
                      <span className="inline-block translate-y-0.5">{label}</span>
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={value}
                      aria-label={`Receber comunicações por ${label}`}
                      onClick={() => set((v) => !v)}
                      className="relative h-8 w-[70px] shrink-0 cursor-pointer rounded-full transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D3B6E]"
                      style={{ backgroundColor: value ? '#1D3B6E' : '#E5E0EB' }}
                    >
                      {value ? (
                        <span className="pointer-events-none absolute left-2 top-0 flex h-full items-center font-sans text-[14px] font-light leading-none text-white">
                          <span className="inline-block translate-y-0.5">Sim</span>
                        </span>
                      ) : (
                        <span className="pointer-events-none absolute right-2 top-0 flex h-full items-center font-sans text-[14px] font-light leading-none text-[#1A141F]">
                          <span className="inline-block translate-y-0.5">Não</span>
                        </span>
                      )}
                      <span
                        className={`absolute top-[2px] h-7 w-7 rounded-full bg-white shadow-[0px_3px_8px_rgba(0,0,0,0.15),0px_3px_1px_rgba(0,0,0,0.06)] transition-[left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${value ? 'left-[40px]' : 'left-[2px]'}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-sans text-[16px] font-light leading-[148%] text-[#1A141F]">
                Li e concordo com os{' '}
                <a href="#" className="font-bold text-[#1A141F] underline hover:opacity-70">
                  Termos de uso
                </a>{' '}
                e{' '}
                <a href="#" className="font-bold text-[#1A141F] underline hover:opacity-70">
                  Política de Privacidade
                </a>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={termsAccepted}
                aria-label="Aceitar termos de uso e política de privacidade"
                onClick={() => setTermsAccepted((v) => !v)}
                className="relative h-8 w-[70px] shrink-0 cursor-pointer rounded-full transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D3B6E]"
                style={{ backgroundColor: termsAccepted ? '#1D3B6E' : '#E5E0EB' }}
              >
                {termsAccepted ? (
                  <span className="pointer-events-none absolute left-2 top-0 flex h-full items-center font-sans text-[14px] font-light leading-none text-white">
                    <span className="inline-block translate-y-0.5">Sim</span>
                  </span>
                ) : (
                  <span className="pointer-events-none absolute right-2 top-0 flex h-full items-center font-sans text-[14px] font-light leading-none text-[#1A141F]">
                    <span className="inline-block translate-y-0.5">Não</span>
                  </span>
                )}
                <span
                  className={`absolute top-[2px] h-7 w-7 rounded-full bg-white shadow-[0px_3px_8px_rgba(0,0,0,0.15),0px_3px_1px_rgba(0,0,0,0.06)] transition-[left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${termsAccepted ? 'left-[40px]' : 'left-[2px]'}`}
                />
              </button>
            </div>

            <div className="flex w-full justify-end drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
              {termsAccepted ? (
                <button
                  type="submit"
                  className="blupa-gradient-ring box-border flex h-[56px] shrink-0 cursor-pointer items-stretch rounded-[24px] border-none p-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84d0f5]"
                >
                  <span className="box-border flex h-full min-h-0 w-full items-center justify-center whitespace-nowrap rounded-[22.5px] bg-white px-6 font-sans text-base font-bold leading-none text-[#1A141F]">
                    <span className="inline-block translate-y-0.5">Avançar</span>
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex h-[56px] shrink-0 cursor-not-allowed items-center justify-center whitespace-nowrap rounded-[24px] border-2 border-[#D2D7DB] bg-[#9D9D9C] px-6 font-sans text-base font-bold leading-none text-[#D2D7DB]"
                >
                  <span className="inline-block translate-y-0.5">Avançar</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
