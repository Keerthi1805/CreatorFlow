'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
export function SampleReviewer({ orderId }: { orderId: string }) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  async function act(action: 'APPROVE'|'REJECT') {
    setLoading(true)
    await fetch(`/api/orders/${orderId}/samples`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({action,notes}) })
    setLoading(false); router.refresh()
  }
  return (
    <div className="space-y-2 mt-3">
      <textarea rows={2} placeholder="Feedback (optional for approval, recommended for rejection)…" value={notes} onChange={e=>setNotes(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
      <div className="flex gap-2">
        <button onClick={()=>act('APPROVE')} disabled={loading} className="flex-1 h-9 bg-emerald-600 text-white text-xs rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-1.5"><Check className="w-3.5 h-3.5"/>Approve Sample</button>
        <button onClick={()=>act('REJECT')} disabled={loading} className="flex-1 h-9 border border-red-200 text-red-500 text-xs rounded-lg font-semibold hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-1.5"><X className="w-3.5 h-3.5"/>Request Revision</button>
      </div>
    </div>
  )
}
