import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'

export default function ProductCard({ shoe, onAdd }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm"
    >
      <div className="aspect-square overflow-hidden bg-slate-50">
        <img
          src={shoe.images?.[0]}
          alt={shoe.title}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900 leading-tight">{shoe.title}</h3>
            <p className="text-sm text-slate-500">{shoe.brand}</p>
          </div>
          <div className="font-semibold">${shoe.price?.toFixed(2)}</div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-2">
            {(shoe.colors || []).slice(0, 3).map(c => (
              <span key={c} className="w-4 h-4 rounded-full border border-white shadow" style={{ backgroundColor: c.toLowerCase() }} />
            ))}
          </div>
          <button
            onClick={() => onAdd?.(shoe)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800"
          >
            <ShoppingCart size={16} /> Add
          </button>
        </div>
      </div>
    </motion.div>
  )
}
