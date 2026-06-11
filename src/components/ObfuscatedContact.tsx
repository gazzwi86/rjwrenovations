import { useEffect, useRef } from 'react'

// All contact values are base64 encoded to prevent bot harvesting.
// Decoded client-side only — static HTML / scrapers see nothing.

interface Props {
  type: 'phone' | 'email'
  className?: string
  children?: React.ReactNode
  linkClass?: string
}

const ENCODED = {
  phone_href:    'KzQ0Nzg5NjA1MTU0MA==', // base64('+447896051540')
  phone_display: 'MDc4OTYgMDUxNTQw',      // base64('07896 051540')
  email:         'cmh5c0ByandyZW5vdmF0aW9ucy5jby51aw==', // base64('rhys@rjwrenovations.co.uk')
}

export default function ObfuscatedContact({ type, className, children, linkClass }: Props) {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const link = linkRef.current
    const span = spanRef.current
    if (!link || !span) return

    try {
      if (type === 'phone') {
        const href = atob(ENCODED.phone_href)
        const display = atob(ENCODED.phone_display)
        link.href = `tel:${href}`
        if (!children) span.textContent = display
        link.setAttribute('aria-label', `Call RJW Renovations on ${display}`)
      } else {
        const value = atob(ENCODED.email)
        link.href = `mailto:${value}`
        if (!children) span.textContent = value
        link.setAttribute('aria-label', `Email RJW Renovations at ${value}`)
      }
    } catch {
      // silently fail if atob not available
    }
  }, [type, children])

  return (
    <a ref={linkRef} href="#" className={linkClass} rel="nofollow" data-contact="true">
      <span ref={spanRef} className={className}>{children}</span>
    </a>
  )
}
