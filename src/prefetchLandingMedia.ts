/**
 * Pré-carrega imagens em segundo plano (cache HTTP + decode na GPU),
 * sem bloquear a pintura inicial. Útil para sliders e troca de benefícios.
 */
export function prefetchLandingMediaUrls(urls: readonly string[]): void {
  if (typeof window === 'undefined') return

  const load = () => {
    for (const href of urls) {
      if (!href) continue
      const img = new Image()
      img.decoding = 'async'
      img.src = href
    }
  }

  const ric = window.requestIdleCallback
  if (typeof ric === 'function') {
    ric.call(window, () => load(), { timeout: 6000 })
  } else {
    window.setTimeout(load, 150)
  }
}
