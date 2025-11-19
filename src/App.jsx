import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedNavbar from './components/AnimatedNavbar'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'
import { Filter, Sparkles } from 'lucide-react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [shoes, setShoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [checkingOut, setCheckingOut] = useState(false)
  const [orderResult, setOrderResult] = useState(null)

  // Filters
  const [query, setQuery] = useState('')
  const [color, setColor] = useState('All')
  const [size, setSize] = useState('All')
  const [price, setPrice] = useState('All')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        let res = await fetch(`${BACKEND}/shoes`)
        if (!res.ok) throw new Error('Failed to load products')
        let data = await res.json()
        if (!Array.isArray(data) || data.length === 0) {
          // Seed and refetch
          await fetch(`${BACKEND}/seed`, { method: 'POST' })
          res = await fetch(`${BACKEND}/shoes`)
          data = await res.json()
        }
        setShoes(data)
      } catch (e) {
        setError(e.message || 'Unable to load products')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return shoes.filter(s => {
      const q = query.trim().toLowerCase()
      const matchesQ = !q || s.title?.toLowerCase().includes(q) || s.brand?.toLowerCase().includes(q)
      const matchesColor = color === 'All' || (s.colors || []).includes(color)
      const matchesSize = size === 'All' || (s.sizes || []).includes(Number(size))
      const matchesPrice = price === 'All' ||
        (price === 'Under 150' && s.price < 150) ||
        (price === '150 - 175' && s.price >= 150 && s.price <= 175) ||
        (price === 'Over 175' && s.price > 175)
      return matchesQ && matchesColor && matchesSize && matchesPrice
    })
  }, [shoes, query, color, size, price])

  const addToCart = (item) => {
    setCartOpen(true)
    setCart(prev => {
      const idx = prev.findIndex(p => p.id === item.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], qty: (copy[idx].qty || 1) + 1 }
        return copy
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const checkout = async () => {
    setCheckingOut(true)
    setOrderResult(null)
    try {
      const payload = {
        items: cart.map(c => ({ product_id: c.id, quantity: c.qty, size: c.sizes?.[0] || null, color: c.colors?.[0] || null }))
      }
      const res = await fetch(`${BACKEND}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Checkout failed')
      const data = await res.json()
      setOrderResult({ ok: true, data })
      setCart([])
    } catch (e) {
      setOrderResult({ ok: false, message: e.message || 'Error' })
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AnimatedNavbar onCartToggle={setCartOpen} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1000px_500px_at_10%_-10%,rgba(15,23,42,0.08),transparent),radial-gradient(800px_400px_at_90%_-20%,rgba(15,23,42,0.06),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="grid md:grid-cols-2 items-center gap-8">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                Oxford & Co.
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-lg text-slate-600">
                Handcrafted formal shoes built for elegance and all‑day comfort.
              </motion.p>
              <div className="mt-6 flex items-center gap-3">
                <a href="#catalog" className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-md shadow hover:bg-slate-800">
                  <Sparkles size={18} /> Shop Collection
                </a>
                <a href="/test" className="text-slate-700 hover:text-slate-900">Check Connection</a>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop" alt="Oxford" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white/80 backdrop-blur border border-slate-200 rounded-xl px-4 py-2 shadow">
                <span className="text-sm">Premium Leather • Goodyear Welt • Cushioned Insole</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-t border-slate-200 bg-white/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 text-slate-700 font-medium"><Filter size={16} /> Filters</div>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." className="px-3 py-2 rounded-md border border-slate-300 text-sm" />
          <select value={color} onChange={e => setColor(e.target.value)} className="px-3 py-2 rounded-md border border-slate-300 text-sm">
            {['All','Black','Brown','Tan'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={size} onChange={e => setSize(e.target.value)} className="px-3 py-2 rounded-md border border-slate-300 text-sm">
            {['All',6,7,8,9,10,11,12].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={price} onChange={e => setPrice(e.target.value)} className="px-3 py-2 rounded-md border border-slate-300 text-sm">
            {['All','Under 150','150 - 175','Over 175'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center text-slate-600">Loading products…</div>
          )}
          {error && (
            <div className="text-center text-red-600">{error}</div>
          )}
          {!loading && !error && (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(s => (
                <ProductCard key={s.id} shoe={s} onAdd={addToCart} />
              ))}
            </motion.div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <p className="text-center text-slate-500">No products match your filters.</p>
          )}
        </div>
      </section>

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onCheckout={checkout}
      />

      {/* Toast/Result */}
      {orderResult && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3">
          {orderResult.ok ? (
            <div className="text-slate-800">Order placed • ID {orderResult.data.id}</div>
          ) : (
            <div className="text-red-600">{orderResult.message}</div>
          )}
        </div>
      )}
    </div>
  )
}
