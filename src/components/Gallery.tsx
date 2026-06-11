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
  { src: '/gallery/kitchen-1.jpg', alt: 'Modern fitted kitchen with island and quartz worktops', category: 'kitchens', width: 1200, height: 800 },
  { src: '/gallery/kitchen-2.jpg', alt: 'Open plan kitchen renovation with navy shaker units', category: 'kitchens', width: 1200, height: 800 },
  { src: '/gallery/kitchen-3.jpg', alt: 'Kitchen worktop and splashback installation', category: 'kitchens', width: 1200, height: 800 },
  { src: '/gallery/bathroom-1.jpg', alt: 'Luxury bathroom with walk-in shower and freestanding bath', category: 'bathrooms', width: 1200, height: 800 },
  { src: '/gallery/bathroom-2.jpg', alt: 'Contemporary bathroom with tiled feature wall', category: 'bathrooms', width: 1200, height: 800 },
  { src: '/gallery/bathroom-3.jpg', alt: 'Ensuite bathroom renovation with heated towel rail', category: 'bathrooms', width: 1200, height: 800 },
  { src: '/gallery/wetroom-1.jpg', alt: 'Fully tiled wet room with linear drain', category: 'wet-rooms', width: 1200, height: 800 },
  { src: '/gallery/decking-1.jpg', alt: 'Composite garden decking with built-in lighting', category: 'decking', width: 1200, height: 800 },
  { src: '/gallery/mediawall-1.jpg', alt: 'Custom built media wall with shelving and TV recess', category: 'other', width: 1200, height: 800 },
  { src: '/gallery/garage-1.jpg', alt: 'Garage converted to home office with natural light', category: 'other', width: 1200, height: 800 },
  { src: '/gallery/tiling-1.jpg', alt: 'Precision floor tiling in herringbone pattern', category: 'other', width: 1200, height: 800 },
  { src: '/gallery/fencing-1.jpg', alt: 'Freshly installed timber fence panels', category: 'other', width: 1200, height: 800 },
]

const FILTERS = [
  { id: 'all', label: 'All Projects' },
  { id: 'kitchens', label: 'Kitchens' },
  { id: 'bathrooms', label: 'Bathrooms' },
  { id: 'wet-rooms', label: 'Wet Rooms' },
  { id: 'decking', label: 'Decking' },
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

      <style>{`
        .gallery-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
        .filter-btn {
          padding: 8px 18px; border-radius: 20px; border: 1px solid var(--border-sub);
          background: transparent; color: var(--text-muted); font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.15s; min-height: 44px;
        }
        .filter-btn:hover { border-color: var(--blue-text); color: var(--blue-text); }
        .filter-btn.active { background: var(--red); border-color: var(--red); color: #fff; }
        .gallery-grid {
          list-style: none; display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;
        }
        .gallery-item { border-radius: 10px; overflow: hidden; }
        .gallery-btn {
          display: block; width: 100%; background: none; border: none; cursor: pointer;
          padding: 0; position: relative; overflow: hidden; border-radius: 10px;
        }
        .gallery-btn img {
          display: block; width: 100%; aspect-ratio: 3/2; object-fit: cover; transition: transform 0.4s ease;
        }
        .gallery-btn:hover img { transform: scale(1.05); }
        .gallery-overlay {
          position: absolute; inset: 0; background: rgba(13,17,23,0.6);
          display: flex; align-items: center; justify-content: center;
          color: #fff; opacity: 0; transition: opacity 0.2s;
        }
        .gallery-btn:hover .gallery-overlay,
        .gallery-btn:focus-visible .gallery-overlay { opacity: 1; }
        .lightbox {
          position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.92);
          display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);
        }
        .lb-close {
          position: absolute; top: 16px; right: 16px;
          background: rgba(255,255,255,0.1); border: none; color: #fff; cursor: pointer;
          border-radius: 50%; width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center; transition: background 0.15s;
        }
        .lb-close:hover { background: rgba(255,255,255,0.2); }
        .lb-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.1); border: none; color: #fff; cursor: pointer;
          border-radius: 50%; width: 52px; height: 52px;
          display: flex; align-items: center; justify-content: center; transition: background 0.15s; z-index: 1;
        }
        .lb-nav:hover { background: rgba(255,255,255,0.2); }
        .lb-prev { left: 16px; }
        .lb-next { right: 16px; }
        .lb-img-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .lb-img { max-width: 90vw; max-height: 85vh; object-fit: contain; }
        .lb-caption { color: rgba(255,255,255,0.7); font-size: 14px; text-align: center; max-width: 600px; }
      `}</style>
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
