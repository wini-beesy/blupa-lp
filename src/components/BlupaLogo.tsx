export function BlupaLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient
          id="blupa-logo-grad"
          x1="4"
          y1="8"
          x2="36"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84d0f5" />
          <stop offset="0.35" stopColor="#2581c4" />
          <stop offset="0.55" stopColor="#8c4091" />
          <stop offset="0.75" stopColor="#ba5b9e" />
          <stop offset="0.9" stopColor="#ea5045" />
          <stop offset="1" stopColor="#ffcd00" />
        </linearGradient>
      </defs>
      <path
        d="M8 10c0-2.2 1.8-4 4-4h16c2.2 0 4 1.8 4 4v10c0 2.2-1.8 4-4 4h-6l-6 6v-6h-4c-2.2 0-4-1.8-4-4V10z"
        stroke="url(#blupa-logo-grad)"
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  )
}
