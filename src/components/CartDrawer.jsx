import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function CartDrawer({ open, items, onClose, onCheckout }) {
  const subtotal = items.reduce((s, it) => s + it.price * (it.qty || 1), 0)
  const shipping = subtotal >= 199 ? 0 : 9.99
  const total = +(subtotal + shipping).toFixed(2)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
          <motion.aside
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-lg">Your Cart</h3>
              <button onClick={onClose} className="p-2 rounded hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {items.length === 0 ? (
                <p className="text-slate-500">Your cart is empty.</p>
              ) : (
                items.map((it, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <img src={it.images?.[0]} alt={it.title} className="w-16 h-16 rounded object-cover" />
                    <div className="flex-1">
                      <div className="font-medium">{it.title}</div>
                      <div className="text-sm text-slate-500">Qty {it.qty || 1}</div>
                    </div>
                    <div className="font-semibold">${(it.price * (it.qty || 1)).toFixed(2)}</div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t space-y-2">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
              <button onClick={onCheckout} className="w-full mt-2 bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800">Checkout</button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
