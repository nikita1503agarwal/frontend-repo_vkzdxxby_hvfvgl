import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function LoginDialog({ open, onClose, onAuthed }) {
  const [mode, setMode] = useState('login') // or 'register'
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const initialRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => initialRef.current?.focus(), 50)
    } else {
      setError('')
      setLoading(false)
      setPassword('')
    }
  }, [open])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'register') {
        const res = await fetch(`${BACKEND}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name || email.split('@')[0], email, password })
        })
        if (!res.ok) {
          const d = await res.json().catch(() => ({}))
          throw new Error(d.detail || 'Registration failed')
        }
      }
      const res = await fetch(`${BACKEND}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.detail || 'Login failed')
      }
      const data = await res.json()
      const token = data.access_token
      localStorage.setItem('auth_token', token)
      onAuthed?.({ token, email })
      onClose?.()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onClose?.()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="auth-title"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onKeyDown={onKeyDown}>
          <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
          <motion.div className="absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 id="auth-title" className="font-semibold text-lg">{mode === 'login' ? 'Sign in' : 'Create account'}</h3>
              <button className="p-2 rounded hover:bg-slate-100" aria-label="Close login" onClick={onClose}><X size={18} /></button>
            </div>
            <form onSubmit={onSubmit} className="p-6 space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Name</label>
                  <input ref={initialRef} value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300" required />
                </div>
              )}
              <div>
                <label className="block text-sm text-slate-600 mb-1">Email</label>
                <input ref={mode === 'login' ? initialRef : null} type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300" required />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300" required />
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 disabled:opacity-60">
                {loading ? 'Please wait…' : (mode === 'login' ? 'Sign in' : 'Create account')}
              </button>
              <div className="text-xs text-slate-500 text-center">
                {mode === 'login' ? (
                  <button type="button" onClick={() => setMode('register')} className="underline">Need an account? Register</button>
                ) : (
                  <button type="button" onClick={() => setMode('login')} className="underline">Have an account? Sign in</button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
