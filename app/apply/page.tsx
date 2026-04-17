/**
 * app/apply/page.tsx
 * Public membership application page.
 * Submits to Firestore as a pending application.
 */
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Send, Wallet } from 'lucide-react'
import { AlertBanner, Spinner } from '@/components/ui'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function ApplyPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', reason: '' })
  const [accepted, setAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!accepted) { setError('You must accept the contract to apply.'); return }
    setLoading(true)
    try {
      await addDoc(collection(db, 'applications'), {
        ...form, contractAccepted: true, status: 'pending',
        createdAt: serverTimestamp()
      })
      setSubmitted(true)
    } catch {
      setError('Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return (
    <div className="min-h-screen bg-vault-950 bg-grid flex items-center justify-center px-4">
      <div className="card p-10 max-w-md w-full text-center space-y-4 animate-slide-up">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
          <CheckCircle size={28} className="text-emerald-400"/>
        </div>
        <h2 className="font-display font-bold text-xl text-white">Application Submitted!</h2>
        <p className="text-white/50 text-sm">Your application has been received. An admin will review it shortly. Check your email for updates.</p>
        <Link href="/signup" className="btn-primary block text-center mt-4">Create Your Account →</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-vault-950 bg-grid flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="glow-orb w-96 h-96 bg-emerald-500 -top-48 -left-48" />
      <div className="w-full max-w-lg relative animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center mb-4">
            <Wallet size={24} className="text-emerald-400"/>
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Apply for Membership</h1>
          <p className="text-white/40 text-sm mt-1">Private wealth-building collective — limited spots available</p>
        </div>

        <div className="card p-8 space-y-5">
          {error && <AlertBanner variant="error">{error}</AlertBanner>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input className="input" required placeholder="John Doe" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
              </div>
              <div>
                <label className="label">Phone (WhatsApp)</label>
                <input className="input" required placeholder="+234 800 000 0000" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
              </div>
            </div>
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input" required placeholder="you@example.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
            </div>
            <div>
              <label className="label">Why do you want to join?</label>
              <textarea className="input resize-none" rows={4} required placeholder="Tell us about your financial goals and why you'd be a great member..." value={form.reason} onChange={e=>setForm(p=>({...p,reason:e.target.value}))}/>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div onClick={() => setAccepted(!accepted)}
                  className={`flex-shrink-0 w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-all ${accepted?'bg-emerald-500 border-emerald-500':'border-white/20 group-hover:border-white/40'}`}>
                  {accepted && <CheckCircle size={12} className="text-white"/>}
                </div>
                <span className="text-sm text-white/60">
                  I understand this is a <strong className="text-white/80">private, closed group</strong>. Monthly contributions are mandatory, exit fees apply, and all decisions are binding per the membership agreement.
                </span>
              </label>
            </div>

            <button type="submit" disabled={loading||!accepted} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading?<Spinner size={16}/>:<Send size={16}/>}
              {loading?'Submitting...':'Submit Application'}
            </button>
          </form>
          <p className="text-center text-sm text-white/40 pt-2 border-t border-white/[0.06]">
            Already have an account? <Link href="/login" className="text-emerald-400 hover:text-emerald-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
