import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import AccessibleNavbar from './components/AccessibleNavbar'
import AnimatedHero from './components/AnimatedHero'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'
import LoginDialog from './components/LoginDialog'
import { Filter } from 'lucide-react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [shoes, setShoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [checkingOut, setCheckingOut] = useState(false)
  const [orderResult, setOrderResult] = useState(null)

  // Auth
  const [loginOpen, setLoginOpen] = useState(false)
  const [token, setToken] = useState('')
  const [userEmail, setUserEmail] = useState('')

  // Filters
  const [query, setQuery] = useState('')
  const [color, setColor] = useState('All')
  const [size, setSize] = useState('All')
  const [price, setPrice] = useState('All')

  const catalogRef = useRef(null)
  const scrollToCatalog = () => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  useEffect(() => {
    // bootstrap auth state
    const t = localStorage.getItem('auth_token')
    if (t) setToken(t)

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

  const handleAuthed = ({ token: t, email }) => {
    setToken(t)
    setUserEmail(email)
  }

  const checkout = async () => {
    if (!token) {
      setLoginOpen(true)
      return
    }
    setCheckingOut(true)
    setOrderResult(null)
    try {
      const payload = {
        items: cart.map(c => ({ product_id: c.id, quantity: c.qty, size: c.sizes?.[0] || null, color: c.colors?.[0] || null }))
      }
      const res = await fetch(`${BACKEND}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.detail || 'Checkout failed')
      }
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
      <AccessibleNavbar onCartToggle={setCartOpen} onLoginToggle={setLoginOpen} />

      {/* Hero */}
      <AnimatedHero onShop={scrollToCatalog} />

      {/* Filters */}
      <section className="border-t border-slate-200 bg-white/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 text-slate-700 font-medium">Filters</div>
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
      <section id="catalog" ref={catalogRef} className="py-10">
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

      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onAuthed={handleAuthed}
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
