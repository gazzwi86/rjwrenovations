import { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
  vx: number
  vy: number
}

export default function MeshCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId = 0
    let visible = true
    let points: Point[] = []
    const COUNT = window.innerWidth < 768 ? 40 : 80
    const DIST = 140

    function resize() {
      canvas!.width = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
    }

    function init() {
      points = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }))
    }

    const DIST_SQ = DIST * DIST

    function draw() {
      if (!visible) { animId = 0; return }
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      ctx!.lineWidth = 1

      for (const p of points) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas!.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx!.fillStyle = 'rgba(91,143,184,0.5)'
        ctx!.fill()
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const dSq = dx * dx + dy * dy
          if (dSq < DIST_SQ) {
            const alpha = (1 - Math.sqrt(dSq) / DIST) * 0.3
            ctx!.beginPath()
            ctx!.moveTo(points[i].x, points[i].y)
            ctx!.lineTo(points[j].x, points[j].y)
            ctx!.strokeStyle = `rgba(61,110,150,${alpha})`
            ctx!.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    init()

    // Pause rAF when hero scrolls off-screen
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !animId) animId = requestAnimationFrame(draw)
    }, { threshold: 0 })
    io.observe(canvas)

    animId = requestAnimationFrame(draw)

    const ro = new ResizeObserver(() => { resize(); init() })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  )
}
