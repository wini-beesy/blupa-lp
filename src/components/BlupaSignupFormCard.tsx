import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import { Link } from 'react-router-dom'
import {
  initPublicCustomerSession,
  PublicCustomerApiError,
  registerPublicCustomer,
} from '../api/publicCustomer'

/** Mesmo destino do CTA “Entrar” no header (`App.tsx`). */
const MEMBER_LOGIN_HREF = 'https://clube.blupa.com.br/member/login'

const inputClass =
  'box-border h-[51px] w-full rounded-[4px] bg-[#F3F7F9] px-5 py-0 font-sans text-[14px] font-light leading-[51px] text-[#04000B] placeholder-[#9D9D9C] [font-variant-ligatures:none] outline-none transition-shadow duration-200 focus:ring-2 focus:ring-[#1D3B6E]/30'

const inputFlexClass =
  'box-border h-[51px] flex-1 rounded-[4px] bg-[#F3F7F9] px-5 py-0 font-sans text-[14px] font-light leading-[51px] text-[#04000B] placeholder-[#9D9D9C] [font-variant-ligatures:none] outline-none transition-shadow duration-200 focus:ring-2 focus:ring-[#1D3B6E]/30'

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/** CPF brasileiro: até 11 dígitos → `000.000.000-00`. */
function formatCpfInput(digits: string): string {
  const d = digits.slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

/** Data de nascimento: até 8 dígitos → `DD/MM/AAAA`. */
function formatBirthDateInput(digits: string): string {
  const d = digits.slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

/** Navegadores com `bday` costumam preencher `AAAA-MM-DD`; normaliza para a máscara BR. */
function birthDateInputFromRaw(raw: string): string {
  const t = raw.trim().replace(/[\u200e\u200f]/g, '')
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t)
  if (iso) {
    return formatBirthDateInput(`${iso[3]}${iso[2]}${iso[1]}`)
  }
  return formatBirthDateInput(digitsOnly(t))
}

/** Valor enviado à API Blupa: sempre `DD/MM/AAAA` (formato `d/m/Y` no Laravel). */
function birthDateToApiDmY(raw: string): string | null {
  const t = raw.trim().replace(/[\u200e\u200f]/g, '')
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t)
  if (iso) {
    return `${iso[3]}/${iso[2]}/${iso[1]}`
  }
  const d = digitsOnly(t)
  if (d.length !== 8) return null
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

/**
 * Celular/fixo BR: DDD + número (10 ou 11 dígitos).
 * 11 → `(11) 98765-4321` · 10 → `(11) 3333-4444`.
 */
function formatCellphoneInput(digits: string): string {
  const d = digits.slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  const dd = d.slice(0, 2)
  const rest = d.slice(2)
  if (d.length <= 6) return `(${dd}) ${rest}`
  if (d.length <= 10) {
    return `(${dd}) ${rest.slice(0, 4)}-${rest.slice(4)}`
  }
  return `(${dd}) ${rest.slice(0, 5)}-${rest.slice(5)}`
}

/**
 * Cartão branco + formulário da secção “Desbloqueie os benefícios” (#contato).
 */
export function BlupaSignupFormCard() {
  const [commEmail, setCommEmail] = useState(true)
  const [commSms, setCommSms] = useState(true)
  const [commWhatsapp, setCommWhatsapp] = useState(true)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [fullName, setFullName] = useState('')
  const [cpf, setCpf] = useState('')
  const [cellphone, setCellphone] = useState('')
  const [email, setEmail] = useState('')
  const [emailConfirm, setEmailConfirm] = useState('')
  const [birthDate, setBirthDate] = useState('')

  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [duplicateAccountModalOpen, setDuplicateAccountModalOpen] =
    useState(false)

  /** Evita corridas (ex.: React Strict Mode): uma única requisição de sessão por vez. */
  const sessionInflightRef = useRef<Promise<string | null> | null>(null)

  const ensureSession = useCallback(async (): Promise<string | null> => {
    if (sessionInflightRef.current) {
      return sessionInflightRef.current
    }
    const p = (async (): Promise<string | null> => {
      setSessionError(null)
      try {
        const { csrfToken: token } = await initPublicCustomerSession()
        setCsrfToken(token)
        return token
      } catch (e) {
        setCsrfToken(null)
        setSessionError(
          e instanceof Error ? e.message : 'Não foi possível iniciar a sessão segura.',
        )
        return null
      } finally {
        sessionInflightRef.current = null
      }
    })()
    sessionInflightRef.current = p
    return p
  }, [])

  useEffect(() => {
    void ensureSession()
  }, [ensureSession])

  useEffect(() => {
    if (!duplicateAccountModalOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDuplicateAccountModalOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [duplicateAccountModalOpen])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)

    const name = fullName.trim()
    if (!name) {
      setFormError('Informe o nome completo.')
      return
    }

    const cpfDigits = digitsOnly(cpf)
    if (cpfDigits.length < 11) {
      setFormError('Informe um CPF válido (11 dígitos).')
      return
    }

    const phoneDigits = digitsOnly(cellphone)
    if (phoneDigits.length < 10) {
      setFormError('Informe um celular válido.')
      return
    }

    const mail = email.trim().toLowerCase()
    const mailConfirm = emailConfirm.trim().toLowerCase()
    if (!mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setFormError('Informe um e-mail válido.')
      return
    }
    if (mail !== mailConfirm) {
      setFormError('Os e-mails informados não coincidem.')
      return
    }

    const birthApi = birthDateToApiDmY(birthDate)
    if (!birthApi) {
      setFormError('Informe a data de nascimento completa (DD/MM/AAAA).')
      return
    }

    if (!termsAccepted) {
      setFormError('É necessário aceitar os termos para continuar.')
      return
    }

    let token = csrfToken
    if (!token) {
      token = await ensureSession()
    }
    if (!token) {
      setFormError(
        'Sessão indisponível. Atualize a página ou use “Tentar novamente” acima.',
      )
      return
    }

    setSubmitting(true)
    try {
      const result = await registerPublicCustomer(token, {
        name,
        email: mail,
        cpf,
        cellphone,
        birth_date: birthApi,
        newsletter: commEmail,
        sms: commSms,
        whatsapp: commWhatsapp,
      })
      setFormSuccess(result.message)
      setFullName('')
      setCpf('')
      setCellphone('')
      setEmail('')
      setEmailConfirm('')
      setBirthDate('')
      setTermsAccepted(false)
      await ensureSession()
    } catch (err) {
      if (
        err instanceof PublicCustomerApiError &&
        err.kind === 'duplicate_registration'
      ) {
        setFormError(null)
        setDuplicateAccountModalOpen(true)
      } else {
        setFormError(
          err instanceof Error
            ? err.message
            : 'Não foi possível concluir o cadastro.',
        )
      }
      await ensureSession()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1920px] px-4 py-12 sm:py-16 lg:py-[60px] lg:pl-[312px] lg:pr-0">
      <div className="w-full max-w-[992px] bg-white px-6 py-10 sm:px-12 sm:py-12 lg:px-[100px] lg:py-[60px]">
        <form
          className="flex w-full flex-col items-start gap-[48px]"
          noValidate
          onSubmit={handleSubmit}
        >
          <h2
            id="contato-heading"
            className="m-0 w-full font-sans text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-[128%] text-[#1A141F] lg:text-[44px]"
          >
            Desbloqueie os benefícios do Blupa
          </h2>

          {sessionError ? (
            <div
              className="w-full rounded-[4px] bg-[#FEF2F2] px-4 py-3 font-sans text-[14px] font-light text-[#991B1B]"
              role="alert"
            >
              <p className="m-0">
                {sessionError}{' '}
                <button
                  type="button"
                  className="cursor-pointer border-none bg-transparent font-sans text-[14px] font-bold text-[#1D3B6E] underline"
                  onClick={() => void ensureSession()}
                >
                  Tentar novamente
                </button>
              </p>
            </div>
          ) : null}

          <div className="flex w-full flex-col gap-4">
            <input
              type="text"
              name="fullName"
              autoComplete="name"
              placeholder="Nome completo"
              className={inputClass}
              value={fullName}
              onChange={(ev) => setFullName(ev.target.value)}
              disabled={submitting}
            />
            <div className="flex gap-4">
              <input
                type="text"
                name="cpf"
                inputMode="numeric"
                autoComplete="off"
                placeholder="CPF"
                className={inputFlexClass}
                value={cpf}
                onChange={(ev) =>
                  setCpf(formatCpfInput(digitsOnly(ev.target.value)))
                }
                disabled={submitting}
              />
              <input
                type="tel"
                name="cellphone"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="Celular"
                className={inputFlexClass}
                value={cellphone}
                onChange={(ev) =>
                  setCellphone(formatCellphoneInput(digitsOnly(ev.target.value)))
                }
                disabled={submitting}
              />
            </div>
            <div className="flex gap-4">
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="E-mail"
                className={inputFlexClass}
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                disabled={submitting}
              />
              <input
                type="email"
                name="emailConfirm"
                autoComplete="email"
                placeholder="Confirmar e-mail"
                className={inputFlexClass}
                value={emailConfirm}
                onChange={(ev) => setEmailConfirm(ev.target.value)}
                disabled={submitting}
              />
            </div>
            <input
              type="text"
              name="birthDate"
              inputMode="text"
              autoComplete="bday"
              placeholder="Data de nascimento (DD/MM/AAAA)"
              className={inputClass}
              value={birthDate}
              onChange={(ev) => setBirthDate(birthDateInputFromRaw(ev.target.value))}
              disabled={submitting}
            />
          </div>

          <div className="flex w-full flex-col gap-6">
            {(formError || formSuccess) && (
              <div
                className={`w-full rounded-[4px] px-4 py-3 font-sans text-[14px] font-light leading-relaxed ${
                  formSuccess
                    ? 'bg-[#ECFDF5] text-[#065F46]'
                    : 'bg-[#FEF2F2] text-[#991B1B] whitespace-pre-line'
                }`}
                role="status"
                aria-live="polite"
              >
                {formSuccess ?? formError}
              </div>
            )}

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
                      disabled={submitting}
                      className="relative h-8 w-[70px] shrink-0 cursor-pointer rounded-full transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D3B6E] disabled:cursor-not-allowed disabled:opacity-60"
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

            <div className="flex min-h-8 min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
              <span className="min-w-0 shrink font-sans text-[16px] font-light leading-none text-[#1A141F]">
                <span className="inline-block translate-y-0.5">
                  Li e concordo com os{' '}
                  <Link
                    to="/termos-de-uso"
                    className="font-bold text-[#1A141F] underline hover:opacity-70"
                  >
                    Termos de uso
                  </Link>{' '}
                  e{' '}
                  <Link
                    to="/politica-de-privacidade"
                    className="font-bold text-[#1A141F] underline hover:opacity-70"
                  >
                    Política de Privacidade
                  </Link>
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={termsAccepted}
                aria-label="Aceitar termos de uso e política de privacidade"
                onClick={() => setTermsAccepted((v) => !v)}
                disabled={submitting}
                className="relative h-8 w-[70px] shrink-0 cursor-pointer rounded-full transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D3B6E] disabled:cursor-not-allowed disabled:opacity-60"
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
                  disabled={submitting || !!sessionError}
                  className="blupa-gradient-ring blupa-gradient-ring--on-light box-border flex h-[56px] shrink-0 cursor-pointer items-stretch rounded-[24px] border-none p-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84d0f5] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="box-border flex h-full min-h-0 w-full items-center justify-center whitespace-nowrap rounded-[21px] bg-white px-6 font-sans text-base font-bold leading-none text-[#1A141F]">
                    <span className="inline-block translate-y-0.5">
                      {submitting ? 'Enviando…' : 'Avançar'}
                    </span>
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

      {duplicateAccountModalOpen ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="duplicate-account-dialog-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default border-none bg-[#04000B]/50"
            aria-label="Fechar"
            onClick={() => setDuplicateAccountModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-[440px] rounded-[16px] bg-[#1A141F] px-8 py-10 shadow-[0_24px_48px_rgba(0,0,0,0.5)] ring-1 ring-inset ring-white/10">
            <h3
              id="duplicate-account-dialog-title"
              className="m-0 font-sans text-xl font-bold leading-tight text-white"
            >
              Identificamos que sua conta já existe.
            </h3>
            <p className="mt-4 mb-0 font-sans text-[15px] font-light leading-[150%] text-white/88">
              Deseja acessar sua conta?
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDuplicateAccountModalOpen(false)}
                className="box-border h-[48px] cursor-pointer rounded-[24px] border border-white/30 bg-transparent px-6 font-sans text-[15px] font-light leading-none text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84d0f5]"
              >
                <span className="inline-block translate-y-0.5">Fechar</span>
              </button>
              <a
                href={MEMBER_LOGIN_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="blupa-gradient-ring box-border flex h-[48px] shrink-0 cursor-pointer items-stretch justify-center rounded-[24px] border-none p-0 no-underline transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84d0f5]"
              >
                <span className="blupa-glass-face blupa-glass-face--flat box-border flex h-full min-h-0 w-full items-center justify-center whitespace-nowrap rounded-[22.5px] px-6 font-sans text-[15px] font-light leading-none text-white">
                  <span className="inline-block translate-y-0.5">
                    Acessar minha conta
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
