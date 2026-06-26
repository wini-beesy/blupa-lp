import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function GradientBorderButton({
  children,
  className = '',
  innerClassName = '',
  href,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  innerClassName?: string
  children: ReactNode
  href?: string
}) {
  const sharedClass = `blupa-gradient-ring inline-flex h-[42px] items-stretch rounded-[24px] border-none p-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84d0f5] ${className}`
  const inner = (
    <span
      className={`blupa-glass-face blupa-glass-face--flat box-border flex h-full min-h-0 items-center justify-center rounded-[22.5px] px-3.5 py-0 font-sans text-sm font-light leading-none text-white sm:px-6 sm:text-base ${innerClassName}`}
    >
      <span className="inline-block translate-y-0.5">{children}</span>
    </span>
  )
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClass}
      >
        {inner}
      </a>
    )
  }
  return (
    <button
      type="button"
      className={sharedClass}
      {...props}
    >
      {inner}
    </button>
  )
}
