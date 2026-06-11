import { useState, useRef, useCallback } from 'react'

interface Props {
  before: { src: string; alt: string }
  after: { src: string; alt: string }
  label?: string
}

export default function BeforeAfter({ before, after, label = 'Before & after' }: Props) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const update = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    setPos(pct)
  }, [])

  return (
    <div
      ref={containerRef}
      className="ba-wrap"
      role="img"
      aria-label={label}
      onMouseMove={e => dragging.current && update(e.clientX)}
      onMouseUp={() => { dragging.current = false }}
      onMouseLeave={() => { dragging.current = false }}
      onTouchMove={e => update(e.touches[0].clientX)}
    >
      <img src={after.src} alt={after.alt} className="ba-img" draggable={false} />
      <div className="ba-before" style={{ width: `${pos}%` }}>
        <img src={before.src} alt={before.alt} className="ba-img" draggable={false} />
      </div>
      <div
        className="ba-divider"
        style={{ left: `${pos}%` }}
        onMouseDown={() => { dragging.current = true }}
        onTouchStart={e => { dragging.current = true; update(e.touches[0].clientX) }}
        role="slider"
        aria-label="Drag to compare before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'ArrowLeft') setPos(p => Math.max(0, p - 5))
          if (e.key === 'ArrowRight') setPos(p => Math.min(100, p + 5))
        }}
      >
        <div className="ba-handle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6"/></svg>
        </div>
      </div>
      <span className="ba-label ba-label-before" aria-hidden="true">Before</span>
      <span className="ba-label ba-label-after" aria-hidden="true">After</span>
      <style>{`
        .ba-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          cursor: ew-resize;
          user-select: none;
          aspect-ratio: 4/3;
        }
        .ba-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .ba-before {
          position: absolute; top: 0; left: 0; bottom: 0;
          overflow: hidden;
        }
        .ba-before .ba-img { width: auto; max-width: none; min-width: 100vw; }
        .ba-divider {
          position: absolute; top: 0; bottom: 0;
          transform: translateX(-50%);
          width: 3px;
          background: #fff;
          z-index: 2;
        }
        .ba-handle {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 44px; height: 44px;
          background: #fff;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: var(--bg);
          box-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }
        .ba-label {
          position: absolute;
          top: 16px;
          background: rgba(0,0,0,0.6);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 4px;
          pointer-events: none;
          z-index: 3;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .ba-label-before { left: 16px; }
        .ba-label-after { right: 16px; }
      `}</style>
    </div>
  )
}
