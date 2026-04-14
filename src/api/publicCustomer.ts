/** Payload alinhado a `PublicCreateCustomerDto` no backend (sem campos extras — forbidNonWhitelisted). */
export type PublicCreateCustomerBody = {
  name: string
  email: string
  cpf: string
  cellphone: string
  birth_date: string
  phone?: string | null
  newsletter?: boolean
  whatsapp?: boolean
  sms?: boolean
  cep?: string | null
  state?: string | null
  city?: string | null
  neighborhood?: string | null
  street?: string | null
  complement?: string | null
  number?: string | null
}

export type PublicCustomerSessionResponse = { ok: true; csrfToken: string }

export type PublicCustomerRegisterResponse = {
  id: string
  message: string
}

function apiBase(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined
  const trimmed = raw?.trim().replace(/\/$/, '')
  return trimmed && trimmed.length > 0 ? trimmed : 'http://localhost:3000'
}

const GENERIC_INVALID_BODY =
  /^(the given data was invalid\.?|os dados fornecidos são inválidos\.?)$/i

function uniqueOrdered(strings: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const s of strings) {
    const t = s.trim()
    if (!t || seen.has(t)) continue
    seen.add(t)
    out.push(t)
  }
  return out
}

/** Texto vindo de APIs em inglês, ex.: "(and 2 more errors)". */
function localizeTrailingErrorCount(msg: string): string {
  return msg.replace(/\s*\(and\s+(\d+)\s+more\s+errors?\)/gi, ' (e mais $1 erros)')
}

function flattenLaravelErrors(errors: Record<string, unknown>): string[] {
  const out: string[] = []
  for (const v of Object.values(errors)) {
    if (Array.isArray(v)) {
      for (const item of v) {
        if (typeof item === 'string') out.push(item)
      }
    } else if (typeof v === 'string') {
      out.push(v)
    }
  }
  return out
}

/**
 * Unifica respostas Nest (message string | string[]) e Laravel/Blupa (`errors` por campo).
 */
function formatPublicApiErrorBody(data: unknown): string {
  if (!data || typeof data !== 'object') {
    return ''
  }
  const o = data as Record<string, unknown>
  const parts: string[] = []

  const errObj = o.errors
  if (errObj && typeof errObj === 'object' && !Array.isArray(errObj)) {
    parts.push(...flattenLaravelErrors(errObj as Record<string, unknown>))
  }

  const nestedMsg = o.message
  if (
    parts.length === 0 &&
    nestedMsg &&
    typeof nestedMsg === 'object' &&
    !Array.isArray(nestedMsg)
  ) {
    const inner = nestedMsg as Record<string, unknown>
    const innerErr = inner.errors
    if (innerErr && typeof innerErr === 'object' && !Array.isArray(innerErr)) {
      parts.push(...flattenLaravelErrors(innerErr as Record<string, unknown>))
    }
  }

  const msg = o.message
  if (typeof msg === 'string' && msg.trim()) {
    const t = msg.trim()
    if (parts.length === 0 && !GENERIC_INVALID_BODY.test(t)) {
      parts.push(localizeTrailingErrorCount(t))
    }
  } else if (Array.isArray(msg)) {
    for (const item of msg) {
      if (typeof item === 'string' && item.trim()) {
        parts.push(localizeTrailingErrorCount(item.trim()))
      }
    }
  } else if (msg && typeof msg === 'object' && !Array.isArray(msg)) {
    const inner = msg as Record<string, unknown>
    const innerText = inner.message
    if (typeof innerText === 'string' && innerText.trim() && parts.length === 0) {
      const t = innerText.trim()
      if (!GENERIC_INVALID_BODY.test(t)) {
        parts.push(localizeTrailingErrorCount(t))
      }
    }
  }

  const merged = uniqueOrdered(parts)
  if (merged.length > 0) {
    return merged.join('\n')
  }

  if (typeof o.error === 'string' && o.error.trim()) {
    return o.error.trim()
  }

  return ''
}

async function readJsonError(res: Response): Promise<string> {
  try {
    const data: unknown = await res.json()
    const formatted = formatPublicApiErrorBody(data)
    if (formatted) return formatted
  } catch {
    /* ignore */
  }
  return res.statusText || `Erro HTTP ${res.status}`
}

/** Erro de API pública com metadados (ex.: cadastro duplicado → modal na landing). */
export class PublicCustomerApiError extends Error {
  readonly status: number
  readonly kind: 'duplicate_registration' | 'generic'

  constructor(
    message: string,
    status: number,
    kind: PublicCustomerApiError['kind'],
  ) {
    super(message)
    this.name = 'PublicCustomerApiError'
    this.status = status
    this.kind = kind
  }
}

export async function initPublicCustomerSession(): Promise<PublicCustomerSessionResponse> {
  const res = await fetch(`${apiBase()}/public/customers/session`, {
    method: 'GET',
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error(await readJsonError(res))
  }
  return res.json() as Promise<PublicCustomerSessionResponse>
}

export async function registerPublicCustomer(
  csrfToken: string,
  body: PublicCreateCustomerBody,
): Promise<PublicCustomerRegisterResponse> {
  const res = await fetch(`${apiBase()}/public/customers`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Public-CSRF': csrfToken,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await readJsonError(res)
    if (res.status === 409) {
      throw new PublicCustomerApiError(text, 409, 'duplicate_registration')
    }
    throw new PublicCustomerApiError(text, res.status, 'generic')
  }
  return res.json() as Promise<PublicCustomerRegisterResponse>
}
