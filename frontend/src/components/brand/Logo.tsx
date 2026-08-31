import { cn } from '@/lib/cn'

interface LogoProps {
  /** Size of the mark in px (wordmark scales with it). */
  size?: number
  /** Hide the "yatrik" wordmark, show only the pin mark. */
  markOnly?: boolean
  /** Reversed palette for use on an orange/dark background. */
  reversed?: boolean
  className?: string
}

/**
 * YATRIK brand logo — a location pin holding a home ("a safe place, found on the map"),
 * next to the lowercase "yatrik" wordmark. See docs/design-system.md.
 */
export function Logo({ size = 28, markOnly = false, reversed = false, className }: LogoProps) {
  const pinColor = reversed ? '#ffffff' : '#E4572E'
  const houseColor = reversed ? '#E4572E' : '#ffffff'

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="YATRIK"
        className="shrink-0"
      >
        {/* Pin */}
        <path
          d="M32 4C20.4 4 11 13.4 11 25c0 14.9 17.5 32.1 19.5 34.5a2 2 0 0 0 3 0C35.5 57.1 53 39.9 53 25 53 13.4 43.6 4 32 4Z"
          fill={pinColor}
        />
        {/* House */}
        <path d="M32 13 43 22.5V37H21V22.5Z" fill={houseColor} />
        {/* Door */}
        <rect x="28.5" y="29" width="7" height="8" rx="1" fill={pinColor} />
      </svg>
      {!markOnly && (
        <span
          className={cn(
            'text-2xl font-bold tracking-tight',
            reversed ? 'text-white' : 'text-ink-900',
          )}
        >
          yatrik
        </span>
      )}
    </span>
  )
}
