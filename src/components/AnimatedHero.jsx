import { useEffect, useMemo, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function AnimatedHero({ onShop }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 120, damping: 18 })
  const springY = useSpring(y, { stiffness: 120, damping: 18 })

  const rotateX = useTransform(springY, [ -200, 200 ], [ 10, -10 ])
  const rotateY = useTransform(springX, [ -200, 200 ], [ -10, 10 ])
  const glow = useTransform(springX, [-200, 0, 200], ['#60a5fa', '#a78bfa', '#f472b6'])

  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      const dx = e.clientX - (rect.left + rect.width/2)
      const dy = e.clientY - (rect.top + rect.height/2)
      x.set(dx)
      y.set(dy)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [x, y])

  return (
    <section className="relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }} />
        <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, #60a5fa, transparent 70%)' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid md:grid-cols-2 items-center gap-10">
          <div>
            <motion.h1 style={{ color: glow }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              Elevate Every Step
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-slate-600">
              Formal shoes hand‑finished for poise, comfort, and lasting craftsmanship.
            </motion.p>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={onShop} className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-md shadow hover:bg-slate-800">
                <Sparkles size={18} /> Shop Collection
              </button>
              <a href="#about" className="text-slate-700 hover:text-slate-900">Learn more</a>
            </div>
          </div>
          <motion.div
            style={{ rotateX, rotateY }}
            className="relative will-change-transform"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
              <img src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop" alt="Oxford" className="w-full h-full object-cover" />
            </div>
            <motion.div className="absolute -bottom-4 -left-4 bg-white/80 backdrop-blur border border-slate-200 rounded-xl px-4 py-2 shadow"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-sm">Premium Leather • Goodyear Welt • Cushioned Insole</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
