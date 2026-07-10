'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export function SampleUploader({ orderId }: { orderId: string }) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  async function upload() {
    setLoading(true)
    await fetch(`/api/orders/${orderId}/samples`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({action:'UPLOAD',notes}) })
    setLoading(false); router.refresh()
  }
  return (
    <div className="mt-3 space-y-2">
      <textarea rows={2} placeholder="Sample description and notes…" value={notes} onChange={e=>setNotes(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      <button onClick={upload} disabled={loading} className="h-9 px-4 bg-indigo-600 text-white text-xs rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">{loading?'Uploading…':'Mark Sample as Uploaded'}</button>
    </div>
  )
}
