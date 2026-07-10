'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Package } from 'lucide-react'
export function SampleRequester({ orderId }: { orderId: string }) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  async function request() {
    setLoading(true)
    await fetch(`/api/orders/${orderId}/samples`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({action:'REQUEST',notes}) })
    setLoading(false); router.refresh()
  }
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">Request a sample before production begins</p>
      <textarea rows={2} placeholder="Specific sample requirements…" value={notes} onChange={e=>setNotes(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
      <button onClick={request} disabled={loading} className="h-9 px-4 bg-emerald-600 text-white text-xs rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5"><Package className="w-3.5 h-3.5"/>{loading?'Requesting…':'Request Sample'}</button>
    </div>
  )
}
