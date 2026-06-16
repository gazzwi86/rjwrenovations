import { useState, useCallback, useEffect, useRef, useMemo, Component } from 'react'
import type { ReactNode } from 'react'

interface GalleryItem {
  src: string
  alt: string
  category: string
  width: number
  height: number
}

const ITEMS: GalleryItem[] = [
  { src: '/gallery/kitchen-navy-shaker.jpg', alt: 'Navy shaker kitchen with marble-effect quartz worktops and matt black extractor', category: 'kitchens', width: 1080, height: 1440 },
  { src: '/gallery/kitchen-white-sink.jpg', alt: 'White composite kitchen sink with pull-out spray tap, metro-tile splashback and oak worktop', category: 'kitchens', width: 1080, height: 810 },
  { src: '/gallery/kitchen-marble-splashback.jpg', alt: 'Chrome swan-neck tap over a black kitchen sink with marble-tiled splashback and leaded bay window', category: 'kitchens', width: 1080, height: 1440 },
  { src: '/gallery/bathroom-green-tiles.jpg', alt: 'Bathroom with emerald metro tiles, freestanding bath, brass fittings and patterned floor', category: 'bathrooms', width: 1080, height: 1440 },
  { src: '/gallery/bathroom-navy.jpg', alt: 'Family bathroom with corner bath, navy vanity units and chrome heated towel rail', category: 'bathrooms', width: 1080, height: 1440 },
  { src: '/gallery/bathroom-crittall-screen.jpg', alt: 'White-tiled bathroom with over-bath shower and black crittall-style glass screen', category: 'bathrooms', width: 1080, height: 1440 },
  { src: '/gallery/cloakroom-oak-slat.jpg', alt: 'Downstairs cloakroom with oak slat feature wall, round mirror and herringbone floor', category: 'bathrooms', width: 1080, height: 1440 },
  { src: '/gallery/bathroom-freestanding-bath.jpg', alt: 'Freestanding bath with chrome floor-standing tap and wood-effect tiled feature wall', category: 'bathrooms', width: 1080, height: 1440 },
  { src: '/gallery/wetroom-walk-in-shower.jpg', alt: 'Walk-in shower room with glass screen, grey vanity unit and wood-effect flooring', category: 'wet-rooms', width: 1080, height: 1440 },
  { src: '/gallery/bedroom-barn-door.jpg', alt: 'Bedroom with oak sliding barn door, herringbone flooring and ensuite beyond', category: 'bedroom', width: 1080, height: 1440 },
  { src: '/gallery/garden-store.jpg', alt: 'Bespoke timber garden store with apex roof built from pressure-treated cladding', category: 'other', width: 1080, height: 1440 },
  { src: '/gallery/victorian-floor-tiling.jpg', alt: 'Restored Victorian geometric mosaic hallway floor in terracotta, slate and cream tiles', category: 'other', width: 1080, height: 810 },
]

const FILTERS = [
  { id: 'all', label: 'All Projects' },
  { id: 'kitchens', label: 'Kitchens' },
  { id: 'bathrooms', label: 'Bathrooms' },
  { id: 'wet-rooms', label: 'Wet Rooms' },
  { id: 'bedroom', label: 'Bedrooms' },
  { id: 'other', label: 'Other' },
]

class GalleryErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Gallery temporarily unavailable.</p>
    }
    return this.props.children
  }
}

function GalleryInner() {
  const [active, setActive] = useState('all')
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)

  const filtered = useMemo(
    () => active === 'all' ? ITEMS : ITEMS.filter(i => i.category === active),
    [active]
  )

  const lightboxItem = useMemo(
    () => lightboxSrc ? filtered.find(i => i.src === lightboxSrc) ?? null : null,
    [lightboxSrc, filtered]
  )
  const lightboxIdx = lightboxItem ? filtered.indexOf(lightboxItem) : -1

  const openLightbox = useCallback((src: string, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger
    setLightboxSrc(src)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxSrc(null)
    requestAnimationFrame(() => lastTriggerRef.current?.focus())
  }, [])

  const prev = useCallback(() => {
    if (lightboxIdx < 0) return
    setLightboxSrc(filtered[(lightboxIdx - 1 + filtered.length) % filtered.length].src)
  }, [filtered, lightboxIdx])

  const next = useCallback(() => {
    if (lightboxIdx < 0) return
    setLightboxSrc(filtered[(lightboxIdx + 1) % filtered.length].src)
  }, [filtered, lightboxIdx])

  useEffect(() => {
    if (lightboxSrc) requestAnimationFrame(() => closeRef.current?.focus())
  }, [lightboxSrc])

  useEffect(() => {
    if (!lightboxSrc) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeLightbox(); return }
      if (e.key === 'ArrowLeft') { prev(); return }
      if (e.key === 'ArrowRight') { next(); return }
      if (e.key === 'Tab') {
        const dialog = document.querySelector('.lightbox') as HTMLElement | null
        if (!dialog) return
        const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ))
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus()
        }
      }
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [lightboxSrc, prev, next, closeLightbox])

  return (
    <div className="gallery-wrap">
      <div className="gallery-filters" role="group" aria-label="Filter projects by category">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`filter-btn${active === f.id ? ' active' : ''}`}
            onClick={() => setActive(f.id)}
            aria-pressed={active === f.id}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="gallery-grid" role="list">
        {filtered.map(item => (
          <li key={item.src} className="gallery-item">
            <button
              className="gallery-btn"
              onClick={e => openLightbox(item.src, e.currentTarget)}
              aria-label={`View enlarged: ${item.alt}`}
            >
              <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" />
              <div className="gallery-overlay" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {lightboxItem && (
        <div
          className="lightbox"
          role="dialog"
          aria-label={`Image ${lightboxIdx + 1} of ${filtered.length}: ${lightboxItem.alt}`}
          aria-modal="true"
          onClick={closeLightbox}
        >
          <button ref={closeRef} className="lb-close" aria-label="Close image viewer" onClick={closeLightbox}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <button className="lb-nav lb-prev" aria-label="Previous image" onClick={e => { e.stopPropagation(); prev() }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="lb-img-wrap" onClick={e => e.stopPropagation()}>
            <img src={lightboxItem.src} alt={lightboxItem.alt} className="lb-img" />
            <p className="lb-caption">{lightboxItem.alt}</p>
          </div>
          <button className="lb-nav lb-next" aria-label="Next image" onClick={e => { e.stopPropagation(); next() }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      )}

    </div>
  )
}

export default function Gallery() {
  return (
    <GalleryErrorBoundary>
      <GalleryInner />
    </GalleryErrorBoundary>
  )
}
