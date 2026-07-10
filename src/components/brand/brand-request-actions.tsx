'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
export function BrandRequestActions({ collabId }: { collabId: string }) {
  const [loading, setLoading] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [reason, setReason] = useState('')
  const router = useRouter()
  async function respond(status: string, response?: string) {
    setLoading(true)
    await fetch(`/api/collabs/${collabId}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status,response}) })
    setLoading(false); router.refresh()
  }
  if(showReject) return (
    <div className="space-y-2">
      <textarea rows={2} placeholder="Reason for declining (optional)..." value={reason} onChange={e=>setReason(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-300"/>
      <div className="flex gap-2">
        <button onClick={()=>respond('REJECTED',reason)} disabled={loading} className="flex-1 h-8 bg-red-500 text-white text-xs rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50">Confirm Decline</button>
        <button onClick={()=>setShowReject(false)} className="h-8 px-3 border border-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-50">Cancel</button>
      </div>
    </div>
  )
  return (
    <div className="flex gap-2">
      <button onClick={()=>respond('ACCEPTED')} disabled={loading} className="flex-1 h-9 bg-emerald-600 text-white text-xs rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-1.5"><Check className="w-3.5 h-3.5"/>Accept & Connect</button>
      <button onClick={()=>setShowReject(true)} disabled={loading} className="h-9 px-3 border border-red-200 text-red-500 text-xs rounded-lg font-semibold hover:bg-red-50 disabled:opacity-50 flex items-center gap-1"><X className="w-3.5 h-3.5"/>Decline</button>
    </div>
  )
}
