import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X, Shirt, Home, Search } from 'lucide-react'

export default function AnimatedNavbar({ onCartToggle }) {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Oxfords', href: '#oxfords', icon: Shirt },
    { label: 'Derbies', href: '#derbies', icon: Shirt },
  ]

  return (
    <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2">
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
              >
                <Icon size={18} />
                {label}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition"
              onClick={() => onCartToggle?.(true)}
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Cart</span>
            </button>
            <button
              className="md:hidden p-2 rounded-md hover:bg-slate-100"
              onClick={() => setOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-200"
          >
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-100">
                <Search size={16} />
                <input
                  placeholder="Search shoes..."
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
              {links.map(({ label, href }) => (
                <a key={label} href={href} className="px-3 py-2 rounded-md hover:bg-slate-100">
                  {label}
                </a>
              ))}
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
    </div>
  )
}
