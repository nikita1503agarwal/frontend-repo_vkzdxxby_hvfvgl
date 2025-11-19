import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X, Shirt, Home, Search, LogIn } from 'lucide-react'

export default function AccessibleNavbar({ onCartToggle, onLoginToggle }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  const links = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Oxfords', href: '#oxfords', icon: Shirt },
    { label: 'Derbies', href: '#derbies', icon: Shirt },
  ]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200" aria-label="Primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2" aria-label="Oxford & Co. home">
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xl font-extrabold tracking-tight"
            >
              Oxford & Co.
            </motion.span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {links.map(({ label, href, icon: Icon }, i) => (
              <motion.a
                key={label}
                href={href}
                className="text-slate-700 hover:text-slate-900 inline-flex items-center gap-2"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
                role="menuitem"
              >
                <Icon size={18} aria-hidden />
                {label}
              </motion.a>
            ))}
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition"
              onClick={() => onLoginToggle?.(true)}
            >
              <LogIn size={18} aria-hidden />
              <span>Sign in</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition"
              onClick={() => onCartToggle?.(true)}
            >
              <ShoppingBag size={18} aria-hidden />
              <span>Cart</span>
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              ref={buttonRef}
              className="p-2 rounded-md hover:bg-slate-100"
              onClick={() => setOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-200"
            role="menu"
          >
            <div className="px-4 py-3 flex flex-col gap-2">
              <label className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-100" htmlFor="mobile-search">
                <Search size={16} aria-hidden />
                <input id="mobile-search" placeholder="Search shoes..." className="w-full bg-transparent outline-none text-sm" />
              </label>
              {links.map(({ label, href }) => (
                <a key={label} href={href} className="px-3 py-2 rounded-md hover:bg-slate-100" role="menuitem">
                  {label}
                </a>
              ))}
              <button
                onClick={() => { onLoginToggle?.(true); setOpen(false) }}
                className="px-3 py-2 rounded-md bg-slate-900 text-white"
              >
                Sign in
              </button>
              <button
                onClick={() => { onCartToggle?.(true); setOpen(false) }}
                className="px-3 py-2 rounded-md bg-slate-900 text-white"
              >
                Open Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
